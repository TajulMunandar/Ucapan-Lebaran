// Edge Function for sending email notification
// This function sends an email with the greeting link after payment

Deno.serve(async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { email, sender_name, greeting_url } = await req.json();

    // Validate required fields
    if (!email || !sender_name || !greeting_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'GreetEase <noreply@greetease.id>',
          to: email,
          subject: `Ucapan Lebaran dari ${sender_name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #f37d23, #d4a853); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { color: white; margin: 0; }
                .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
                .button { display: inline-block; background: #f37d23; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Eid Mubarak!</h1>
                </div>
                <div class="content">
                  <p>Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
                  <p>Anda menerima ucapan Lebaran dari <strong>${sender_name}</strong>.</p>
                  <p>Klik tombol di bawah untuk melihat ucapan:</p>
                  <p style="text-align: center;">
                    <a href="${greeting_url}" class="button">Lihat Ucapan</a>
                  </p>
                  <p>Atau salin link ini: ${greeting_url}</p>
                </div>
                <div class="footer">
                  <p>Dibuat dengan ❤️ oleh GreetEase</p>
                  <p>© 2026 GreetEase. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

      const data = await response.json();
      return new Response(
        JSON.stringify({ success: true, message_id: data.id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Fallback: Log email data if Resend is not configured
      console.log('Email would be sent:', { email, sender_name, greeting_url });
      return new Response(
        JSON.stringify({ success: true, message: 'Email notification queued (Resend not configured)' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Email error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email notification' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
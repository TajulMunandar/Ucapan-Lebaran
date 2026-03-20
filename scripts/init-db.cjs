const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: 'postgresql://postgres:9HE5mk9gSM2f1Qm1@db.qituukpchdunvtztaayc.supabase.co:5432/postgres',
});

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    // Read SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, '..', 'supabase', 'schema.sql'),
      'utf8'
    );
    
    // Execute SQL
    await client.query(sql);
    console.log('✅ Database schema created successfully!');
    
    // Create storage bucket
    await client.query(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('greeting-assets', 'greeting-assets', true)
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('✅ Storage bucket created!');
    
    // Enable realtime for testimonials
    await client.query(`
      ALTER PUBLICATION supabase_realtime ADD TABLE testimonials
    `);
    console.log('✅ Realtime enabled for testimonials!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();

import TemplateElegant from './TemplateElegant'
import TemplateIslamic from './TemplateIslamic'
import TemplateMinimalist from './TemplateMinimalist'
import TemplateFun from './TemplateFun'

export { TemplateElegant, TemplateIslamic, TemplateMinimalist, TemplateFun }

// Template renderer component
export function GreetingTemplate({ template, data, isPreview = false }) {
  switch (template) {
    case 'elegant':
      return <TemplateElegant data={data} isPreview={isPreview} />
    case 'islamic':
      return <TemplateIslamic data={data} isPreview={isPreview} />
    case 'minimalist':
      return <TemplateMinimalist data={data} isPreview={isPreview} />
    case 'fun':
      return <TemplateFun data={data} isPreview={isPreview} />
    default:
      return <TemplateElegant data={data} isPreview={isPreview} />
  }
}

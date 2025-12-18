import './monaco-env'
import * as monaco from 'monaco-editor'
import './style.css'
import { loadConfigs } from './utils'

const root = document.getElementById('root')

if (!root) throw new Error('Root element not found')

const innerModel = monaco.editor.createModel(
  `class Test {\n\tconstructor() {}\n}`,
  'typescript',
  monaco.Uri.parse('file:///main.ts')
)

const config = await loadConfigs()
const { language, model, uri, value, ...userOptions } = config ?? {}

if (language || model || uri || value)
  console.warn(
    'embertext configuration cannot contain model, language, uri, or value'
  )

monaco.editor.create(root, {
  model: innerModel,
  ...userOptions,
})

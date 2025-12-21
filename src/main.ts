import './monaco-env'
import * as monaco from 'monaco-editor'
import './style.css'
import { inferLanguage, loadConfigs } from './utils'

const root = document.getElementById('root')
const search = document.getElementById('search')

if (!root) throw new Error('Root element not found')

if (!search) throw new Error('Search element not found')

const config = await loadConfigs()
const { language, model, uri, value, ...userOptions } = config ?? {}

if (language || model || uri || value) {
  console.warn(
    'embertext configuration cannot contain model, language, uri, or value'
  )
}

monaco.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.typescript.JsxEmit.ReactJSX,
  target: monaco.typescript.ScriptTarget.ESNext,
  module: monaco.typescript.ModuleKind.ESNext,
})

monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
})

const editor = monaco.editor.create(root, {
  ...userOptions,
})

/** @todo replace with input event and use keydown for file selection */
search.addEventListener('keydown', async event => {
  try {
    if (event.key !== 'Enter') return

    const path = 'public/test.js'
    const content = await window.embertext.readFile(path)
    const uri = monaco.Uri.parse(`file:///${path}`)
    const language = inferLanguage(path)

    let model = monaco.editor.getModel(uri)

    if (!model) {
      model = monaco.editor.createModel(content, language, uri)
    }

    editor.setModel(model)
  } catch (error) {
    console.error(error)
  }
})

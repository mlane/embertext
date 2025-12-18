import './monaco-env'
import * as monaco from 'monaco-editor'
import './style.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

const model = monaco.editor.createModel(
  `class Test {\n\tconstructor() {}\n}`,
  'typescript',
  monaco.Uri.parse('file:///main.ts')
)

monaco.editor.create(root, {
  automaticLayout: true,
  minimap: {
    enabled: false,
  },
  model,
  theme: 'vs-dark',
})

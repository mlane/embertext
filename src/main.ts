import './monaco-env'
import * as monaco from 'monaco-editor'
import './style.css'
import { inferLanguage, loadConfigs } from './utils'
console.log('how many times')
const onboardingElement = document.getElementById('onboarding')
const rootElement = document.getElementById('root')
const searchElement = document.getElementById('search')
const searchInputElement = searchElement?.querySelector('input')
const searchListboxElement = searchElement?.querySelector('ul')

/**
 * @todo
 * if `.embertext.json` doesn't exist then display a toast asking the user if they want us to create a preset and update .gitignore.
 * find a way to confirm if a project has more then  10 folders (async task that only touches directories nothing more and just looks for the depth)
 */

if (!onboardingElement) throw new Error('Onboarding element not found')

if (!rootElement) throw new Error('Root element not found')

if (!searchInputElement) throw new Error('Search element not found')

if (!searchListboxElement) throw new Error('Search listbox element not found')

const config = await loadConfigs()

let path = ''

let resultIndex: number = 0

let results: string[] = []

let tree: string[] = []

const {
  language: configLanguage,
  model: configModel,
  uri: configUri,
  value: configValue,
  ...userOptions
} = config ?? {}

if (configLanguage || configModel || configUri || configValue) {
  console.warn(
    'embertext configuration cannot contain model, language, uri, or value'
  )
}

monaco.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.typescript.JsxEmit.ReactJSX,
  module: monaco.typescript.ModuleKind.ESNext,
  target: monaco.typescript.ScriptTarget.ESNext,
})

monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
})

const projectPath = localStorage.getItem('projectPath')

const editor = monaco.editor.create(rootElement, {
  ...userOptions,
  colorDecorators: false,
  folding: false,
  readOnly: !path || !projectPath,
})

const model = editor.getModel()

model?.onDidChangeContent(event => {
  console.log('event', event)
})

if (!projectPath) {
  onboardingElement.style.display = 'block'
  onboardingElement.querySelector('button')?.addEventListener('click', () => {
    window.embertext
      .selectProject()
      .then(projectPath => onSelectProject(projectPath))
  })
} else {
  tree = await window.embertext.init(
    projectPath,
    config?.excludeFromSearch ?? []
  )
}

console.log('path', path)

/** @todo replace with input event and use keydown for file selection */
searchInputElement.addEventListener('keydown', async (event: KeyboardEvent) => {
  try {
    const { ctrlKey, metaKey, key } = event ?? {}
    console.log(results, resultIndex)

    if ((ctrlKey || metaKey) && key === 'p') {
      event.preventDefault()
      window.embertext
        .selectProject()
        .then(projectPath => onSelectProject(projectPath))
      return
    }

    if (key === 'ArrowDown') {
      event.preventDefault()

      if (!results?.length) return

      resultIndex = results?.[resultIndex + 1]
        ? resultIndex + 1
        : results?.length - 1
      return
    }

    if (key === 'ArrowUp') {
      event.preventDefault()

      if (!results?.length) return

      resultIndex = results?.[resultIndex - 1] ? resultIndex - 1 : 0
      return
    }

    /** @todo will clean this up and support directories later but not now */
    if (key === 'Enter') {
      event.preventDefault()
      path = results?.[resultIndex]?.endsWith('/')
        ? (tree?.find(file => !file?.endsWith('/')) ?? tree?.[0])
        : (results?.[resultIndex] ?? '')
      console.log('path-enter', path)

      /** #todo not sure if this will work */
      if (path) {
        editor.updateOptions({
          readOnly: false,
        })
      } else {
        editor.setModel(null)
      }

      const file = await window.embertext.readFile(path)
      console.log('path', path, tree)
      const uri = monaco.Uri.parse(`file://${path}`)
      const language = inferLanguage(path)
      let model = monaco.editor.getModel(uri)

      if (!model) {
        model = monaco.editor.createModel(file, language, uri)
      }

      editor.setModel(model)
      return
    }
  } catch (error) {
    console.error(error)
  }
})

/** @todo not even close to PoC just trying to get the flow operational (debounce) */
searchInputElement.addEventListener('input', event => {
  const value = (event?.target as HTMLInputElement)?.value?.trim() ?? ''
  console.log('value', value)

  if (value) {
    results = [...tree]?.slice(0, 5) ?? []
  } else {
    results = []
  }

  resultIndex = 0
  searchListboxElement.innerHTML =
    results?.map(result => `<li>${result}</li>`)?.join('') ?? ''
})

const onSelectProject = async (projectPath: string) => {
  console.log('onSelectProject', projectPath)

  if (!projectPath) return

  localStorage.setItem('projectPath', projectPath)
  results = []
  searchListboxElement.innerHTML = ''
  resultIndex = 0
  tree = await window.embertext.init(
    projectPath,
    config?.excludeFromSearch ?? []
  )
  onboardingElement.style.display = 'none'
  /** #todo not sure if this will work */
  editor.setModel(null)
  editor.updateOptions({
    readOnly: false,
  })
}

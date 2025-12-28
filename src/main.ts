import './monaco-env'
import * as monaco from 'monaco-editor'
import './style.css'
import { inferLanguage, loadConfigs } from './utils'
console.log('how many times')
const onboardingElement = document.getElementById('onboarding')
const resultsElement = document.getElementById('results')
const rootElement = document.getElementById('root')
const searchElement = document.getElementById('search')

/**
 * @todo
 * if `.embertext.json` doesn't exist then display a toast asking the user if they want us to create a preset and update .gitignore.
 * find a way to confirm if a project has more then  10 folders (async task that only touches directories nothing more and just looks for the depth)
 */

if (!onboardingElement) throw new Error('OnboardingElement element not found')

if (!resultsElement) throw new Error('Results element not found')

if (!rootElement) throw new Error('RootElement element not found')

if (!searchElement) throw new Error('SearchElement element not found')

const config = await loadConfigs()
let results: string[] = []
let resultIndex: number = 0
let tree: string[] = []

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
const projectPath = localStorage.getItem('projectPath')
const editor = monaco.editor.create(rootElement, {
  ...userOptions,
  colorDecorators: false,
  folding: false,
  readOnly: !projectPath,
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

console.log('tree', tree)

/** @todo replace with input event and use keydown for file selection */
searchElement.addEventListener('keydown', async (event: KeyboardEvent) => {
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

    if (key === 'Enter') {
      event.preventDefault()
      onSelectResult(resultIndex)
      return
    }

    onSearch((event?.target as HTMLInputElement)?.value)
  } catch (error) {
    console.error(error)
  }
})

/** @todo not even close to PoC just trying to get the flow operational (debounce) */
const onSearch = (searchElement: string) => {
  console.log('searchElement', searchElement)
  resultIndex = 0
  results = [...tree]?.slice(0, 5) ?? []
  resultsElement.innerHTML =
    results?.map(result => `<li>${result}</li>`)?.join('') ?? ''
}

/** @todo will clean this up and support directories later but not now */
const onSelectResult = async (resultIndex: number) => {
  const path = results?.[resultIndex]?.endsWith('/')
    ? (tree?.find(file => !file?.endsWith('/')) ?? tree?.[0])
    : (results?.[resultIndex] ?? '')

  /** #todo not sure if this will work */
  if (!path) editor.setModel(null)

  const file = await window.embertext.readFile(path)
  console.log('path', path, tree)
  const uri = monaco.Uri.parse(`file://${path}`)
  const language = inferLanguage(path)
  let model = monaco.editor.getModel(uri)

  if (!model) {
    model = monaco.editor.createModel(file, language, uri)
  }

  editor.setModel(model)
}

const onSelectProject = async (projectPath: string) => {
  console.log('onSelectProject', projectPath)

  if (!projectPath) return

  localStorage.setItem('projectPath', projectPath)
  results = []
  resultsElement.innerHTML = ''
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

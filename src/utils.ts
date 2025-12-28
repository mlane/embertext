export const inferLanguage = (path: string): string => {
  const extension = path?.split?.('.')?.pop?.() ?? 'plaintext'

  if (extension === 'css') return 'css'

  if (extension === 'html') return 'html'

  if (extension === 'js' || extension === 'jsx') return 'javascript'

  if (extension === 'json') return 'json'

  if (extension === 'ts' || extension === 'tsx') return 'typescript'

  return 'plaintext'
}

export const loadConfigs = async () => {
  try {
    const response = await fetch('/.embertext.json')

    if (!response.ok) return null

    return await response.json()
  } catch {
    return null
  }
}

export const inferLanguage = (path: string): string => {
  const language = path?.split('.')?.pop() ?? 'plaintext'

  if (language === 'css') return 'css'

  if (language === 'html') return 'html'

  if (language === 'js') return 'javascript'

  if (language === 'json') return 'json'

  if (language === 'jsx') return 'javascriptreact'

  if (language === 'ts') return 'typescript'

  if (language === 'tsx') return 'typescript'

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

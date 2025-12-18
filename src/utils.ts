export const loadConfigs = async () => {
  try {
    const response = await fetch('/.embertext.json')

    if (!response.ok) return null

    return await response.json()
  } catch {
    return null
  }
}

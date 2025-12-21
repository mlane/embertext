export {}

declare global {
  interface Window {
    embertext: {
      readFile(path: string): Promise<string>
    }
  }
}

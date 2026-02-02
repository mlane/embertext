export {}

declare global {
  interface Window {
    embertext: {
      init(projectPath: string, excludeFromSearch: string[]): Promise<string[]>
      readFile(path: string): Promise<string>
      reinit(
        projectPath: string,
        excludeFromSearch: string[]
      ): Promise<string[]>
      selectProject(): Promise<string>
      writeFile(path: string, content: string): Promise<void>
    }
  }
}

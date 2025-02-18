import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface ElectronAPI {
    sendMessage: (channel: string, data: any) => void
    onMessage: (channel: string, callback: (event: any, ...args: any[]) => void) => void
    saveGlobalStore: (state: any) => void
    loadGlobalStore: () => Promise<any>
    // você pode incluir outras funções do seu preload aqui, se necessário
  }
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}

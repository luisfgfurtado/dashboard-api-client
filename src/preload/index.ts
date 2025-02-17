import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const customElectronAPI = {
  ...electronAPI,
  sendMessage: (channel: string, data: any): void => {
    ipcRenderer.send(channel, data)
  },
  onMessage: (channel: string, callback: (event: any, ...args: any[]) => void): void => {
    ipcRenderer.on(channel, callback)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', customElectronAPI)
    // Exponha também outras APIs, se necessário
    contextBridge.exposeInMainWorld('api', {})
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore TODO: Remove this ignore when the issue is fixed
  window.electron = customElectronAPI
}

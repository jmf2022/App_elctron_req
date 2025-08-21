/* import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}

*/

export interface IElectronAPI {
  ipcRenderer: {
    send(channel: string, ...args: any[]): void
    invoke(channel: string, ...args: any[]): Promise<any>
    on(channel: string, listener: (...args: any[]) => void): void
    once(channel: string, listener: (...args: any[]) => void): void
  }
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}


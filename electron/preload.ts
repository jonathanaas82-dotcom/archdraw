import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Fil-operasjoner (utvides i Fase 1)
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data: string) => ipcRenderer.invoke('dialog:saveFile', data),
  // App-info
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
})

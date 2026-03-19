import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data: string, name?: string) => ipcRenderer.invoke('dialog:saveFile', data, name),
  savePng: (dataUrl: string, name?: string) => ipcRenderer.invoke('export:savePng', dataUrl, name),
  saveDxf: (content: string, name?: string) => ipcRenderer.invoke('export:saveDxf', content, name),
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
})

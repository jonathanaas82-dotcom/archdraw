import { autoUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'

export function registerUpdateHandlers(win: BrowserWindow): void {
  autoUpdater.autoDownload = false

  autoUpdater.on('update-available', () => {
    win.webContents.send('update:available')
  })

  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update:downloaded')
  })
}

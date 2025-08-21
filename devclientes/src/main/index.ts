
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow | null = null
let novaJanela: BrowserWindow | null = null

function createWindow(): void {
  // janela principal
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// 🔹 função para abrir a nova janela
function createNovaJanela(): void {
  if (novaJanela) {
    novaJanela.focus()
    return
  }

  novaJanela = new BrowserWindow({
    width: 600,
    height: 400,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  novaJanela.on('ready-to-show', () => {
    novaJanela?.show()
  })

  novaJanela.on('closed', () => {
    novaJanela = null
  })

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    novaJanela.loadURL(process.env.ELECTRON_RENDERER_URL + '/#/novajanela')
  } else {
    novaJanela.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: 'novajanela'
    })
  }
}

// 🔹 ponte ipc para abrir a janela
ipcMain.handle('abrir-novajanela', () => {
  createNovaJanela()
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



/* import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createFileRoute, createURLRoute } from 'electron-router-dom'


// Inicio nova janelas 

let mainWindow2: BrowserWindow | null = null;
let janelaReq: BrowserWindow | null = null;

function createWindow2() {
  mainWindow2 = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
    },
  });

  mainWindow2.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.on("ready", createWindow2);

// 🔹 Função para criar a nova janela (janelaReq)
function createJanelaReq(url: string) {
  // evita abrir várias vezes
  if (janelaReq !== null) {
    janelaReq.focus();
    return;
  }

  janelaReq = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Janela Req", // <<< nome da janela
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.ts"),
    },
  });

  janelaReq.loadFile(path.join(__dirname, "../renderer/jmf/index.html"));

  // mandar a rota depois que carregar
  janelaReq.webContents.on("did-finish-load", () => {
    janelaReq?.webContents.send("navigate-to", url);
  });

  // quando fechar, liberar referência
  janelaReq.on("closed", () => {
    janelaReq = null;
  });
}

// 🔹 IPC para abrir a janelaReq
ipcMain.handle("abrir-janela-req", async (event, url: string) => {
  createJanelaReq(url);
});




//Final dos codigos de novas janelas



function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: true,
    autoHideMenuBar: true,
    backgroundColor: "#030712",
    ...(process.platform === 'linux' ? { 
      icon: path.join(__dirname, "../../build/icon.png")
     } : process.platform === "win32" && {
      icon: path.join(__dirname, "resources", "icon.png")
     }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Mudar icone para o mac 
  if(process.platform === "darwin"){
    const iconPath = path.resolve(__dirname, "resources", "icon.png")
    app.dock.setIcon(iconPath);
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })


  const devServerURL = createURLRoute(process.env['ELECTRON_RENDERER_URL']!, 'main')

  const fileRoute = createFileRoute(
    join(__dirname, '../renderer/index.html'),
    'main'
  )

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(devServerURL)
  } else {
    mainWindow.loadFile(...fileRoute)
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


*/



// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

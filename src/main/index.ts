import { app, shell, BrowserWindow, ipcMain } from 'electron'
import express from 'express'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow | null = null

async function setupStoreHandlers(): Promise<void> {
  // Usa dynamic import para carregar electron-store (ESM)
  const { default: Store } = await import('electron-store')
  const store = new Store()
  console.log('GlobalStore file path:', store.path)

  ipcMain.handle('load-global-store', async () => {
    return store.get('globalStore')
  })

  ipcMain.on('save-global-store', (event, state) => {
    store.set('globalStore', state)
  })
}

setupStoreHandlers().catch((err) => {
  console.error('Erro ao configurar electron-store:', err)
})

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: true,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
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

  createWindow()

  // Registra o listener para o fluxo de autenticação
  ipcMain.on('start-auth', (event, config) => {
    const { authUrl, clientId, responseType, scope } = config
    const port = 3000
    // Usaremos a rota "/login" como redirect_uri, pois é onde o auth server enviará o hash com o token
    const callbackPath = '/login'
    const fullRedirectUri = `http://localhost:${port}${callbackPath}`

    const server = express()

    // Rota para servir a página que extrai o token do hash
    server.get('/login', (req, res) => {
      res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Autenticação</title>
</head>
<body>
  <script>
    // Extrai o token do hash, por exemplo: #access_token=...
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    if (accessToken) {
      // Redireciona para /callback com o token na query string
      window.location.href = '/callback?token=' + encodeURIComponent(accessToken);
    } else {
      document.body.innerText = 'Token não encontrado no hash.';
    }
  </script>
</body>
</html>`)
    })

    // Rota para receber o token via query e enviar para o renderer
    server.get('/callback', (req, res) => {
      const token = req.query.token
      if (token) {
        mainWindow?.webContents.send('auth-token', token)
        res.send('Autenticação realizada com sucesso! Você pode fechar esta janela.')
      } else {
        res.send('Token não recebido.')
      }
      serverInstance.close(() => {
        console.log('Servidor de callback encerrado.')
      })
    })

    const serverInstance = server.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`)

      // Monta a URL de autenticação com os parâmetros necessários
      const urlWithParams = new URL(authUrl)
      urlWithParams.searchParams.set('response_type', responseType || 'token')
      urlWithParams.searchParams.set('client_id', clientId)
      urlWithParams.searchParams.set('redirect_uri', fullRedirectUri)
      urlWithParams.searchParams.set('scope', scope)

      // Abre a URL no navegador padrão
      shell.openExternal(urlWithParams.toString())
    })
  })

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

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

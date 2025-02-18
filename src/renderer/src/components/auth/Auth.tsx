import React, { useState, useEffect } from 'react'
import { useGlobalStore } from '../globalStore'
import { Button } from '@mui/material'

interface AuthConfig {
  authUrl: string
  clientId: string
  responseType: string
  scope: string
}

const Auth: React.FC = () => {
  const { globalStore } = useGlobalStore()
  // Define um default vazio ou com valores temporários.
  const initialConfig: AuthConfig = {
    authUrl: 'https://eu1.identity.cicd.development.abovecloud.io/connect/authorize',
    clientId: 'AC-Frontend',
    responseType: 'token',
    scope: 'API'
  }

  const [config, setConfig] = useState<AuthConfig>(initialConfig)
  const [token, setToken] = useState<string | null>(null)

  // Atualiza o estado config assim que o globalStore estiver carregado
  useEffect(() => {
    if (globalStore && globalStore.projectConfig?.projectSettings?.authSettings) {
      const authSettings = globalStore.projectConfig.projectSettings.authSettings
      setConfig({
        authUrl: authSettings.authUrl || initialConfig.authUrl,
        clientId: authSettings.clientId || initialConfig.clientId,
        responseType: authSettings.responseType || initialConfig.responseType,
        scope: authSettings.scope || initialConfig.scope
      })
    }
  }, [globalStore])

  useEffect(() => {
    // Registra o listener para receber o token vindo do processo main via IPC
    window.electron.onMessage('auth-token', (_event: any, receivedToken: string) => {
      setToken(receivedToken)
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value
    })
  }

  const handleAuth = (): void => {
    // Envia os dados de configuração para o processo main iniciar o fluxo de autenticação
    window.electron.sendMessage('start-auth', config)
  }

  const handleExport = (): void => {
    // Exporta a configuração em formato JSON
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2))
    const a = document.createElement('a')
    a.href = dataStr
    a.download = 'auth-config.json'
    a.click()
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event): void => {
        if (event.target?.result) {
          try {
            const importedConfig = JSON.parse(event.target.result as string)
            setConfig(importedConfig)
          } catch (err) {
            console.error('Erro ao importar config:', err)
          }
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div>
      <h2>Autenticação</h2>
      <div>
        <label>Auth URL:</label>
        <input
          type="text"
          name="authUrl"
          value={config.authUrl}
          onChange={handleChange}
          title="Auth URL"
          placeholder="Enter Auth URL"
        />
      </div>
      <div>
        <label>Client ID:</label>
        <input
          type="text"
          name="clientId"
          value={config.clientId}
          onChange={handleChange}
          title="Client ID"
          placeholder="Enter Client ID"
        />
      </div>
      <div>
        <label>Scope:</label>
        <input
          type="text"
          name="scope"
          value={config.scope}
          onChange={handleChange}
          placeholder="Enter scope"
        />
      </div>
      <Button onClick={handleAuth}>Autenticar</Button>
      <Button onClick={handleExport}>Exportar Config</Button>
      <label htmlFor="fileInput">Importar Config:</label>
      <input id="fileInput" type="file" onChange={handleImport} accept=".json" />
      {token && (
        <div>
          <h3>Token Recebido:</h3>
          <pre>{token}</pre>
        </div>
      )}
    </div>
  )
}

export default Auth

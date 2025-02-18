// src/renderer/src/components/auth/AuthDialog.tsx
import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material'
import { useGlobalStore } from '../globalStore'

interface AuthConfig {
  authUrl: string
  clientId: string
  responseType: string
  scope: string
}

interface AuthDialogProps {
  open: boolean
  onClose: () => void
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose }) => {
  const { state, dispatch } = useGlobalStore()
  // Inicializamos o estado local com os valores do globalStore
  const initialConfig: AuthConfig = state.authSettings

  const [config, setConfig] = useState<AuthConfig>(initialConfig)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Atualiza o estado local se o globalStore mudar (opcional)
    setConfig(state.authSettings)
  }, [state.authSettings])

  useEffect(() => {
    // Listener para o token, se necessário
    window.electron.onMessage('auth-token', (_event: any, receivedToken: string) => {
      setToken(receivedToken)
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfig({ ...config, [e.target.name]: e.target.value })
  }

  // Função para despachar atualização para cada campo quando perde o foco
  const handleBlur = (field: keyof AuthConfig): void => {
    dispatch({ type: 'UPDATE_AUTH_SETTINGS', payload: { [field]: config[field] } })
  }

  const handleAuth = (): void => {
    window.electron.sendMessage('start-auth', config)
  }

  const handleExport = (): void => {
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
            // Atualiza também o globalStore ao importar
            dispatch({ type: 'UPDATE_AUTH_SETTINGS', payload: importedConfig })
          } catch (err) {
            console.error('Erro ao importar config:', err)
          }
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Autenticação</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Auth URL"
          name="authUrl"
          value={config.authUrl}
          onChange={handleChange}
          onBlur={() => handleBlur('authUrl')}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Client ID"
          name="clientId"
          value={config.clientId}
          onChange={handleChange}
          onBlur={() => handleBlur('clientId')}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Response Type"
          name="responseType"
          value={config.responseType}
          onChange={handleChange}
          onBlur={() => handleBlur('responseType')}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Scope"
          name="scope"
          value={config.scope}
          onChange={handleChange}
          onBlur={() => handleBlur('scope')}
          fullWidth
        />
        {token && (
          <div>
            <strong>Token Recebido:</strong>
            <pre>{token}</pre>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleExport}>Exportar Config</Button>
        <Button component="label">
          Importar Config
          <input type="file" hidden onChange={handleImport} accept=".json" />
        </Button>
        <Button onClick={handleAuth} variant="contained" color="primary">
          Autenticar
        </Button>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AuthDialog

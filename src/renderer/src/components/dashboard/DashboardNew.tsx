import { Button } from '@mui/material'
import React from 'react'

const DashboardNew: React.FC = () => {
  // A função para adicionar um dashboard deve ser chamada a partir de um botão.
  const handleAddDashboard = (): void => {
    // Importamos a instância única diretamente
    import('../dashboard/DashboardManager').then(({ default: DashboardManager }) => {
      DashboardManager.newDashboard()
    })
  }

  return (
    <div className="dashboard-new">
      <h2>Nenhum Dashboard encontrado</h2>
      <p>Por favor, clique no botão abaixo para adicionar um dashboard.</p>
      <Button onClick={handleAddDashboard} variant="outlined">
        Adicionar Dashboard
      </Button>
    </div>
  )
}

export default DashboardNew

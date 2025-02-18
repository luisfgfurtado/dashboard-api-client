import { Button } from '@mui/material'
import React from 'react'

interface DashboardNewProps {
  onAddDashboard: () => void
}

const DashboardNew: React.FC<DashboardNewProps> = ({ onAddDashboard }) => {
  return (
    <div className="dashboard-new">
      <h2>Nenhum Dashboard encontrado</h2>
      <p>Por favor, clique no botão abaixo para adicionar um dashboard.</p>
      <Button onClick={onAddDashboard} variant="outlined">
        Adicionar Dashboard
      </Button>
    </div>
  )
}

export default DashboardNew

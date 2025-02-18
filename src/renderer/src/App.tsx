// src/renderer/src/App.tsx
import React, { useEffect, useState } from 'react'
import TopMenu from './components/ui/TopMenu'
import GlobalStoreViewer from './components/globalStore/GlobalStoreViewer'
import DashboardViewer from './components/dashboard/DashboardViewer'
import AuthDialog from './components/auth/AuthDialog'
import { useGlobalStore } from './components/globalStore'
import './styles/app.css'

const App: React.FC = () => {
  const { state, dispatch } = useGlobalStore()
  const dashboards = state.dashboards
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>('')
  const [authDialogOpen, setAuthDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    if (dashboards.length > 0) {
      const storedId = localStorage.getItem('selectedDashboardId')
      if (storedId && dashboards.some((d) => d.dashboardSettings.id === storedId)) {
        setSelectedDashboardId(storedId)
      } else {
        const newSelected = dashboards[0].dashboardSettings.id
        setSelectedDashboardId(newSelected)
        localStorage.setItem('selectedDashboardId', newSelected)
      }
    } else {
      setSelectedDashboardId('')
      localStorage.removeItem('selectedDashboardId')
    }
  }, [dashboards])

  const handleSelectDashboard = (dashboardId: string): void => {
    setSelectedDashboardId(dashboardId)
    localStorage.setItem('selectedDashboardId', dashboardId)
  }

  const handleAddDashboard = (): void => {
    const newDashboard = {
      dashboardSettings: {
        id: `dashboard-${Date.now()}`,
        title: 'New Dashboard',
        layout: 'grid'
      },
      containers: []
    }

    // Despacha a ação para adicionar o dashboard ao estado global
    dispatch({ type: 'ADD_DASHBOARD', payload: newDashboard })

    // Atualiza o dashboard selecionado e persiste no localStorage
    setSelectedDashboardId(newDashboard.dashboardSettings.id)
    localStorage.setItem('selectedDashboardId', newDashboard.dashboardSettings.id)
  }

  const handleOpenAuthDialog = (): void => {
    setAuthDialogOpen(true)
  }

  const handleCloseAuthDialog = (): void => {
    setAuthDialogOpen(false)
  }

  const currentDashboard =
    dashboards.find((d) => d.dashboardSettings.id === selectedDashboardId) || null

  return (
    <div className="app-container">
      <TopMenu
        selectedDashboardId={selectedDashboardId}
        onSelectDashboard={handleSelectDashboard}
        onAddDashboard={handleAddDashboard}
        onOpenAuth={handleOpenAuthDialog}
      />
      <main className="dashboard-main">
        <DashboardViewer dashboard={currentDashboard} onAddDashboard={handleAddDashboard} />
      </main>
      <GlobalStoreViewer />
      <AuthDialog open={authDialogOpen} onClose={handleCloseAuthDialog} />
    </div>
  )
}

export default App

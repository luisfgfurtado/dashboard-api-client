// src/renderer/src/App.tsx
import React, { useEffect, useState, useMemo } from 'react'
import TopMenu from './components/TopMenu'
import GlobalStoreViewer from './components/globalStore/GlobalStoreViewer'
import DashboardViewer from './components/dashboard/DashboardViewer'
import { useDashboardManager } from './components/dashboard/useDashboardManager'
import './styles/App.css'
import { DashboardInstanceManager } from './components/dashboard/DashboardInstanceManager'

const App: React.FC = () => {
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>('')
  const dashboards = useDashboardManager()

  // Sempre que a lista de dashboards mudar, garantimos que o selectedDashboardId seja válido.
  useEffect(() => {
    if (dashboards.length > 0) {
      // Se não há dashboard selecionado ou o selecionado não existe mais na lista...
      if (
        !selectedDashboardId ||
        !dashboards.some((d) => d.dashboardSettings.id === selectedDashboardId)
      ) {
        const newSelected = dashboards[0].dashboardSettings.id
        setSelectedDashboardId(newSelected)
        localStorage.setItem('selectedDashboardId', newSelected)
      }
    } else {
      // Se não houver dashboards, limpamos o selectedDashboardId.
      setSelectedDashboardId('')
      localStorage.removeItem('selectedDashboardId')
    }
  }, [dashboards, selectedDashboardId])

  const handleSelectDashboard = (dashboardId: string): void => {
    setSelectedDashboardId(dashboardId)
    localStorage.setItem('selectedDashboardId', dashboardId)
  }

  // Obtém o dashboard selecionado da lista (DashboardData)
  const currentDashboard =
    dashboards.find((d) => d.dashboardSettings.id === selectedDashboardId) || null

  // Cria uma instância do DashboardInstanceManager para o dashboard selecionado.
  const currentManager = useMemo(() => {
    if (currentDashboard) {
      return new DashboardInstanceManager(currentDashboard)
    }
    return null
  }, [currentDashboard])

  return (
    <div className="app-container">
      <TopMenu
        selectedDashboardId={selectedDashboardId}
        onSelectDashboard={handleSelectDashboard}
      />
      <main className="dashboard-main">
        <DashboardViewer manager={currentManager} />
      </main>
      <GlobalStoreViewer />
    </div>
  )
}
export default App

// src/renderer/src/components/DashboardViewer.tsx
import React, { useEffect, useState } from 'react'
import { Typography, Button, TextField } from '@mui/material'
import ContainerViewer from '../container/ContainerViewer'
import DashboardNew from './DashboardNew'
import { DashboardInstanceManager } from './DashboardInstanceManager'
import { useDashboardInstance } from './useDashboardInstance'
import { ContainerData } from '../globalStore/GlobalStoreProvider'

interface DashboardViewerProps extends React.PropsWithChildren {
  manager: DashboardInstanceManager | null
}

const DashboardViewer: React.FC<DashboardViewerProps> = ({ manager, children }) => {
  // Se não houver uma instância de dashboard, renderiza o DashboardNew
  if (!manager) {
    return <DashboardNew />
  }

  // Obtém o dashboard atualizado via hook
  const dashboard = useDashboardInstance(manager)

  // Estado local para o título (para edição)
  const [title, setTitle] = useState(dashboard.dashboardSettings.title)

  useEffect(() => {
    setTitle(dashboard.dashboardSettings.title)
  }, [dashboard.dashboardSettings.title])

  const handleTitleBlur = (): void => {
    if (title !== dashboard.dashboardSettings.title) {
      manager.updateTitle(title)
    }
  }

  // A ação de adicionar container é delegada ao manager do dashboard
  const handleAddContainer = (): void => {
    const newContainer: ContainerData = {
      containerSettings: {
        id: `container-${Date.now()}`,
        title: 'New Container',
        apiDefinition: {
          baseUrl: '',
          authRequired: true
        }
      },
      components: []
    }
    manager.addContainer(newContainer)
  }

  return (
    <div className="dashboard-viewer">
      <TextField
        label="Dashboard Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        variant="outlined"
        size="small"
      />
      <div style={{ margin: '16px 0' }}>
        <Button variant="contained" color="primary" onClick={handleAddContainer}>
          Add Container
        </Button>
      </div>
      {dashboard.containers && dashboard.containers.length > 0 ? (
        dashboard.containers.map((container) => (
          <ContainerViewer key={container.containerSettings.id} container={container} />
        ))
      ) : (
        <Typography variant="body1">No containers added yet.</Typography>
      )}
      {children}
    </div>
  )
}

export default DashboardViewer

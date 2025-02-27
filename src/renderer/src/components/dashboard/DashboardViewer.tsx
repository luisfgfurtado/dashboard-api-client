// src/renderer/src/components/DashboardViewer.tsx
import React, { useState, useEffect } from 'react'
import { Typography, Button, TextField } from '@mui/material'
import ContainerViewer from '../container/ContainerViewer'
import DashboardNew from './DashboardNew'
import { DashboardData } from '../globalStore'
import { useGlobalStore } from '../globalStore'

interface DashboardViewerProps extends React.PropsWithChildren {
  dashboard: DashboardData | null
  onAddDashboard: () => void
}

const DashboardViewer: React.FC<DashboardViewerProps> = ({
  dashboard,
  onAddDashboard,
  children
}) => {
  const { dispatch } = useGlobalStore()
  const [title, setTitle] = useState(dashboard?.dashboardSettings.title || '')

  useEffect(() => {
    setTitle(dashboard?.dashboardSettings.title || '')
  }, [dashboard?.dashboardSettings.title])

  const handleTitleBlur = (): void => {
    if (dashboard && title !== dashboard.dashboardSettings.title) {
      dispatch({
        type: 'UPDATE_DASHBOARD_TITLE',
        payload: { dashboardId: dashboard.dashboardSettings.id, title }
      })
    }
  }

  const handleAddContainer = (): void => {
    if (dashboard) {
      const newContainer = {
        containerSettings: {
          id: `container-${Date.now()}`,
          title: 'New Container',
          apiDefinition: {}
        },
        components: []
      }
      dispatch({
        type: 'ADD_CONTAINER',
        payload: { dashboardId: dashboard.dashboardSettings.id, container: newContainer }
      })
    }
  }

  if (!dashboard) {
    return <DashboardNew onAddDashboard={onAddDashboard} />
  }

  return (
    <div className="dashboard-viewer">
      <TextField
        className="dashboard-title"
        value={title}
        variant="standard"
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        size="small"
        InputProps={{
          disableUnderline: true
        }}
      />
      <div style={{ margin: '16px 0' }}>
        <Button variant="contained" color="primary" size="small" onClick={handleAddContainer}>
          Add Container
        </Button>
      </div>
      {dashboard.containers && dashboard.containers.length > 0 ? (
        dashboard.containers.map((container) => (
          <ContainerViewer
            key={container.containerSettings.id}
            container={container}
            dashboardId={dashboard.dashboardSettings.id}
          />
        ))
      ) : (
        <Typography variant="body1">No containers added yet.</Typography>
      )}
      {children}
    </div>
  )
}

export default DashboardViewer

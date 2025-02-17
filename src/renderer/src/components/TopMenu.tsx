// src/renderer/src/components/TopMenu.tsx
import React from 'react'
import { AppBar, Toolbar, IconButton, Tabs, Tab, Menu, MenuItem, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AddIcon from '@mui/icons-material/Add'
import { useDashboardManager } from './dashboard/useDashboardManager'

interface TopMenuProps {
  onSelectDashboard: (dashboardId: string) => void
  selectedDashboardId: string
}

const TopMenu: React.FC<TopMenuProps> = ({ onSelectDashboard, selectedDashboardId }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  // Obtém a lista de dashboards do DashboardManager.
  const dashboards = useDashboardManager()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (): void => {
    setAnchorEl(null)
  }

  const handleDashboardChange = (event: React.SyntheticEvent, newValue: string): void => {
    onSelectDashboard(newValue)
  }

  // A função para adicionar um dashboard deve ser chamada a partir de um botão.
  const handleAddDashboard = (): void => {
    // Importamos a instância única diretamente
    import('./dashboard/DashboardManager').then(({ default: DashboardManager }) => {
      const newDash = DashboardManager.newDashboard()
      onSelectDashboard(newDash.dashboardSettings.id)
    })
  }

  const currentValue =
    dashboards.length > 0 ? selectedDashboardId || dashboards[0].dashboardSettings.id : undefined

  return (
    <AppBar position="fixed" className="top-menu">
      <Toolbar variant="dense">
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>
        <Button color="inherit">Autenticar</Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Configuração 1</MenuItem>
          <MenuItem onClick={handleMenuClose}>Configuração 2</MenuItem>
          <MenuItem onClick={handleMenuClose}>Configuração 3</MenuItem>
        </Menu>
        <Tabs
          value={currentValue}
          onChange={handleDashboardChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          className="top-tabs"
        >
          {dashboards.map((dashboard) => (
            <Tab
              key={dashboard.dashboardSettings.id}
              label={dashboard.dashboardSettings.title}
              value={dashboard.dashboardSettings.id}
            />
          ))}
        </Tabs>
        <IconButton onClick={handleAddDashboard} color="inherit" sx={{ marginLeft: '8px' }}>
          <AddIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default TopMenu

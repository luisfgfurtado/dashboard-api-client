// src/renderer/src/components/TopMenu.tsx
import React from 'react'
import { AppBar, Toolbar, Tabs, Tab, IconButton, Button, Menu, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AddIcon from '@mui/icons-material/Add'
import { useGlobalStore } from '../globalStore'

interface TopMenuProps {
  selectedDashboardId: string
  onSelectDashboard: (dashboardId: string) => void
  onAddDashboard: () => void
  onOpenAuth: () => void
}

const TopMenu: React.FC<TopMenuProps> = ({
  selectedDashboardId,
  onSelectDashboard,
  onAddDashboard,
  onOpenAuth
}) => {
  const { state } = useGlobalStore()
  const dashboards = state.dashboards

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>): void => setAnchorEl(e.currentTarget)
  const handleMenuClose = (): void => setAnchorEl(null)
  const handleDashboardChange = (_: React.SyntheticEvent, newValue: string): void =>
    onSelectDashboard(newValue)

  // Se houver dashboards, currentValue é o id selecionado ou o id do primeiro.
  const currentValue =
    dashboards.length > 0 ? selectedDashboardId || dashboards[0].dashboardSettings.id : undefined

  return (
    <AppBar position="fixed" className="top-menu">
      <Toolbar variant="dense">
        <IconButton edge="start" color="inherit" onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Configuração 1</MenuItem>
          <MenuItem onClick={handleMenuClose}>Configuração 2</MenuItem>
          <MenuItem onClick={handleMenuClose}>Configuração 3</MenuItem>
        </Menu>
        <Button
          color="inherit"
          sx={{ marginLeft: '20px', marginRight: '20px' }}
          onClick={onOpenAuth}
        >
          Autenticar
        </Button>
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
        <IconButton onClick={onAddDashboard} color="inherit" sx={{ marginLeft: '8px' }}>
          <AddIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default TopMenu

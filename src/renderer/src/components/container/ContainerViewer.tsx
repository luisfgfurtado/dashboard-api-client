// src/renderer/src/container/ContainerViewer.tsx
import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { ContainerData, ComponentDefinition } from '../globalStore'
import { ContainerManager } from './ContainerManager'
import EndpointDialog from './EndpointDialog'
import TextComponent from './components/TextComponent'
import TableComponent from './components/TableComponent'
import { useGlobalStore } from '../globalStore'
import '../../styles/container.css'
import { Padding } from '@mui/icons-material'

interface ContainerViewerProps {
  container: ContainerData
  dashboardId: string // Precisamos saber a qual dashboard pertence este container para remover
}

const ContainerViewer: React.FC<ContainerViewerProps> = ({ container, dashboardId }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEndpoint, setEditingEndpoint] = useState<Partial<ComponentDefinition> | null>(null)
  const [title, setTitle] = useState(container.containerSettings.title)
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const { dispatch } = useGlobalStore()

  const containerManager = new ContainerManager(container)

  useEffect(() => {
    setTitle(container.containerSettings.title)
  }, [container.containerSettings.title])

  const handleTitleBlur = (): void => {
    if (title !== container.containerSettings.title) {
      containerManager.updateTitle(title)
      // Se necessário, você também pode despachar uma ação para atualizar o estado global
    }
  }

  // Funções de diálogo para endpoints (adicionar/editar)
  const handleOpenAddDialog = (): void => {
    setEditingEndpoint({})
    setDialogOpen(true)
  }

  const handleEditEndpoint = (component: ComponentDefinition): void => {
    setEditingEndpoint(component)
    setDialogOpen(true)
  }

  const handleCloseDialog = (): void => {
    setDialogOpen(false)
    setEditingEndpoint(null)
  }

  const handleDialogSubmit = (data: Partial<ComponentDefinition>): void => {
    if (editingEndpoint && editingEndpoint.id) {
      containerManager.updateEndpoint(editingEndpoint.id, data)
    } else {
      containerManager.addEndpoint(data)
    }
    handleCloseDialog()
    // Se o container faz parte do estado global, é importante disparar um re-render ou despachar ação
  }

  // Dummy callbacks para refresh, pin, etc.
  const handleRefresh = (component: ComponentDefinition): void => {
    console.log('Refresh endpoint', component)
  }
  const handlePin = (component: ComponentDefinition): void => {
    containerManager.updateEndpoint(component.id, { pinned: !component.pinned })
  }

  // Ação para deletar o container
  const handleDeleteContainer = (): void => {
    if (window.confirm('Você deseja excluir este container?')) {
      // Despacha a ação para remover o container do dashboard
      dispatch({
        type: 'REMOVE_CONTAINER',
        payload: { dashboardId, containerId: container.containerSettings.id }
      })
    }
  }

  // Funções para o menu do CardHeader
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>): void =>
    setMenuAnchorEl(e.currentTarget)
  const handleMenuClose = (): void => setMenuAnchorEl(null)

  return (
    <Card variant="outlined" style={{ marginBottom: '16px' }}>
      <CardHeader
        className="container-header"
        title={
          <TextField
            className="container-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            variant="standard"
            size="small"
            fullWidth
            InputProps={{ disableUnderline: true }}
          />
        }
        action={
          <IconButton
            aria-label="container actions"
            size="small"
            style={{ margin: 0, marginTop: '-6px' }}
            onClick={handleMenuOpen}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        }
      />
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            handleOpenAddDialog()
          }}
        >
          Add Endpoint
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            // Aqui você pode chamar a lógica para importar a API definition
          }}
        >
          Import API Definition
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            handleDeleteContainer()
          }}
        >
          Delete Container
        </MenuItem>
      </Menu>
      <CardContent>
        <Typography variant="subtitle1">Endpoints:</Typography>
        {container.components && container.components.length > 0 ? (
          container.components.map((comp) => {
            const compDef = comp.componentDefinition
            const commonProps = {
              onRefresh: () => handleRefresh(compDef),
              onDelete: () => {
                // Exemplo: se desejar excluir endpoint, use containerManager ou despache uma ação
                if (window.confirm('Você deseja excluir este endpoint?')) {
                  // Aqui você pode implementar a remoção do endpoint
                  // Por simplicidade, chamamos uma função dummy
                  console.log('Delete endpoint', compDef.id)
                }
              },
              onPin: () => handlePin(compDef),
              onEdit: () => handleEditEndpoint(compDef)
            }
            if (compDef.type === 'Text') {
              return (
                <TextComponent
                  key={compDef.id}
                  componentDefinition={compDef}
                  payload={'Sample text payload'}
                  {...commonProps}
                />
              )
            } else if (compDef.type === 'Table') {
              return (
                <TableComponent
                  key={compDef.id}
                  componentDefinition={compDef}
                  data={[{ col1: 'Value1', col2: 'Value2' }]}
                  {...commonProps}
                />
              )
            } else {
              return (
                <TextComponent
                  key={compDef.id}
                  componentDefinition={compDef}
                  payload={'Default payload'}
                  {...commonProps}
                />
              )
            }
          })
        ) : (
          <Typography variant="body2" color="textSecondary">
            No endpoints added.
          </Typography>
        )}
      </CardContent>
      {editingEndpoint !== null && (
        <EndpointDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          initialData={editingEndpoint || {}}
          onSubmit={handleDialogSubmit}
        />
      )}
    </Card>
  )
}

export default ContainerViewer

// src/renderer/src/container/ContainerViewer.tsx
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { ContainerData } from '../globalStore/GlobalStoreProvider'
import { ContainerManager } from './ContainerManager'

interface ContainerViewerProps {
  container: ContainerData
}

const ContainerViewer: React.FC<ContainerViewerProps> = ({ container }) => {
  // Usamos um state dummy para forçar re-render quando o container for alterado.
  const [_, setUpdate] = useState({})
  const containerManager = new ContainerManager(container)

  const handleAddEndpoint = (): void => {
    containerManager.addEndpoint()
    setUpdate({}) // Força re-render para refletir a atualização
  }

  const handleImportAPIDefinition = (): void => {
    // Exemplo: chamamos a função com uma definição dummy.
    const dummyApiDefinition = {
      baseUrl: 'https://api.example.com',
      authRequired: true
    }
    containerManager.importAPIDefinition(dummyApiDefinition)
    setUpdate({})
  }

  return (
    <Card variant="outlined" style={{ marginBottom: '16px' }}>
      <CardContent>
        <Typography variant="h6">{container.containerSettings.title || 'Container'}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" onClick={handleAddEndpoint}>
          Add Endpoint
        </Button>
        <Button size="small" variant="outlined" onClick={handleImportAPIDefinition}>
          Import API Definition
        </Button>
      </CardActions>
      <CardContent>
        <Typography variant="subtitle1">Components:</Typography>
        {container.components && container.components.length > 0 ? (
          <List>
            {container.components.map((comp) => (
              <ListItem key={comp.componentDefinition.id}>
                <ListItemText
                  primary={comp.componentDefinition.type}
                  secondary={comp.componentDefinition.endpointUrl}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No components added.
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default ContainerViewer

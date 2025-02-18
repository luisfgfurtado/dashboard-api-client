// src/renderer/src/container/ContainerViewer.tsx
import React from 'react'
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
import { ContainerData } from '../globalStore'

interface ContainerViewerProps {
  container: ContainerData
}

const ContainerViewer: React.FC<ContainerViewerProps> = ({ container }) => {
  const handleAddEndpoint = (): void => {
    // Lógica para adicionar um endpoint ao container
  }

  const handleImportAPIDefinition = (): void => {
    // Lógica para importar a API definition para o container
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

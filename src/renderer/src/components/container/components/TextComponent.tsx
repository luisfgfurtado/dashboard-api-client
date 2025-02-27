// src/renderer/src/components/container/TextComponent.tsx
import React from 'react'
import { Card, CardContent, CardActions, Typography, IconButton } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteIcon from '@mui/icons-material/Delete'
import PushPinIcon from '@mui/icons-material/PushPin'
import EditIcon from '@mui/icons-material/Edit'
import { ComponentDefinition } from '../../globalStore'

interface TextComponentProps {
  componentDefinition: ComponentDefinition
  payload?: string
  onRefresh: () => void
  onDelete: () => void
  onPin: () => void
  onEdit: () => void
}

const TextComponent: React.FC<TextComponentProps> = ({
  componentDefinition,
  payload,
  onRefresh,
  onDelete,
  onPin,
  onEdit
}) => {
  return (
    <Card variant="outlined" style={{ marginBottom: '16px' }}>
      <CardContent>
        <Typography variant="subtitle1">
          {componentDefinition.verb} - {componentDefinition.endpointUrl}
        </Typography>
        <Typography variant="body2" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
          {payload || 'No data available.'}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={onRefresh} size="small">
          <RefreshIcon />
        </IconButton>
        <IconButton onClick={onDelete} size="small">
          <DeleteIcon />
        </IconButton>
        <IconButton
          onClick={onPin}
          size="small"
          color={componentDefinition.pinned ? 'primary' : 'default'}
        >
          <PushPinIcon />
        </IconButton>
        <IconButton onClick={onEdit} size="small">
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default TextComponent

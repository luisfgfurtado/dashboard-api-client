// src/renderer/src/components/container/EndpointDialog.tsx
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from '@mui/material'
import { ComponentDefinition } from '../globalStore'

interface EndpointDialogProps {
  open: boolean
  onClose: () => void
  initialData?: Partial<ComponentDefinition>
  onSubmit: (data: Partial<ComponentDefinition>) => void
}

const EndpointDialog: React.FC<EndpointDialogProps> = ({
  open,
  onClose,
  initialData,
  onSubmit
}) => {
  // Valores padrão se não houver initialData (para adicionar novo endpoint)
  const defaultData: Partial<ComponentDefinition> = {
    endpointUrl: '',
    verb: 'GET',
    type: 'Text'
  }

  const [endpointUrl, setEndpointUrl] = useState(
    initialData?.endpointUrl || defaultData.endpointUrl
  )
  const [verb, setVerb] = useState(initialData?.verb || defaultData.verb)
  const [type, setType] = useState(initialData?.type || defaultData.type)

  useEffect(() => {
    setEndpointUrl(initialData?.endpointUrl || defaultData.endpointUrl)
    setVerb(initialData?.verb || defaultData.verb)
    setType(initialData?.type || defaultData.type)
  }, [initialData])

  const handleSubmit = () => {
    onSubmit({ endpointUrl, verb, type })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData && initialData.id ? 'Edit Endpoint' : 'Add New Endpoint'}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Endpoint URL"
          value={endpointUrl}
          onChange={(e) => setEndpointUrl(e.target.value)}
          fullWidth
        />
        <TextField
          select
          margin="dense"
          label="HTTP Verb"
          value={verb}
          onChange={(e) => setVerb(e.target.value)}
          fullWidth
        >
          <MenuItem value="GET">GET</MenuItem>
          <MenuItem value="POST">POST</MenuItem>
          <MenuItem value="PUT">PUT</MenuItem>
          <MenuItem value="DELETE">DELETE</MenuItem>
        </TextField>
        <TextField
          select
          margin="dense"
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          fullWidth
        >
          <MenuItem value="Text">Text</MenuItem>
          <MenuItem value="Table">Table</MenuItem>
          <MenuItem value="Button">Button</MenuItem>
          <MenuItem value="List">List</MenuItem>
          <MenuItem value="ComboSelect">ComboSelect</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EndpointDialog

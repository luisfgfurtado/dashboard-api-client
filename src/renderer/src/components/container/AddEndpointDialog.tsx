// src/renderer/src/components/container/AddEndpointDialog.tsx
import React, { useState } from 'react'
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

interface AddEndpointDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<ComponentDefinition>) => void
}

const AddEndpointDialog: React.FC<AddEndpointDialogProps> = ({ open, onClose, onSubmit }) => {
  const [endpointUrl, setEndpointUrl] = useState('')
  const [verb, setVerb] = useState('GET')
  const [type, setType] = useState('Text')

  const handleSubmit = (): void => {
    onSubmit({ endpointUrl, verb, type })
    setEndpointUrl('')
    setVerb('GET')
    setType('Text')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Endpoint</DialogTitle>
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
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEndpointDialog

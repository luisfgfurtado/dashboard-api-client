// src/renderer/src/components/container/TableComponent.tsx
import React from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteIcon from '@mui/icons-material/Delete'
import PushPinIcon from '@mui/icons-material/PushPin'
import EditIcon from '@mui/icons-material/Edit'
import { ComponentDefinition } from '../../globalStore'

interface TableComponentProps {
  componentDefinition: ComponentDefinition
  data?: any[]
  onRefresh: () => void
  onDelete: () => void
  onPin: () => void
  onEdit: () => void
}

const TableComponent: React.FC<TableComponentProps> = ({
  componentDefinition,
  data,
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
        {data && data.length > 0 ? (
          <TableContainer component={Paper} style={{ marginTop: '16px' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {Object.keys(data[0]).map((key) => (
                    <TableCell key={key}>{key}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Object.values(row).map((value, cellIndex) => (
                      <TableCell key={cellIndex}>{String(value)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '16px' }}>
            No data available.
          </Typography>
        )}
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

export default TableComponent

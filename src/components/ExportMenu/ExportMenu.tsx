import React, { useState } from 'react';
import { 
  Menu, 
  MenuItem, 
  IconButton, 
  ListItemIcon, 
  ListItemText,
  Tooltip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export interface ExportFormat {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export interface ExportMenuProps {
  onExport: (format: string) => Promise<void>;
  disabled?: boolean;
  availableFormats?: ExportFormat[];
}

const defaultFormats: ExportFormat[] = [
  {
    id: 'mindmap-pdf',
    label: 'Mind Map (PDF)',
    icon: <AccountTreeIcon />,
    description: 'Export as a hierarchical mind map visualization'
  },
  {
    id: 'tiered-pdf',
    label: 'Tiered List (PDF)',
    icon: <PictureAsPdfIcon />,
    description: 'Export as a tiered list with indentation'
  },
  {
    id: 'table-csv',
    label: 'Data Table (CSV)',
    icon: <TableChartIcon />,
    description: 'Export as a flat data table'
  }
];

export const ExportMenu: React.FC<ExportMenuProps> = ({
  onExport,
  disabled = false,
  availableFormats = defaultFormats
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (format: string) => {
    try {
      setLoading(true);
      await onExport(format);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <Tooltip title="Export">
        <span>
          <IconButton
            onClick={handleClick}
            disabled={disabled || loading}
            aria-label="export options"
            aria-controls={open ? 'export-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            data-testid="export-button"
          >
            <DownloadIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
          role: 'menu'
        }}
        PaperProps={{
          'data-testid': 'export-menu' as string
        }}
      >
        {availableFormats.map((format) => (
          <MenuItem
            key={format.id}
            onClick={() => handleExport(format.id)}
            disabled={loading}
            data-testid={`export-option-${format.id}`}
          >
            <ListItemIcon>{format.icon}</ListItemIcon>
            <ListItemText 
              primary={format.label}
              secondary={format.description}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

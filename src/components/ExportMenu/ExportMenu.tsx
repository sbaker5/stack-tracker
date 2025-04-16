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
  const [error, setError] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setError(null); // Clear error when menu closes
    setExportAttempted(false);
  };

  // Track if export was triggered by user click
  const [exportAttempted, setExportAttempted] = useState(false);

  const handleExport = async (format: string) => {
    setError(null); // Clear previous error
    setExportAttempted(true);
    setLoading(true);
    try {
      await onExport(format);
      setLoading(false);
      setExportAttempted(false);
      handleClose(); // Success: close menu
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Export failed'); // Failure: keep menu open
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
        {error && (
          <MenuItem disabled style={{ pointerEvents: 'none', background: 'transparent' }}>
            <span style={{ width: '100%' }}>
              <span data-testid="export-error" style={{ color: '#d32f2f', fontWeight: 500 }}>{error}</span>
            </span>
          </MenuItem>
        )}
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

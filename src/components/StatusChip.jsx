import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { STATUS_CONFIG } from '../constants/config';

export default function StatusChip({ status, pending = false }) {
  const cfg = STATUS_CONFIG[status] || { color: '#6b7280', bg: '#f3f4f6', label: status };
  return (
    <Chip
      size="small"
      label={
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <span>{cfg.label}</span>
          {pending && (
            <Tooltip title="Pending sync">
              <HourglassTopIcon sx={{ fontSize: 14, color: 'warning.dark' }} />
            </Tooltip>
          )}
        </Box>
      }
      icon={
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: cfg.color,
          display: 'inline-block',
          flexShrink: 0,
          marginLeft: 6,
        }} />
      }
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        border: pending ? '1px dashed' : `1px solid ${cfg.color}30`,
        borderColor: pending ? 'warning.main' : `${cfg.color}30`,
        fontWeight: 600,
        fontSize: 12,
        letterSpacing: '0.02em',
        '& .MuiChip-icon': { marginLeft: 0, marginRight: -0.5 },
      }}
    />
  );
}

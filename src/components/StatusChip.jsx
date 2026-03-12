import Chip from '@mui/material/Chip';
import { STATUS_CONFIG } from '../constants/config';

export default function StatusChip({ status }) {
  const cfg = STATUS_CONFIG[status] || { color: '#6b7280', bg: '#f3f4f6', label: status };
  return (
    <Chip
      size="small"
      label={cfg.label}
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
        border: `1px solid ${cfg.color}30`,
        fontWeight: 600,
        fontSize: 12,
        letterSpacing: '0.02em',
        '& .MuiChip-icon': { marginLeft: 0, marginRight: -0.5 },
      }}
    />
  );
}

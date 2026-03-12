import Chip from '@mui/material/Chip';
import GridViewIcon from '@mui/icons-material/GridView';

export default function LocationBadge({ location }) {
  return (
    <Chip
      size="small"
      icon={<GridViewIcon sx={{ fontSize: '11px !important' }} />}
      label={location}
      sx={{
        bgcolor: '#f1f5f9',
        color: '#475569',
        border: '1px solid #e2e8f0',
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.08em',
        fontFamily: 'monospace',
        borderRadius: 1.5,
        '& .MuiChip-icon': { color: '#475569' },
      }}
    />
  );
}

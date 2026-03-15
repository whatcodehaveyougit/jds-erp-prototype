import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import { STATUS_CONFIG } from '../constants/config';

export default function FilterBar({ search, setSearch, statusFilter, setStatusFilter, statusCounts, onPageReset }) {
  const FILTER_KEYS = ['All', 'Pending', ...Object.keys(STATUS_CONFIG)];

  return (
    <Paper
      variant="outlined"
      sx={{
        p: '16px 20px',
        mb: 2,
        borderColor: 'divider',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {/* Search */}
      <OutlinedInput
        value={search}
        onChange={e => { setSearch(e.target.value); onPageReset(); }}
        placeholder="Search by name, ID, location or batch..."
        size="small"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
          </InputAdornment>
        }
        sx={{ flex: '1 1 280px', maxWidth: 420, fontSize: 13 }}
      />

      {/* Status pills */}
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
        {FILTER_KEYS.map(s => {
          const active = statusFilter === s;
          const cfg = s === 'Pending'
            ? { color: '#b45309', bg: '#fef3c7', label: 'Pending' }
            : STATUS_CONFIG[s];

          const label = s === 'All'
            ? `All (${statusCounts.All || 0})`
            : s === 'Pending'
              ? `Pending (${statusCounts.Pending || 0})`
              : `${STATUS_CONFIG[s].label} (${statusCounts[s] || 0})`;

          return (
            <Chip
              key={s}
              size="small"
              clickable
              onClick={() => { setStatusFilter(s); onPageReset(); }}
              label={label}
              sx={{
                borderRadius: '20px',
                border: '1.5px solid',
                borderColor: active ? (cfg?.color || '#5a8a1e') : '#e2e8f0',
                bgcolor: active ? (cfg?.bg || '#dcfce7') : 'white',
                color: active ? (cfg?.color || '#5a8a1e') : 'text.secondary',
                fontWeight: 600,
                fontSize: 12,
                transition: 'all 0.15s',
                '&:hover': {
                  bgcolor: active ? (cfg?.bg || '#dcfce7') : '#f8fafc',
                },
              }}
            />
          );
        })}
      </Box>
    </Paper>
  );
}

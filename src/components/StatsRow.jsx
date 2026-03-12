import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function StatsRow({ plants, statusCounts }) {
  const stats = [
    { label: 'Total Plants', value: plants.length,                icon: '🌿', color: '#5a8a1e' },
    { label: 'Available',    value: statusCounts['Available'],    icon: '✅', color: '#16a34a' },
    { label: 'Growing',      value: statusCounts['Growing'],      icon: '🌱', color: '#3b82f6' },
    { label: 'In-Shop',      value: statusCounts['In-shop'],      icon: '🏪', color: '#06b6d4' },
    { label: 'Incoming',     value: statusCounts['Incoming'],     icon: '📦', color: '#8b5cf6' },
  ];

  return (
    <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
      {stats.map(stat => (
        <Grid item xs={12} sm={6} md key={stat.label}>
          <Paper
            variant="outlined"
            sx={{
              p: '14px 20px',
              borderColor: 'divider',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <Box sx={{ fontSize: 20, mb: 0.5 }}>{stat.icon}</Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: stat.color, lineHeight: 1 }}>
              {stat.value}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.25, fontWeight: 500, display: 'block' }}>
              {stat.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';

function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString();
}

export default function QueuedUpdatesPage({ queuedStatusUpdates, onSyncNow }) {
  const hasItems = queuedStatusUpdates.length > 0;
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return (
    <Box sx={{ p: '24px 32px', maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark' }}>
            Queued Status Updates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            These changes were saved while offline and will sync once online.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={onSyncNow}
          disabled={!isOnline || !hasItems}
          sx={{ fontWeight: 700 }}
        >
          Sync Now
        </Button>
      </Box>

      {!isOnline && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are offline. Sync will run automatically when your connection returns.
        </Alert>
      )}

      <Paper variant="outlined" sx={{ borderColor: 'divider', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 700 }}>Plant</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Plant ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Queued Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Queued At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hasItems ? (
              queuedStatusUpdates.map((item) => (
                <TableRow key={item.plantId}>
                  <TableCell>{item.plantName || 'Unknown plant'}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.plantId}</TableCell>
                  <TableCell>
                    <Chip size="small" label={item.status} color="warning" variant="outlined" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell>{formatDateTime(item.queuedAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ py: 6, textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 700 }}>No queued status updates</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    All pending changes are synced.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

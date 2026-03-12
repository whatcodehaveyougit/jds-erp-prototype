import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { PLANTS } from '../data/plants';
import StatusChip from './StatusChip';
import LocationBadge from './LocationBadge';

export default function ScannerPanel() {
  const [scanInput, setScanInput]   = useState('');
  const [scanResult, setScanResult] = useState(null);

  const handleScan = () => {
    const match = PLANTS.find(p =>
      p.id === scanInput.trim() ||
      p.location === scanInput.trim() ||
      p.batch === scanInput.trim()
    );
    setScanResult(match || 'notfound');
    setScanInput('');
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        mb: 2.5,
        borderColor: 'primary.main',
        borderStyle: 'dashed',
        borderWidth: 2,
        boxShadow: '0 4px 20px rgba(106,170,31,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box sx={{ fontSize: 20 }}>📷</Box>
        <Box>
          <Typography sx={{ fontWeight: 700, color: 'primary.dark', fontSize: 14 }}>
            Barcode Scanner Mode
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Scan a plant tag or shelf barcode to locate it
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.25 }}>
        <OutlinedInput
          autoFocus
          value={scanInput}
          onChange={e => setScanInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleScan()}
          placeholder="Scan or type barcode (e.g. PLT-003, A-24-2, B-2024-03)..."
          size="small"
          sx={{
            flex: 1,
            fontFamily: 'monospace',
            fontSize: 13,
            bgcolor: '#f0fdf4',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1fae5' },
          }}
        />
        <Button variant="contained" color="primary" onClick={handleScan} sx={{ fontWeight: 600 }}>
          Locate
        </Button>
      </Box>

      {scanResult && (
        <Box sx={{ mt: 1.5 }}>
          {scanResult === 'notfound' ? (
            <Alert severity="error" sx={{ fontSize: 13, fontWeight: 600 }}>
              No match found. Check the barcode and try again.
            </Alert>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                bgcolor: '#f0fdf4',
                borderColor: '#bbf7d0',
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ fontSize: 28 }}>🌱</Box>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#15803d', fontSize: 15 }}>
                  {scanResult.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.secondary">
                    ID: <strong style={{ color: '#1e293b' }}>{scanResult.id}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Batch: <strong style={{ color: '#1e293b' }}>{scanResult.batch}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Price: <strong style={{ color: '#1e293b' }}>£{scanResult.price.toFixed(2)}</strong>
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
                <StatusChip status={scanResult.status} />
                <LocationBadge location={scanResult.location} />
              </Box>
            </Paper>
          )}
        </Box>
      )}
    </Paper>
  );
}

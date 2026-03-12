import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { PLANTS } from '../data/plants';
import StatusChip from './StatusChip';
import LocationBadge from './LocationBadge';

const CAMERA_DIV_ID = 'jds-camera-reader';

export default function ScannerPanel() {
  const [mode, setMode]             = useState('keyboard'); // 'keyboard' | 'camera'
  const [scanInput, setScanInput]   = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const scannerRef = useRef(null);

  // ── Camera lifecycle ────────────────────────────────────────────────────────

  useEffect(() => {
    if (mode !== 'camera') return;

    const scanner = new Html5Qrcode(CAMERA_DIV_ID);
    scannerRef.current = scanner;
    setCameraError(null);

    scanner
      .start(
        { facingMode: 'environment' }, // prefer back camera on mobile
        { fps: 10, qrbox: { width: 280, height: 160 } },
        (decodedText) => {
          handleLookup(decodedText);
          // brief pause after a successful scan to avoid repeated fires
          scanner.pause(true);
          setTimeout(() => {
            if (scannerRef.current) scanner.resume();
          }, 2000);
        },
        () => {} // suppress per-frame "not found" errors
      )
      .catch(err => {
        setCameraError(
          err?.message?.includes('Permission')
            ? 'Camera permission denied. Please allow camera access and try again.'
            : 'Could not start camera. Check your browser permissions.'
        );
      });

    return () => {
      scanner.stop().catch(() => {}).finally(() => {
        scannerRef.current = null;
      });
    };
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Shared lookup ───────────────────────────────────────────────────────────

  const handleLookup = (value) => {
    const trimmed = value.trim();
    const match = PLANTS.find(p =>
      p.id === trimmed ||
      p.location === trimmed ||
      p.batch === trimmed
    );
    setScanResult(match || 'notfound');
  };

  const handleKeyboardScan = () => {
    handleLookup(scanInput);
    setScanInput('');
  };

  const handleModeChange = (_, newMode) => {
    if (newMode) {
      setScanResult(null);
      setMode(newMode);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

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
      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <QrCodeScannerIcon sx={{ color: 'primary.dark', fontSize: 22 }} />
          <Box>
            <Typography sx={{ fontWeight: 700, color: 'primary.dark', fontSize: 14 }}>
              Barcode Scanner Mode
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {mode === 'keyboard'
                ? 'Type or paste a barcode, or plug in a USB/Bluetooth scanner'
                : 'Point your camera at a barcode or QR code'}
            </Typography>
          </Box>
        </Box>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          size="small"
          sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 600, fontSize: 12 } }}
        >
          <ToggleButton value="keyboard">
            <KeyboardIcon sx={{ fontSize: 15, mr: 0.75 }} />
            Keyboard / USB
          </ToggleButton>
          <ToggleButton value="camera">
            <QrCodeScannerIcon sx={{ fontSize: 15, mr: 0.75 }} />
            Camera
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Keyboard mode */}
      {mode === 'keyboard' && (
        <Box sx={{ display: 'flex', gap: 1.25 }}>
          <OutlinedInput
            autoFocus
            value={scanInput}
            onChange={e => setScanInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleKeyboardScan()}
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
          <Button variant="contained" color="primary" onClick={handleKeyboardScan} sx={{ fontWeight: 600 }}>
            Locate
          </Button>
        </Box>
      )}

      {/* Camera mode */}
      {mode === 'camera' && (
        <Box>
          {cameraError ? (
            <Alert severity="error" sx={{ mb: 1 }}>{cameraError}</Alert>
          ) : (
            <Alert severity="info" sx={{ mb: 1.5, fontSize: 12 }}>
              Camera is active — hold a barcode or QR code steady in the frame.
            </Alert>
          )}
          {/* html5-qrcode mounts the video feed into this div */}
          <Box
            id={CAMERA_DIV_ID}
            sx={{
              borderRadius: 1.5,
              overflow: 'hidden',
              border: '2px solid',
              borderColor: 'primary.light',
              maxWidth: 480,
            }}
          />
        </Box>
      )}

      {/* Result */}
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

import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import HomeIcon from '@mui/icons-material/Home';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AddIcon from '@mui/icons-material/Add';
import PaletteIcon from '@mui/icons-material/Palette';

export default function Header({ scanMode, setScanMode, onOpenLocations }) {
  const { pathname } = useLocation();
  const navigate     = useNavigate();

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between', height: 68, px: 4 }}>
        {/* Logo — clicking goes home */}
        <Box
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.75, cursor: 'pointer' }}
        >
          <Box sx={{
            height: 44,
            px: 1.75,
            borderRadius: 1.25,
            bgcolor: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(232,93,26,0.4)',
          }}>
            <Typography sx={{
              color: 'white',
              fontWeight: 900,
              fontSize: 20,
              letterSpacing: '-0.02em',
              fontFamily: "'Georgia', serif",
            }}>
              JDS
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Plant Hub
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 400, letterSpacing: '0.02em' }}>
              Inventory Management System
            </Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <HeaderBtn
            active={scanMode}
            onClick={() => setScanMode(m => !m)}
            icon={<QrCodeScannerIcon sx={{ fontSize: 16 }} />}
            label="Scan Barcode"
          />
          <HeaderBtn
            active={pathname === '/locations'}
            onClick={() => navigate('/locations')}
            icon={<HomeIcon sx={{ fontSize: 16 }} />}
            label="Locations"
          />
          <HeaderBtn
            active={pathname === '/design-system'}
            onClick={() => navigate('/design-system')}
            icon={<PaletteIcon sx={{ fontSize: 16 }} />}
            label="Design System"
          />
          <HeaderBtn
            onClick={onOpenLocations}
            icon={<AddLocationIcon sx={{ fontSize: 16 }} />}
            label="Add Location"
          />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            sx={{ fontWeight: 700, boxShadow: '0 2px 8px rgba(232,93,26,0.35)' }}
          >
            Add Plant
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function HeaderBtn({ onClick, icon, label, active }) {
  return (
    <Button
      onClick={onClick}
      startIcon={icon}
      sx={{
        color: 'white',
        bgcolor: active ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.3)',
        fontWeight: 600,
        fontSize: 13,
        '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
      }}
    >
      {label}
    </Button>
  );
}

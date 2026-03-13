import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AddIcon from '@mui/icons-material/Add';
import PaletteIcon from '@mui/icons-material/Palette';

export default function Header({ scanMode, setScanMode, onOpenLocations }) {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    {
      label:  'Scan Barcode',
      icon:   <QrCodeScannerIcon />,
      onClick: () => { setScanMode(m => !m); setDrawerOpen(false); },
      active: scanMode,
    },
    {
      label:  'Locations',
      icon:   <LocationOnIcon />,
      onClick: () => { navigate('/locations'); setDrawerOpen(false); },
      active: pathname === '/locations',
    },
    {
      label:  'Design System',
      icon:   <PaletteIcon />,
      onClick: () => { navigate('/design-system'); setDrawerOpen(false); },
      active: pathname === '/design-system',
    },
    {
      label:  'Add Location',
      icon:   <AddLocationIcon />,
      onClick: () => { onOpenLocations(); setDrawerOpen(false); },
    },
  ];

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between', height: 68, px: { xs: 2, md: 4 } }}>

        {/* Logo */}
        <Box
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.75, cursor: 'pointer' }}
        >
          <Box sx={{
            height: 44, px: 1.75, borderRadius: 1.25,
            bgcolor: 'secondary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(232,93,26,0.4)',
          }}>
            <Typography sx={{
              color: 'white', fontWeight: 900, fontSize: 20,
              letterSpacing: '-0.02em', fontFamily: "'Georgia', serif",
            }}>
              JDS
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Plant Hub
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 400, letterSpacing: '0.02em', display: { xs: 'none', sm: 'block' } }}>
              Inventory Management System
            </Typography>
          </Box>
        </Box>

        {/* Desktop nav — hidden on mobile */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navItems.map(item => (
            <HeaderBtn key={item.label} active={item.active} onClick={item.onClick} icon={item.icon} label={item.label} />
          ))}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            sx={{ fontWeight: 700, boxShadow: '0 2px 8px rgba(232,93,26,0.35)' }}
          >
            Add Plant
          </Button>
        </Box>

        {/* Mobile hamburger — hidden on desktop */}
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
          size="large"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'primary.dark' }}>Menu</Typography>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider />
          <List disablePadding>
            {navItems.map(item => (
              <ListItemButton
                key={item.label}
                onClick={item.onClick}
                selected={item.active}
                sx={{
                  py: 1.5,
                  '&.Mui-selected': { bgcolor: 'primary.50', borderLeft: '3px solid', borderColor: 'primary.main' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: item.active ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { fontWeight: item.active ? 700 : 500, fontSize: 14 } }}
                />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Button fullWidth variant="contained" color="secondary" startIcon={<AddIcon />} sx={{ fontWeight: 700 }}>
              Add Plant
            </Button>
          </Box>
        </Box>
      </Drawer>
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

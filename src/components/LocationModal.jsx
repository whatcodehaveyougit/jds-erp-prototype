import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PlaceIcon from '@mui/icons-material/Place';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { LOCATION_TYPES, TYPE_COLORS } from '../constants/config';
import { PLANTS } from '../data/plants';
import LocationBadge from './LocationBadge';

export default function LocationModal({ locations, setLocations, onClose }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ zone: '', aisle: '', shelf: '', description: '', capacity: '', type: 'Warehouse' });

  const previewCode = form.zone && form.aisle && form.shelf
    ? `${form.zone}-${form.aisle.padStart(2, '0')}-${form.shelf}`
    : null;

  const handleSave = () => {
    if (!form.zone || !form.aisle || !form.shelf) return;
    const code = `${form.zone}-${form.aisle.padStart(2, '0')}-${form.shelf}`;
    const id = `LOC-${String(locations.length + 1).padStart(3, '0')}`;
    setLocations(prev => [...prev, { ...form, id, code, capacity: Number(form.capacity) || 20 }]);
    setForm({ zone: '', aisle: '', shelf: '', description: '', capacity: '', type: 'Warehouse' });
    setTab(0);
  };

  const canSave = form.zone && form.aisle && form.shelf;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      {/* Modal header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #5a8a1e, #7abf22)',
        px: 3, py: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 1.25,
            bgcolor: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PlaceIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Manage Locations</Typography>
            <Typography sx={{ color: '#d4f5a0', fontSize: 12 }}>{locations.length} locations registered</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fafafa', px: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 44 }}>
          <Tab label="All Locations" sx={{ fontSize: 13 }} />
          <Tab label="+ Add New Location" sx={{ fontSize: 13 }} />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0, overflow: 'auto' }}>
        {tab === 0 && <LocationList locations={locations} />}
        {tab === 1 && (
          <AddLocationForm
            form={form}
            setForm={setForm}
            previewCode={previewCode}
            canSave={canSave}
            onSave={handleSave}
            onCancel={() => setTab(0)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function LocationList({ locations }) {
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {locations.map(loc => {
        const tc = TYPE_COLORS[loc.type] || { color: '#64748b', bg: '#f1f5f9' };
        const plantCount = PLANTS.filter(p => p.location === loc.code).length;
        const pct = plantCount / loc.capacity;
        const barColor = pct >= 1 ? '#fca5a5' : pct > 0.7 ? '#fcd34d' : '#86efac';

        return (
          <Paper
            key={loc.id}
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.75,
              px: 2, py: 1.5,
              borderRadius: 1.25,
              borderColor: '#f1f5f9',
              transition: 'border-color 0.15s',
              '&:hover': { borderColor: '#bbf7d0' },
            }}
          >
            <Box sx={{
              width: 42, height: 42, borderRadius: 1.25,
              bgcolor: tc.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <PlaceIcon sx={{ color: tc.color, fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, color: 'text.primary' }}>
                  {loc.code}
                </Typography>
                <Chip
                  label={loc.type}
                  size="small"
                  sx={{ fontSize: 11, fontWeight: 600, bgcolor: tc.bg, color: tc.color, borderRadius: '20px', height: 20 }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{
                display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mt: 0.25,
              }}>
                {loc.description}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>
                {plantCount} <span style={{ color: '#94a3b8', fontWeight: 400 }}>plant{plantCount !== 1 ? 's' : ''}</span>
              </Typography>
              <Typography variant="caption" color="text.disabled">Cap: {loc.capacity}</Typography>
            </Box>
            <Box sx={{ width: 6, height: 36, borderRadius: 0.75, bgcolor: barColor, flexShrink: 0 }}
              title={`${Math.round(pct * 100)}% full`}
            />
          </Paper>
        );
      })}
    </Box>
  );
}

function AddLocationForm({ form, setForm, previewCode, canSave, onSave, onCancel }) {
  const update = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const fieldSx = { fontSize: 13, bgcolor: '#f8fafc' };
  const labelSx = {
    fontSize: 11, fontWeight: 700, color: '#64748b',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    mb: 0.75, display: 'block',
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Info box */}
      <Paper variant="outlined" sx={{ bgcolor: '#f0fdf4', borderColor: '#bbf7d0', p: 2, mb: 2.5, borderRadius: 1.25 }}>
        <Typography sx={{ fontSize: 12, color: 'primary.dark', fontWeight: 600, mb: 0.5 }}>
          📍 Location ID Format
        </Typography>
        <Typography variant="caption" color="text.secondary">
          IDs are auto-generated as{' '}
          <strong style={{ fontFamily: 'monospace', color: '#5a8a1e' }}>ZONE-AISLE-SHELF</strong>{' '}
          (e.g. <strong style={{ fontFamily: 'monospace' }}>A-12-3</strong>, <strong style={{ fontFamily: 'monospace' }}>SHOP-01</strong>)
        </Typography>
        {previewCode && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">Preview:</Typography>
            <LocationBadge location={previewCode} />
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.75, mb: 1.75 }}>
        {[
          { key: 'zone',  label: 'Zone *',         placeholder: 'e.g. A, B, SHOP' },
          { key: 'aisle', label: 'Aisle / Bay *',   placeholder: 'e.g. 12, 24' },
          { key: 'shelf', label: 'Shelf *',          placeholder: 'e.g. 1, 2, 3' },
        ].map(f => (
          <FormControl key={f.key}>
            <Typography component="label" sx={labelSx}>{f.label}</Typography>
            <OutlinedInput
              value={form[f.key]}
              onChange={e => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              size="small"
              sx={fieldSx}
            />
          </FormControl>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.75, mb: 1.75 }}>
        <FormControl>
          <Typography component="label" sx={labelSx}>Location Type</Typography>
          <Select
            value={form.type}
            onChange={e => update('type', e.target.value)}
            size="small"
            sx={fieldSx}
          >
            {LOCATION_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl>
          <Typography component="label" sx={labelSx}>Capacity (plants)</Typography>
          <OutlinedInput
            type="number"
            value={form.capacity}
            onChange={e => update('capacity', e.target.value)}
            placeholder="e.g. 20"
            size="small"
            sx={fieldSx}
          />
        </FormControl>
      </Box>

      <FormControl fullWidth sx={{ mb: 2.5 }}>
        <Typography component="label" sx={labelSx}>Description</Typography>
        <OutlinedInput
          value={form.description}
          onChange={e => update('description', e.target.value)}
          placeholder="e.g. Main warehouse, aisle 12, shelf 3"
          size="small"
          sx={fieldSx}
        />
      </FormControl>

      <Box sx={{ display: 'flex', gap: 1.25, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel} sx={{ fontWeight: 600, borderColor: '#e2e8f0', color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={!canSave}
          onClick={onSave}
          startIcon={<AddCircleOutlineIcon />}
          sx={{ fontWeight: 700 }}
        >
          Save Location
        </Button>
      </Box>
    </Box>
  );
}

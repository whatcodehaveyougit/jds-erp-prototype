import { useState, useCallback, useMemo, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Collapse from '@mui/material/Collapse';
import Popover from '@mui/material/Popover';
import Menu from '@mui/material/Menu';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import StatusChip from './StatusChip';
import LocationBadge from './LocationBadge';
import { STATUS_CONFIG } from '../constants/config';

const ROWS_PER_PAGE = 10;

const ALL_COLUMNS = [
  { key: 'name',     label: 'Plant Name', defaultVisible: true  },
  { key: 'potSize',  label: 'Pot Sizes',  defaultVisible: true  },
  { key: 'qty',      label: 'Total Qty',  defaultVisible: true  },
  { key: 'location', label: 'Location',   defaultVisible: true  },
  { key: 'status',   label: 'Status',     defaultVisible: true  },
  { key: 'price',    label: 'Price',      defaultVisible: true  },
];

const LOW_STOCK_THRESHOLD = 5;
const POT_SIZES = ['7cm', '9cm', '1L', '2L', '3L', '5L', '10L', '20L'];

export default function PlantTable({
  filtered, search, page, setPage, sortConfig, onSort,
  onUpdateQty, onUpdatePotSize, onUpdateStatus, onUpdateLocation, onAddPlant, allPlants,
}) {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [addBatchFor, setAddBatchFor]     = useState(null);
  const [visibleCols, setVisibleCols]     = useState(
    () => ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {})
  );
  const [colAnchor, setColAnchor] = useState(null);

  // Group filtered plants by name, preserving sort order of first appearance
  const groups = useMemo(() => {
    const map = new Map();
    filtered.forEach(plant => {
      if (!map.has(plant.name)) map.set(plant.name, []);
      map.get(plant.name).push(plant);
    });
    return Array.from(map.entries()).map(([name, batches]) => ({ name, batches }));
  }, [filtered]);

  const totalPages    = Math.ceil(groups.length / ROWS_PER_PAGE);
  const paginatedGroups = groups.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);
  const totalPlants   = filtered.length;

  const visibleColumns = ALL_COLUMNS.filter(c => visibleCols[c.key]);
  const colSpan        = visibleColumns.length + 1;

  const toggleCol = key => setVisibleCols(prev => ({ ...prev, [key]: !prev[key] }));

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <SwapVertIcon sx={{ fontSize: 14, ml: 0.5, color: 'text.disabled', verticalAlign: 'middle' }} />;
    return sortConfig.dir === 'asc'
      ? <ArrowUpwardIcon  sx={{ fontSize: 14, ml: 0.5, color: 'primary.main', verticalAlign: 'middle' }} />
      : <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5, color: 'primary.main', verticalAlign: 'middle' }} />;
  };

  return (
    <Paper variant="outlined" sx={{ borderColor: 'divider', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

      {/* Info bar */}
      <Box sx={{ px: 2.5, py: 1.75, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Showing <strong>{groups.length}</strong> plant{groups.length !== 1 ? 's' : ''} ({totalPlants} batch{totalPlants !== 1 ? 'es' : ''})
          {search && <Box component="span" sx={{ color: 'primary.main' }}> for "{search}"</Box>}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="caption" color="text.disabled">
            Page {page + 1} of {totalPages || 1}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ViewColumnIcon />}
            onClick={e => setColAnchor(e.currentTarget)}
            sx={{ fontWeight: 600, fontSize: 12, borderColor: 'divider', color: 'text.secondary' }}
          >
            Columns
          </Button>
        </Box>
      </Box>

      {/* Column visibility popover */}
      <Popover
        open={Boolean(colAnchor)}
        anchorEl={colAnchor}
        onClose={() => setColAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, minWidth: 190 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 11, mb: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Show / Hide Columns
          </Typography>
          {ALL_COLUMNS.map(col => (
            <Box key={col.key}>
              <FormControlLabel
                control={<Checkbox size="small" checked={visibleCols[col.key]} onChange={() => toggleCol(col.key)} color="primary" />}
                label={<Typography sx={{ fontSize: 13, fontWeight: 500 }}>{col.label}</Typography>}
                sx={{ display: 'flex', mx: 0, mb: 0.25 }}
              />
            </Box>
          ))}
        </Box>
      </Popover>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid', borderColor: 'divider' }}>
              {visibleColumns.map(col => (
                <TableCell
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  sx={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                >
                  {col.label}<SortIcon col={col.key} />
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} sx={{ py: 6, textAlign: 'center' }}>
                  <Box sx={{ fontSize: 32, mb: 1 }}>🔍</Box>
                  <Typography sx={{ fontWeight: 600 }}>No plants found</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Try a different search term or filter
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginatedGroups.map(({ name, batches }, i) => (
              <PlantGroupRow
                key={name}
                name={name}
                batches={batches}
                i={i}
                expanded={expandedGroup === name}
                onToggle={() => setExpandedGroup(prev => prev === name ? null : name)}
                onAddBatch={() => setAddBatchFor(name)}
                visibleColumns={visibleColumns}
                colSpan={colSpan}
                onUpdateQty={onUpdateQty}
                onUpdatePotSize={onUpdatePotSize}
                onUpdateStatus={onUpdateStatus}
                onUpdateLocation={onUpdateLocation}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.75 }}>
        <PagBtn disabled={page === 0} onClick={() => setPage(p => p - 1)} label="← Prev" />
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            onClick={() => setPage(i)}
            variant={page === i ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            sx={{
              minWidth: 32, width: 32, height: 32, p: 0,
              fontSize: 13, fontWeight: 600,
              borderColor: page === i ? 'primary.main' : '#e2e8f0',
              color: page === i ? 'white' : '#475569',
            }}
          >
            {i + 1}
          </Button>
        ))}
        <PagBtn disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} label="Next →" />
      </Box>

      {/* Add Batch Dialog */}
      <AddBatchDialog
        open={Boolean(addBatchFor)}
        plantName={addBatchFor}
        existingBatches={allPlants.filter(p => p.name === addBatchFor)}
        onClose={() => setAddBatchFor(null)}
        onAdd={onAddPlant}
      />
    </Paper>
  );
}

// ─── Plant group summary row ───────────────────────────────────────────────────

function PlantGroupRow({ name, batches, i, expanded, onToggle, onAddBatch, visibleColumns, colSpan, onUpdateQty, onUpdatePotSize, onUpdateStatus, onUpdateLocation }) {
  const totalQty  = batches.reduce((sum, b) => sum + (b.qty || 0), 0);
  const potSizes  = [...new Set(batches.map(b => b.potSize))];
  const statuses  = [...new Set(batches.map(b => b.status))];
  const prices    = batches.map(b => b.price).filter(p => p != null);
  const minPrice  = prices.length ? Math.min(...prices) : null;
  const maxPrice  = prices.length ? Math.max(...prices) : null;

  const cellContent = {
    name: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box sx={{
          width: 30, height: 30, borderRadius: 1,
          background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, flexShrink: 0,
        }}>
          🌱
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>{name}</Typography>
          <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
            {batches.length} batch{batches.length !== 1 ? 'es' : ''}
          </Typography>
        </Box>
      </Box>
    ),
    potSize: (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {potSizes.map(size => (
          <Chip
            key={size}
            label={size}
            size="small"
            sx={{ fontSize: 11, fontWeight: 600, height: 20, bgcolor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}
          />
        ))}
      </Box>
    ),
    qty: (
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{totalQty}</Typography>
        {batches.length > 1 && (
          <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>total</Typography>
        )}
      </Box>
    ),
    location: batches.length === 1
      ? <LocationBadge location={batches[0].location} />
      : <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 500 }}>{batches.length} locations</Typography>,
    status: statuses.length === 1
      ? <StatusChip status={statuses[0]} />
      : (
        <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 500 }}>
          {statuses.length} statuses
        </Typography>
      ),
    price: minPrice != null
      ? (
        <Typography sx={{ fontWeight: 700, color: 'primary.dark', fontSize: 14 }}>
          {minPrice === maxPrice ? `£${minPrice.toFixed(2)}` : `£${minPrice.toFixed(2)}–£${maxPrice.toFixed(2)}`}
        </Typography>
      )
      : null,
  };

  return (
    <>
      <TableRow
        onClick={onToggle}
        sx={{
          borderBottom: expanded ? 0 : '1px solid',
          borderColor: '#f8fafc',
          bgcolor: expanded ? '#f0fdf4' : (i % 2 === 0 ? 'white' : '#fafafa'),
          cursor: 'pointer', transition: 'background 0.1s',
          '&:hover': { bgcolor: expanded ? '#dcfce7' : '#f8fafc' },
        }}
      >
        {visibleColumns.map(col => (
          <TableCell key={col.key}>{cellContent[col.key]}</TableCell>
        ))}
        <TableCell>
          <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
            <Button
              size="small"
              onClick={e => { e.stopPropagation(); onAddBatch(); }}
              startIcon={<AddIcon sx={{ fontSize: '14px !important' }} />}
              sx={{
                py: '2px', px: 1.25, minWidth: 'auto', fontSize: 11, fontWeight: 600,
                bgcolor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                '&:hover': { bgcolor: '#dcfce7' },
              }}
            >
              Add Batch
            </Button>
            {expanded
              ? <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              : <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
          </Box>
        </TableCell>
      </TableRow>

      {/* Expanded batch sub-table */}
      <TableRow>
        <TableCell colSpan={colSpan} sx={{ p: 0, border: 0 }}>
          <Collapse in={expanded} unmountOnExit>
            <Box sx={{ bgcolor: '#f8fffc', borderTop: '2px solid #bbf7d0', borderBottom: '2px solid #bbf7d0' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#ecfdf5' }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, color: 'text.secondary', pl: 5, width: 130 }}>Pot Size</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, color: 'text.secondary', width: 100 }}>Qty</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, color: 'text.secondary', width: 140 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, color: 'text.secondary' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, color: 'text.secondary' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, color: 'text.secondary' }}>Batch</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 11, color: 'text.secondary' }}>ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batches.map(batch => (
                    <BatchRow
                      key={batch.id}
                      batch={batch}
                      onUpdateQty={onUpdateQty}
                      onUpdatePotSize={onUpdatePotSize}
                      onUpdateStatus={onUpdateStatus}
                      onUpdateLocation={onUpdateLocation}
                    />
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ px: 3, py: 1.25, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #d1fae5' }}>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={onAddBatch}
                  variant="outlined"
                  color="primary"
                  sx={{ fontWeight: 600, fontSize: 12 }}
                >
                  Add Batch to {name}
                </Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// ─── Batch sub-row ─────────────────────────────────────────────────────────────

function BatchRow({ batch, onUpdateQty, onUpdatePotSize, onUpdateStatus, onUpdateLocation }) {
  return (
    <TableRow sx={{ '&:hover': { bgcolor: '#f0fdf4' } }}>
      <TableCell sx={{ pl: 5 }}>
        <PotSizeCell plant={batch} onUpdatePotSize={onUpdatePotSize} />
      </TableCell>
      <TableCell>
        <QtyCell plant={batch} onUpdateQty={onUpdateQty} />
      </TableCell>
      <TableCell>
        <LocationCell plant={batch} onUpdateLocation={onUpdateLocation} />
      </TableCell>
      <TableCell>
        <StatusCell plant={batch} onUpdateStatus={onUpdateStatus} />
      </TableCell>
      <TableCell>
        <Typography sx={{ fontWeight: 700, color: 'primary.dark', fontSize: 13 }}>
          £{batch.price?.toFixed(2)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontFamily: 'monospace', fontSize: 11, color: 'text.disabled' }}>
          {batch.batch}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontFamily: 'monospace', fontSize: 11, color: 'text.secondary', fontWeight: 600 }}>
          {batch.id}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

// ─── Add Batch dialog ──────────────────────────────────────────────────────────

function AddBatchDialog({ open, plantName, existingBatches, onClose, onAdd }) {
  const [form, setForm] = useState({
    potSize: '2L', qty: '', price: '', status: 'Growing', location: '', batch: '',
  });

  useEffect(() => {
    if (open && existingBatches) {
      setForm({
        potSize: '2L',
        qty: '',
        price: existingBatches[0]?.price ?? '',
        status: 'Growing',
        location: '',
        batch: `B-${new Date().getFullYear()}-${String(existingBatches.length + 1).padStart(2, '0')}`,
      });
    }
  }, [open, plantName]); // eslint-disable-line react-hooks/exhaustive-deps

  const valid = form.qty !== '' && form.location.trim() !== '';

  const handleAdd = () => {
    onAdd({ ...form, name: plantName });
    onClose();
  };

  const field = (label, content, required = false) => (
    <Box>
      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
        {label}{required && ' *'}
      </Typography>
      {content}
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Add Batch — {plantName}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0.5 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {field('Pot Size',
              <Select size="small" fullWidth value={form.potSize} onChange={e => setForm(f => ({ ...f, potSize: e.target.value }))}>
                {POT_SIZES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            )}
            {field('Quantity',
              <TextField size="small" fullWidth type="number" value={form.qty}
                onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
                slotProps={{ htmlInput: { min: 0 } }}
              />,
              true
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {field('Price (£)',
              <TextField size="small" fullWidth type="number" value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              />
            )}
            {field('Status',
              <Select size="small" fullWidth value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <MenuItem key={key} value={key}>{cfg.label}</MenuItem>
                ))}
              </Select>
            )}
          </Box>

          {field('Location',
            <TextField size="small" fullWidth value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="e.g. A-12-3"
            />,
            true
          )}

          {field('Batch Code',
            <TextField size="small" fullWidth value={form.batch}
              onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
              placeholder="e.g. B-2026-01"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ fontWeight: 600 }}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained" disabled={!valid} sx={{ fontWeight: 600 }}>
          Add Batch
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Inline cell editors ───────────────────────────────────────────────────────

function StatusCell({ plant, onUpdateStatus }) {
  const [anchor, setAnchor] = useState(null);

  return (
    <>
      <Box
        onClick={e => { e.stopPropagation(); setAnchor(e.currentTarget); }}
        sx={{ display: 'inline-flex', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
      >
        <StatusChip status={plant.status} />
      </Box>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        onClick={e => e.stopPropagation()}
        slotProps={{ paper: { sx: { mt: 0.5, minWidth: 170 } } }}
      >
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <MenuItem
            key={key}
            selected={plant.status === key}
            onClick={() => { onUpdateStatus(plant.id, key); setAnchor(null); }}
            sx={{ gap: 1.25, fontSize: 13, fontWeight: plant.status === key ? 700 : 500 }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cfg.color, flexShrink: 0 }} />
            {cfg.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function PotSizeCell({ plant, onUpdatePotSize }) {
  return (
    <Select
      size="small"
      value={plant.potSize}
      onClick={e => e.stopPropagation()}
      onChange={e => onUpdatePotSize(plant.id, e.target.value)}
      sx={{
        fontSize: 13, fontWeight: 600, minWidth: 80,
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
      }}
    >
      {POT_SIZES.map(size => (
        <MenuItem key={size} value={size} sx={{ fontSize: 13, fontWeight: 500 }}>{size}</MenuItem>
      ))}
    </Select>
  );
}

function QtyCell({ plant, onUpdateQty }) {
  const [value, setValue] = useState(plant.qty);
  const isLow   = value > 0 && value <= LOW_STOCK_THRESHOLD;
  const isOutOf = value === 0;

  const commit = useCallback((raw) => {
    const next = Math.max(0, parseInt(raw, 10) || 0);
    setValue(next);
    onUpdateQty(plant.id, next);
  }, [plant.id, onUpdateQty]);

  return (
    <Tooltip title={isOutOf ? 'Out of stock' : isLow ? 'Low stock' : ''} placement="top" disableHoverListener={!isLow && !isOutOf}>
      <TextField
        type="number"
        size="small"
        value={value}
        onClick={e => e.stopPropagation()}
        onChange={e => setValue(e.target.value)}
        onBlur={e => commit(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); e.stopPropagation(); }}
        slotProps={{ htmlInput: { min: 0, style: { textAlign: 'center', padding: '4px 6px', width: 54, fontWeight: 700 } } }}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: 13,
            bgcolor: isOutOf ? '#fef2f2' : isLow ? '#fffbeb' : 'white',
            '& fieldset': { borderColor: isOutOf ? 'error.main' : isLow ? 'warning.main' : 'divider' },
            '&:hover fieldset': { borderColor: isOutOf ? 'error.main' : isLow ? 'warning.main' : 'primary.main' },
          },
        }}
      />
    </Tooltip>
  );
}

function LocationCell({ plant, onUpdateLocation }) {
  const [value, setValue] = useState(plant.location);

  const commit = useCallback((val) => {
    const trimmed = val.trim();
    if (trimmed && trimmed !== plant.location) onUpdateLocation(plant.id, trimmed);
  }, [plant.id, plant.location, onUpdateLocation]);

  return (
    <TextField
      size="small"
      value={value}
      onClick={e => e.stopPropagation()}
      onChange={e => setValue(e.target.value)}
      onBlur={e => commit(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); e.stopPropagation(); }}
      placeholder="Location"
      sx={{
        minWidth: 90,
        '& input': { fontSize: 12, fontWeight: 600, fontFamily: 'monospace', padding: '4px 8px' },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
      }}
    />
  );
}

// ─── Pagination button ─────────────────────────────────────────────────────────

function PagBtn({ disabled, onClick, label }) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="outlined"
      size="small"
      sx={{
        px: 1.75, fontSize: 13, fontWeight: 600,
        borderColor: '#e2e8f0',
        color: disabled ? 'text.disabled' : '#475569',
        bgcolor: disabled ? '#f8fafc' : 'white',
      }}
    >
      {label}
    </Button>
  );
}

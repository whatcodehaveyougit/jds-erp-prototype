import { useState, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Collapse from '@mui/material/Collapse';
import Popover from '@mui/material/Popover';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import StatusChip from './StatusChip';
import LocationBadge from './LocationBadge';

const ROWS_PER_PAGE = 10;

const ALL_COLUMNS = [
  { key: 'name',     label: 'Plant Name', defaultVisible: true  },
  { key: 'potSize',  label: 'Pot Size',   defaultVisible: true  },
  { key: 'qty',      label: 'Qty',        defaultVisible: true  },
  { key: 'location', label: 'Location',   defaultVisible: true  },
  { key: 'status',   label: 'Status',     defaultVisible: true  },
  { key: 'price',    label: 'Price',      defaultVisible: true  },
  { key: 'id',       label: 'Plant ID',   defaultVisible: false },
  { key: 'batch',    label: 'Batch',      defaultVisible: false },
];

const LOW_STOCK_THRESHOLD = 5;

const POT_SIZES = ['7cm', '9cm', '1L', '2L', '3L', '5L', '10L', '20L'];

export default function PlantTable({ filtered, search, page, setPage, sortConfig, onSort, selectedRow, setSelectedRow, onUpdateQty, onUpdatePotSize }) {
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated  = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const [visibleCols, setVisibleCols] = useState(
    () => ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {})
  );
  const [colAnchor, setColAnchor] = useState(null);

  const visibleColumns = ALL_COLUMNS.filter(c => visibleCols[c.key]);
  const colSpan        = visibleColumns.length + 1; // +1 for actions

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
          Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> results
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
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} sx={{ py: 6, textAlign: 'center' }}>
                  <Box sx={{ fontSize: 32, mb: 1 }}>🔍</Box>
                  <Typography sx={{ fontWeight: 600 }}>No plants found</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Try a different search term or filter
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginated.map((plant, i) => {
              const isSelected = selectedRow?.id === plant.id;
              return (
                <ExpandableRow
                  key={plant.id}
                  plant={plant}
                  i={i}
                  isSelected={isSelected}
                  visibleColumns={visibleColumns}
                  colSpan={colSpan}
                  onToggle={() => setSelectedRow(isSelected ? null : plant)}
                  onClose={() => setSelectedRow(null)}
                  onUpdateQty={onUpdateQty}
                  onUpdatePotSize={onUpdatePotSize}
                />

              );
            })}
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
    </Paper>
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
        fontSize: 13,
        fontWeight: 600,
        minWidth: 80,
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
      }}
    >
      {POT_SIZES.map(size => (
        <MenuItem key={size} value={size} sx={{ fontSize: 13, fontWeight: 500 }}>
          {size}
        </MenuItem>
      ))}
    </Select>
  );
}

function QtyCell({ plant, onUpdateQty }) {
  const [value, setValue] = useState(plant.qty);
  const isLow     = value > 0 && value <= LOW_STOCK_THRESHOLD;
  const isOutOf   = value === 0;

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
        onKeyDown={e => { if (e.key === 'Enter') { e.target.blur(); } e.stopPropagation(); }}
        slotProps={{ htmlInput: { min: 0, style: { textAlign: 'center', padding: '4px 6px', width: 54, fontWeight: 700 } } }}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: 13,
            bgcolor: isOutOf ? '#fef2f2' : isLow ? '#fffbeb' : 'white',
            '& fieldset': {
              borderColor: isOutOf ? 'error.main' : isLow ? 'warning.main' : 'divider',
            },
            '&:hover fieldset': {
              borderColor: isOutOf ? 'error.main' : isLow ? 'warning.main' : 'primary.main',
            },
          },
        }}
      />
    </Tooltip>
  );
}

function ExpandableRow({ plant, i, isSelected, visibleColumns, colSpan, onToggle, onClose, onUpdateQty, onUpdatePotSize }) {
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
        <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>
          {plant.name}
        </Typography>
      </Box>
    ),
    id: (
      <Typography sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>
        {plant.id}
      </Typography>
    ),
    batch: (
      <Typography sx={{ fontFamily: 'monospace', fontSize: 11, color: 'text.disabled' }}>
        {plant.batch}
      </Typography>
    ),
    price: (
      <Typography sx={{ fontWeight: 700, color: 'primary.dark', fontSize: 14 }}>
        £{plant.price.toFixed(2)}
      </Typography>
    ),
    potSize:  <PotSizeCell plant={plant} onUpdatePotSize={onUpdatePotSize} />,
    qty:      <QtyCell plant={plant} onUpdateQty={onUpdateQty} />,
    status:   <StatusChip status={plant.status} />,
    location: <LocationBadge location={plant.location} />,
  };

  return (
    <>
      <TableRow
        onClick={onToggle}
        sx={{
          borderBottom: '1px solid', borderColor: '#f8fafc',
          bgcolor: isSelected ? '#f0fdf4' : (i % 2 === 0 ? 'white' : '#fafafa'),
          cursor: 'pointer', transition: 'background 0.1s',
          '&:hover': { bgcolor: isSelected ? '#f0fdf4' : '#f8fafc' },
        }}
      >
        {visibleColumns.map(col => (
          <TableCell key={col.key}>{cellContent[col.key]}</TableCell>
        ))}
        <TableCell>
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <ActionBtn label="Edit" color="#16a34a" bg="#f0fdf4" border="#bbf7d0" />
            <ActionBtn label="Move" color="#64748b" bg="#f8fafc" border="#e2e8f0" />
          </Box>
        </TableCell>
      </TableRow>

      {/* Expanded detail row */}
      <TableRow>
        <TableCell colSpan={colSpan} sx={{ p: 0, border: 0 }}>
          <Collapse in={isSelected} unmountOnExit>
            <Box sx={{ bgcolor: '#f0fdf4', borderTop: '2px solid #bbf7d0', p: '20px 24px' }}>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">Plant Details</Typography>
                  <Typography sx={{ fontSize: 20, fontWeight: 800, color: 'primary.dark' }}>{plant.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>Batch {plant.batch}</Typography>
                </Box>
                {[
                  { label: 'Plant ID',         value: plant.id },
                  { label: 'Price',            value: `£${plant.price.toFixed(2)}` },
                  { label: 'Current Location', value: <LocationBadge location={plant.location} /> },
                  { label: 'Status',           value: <StatusChip status={plant.status} /> },
                ].map(detail => (
                  <Box key={detail.label}>
                    <Typography variant="overline" color="text.disabled">{detail.label}</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary', mt: 0.5 }}>
                      {detail.value}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignSelf: 'center', flexWrap: 'wrap' }}>
                  <Button variant="contained" color="primary" size="small" sx={{ fontWeight: 600 }}>Update Status</Button>
                  <Button variant="outlined" color="primary" size="small" sx={{ fontWeight: 600 }}>Move Plant</Button>
                  <Button variant="outlined" size="small" onClick={e => { e.stopPropagation(); onClose(); }}
                    sx={{ fontWeight: 600, borderColor: '#e2e8f0', color: 'text.secondary' }}>
                    Close
                  </Button>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function ActionBtn({ label, color, bg, border }) {
  return (
    <Button
      size="small"
      onClick={e => e.stopPropagation()}
      sx={{
        py: '2px', px: 1.25, minWidth: 'auto', fontSize: 11, fontWeight: 600,
        bgcolor: bg, color, border: `1px solid ${border}`,
        '&:hover': { bgcolor: bg, opacity: 0.85 },
      }}
    >
      {label}
    </Button>
  );
}

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

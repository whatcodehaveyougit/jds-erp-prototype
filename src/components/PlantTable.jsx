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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import StatusChip from './StatusChip';
import LocationBadge from './LocationBadge';

const ROWS_PER_PAGE = 10;

export default function PlantTable({ filtered, search, page, setPage, sortConfig, onSort, selectedRow, setSelectedRow }) {
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated  = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const columns = [
    { key: 'id',       label: 'Plant ID' },
    { key: 'name',     label: 'Plant Name' },
    { key: 'batch',    label: 'Batch' },
    { key: 'price',    label: 'Price' },
    { key: 'status',   label: 'Status' },
    { key: 'location', label: 'Location' },
  ];

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <SwapVertIcon sx={{ fontSize: 14, ml: 0.5, color: 'text.disabled', verticalAlign: 'middle' }} />;
    return sortConfig.dir === 'asc'
      ? <ArrowUpwardIcon sx={{ fontSize: 14, ml: 0.5, color: 'primary.main', verticalAlign: 'middle' }} />
      : <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5, color: 'primary.main', verticalAlign: 'middle' }} />;
  };

  return (
    <Paper variant="outlined" sx={{ borderColor: 'divider', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      {/* Info bar */}
      <Box sx={{
        px: 2.5, py: 1.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Showing{' '}
          <strong style={{ color: '#1e293b' }}>{paginated.length}</strong> of{' '}
          <strong style={{ color: '#1e293b' }}>{filtered.length}</strong> results
          {search && <span style={{ color: '#6aaa1f' }}> for "{search}"</span>}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Page {page + 1} of {totalPages || 1}
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid', borderColor: 'divider' }}>
              {columns.map(col => (
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
                <TableCell colSpan={7} sx={{ py: 6, textAlign: 'center' }}>
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
                  onToggle={() => setSelectedRow(isSelected ? null : plant)}
                  onClose={() => setSelectedRow(null)}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{
        px: 2.5, py: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 0.75,
      }}>
        <PagBtn disabled={page === 0} onClick={() => setPage(p => p - 1)} label="← Prev" />
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            onClick={() => setPage(i)}
            variant={page === i ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            sx={{
              minWidth: 32,
              width: 32,
              height: 32,
              p: 0,
              fontSize: 13,
              fontWeight: 600,
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

function ExpandableRow({ plant, i, isSelected, onToggle, onClose }) {
  return (
    <>
      <TableRow
        onClick={onToggle}
        sx={{
          borderBottom: '1px solid',
          borderColor: '#f8fafc',
          bgcolor: isSelected ? '#f0fdf4' : (i % 2 === 0 ? 'white' : '#fafafa'),
          cursor: 'pointer',
          transition: 'background 0.1s',
          '&:hover': { bgcolor: isSelected ? '#f0fdf4' : '#f8fafc' },
        }}
      >
        <TableCell>
          <Typography sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>
            {plant.id}
          </Typography>
        </TableCell>
        <TableCell>
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
        </TableCell>
        <TableCell>
          <Typography sx={{ fontFamily: 'monospace', fontSize: 11, color: 'text.disabled' }}>
            {plant.batch}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontWeight: 700, color: 'primary.dark', fontSize: 14 }}>
            £{plant.price.toFixed(2)}
          </Typography>
        </TableCell>
        <TableCell><StatusChip status={plant.status} /></TableCell>
        <TableCell><LocationBadge location={plant.location} /></TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <ActionBtn label="Edit" color="#16a34a" bg="#f0fdf4" border="#bbf7d0" />
            <ActionBtn label="Move" color="#64748b" bg="#f8fafc" border="#e2e8f0" />
          </Box>
        </TableCell>
      </TableRow>

      {/* Expanded detail row */}
      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
          <Collapse in={isSelected} unmountOnExit>
            <Box sx={{
              bgcolor: '#f0fdf4',
              borderTop: '2px solid #bbf7d0',
              p: '20px 24px',
            }}>
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
                  <Button variant="contained" color="primary" size="small" sx={{ fontWeight: 600 }}>
                    Update Status
                  </Button>
                  <Button variant="outlined" color="primary" size="small" sx={{ fontWeight: 600 }}>
                    Move Plant
                  </Button>
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
        py: '2px',
        px: 1.25,
        minWidth: 'auto',
        fontSize: 11,
        fontWeight: 600,
        bgcolor: bg,
        color,
        border: `1px solid ${border}`,
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
        px: 1.75,
        fontSize: 13,
        fontWeight: 600,
        borderColor: '#e2e8f0',
        color: disabled ? 'text.disabled' : '#475569',
        bgcolor: disabled ? '#f8fafc' : 'white',
      }}
    >
      {label}
    </Button>
  );
}

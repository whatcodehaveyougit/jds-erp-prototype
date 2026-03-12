import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { STATUS_CONFIG, TYPE_COLORS, BRAND } from '../constants/config';
import StatusChip from '../components/StatusChip';
import LocationBadge from '../components/LocationBadge';

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, description, children }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{description}</Typography>
      )}
      <Divider sx={{ mb: 2.5 }} />
      {children}
    </Box>
  );
}

function Swatch({ label, value, textColor = 'white' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{
        width: 72, height: 72, borderRadius: 1.5,
        bgcolor: value,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        border: '1px solid rgba(0,0,0,0.06)',
      }} />
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.primary' }}>{label}</Typography>
      <Typography sx={{ fontSize: 10, color: 'text.disabled', fontFamily: 'monospace' }}>{value}</Typography>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  return (
    <Box sx={{ p: '24px 32px', maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>Design System</Typography>
        <Typography variant="body1" color="text.secondary">
          JDS Plant Hub component library and visual language reference.
        </Typography>
      </Box>

      {/* ── Colour Palette ── */}
      <Section title="Colour Palette" description="Brand primaries, semantic status colours, and supporting neutrals.">
        <Typography variant="overline" color="text.disabled" sx={{ mb: 1.5, display: 'block' }}>Brand</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
          <Swatch label="Primary"       value={BRAND.green} />
          <Swatch label="Primary Dark"  value={BRAND.greenDark} />
          <Swatch label="Primary Light" value={BRAND.greenLight} />
          <Swatch label="Secondary"     value={BRAND.orange} />
        </Box>

        <Typography variant="overline" color="text.disabled" sx={{ mb: 1.5, display: 'block' }}>Neutrals</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
          <Swatch label="text.primary"   value="#1e293b" />
          <Swatch label="text.secondary" value="#64748b" />
          <Swatch label="text.disabled"  value="#94a3b8" />
          <Swatch label="bg.default"     value="#f8fafc" textColor="#1e293b" />
          <Swatch label="divider"        value="#f1f5f9" textColor="#1e293b" />
        </Box>

        <Typography variant="overline" color="text.disabled" sx={{ mb: 1.5, display: 'block' }}>Status colours</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <Swatch key={key} label={cfg.label} value={cfg.color} />
          ))}
        </Box>
      </Section>

      {/* ── Typography ── */}
      <Section title="Typography" description="Type scale using DM Sans.">
        {[
          { variant: 'h4',       text: 'Heading 4 — 2.125rem / 700' },
          { variant: 'h5',       text: 'Heading 5 — 1.5rem / 700' },
          { variant: 'h6',       text: 'Heading 6 — 1.25rem / 700' },
          { variant: 'subtitle1',text: 'Subtitle 1 — 1rem / 600' },
          { variant: 'subtitle2',text: 'Subtitle 2 — 0.875rem / 600' },
          { variant: 'body1',    text: 'Body 1 — 1rem / 400  — Regular paragraph text used throughout the app.' },
          { variant: 'body2',    text: 'Body 2 — 0.875rem / 400 — Secondary / descriptive text.' },
          { variant: 'caption',  text: 'Caption — 0.75rem — Metadata, timestamps, labels.' },
          { variant: 'overline', text: 'Overline — 0.6875rem / 700 — Section labels, table headers.' },
        ].map(({ variant, text }) => (
          <Box key={variant} sx={{ mb: 1.5 }}>
            <Typography variant={variant}>{text}</Typography>
          </Box>
        ))}
      </Section>

      {/* ── Buttons ── */}
      <Section title="Buttons" description="Primary, secondary and neutral button variants.">
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>Primary</Button>
          <Button variant="outlined"  color="primary">Primary Outlined</Button>
          <Button variant="text"      color="primary">Primary Text</Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
          <Button variant="contained" color="secondary" startIcon={<AddIcon />}>Secondary</Button>
          <Button variant="outlined"  color="secondary">Secondary Outlined</Button>
          <Button variant="text"      color="secondary">Secondary Text</Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
          <Button variant="contained" color="primary" size="small" startIcon={<EditIcon />}>Small</Button>
          <Button variant="contained" color="primary" size="medium">Medium</Button>
          <Button variant="contained" color="primary" size="large">Large</Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary" disabled>Disabled</Button>
          <Button variant="outlined"
            sx={{ borderColor: '#e2e8f0', color: 'text.secondary' }}
            startIcon={<DeleteIcon />}>
            Neutral
          </Button>
        </Box>
      </Section>

      {/* ── Chips ── */}
      <Section title="Chips" description="Status chips, location badges, and filter pills.">
        <Typography variant="overline" color="text.disabled" sx={{ mb: 1.5, display: 'block' }}>Status chips</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
          {Object.keys(STATUS_CONFIG).map(s => (
            <StatusChip key={s} status={s} />
          ))}
        </Box>

        <Typography variant="overline" color="text.disabled" sx={{ mb: 1.5, display: 'block' }}>Location badges</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
          {['A-01-1', 'B-12-3', 'SHOP-01', 'TUN-1', 'YARD-2'].map(loc => (
            <LocationBadge key={loc} location={loc} />
          ))}
        </Box>

        <Typography variant="overline" color="text.disabled" sx={{ mb: 1.5, display: 'block' }}>Location type chips</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(TYPE_COLORS).map(([type, cfg]) => (
            <Chip key={type} label={type} size="small"
              sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 600, borderRadius: '20px' }} />
          ))}
        </Box>
      </Section>

      {/* ── Form elements ── */}
      <Section title="Form Elements" description="Inputs, selects used across the app.">
        <Grid container spacing={2} sx={{ maxWidth: 640 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="overline" color="text.disabled" sx={{ mb: 0.75, display: 'block' }}>Text input</Typography>
            <OutlinedInput fullWidth size="small" placeholder="e.g. Plant name…" sx={{ bgcolor: '#f8fafc' }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="overline" color="text.disabled" sx={{ mb: 0.75, display: 'block' }}>Select</Typography>
            <Select fullWidth size="small" defaultValue="Warehouse" sx={{ bgcolor: '#f8fafc' }}>
              <MenuItem value="Warehouse">Warehouse</MenuItem>
              <MenuItem value="Greenhouse">Greenhouse</MenuItem>
              <MenuItem value="Retail">Retail</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="overline" color="text.disabled" sx={{ mb: 0.75, display: 'block' }}>Focused (primary accent)</Typography>
            <OutlinedInput fullWidth size="small" defaultValue="Focused input" autoFocus sx={{
              bgcolor: '#f8fafc',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: 2 },
            }} />
          </Grid>
        </Grid>
      </Section>

      {/* ── Alerts ── */}
      <Section title="Alerts" description="Feedback banners used for scanner results and system messages.">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 560 }}>
          <Alert severity="success" icon={<CheckCircleIcon />}>Plant located — Monstera Deliciosa in A-01-1.</Alert>
          <Alert severity="error">No match found. Check the barcode and try again.</Alert>
          <Alert severity="warning" icon={<WarningIcon />}>Location A-12-3 is over 90% capacity.</Alert>
          <Alert severity="info" icon={<InfoIcon />}>Barcode scanner mode is active.</Alert>
        </Box>
      </Section>

      {/* ── Cards / Paper ── */}
      <Section title="Cards & Paper" description="Surfaces used for stat cards and content panels.">
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderColor: 'divider', minWidth: 160 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Plants
            </Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: 'primary.dark', lineHeight: 1.1, mt: 0.5 }}>248</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2.5, borderColor: '#bbf7d0', bgcolor: '#f0fdf4', minWidth: 160 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#16a34a' }}>
              Available
            </Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#16a34a', lineHeight: 1.1, mt: 0.5 }}>84</Typography>
          </Paper>
          <Paper sx={{ p: 2.5, boxShadow: '0 4px 20px rgba(106,170,31,0.15)', minWidth: 160 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Elevated paper
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Default box shadow</Typography>
          </Paper>
        </Box>
      </Section>

      {/* ── Table ── */}
      <Section title="Table" description="Data table structure used in the plant inventory view.">
        <Paper variant="outlined" sx={{ borderColor: 'divider', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  {['Plant ID', 'Name', 'Status', 'Location', 'Price'].map(col => (
                    <TableCell key={col}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { id: 'PLT-001', name: 'Monstera Deliciosa', status: 'Available',  location: 'A-01-1', price: '£12.50' },
                  { id: 'PLT-002', name: 'Fiddle Leaf Fig',    status: 'Growing',     location: 'TUN-1',  price: '£28.00' },
                  { id: 'PLT-003', name: 'Snake Plant',        status: 'In-shop',     location: 'SHOP-01',price: '£9.99' },
                  { id: 'PLT-004', name: 'Peace Lily',         status: 'Retail-ready',location: 'B-12-3', price: '£14.50' },
                ].map((row, i) => (
                  <TableRow key={row.id}
                    sx={{ bgcolor: i % 2 === 0 ? 'white' : '#fafafa', '&:hover': { bgcolor: '#f8fafc' }, cursor: 'pointer' }}>
                    <TableCell>
                      <Typography sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>
                        {row.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Box sx={{
                          width: 28, height: 28, borderRadius: 1,
                          background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                        }}>🌱</Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{row.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><StatusChip status={row.status} /></TableCell>
                    <TableCell><LocationBadge location={row.location} /></TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: 'primary.dark' }}>{row.price}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Section>

      {/* ── Spacing & radius reference ── */}
      <Section title="Spacing & Border Radius" description="MUI theme.spacing(n) = 8px × n. Border radius base = 8px.">
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[0.5, 1, 1.5, 2, 2.5, 3, 4].map(n => (
            <Box key={n} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: n * 8, height: n * 8, bgcolor: 'primary.main', borderRadius: 0.5, opacity: 0.8 }} />
              <Typography sx={{ fontSize: 10, color: 'text.disabled', fontFamily: 'monospace' }}>{n * 8}px</Typography>
              <Typography sx={{ fontSize: 9, color: 'text.disabled' }}>spacing({n})</Typography>
            </Box>
          ))}
        </Box>
      </Section>
    </Box>
  );
}

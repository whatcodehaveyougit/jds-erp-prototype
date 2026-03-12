import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TUNNEL_LOCATIONS, OUTSIDE_AREAS } from '../data/locations';

// SVG map constants
const SVG_W = 760;
const SVG_H = 530;
const SHAPE_W = 305;
const SHAPE_H = 80;
const GAP = 20;
const START_X = 50;
const START_Y = 58;
const ROW_STRIDE = SHAPE_H + 16;

const TUNNEL_CLR = {
  fill: '#d1fae5', hover: '#a7f3d0',
  stroke: '#059669', text: '#065f46', rib: '#059669',
};
const OUTSIDE_CLR = {
  fill: '#fef3c7', hover: '#fde68a',
  stroke: '#d97706', text: '#78350f', rib: '#d97706',
};

export default function LocationsPage() {
  const navigate                  = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [hovered, setHovered]     = useState(null);
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });

  const totalTunnelStock  = TUNNEL_LOCATIONS.reduce((s, t) => s + t.currentStock, 0);
  const totalTunnelCap    = TUNNEL_LOCATIONS.reduce((s, t) => s + t.capacity, 0);
  const totalOutsideStock = OUTSIDE_AREAS.reduce((s, o) => s + o.currentStock, 0);
  const totalOutsideCap   = OUTSIDE_AREAS.reduce((s, o) => s + o.capacity, 0);

  return (
    <Box sx={{ p: '24px 32px', maxWidth: 1400, mx: 'auto' }}>

      {/* Breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
        <Button
          onClick={() => navigate('/')}
          variant="outlined"
          size="small"
          startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
          sx={{ fontWeight: 600, borderColor: '#e2e8f0', color: 'text.secondary', fontSize: 13 }}
        >
          Plants
        </Button>
        <Typography sx={{ color: '#cbd5e1', fontSize: 18 }}>/</Typography>
        <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: 15 }}>Locations</Typography>
      </Box>

      {/* Title + stats */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>Growing Locations</Typography>
          <Typography variant="body2" color="text.secondary">
            5 poly tunnels with adjacent outdoor growing areas
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <StatChip label="Tunnel Stock"  value={`${totalTunnelStock} / ${totalTunnelCap}`}   color="#059669" bg="#f0fdf4" />
          <StatChip label="Outdoor Stock" value={`${totalOutsideStock} / ${totalOutsideCap}`} color="#d97706" bg="#fffbeb" />
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 2, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="☰ List View" />
          <Tab label="⊞ Map View" />
        </Tabs>
      </Box>

      {activeTab === 0
        ? <ListView />
        : <MapView hovered={hovered} setHovered={setHovered} mousePos={mousePos} setMousePos={setMousePos} />
      }
    </Box>
  );
}

function StatChip({ label, value, color, bg }) {
  return (
    <Paper variant="outlined" sx={{ bgcolor: bg, borderColor: color, borderWidth: 1.5, px: 2, py: 1.25, minWidth: 130 }}>
      <Typography sx={{ fontSize: 10, color, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 18, fontWeight: 800, color: 'text.primary', mt: 0.25 }}>{value}</Typography>
    </Paper>
  );
}

function ListView() {
  return (
    <Box>
      {TUNNEL_LOCATIONS.map((tunnel, i) => {
        const outside = OUTSIDE_AREAS[i];
        return (
          <Box key={tunnel.id} sx={{ mb: 2.5 }}>
            <Typography variant="overline" color="text.disabled" sx={{ mb: 1, display: 'block' }}>
              Pair {i + 1}
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={6}><LocationCard loc={tunnel} /></Grid>
              <Grid item xs={12} md={6}><LocationCard loc={outside} /></Grid>
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}

function LocationCard({ loc }) {
  const isTunnel = loc.type === 'polytunnel';
  const accent   = isTunnel ? '#059669' : '#d97706';
  const bg       = isTunnel ? '#f0fdf4' : '#fffbeb';
  const border   = isTunnel ? '#bbf7d0' : '#fde68a';
  const stockPct = Math.round((loc.currentStock / loc.capacity) * 100);

  return (
    <Paper variant="outlined" sx={{ p: 2.25, borderColor: border, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 1.125, flexShrink: 0,
          bgcolor: bg, border: `2px solid ${accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: accent,
        }}>
          {loc.shortName}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'text.primary' }}>{loc.name}</Typography>
          <Chip
            label={isTunnel ? 'Poly Tunnel' : 'Outdoor Area'}
            size="small"
            sx={{ mt: 0.25, fontSize: 10, fontWeight: 600, bgcolor: bg, color: accent, height: 18, borderRadius: 0.5 }}
          />
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.45 }}>
        {loc.description}
      </Typography>

      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary' }}>Stock Level</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: accent }}>
            {loc.currentStock} / {loc.capacity} ({stockPct}%)
          </Typography>
        </Box>
        <Box sx={{ height: 6, bgcolor: '#f1f5f9', borderRadius: 1.5, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', borderRadius: 1.5, bgcolor: accent, width: `${stockPct}%` }} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.625, mb: 1.5 }}>
        {loc.primaryCrops.map(crop => (
          <Chip key={crop} label={crop} size="small"
            sx={{ fontSize: 10, bgcolor: bg, color: accent, fontWeight: 600, height: 20, borderRadius: 0.5 }} />
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: isTunnel ? '1fr 1fr' : '1fr', gap: 0.75 }}>
        {isTunnel ? (
          <>
            <Detail label="Temperature" value={loc.temperature} />
            <Detail label="Humidity"    value={loc.humidity} />
            <Detail label="Aisles"      value={loc.aisles} />
            <Detail label="Benches"     value={loc.benches} />
            <Detail label="Irrigation"  value={loc.irrigation} />
          </>
        ) : (
          <>
            <Detail label="Surface"    value={loc.surface} />
            <Detail label="Irrigation" value={loc.irrigation} />
          </>
        )}
      </Box>
    </Paper>
  );
}

function Detail({ label, value }) {
  return (
    <Box sx={{ bgcolor: '#f8fafc', borderRadius: 0.75, p: '5px 9px' }}>
      <Typography sx={{ fontSize: 10, color: 'text.disabled', fontWeight: 500 }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}

function MapView({ hovered, setHovered, mousePos, setMousePos }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', gap: 2.5, mb: 1.75, alignItems: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 22, height: 14, borderRadius: 0.5, bgcolor: '#d1fae5', border: '2px solid #059669' }} />
          <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>Poly Tunnel</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 22, height: 14, borderRadius: 0.5, bgcolor: '#fef3c7', border: '2px solid #d97706' }} />
          <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>Outdoor Area</Typography>
        </Box>
        <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto' }}>
          Hover over any section for details
        </Typography>
      </Box>

      <Box sx={{ bgcolor: '#eef4e5', borderRadius: 2, border: '2px solid #c8d9b0', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', display: 'block' }}
          onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}>
          <defs>
            <pattern id="ground" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#c4d9a0" strokeWidth="0.5" />
            </pattern>
            <pattern id="hatch" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <line x1="0" y1="10" x2="10" y2="0" stroke="#d97706" strokeWidth="0.7" strokeOpacity="0.2" />
            </pattern>
          </defs>
          <rect width={SVG_W} height={SVG_H} fill="url(#ground)" />
          <text x={SVG_W / 2} y={24} textAnchor="middle" fill="#4b5563" fontSize={12} fontWeight={700}
            fontFamily="DM Sans, sans-serif">JDS Plant Hub — Site Map</text>
          <text x={START_X + SHAPE_W / 2} y={46} textAnchor="middle"
            fill="#059669" fontSize={10} fontWeight={700} fontFamily="DM Sans, sans-serif">POLY TUNNELS</text>
          <text x={START_X + SHAPE_W + GAP + SHAPE_W / 2} y={46} textAnchor="middle"
            fill="#d97706" fontSize={10} fontWeight={700} fontFamily="DM Sans, sans-serif">OUTDOOR AREAS</text>
          <g transform={`translate(${SVG_W - 44}, 30)`}>
            <circle cx={0} cy={0} r={18} fill="white" stroke="#d1d5db" strokeWidth={1.5} />
            <polygon points="0,-11 -4,4 0,1 4,4" fill="#334155" />
            <text x={0} y={20} textAnchor="middle" fill="#475569" fontSize={9} fontWeight={700}
              fontFamily="DM Sans, sans-serif">N</text>
          </g>
          {TUNNEL_LOCATIONS.map((tunnel, i) => {
            const outside = OUTSIDE_AREAS[i];
            const ty  = START_Y + i * ROW_STRIDE;
            const midY = ty + SHAPE_H / 2;
            return (
              <g key={tunnel.id}>
                <line x1={START_X + SHAPE_W} y1={midY} x2={START_X + SHAPE_W + GAP} y2={midY}
                  stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4,3" />
                <TunnelShape x={START_X} y={ty} w={SHAPE_W} h={SHAPE_H} loc={tunnel} clr={TUNNEL_CLR}
                  isHovered={hovered?.id === tunnel.id} isOutside={false}
                  onMouseEnter={() => setHovered(tunnel)} onMouseLeave={() => setHovered(null)} />
                <TunnelShape x={START_X + SHAPE_W + GAP} y={ty} w={SHAPE_W} h={SHAPE_H} loc={outside} clr={OUTSIDE_CLR}
                  isHovered={hovered?.id === outside.id} isOutside={true}
                  onMouseEnter={() => setHovered(outside)} onMouseLeave={() => setHovered(null)} />
              </g>
            );
          })}
        </svg>
      </Box>

      {hovered && <HoverTooltip loc={hovered} mousePos={mousePos} />}
    </Box>
  );
}

function TunnelShape({ x, y, w, h, loc, clr, isHovered, isOutside, onMouseEnter, onMouseLeave }) {
  const fill = isHovered ? clr.hover : clr.fill;
  const ribCount = 6;
  const ribSpacing = w / (ribCount + 1);
  return (
    <g onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} width={w} height={h} rx={20} ry={20}
        fill={fill} stroke={clr.stroke} strokeWidth={isHovered ? 2.5 : 1.5}
        style={{ transition: 'fill 0.12s, stroke-width 0.12s' }} />
      {!isOutside && Array.from({ length: ribCount }).map((_, i) => (
        <line key={i} x1={x + ribSpacing * (i + 1)} y1={y + 10}
          x2={x + ribSpacing * (i + 1)} y2={y + h - 10}
          stroke={clr.rib} strokeWidth={0.7} strokeOpacity={0.35} />
      ))}
      {isOutside && (
        <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} rx={18} ry={18} fill="url(#hatch)" />
      )}
      <text x={x + w / 2} y={y + h / 2 - 9} textAnchor="middle"
        fill={clr.text} fontSize={16} fontWeight={800} fontFamily="DM Sans, sans-serif">
        {loc.shortName}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle"
        fill={clr.text} fontSize={10} fontWeight={500} fontFamily="DM Sans, sans-serif" opacity={0.75}>
        {loc.currentStock} / {loc.capacity} plants
      </text>
    </g>
  );
}

function HoverTooltip({ loc, mousePos }) {
  const isTunnel = loc.type === 'polytunnel';
  const accent   = isTunnel ? '#059669' : '#d97706';
  const bg       = isTunnel ? '#f0fdf4' : '#fffbeb';
  const stockPct = Math.round((loc.currentStock / loc.capacity) * 100);
  const left = Math.min(mousePos.x + 16, window.innerWidth - 290);
  const top  = mousePos.y - 10;

  return (
    <Box sx={{
      position: 'fixed', left, top, zIndex: 1000,
      bgcolor: 'white', borderRadius: 1.5, p: '14px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
      border: `2px solid ${accent}`,
      minWidth: 250, maxWidth: 300,
      pointerEvents: 'none',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
        <Box sx={{
          px: 1.125, py: 0.375, borderRadius: 0.75,
          bgcolor: bg, border: `1.5px solid ${accent}`,
          fontSize: 12, fontWeight: 800, color: accent, flexShrink: 0,
        }}>
          {loc.shortName}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'text.primary', lineHeight: 1.2 }}>{loc.name}</Typography>
          <Typography sx={{ fontSize: 10, color: 'text.disabled', fontWeight: 500 }}>
            {isTunnel ? 'Poly Tunnel' : 'Outdoor Area'}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.25, lineHeight: 1.45 }}>
        {loc.description}
      </Typography>
      <Box sx={{ mb: 1.25 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.375 }}>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 500 }}>Stock</Typography>
          <Typography sx={{ fontSize: 11, color: accent, fontWeight: 700 }}>
            {loc.currentStock} / {loc.capacity} ({stockPct}%)
          </Typography>
        </Box>
        <Box sx={{ height: 5, bgcolor: '#f1f5f9', borderRadius: 0.75, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: `${stockPct}%`, bgcolor: accent, borderRadius: 0.75 }} />
        </Box>
      </Box>
      {isTunnel ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5, mb: 1.25 }}>
          <MiniDetail label="Temp"     value={loc.temperature} />
          <MiniDetail label="Humidity" value={loc.humidity} />
          <MiniDetail label="Aisles"   value={loc.aisles} />
          <MiniDetail label="Benches"  value={loc.benches} />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0.5, mb: 1.25 }}>
          <MiniDetail label="Surface"    value={loc.surface} />
          <MiniDetail label="Irrigation" value={loc.irrigation} />
        </Box>
      )}
      <Box>
        <Typography sx={{ fontSize: 10, color: 'text.disabled', fontWeight: 600, letterSpacing: '0.04em', mb: 0.625 }}>
          KEY PLANTS
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {loc.primaryCrops.map(c => (
            <Chip key={c} label={c} size="small"
              sx={{ fontSize: 10, bgcolor: bg, color: accent, fontWeight: 600, height: 20, borderRadius: 0.5 }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function MiniDetail({ label, value }) {
  return (
    <Box sx={{ bgcolor: '#f8fafc', borderRadius: 0.625, p: '4px 7px' }}>
      <Typography sx={{ fontSize: 9, color: 'text.disabled', fontWeight: 500 }}>{label}</Typography>
      <Typography sx={{ fontSize: 11, color: '#334155', fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}

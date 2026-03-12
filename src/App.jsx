import { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import { PLANTS, INITIAL_LOCATIONS } from './data/plants';
import { STATUS_CONFIG } from './constants/config';
import Header from './components/Header';
import ScannerPanel from './components/ScannerPanel';
import StatsRow from './components/StatsRow';
import FilterBar from './components/FilterBar';
import PlantTable from './components/PlantTable';
import LocationModal from './components/LocationModal';
import LocationsPage from './pages/LocationsPage';
import DesignSystemPage from './pages/DesignSystemPage';

export default function App() {
  const [scanMode, setScanMode]           = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [locations, setLocations]         = useState(INITIAL_LOCATIONS);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Header
        scanMode={scanMode}
        setScanMode={setScanMode}
        onOpenLocations={() => setShowLocations(true)}
      />

      <Routes>
        <Route path="/" element={
          <PlantsPage
            scanMode={scanMode}
            showLocations={showLocations}
            setShowLocations={setShowLocations}
            locations={locations}
            setLocations={setLocations}
          />
        } />
        <Route path="/locations"      element={<LocationsPage />} />
        <Route path="/design-system"  element={<DesignSystemPage />} />
      </Routes>
    </Box>
  );
}

function PlantsPage({ scanMode, showLocations, setShowLocations, locations, setLocations }) {
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRow, setSelectedRow]   = useState(null);
  const [sortConfig, setSortConfig]     = useState({ key: 'name', dir: 'asc' });
  const [page, setPage]                 = useState(0);

  const statusCounts = useMemo(() => {
    const counts = { All: PLANTS.length };
    Object.keys(STATUS_CONFIG).forEach(s => {
      counts[s] = PLANTS.filter(p => p.status === s).length;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    let data = [...PLANTS];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.batch.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'All') data = data.filter(p => p.status === statusFilter);
    data.sort((a, b) => {
      let av = a[sortConfig.key];
      let bv = b[sortConfig.key];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return sortConfig.dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return data;
  }, [search, statusFilter, sortConfig]);

  const handleSort = key => {
    setSortConfig(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
    setPage(0);
  };

  return (
    <>
      <Box sx={{ p: '24px 32px', maxWidth: 1400, mx: 'auto' }}>
        {scanMode && <ScannerPanel />}

        <StatsRow plants={PLANTS} statusCounts={statusCounts} />

        <FilterBar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusCounts={statusCounts}
          onPageReset={() => setPage(0)}
        />

        <PlantTable
          filtered={filtered}
          search={search}
          page={page}
          setPage={setPage}
          sortConfig={sortConfig}
          onSort={handleSort}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      </Box>

      {showLocations && (
        <LocationModal
          locations={locations}
          setLocations={setLocations}
          onClose={() => setShowLocations(false)}
        />
      )}
    </>
  );
}

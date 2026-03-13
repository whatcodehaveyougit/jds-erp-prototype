import { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import { PLANTS, INITIAL_LOCATIONS } from './data/plants'; // PLANTS used as initial state
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
  const [plants, setPlants]               = useState(PLANTS);

  const updateQty     = (id, qty)     => setPlants(prev => prev.map(p => p.id === id ? { ...p, qty }     : p));
  const updatePotSize = (id, potSize) => setPlants(prev => prev.map(p => p.id === id ? { ...p, potSize } : p));

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
            plants={plants}
            updateQty={updateQty}
            updatePotSize={updatePotSize}
          />
        } />
        <Route path="/locations"      element={<LocationsPage />} />
        <Route path="/design-system"  element={<DesignSystemPage />} />
      </Routes>
    </Box>
  );
}

function PlantsPage({ scanMode, showLocations, setShowLocations, locations, setLocations, plants, updateQty, updatePotSize }) {
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRow, setSelectedRow]   = useState(null);
  const [sortConfig, setSortConfig]     = useState({ key: 'name', dir: 'asc' });
  const [page, setPage]                 = useState(0);

  const statusCounts = useMemo(() => {
    const counts = { All: plants.length };
    Object.keys(STATUS_CONFIG).forEach(s => {
      counts[s] = plants.filter(p => p.status === s).length;
    });
    return counts;
  }, [plants]);

  const filtered = useMemo(() => {
    let data = [...plants];
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

        <StatsRow plants={plants} statusCounts={statusCounts} />

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
          onUpdateQty={updateQty}
          onUpdatePotSize={updatePotSize}
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

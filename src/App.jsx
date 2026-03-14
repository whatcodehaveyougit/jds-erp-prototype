import { useState, useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { usePlants } from './hooks/usePlants';
import { useLocations } from './hooks/useLocations';
import { STATUS_CONFIG } from './constants/config';
import Header from './components/Header';
import ScannerPanel from './components/ScannerPanel';
import StatsRow from './components/StatsRow';
import FilterBar from './components/FilterBar';
import PlantTable from './components/PlantTable';
import LocationModal from './components/LocationModal';
import LocationsPage from './pages/LocationsPage';
import DesignSystemPage from './pages/DesignSystemPage';
import QueuedUpdatesPage from './pages/QueuedUpdatesPage';

export default function App() {
  const [scanMode, setScanMode]           = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [isOnline, setIsOnline]           = useState(navigator.onLine);

  const {
    plants,
    loading: plantsLoading,
    error: plantsError,
    updateQty,
    updatePotSize,
    updateStatus,
    queuedStatusUpdates,
    queuedStatusCount,
    pendingPlantIds,
    syncQueuedStatusUpdates,
  } = usePlants();
  const { locations, setLocations, loading: locationsLoading, addLocation }              = useLocations();

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Header
        scanMode={scanMode}
        setScanMode={setScanMode}
        onOpenLocations={() => setShowLocations(true)}
        queuedStatusCount={queuedStatusCount}
      />

      {!isOnline && (
        <Alert severity="warning" sx={{ borderRadius: 0, fontWeight: 600 }}>
          You are currently offline. Status updates will be queued and synced automatically when connection returns.
        </Alert>
      )}

      <Routes>
        <Route path="/" element={
          <PlantsPage
            scanMode={scanMode}
            showLocations={showLocations}
            setShowLocations={setShowLocations}
            locations={locations}
            setLocations={setLocations}
            addLocation={addLocation}
            locationsLoading={locationsLoading}
            plants={plants}
            plantsLoading={plantsLoading}
            plantsError={plantsError}
            updateQty={updateQty}
            updatePotSize={updatePotSize}
            updateStatus={updateStatus}
            pendingPlantIds={pendingPlantIds}
          />
        } />
        <Route
          path="/queued-updates"
          element={<QueuedUpdatesPage queuedStatusUpdates={queuedStatusUpdates} onSyncNow={syncQueuedStatusUpdates} />}
        />
        <Route path="/locations"      element={<LocationsPage />} />
        <Route path="/design-system"  element={<DesignSystemPage />} />
      </Routes>
    </Box>
  );
}

function PlantsPage({
  scanMode, showLocations, setShowLocations,
  locations, setLocations, addLocation, locationsLoading,
  plants, plantsLoading, plantsError,
  updateQty, updatePotSize, updateStatus, pendingPlantIds,
}) {
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
    counts.Pending = plants.filter((p) => pendingPlantIds.has(p.id)).length;
    return counts;
  }, [plants, pendingPlantIds]);

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
    if (statusFilter === 'Pending') {
      data = data.filter((p) => pendingPlantIds.has(p.id));
    } else if (statusFilter !== 'All') {
      data = data.filter((p) => p.status === statusFilter);
    }
    data.sort((a, b) => {
      let av = a[sortConfig.key];
      let bv = b[sortConfig.key];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return sortConfig.dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return data;
  }, [search, statusFilter, sortConfig, plants, pendingPlantIds]);

  const handleSort = key => {
    setSortConfig(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
    setPage(0);
  };

  if (plantsError) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Alert severity="error">Failed to load plants: {plantsError}</Alert>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: '24px 32px', maxWidth: 1400, mx: 'auto' }}>
        {scanMode && <ScannerPanel plants={plants} />}

        {plantsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
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
              onUpdateStatus={updateStatus}
              pendingPlantIds={pendingPlantIds}
            />
          </>
        )}
      </Box>

      {showLocations && (
        <LocationModal
          locations={locations}
          setLocations={setLocations}
          addLocation={addLocation}
          plants={plants}
          onClose={() => setShowLocations(false)}
        />
      )}
    </>
  );
}

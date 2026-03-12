# JDS Plant Hub 🌿

A stock inventory management system for JDS plant nursery.

## Features

- 🔍 Search plants by name, ID, location or batch number
- 📊 Filter by stock status (Available, Growing, Reserved, Incoming, etc.)
- 📍 Location tracking with barcode scanner support
- 🏪 Manage storage locations (Warehouse, Greenhouse, Retail, Receiving, Staging)
- 📦 Real-time capacity tracking per location
- ↕️ Sortable columns and pagination

## Stock Statuses

| Status | Description |
|--------|-------------|
| Available | Ready to sell now |
| Reserved | Allocated to orders |
| Growing | Not yet saleable, in production |
| Incoming | Ordered from suppliers, not yet received |
| Retail-ready | Ready for shop sale and presentation |
| In-shop | Physically moved to retail location |
| Staged for order | Picked and allocated to a specific customer order |

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── App.jsx                    # Root component & state
├── index.js                   # Entry point
├── components/
│   ├── Header.jsx             # Top navigation bar
│   ├── ScannerPanel.jsx       # Barcode scanner mode
│   ├── StatsRow.jsx           # Summary stat cards
│   ├── FilterBar.jsx          # Search + status filter pills
│   ├── PlantTable.jsx         # Main data table with pagination
│   ├── LocationModal.jsx      # Manage / add locations modal
│   ├── StatusChip.jsx         # Coloured status badge
│   └── LocationBadge.jsx      # Monospace location code badge
├── constants/
│   └── config.js              # Status colours, location types, brand colours
└── data/
    └── plants.js              # Seed data (plants + locations)
```

## Customisation

- **Brand colours**: Edit `src/constants/config.js` → `BRAND`
- **Stock statuses**: Edit `STATUS_CONFIG` in `src/constants/config.js`
- **Seed data**: Edit `src/data/plants.js`
- **Rows per page**: Edit `ROWS_PER_PAGE` in `src/components/PlantTable.jsx`
# jds-erp-prototype

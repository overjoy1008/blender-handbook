# Blender Handbook

A clean, aesthetic reference guide for Blender shortcuts, topology, lighting, and nodes.

## Features

- **Shortcuts** - Essential hotkeys for speed in Object Mode, Edit Mode, and more
- **Settings** - Render engines (Cycles vs Eevee), performance tweaks, and denoising
- **Lights** - Lighting types and studio setups
- **Topology** - Edge flow and geometry best practices
- **Nodes** - Shader and Geometry nodes reference
- **Experiments** - Exploratory Blender studies with examples
- **Components** - Reusable 3D building blocks and kitbash assets
- **Add-Ons** - Essential plugins and extensions
- **TODO** - Personal learning checklist

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Database**: PostgreSQL with seed data

## Project Structure

```
├── components/          # React components (cards, search, etc.)
├── services/           # API service layer
├── server/             # Backend Express server
│   ├── db.ts          # Database connection
│   ├── index.ts       # API routes
│   ├── table-schema.sql    # Database schema
│   └── seed-data.sql      # Initial data
├── App.tsx            # Main app component
├── types.ts           # TypeScript type definitions
├── index.tsx          # React entry point
├── vite.config.ts     # Vite configuration
└── tsconfig.json      # TypeScript config
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
psql -U postgres -d blender_handbook -f server/table-schema.sql
psql -U postgres -d blender_handbook -f server/seed-data.sql
```

3. Start the backend server:
```bash
npm run server
```

4. In a new terminal, start the frontend dev server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run server` - Start Express backend server

## Admin Features

- Add/edit/delete shortcuts, concepts, nodes, and todos
- Organize content with sections and categories
- Drag and drop reordering
- Search functionality

## License

MIT

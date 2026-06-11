Here's a proper README for TerraSentinel:

---

# 🌊 TerraSentinel — AI-Powered Flood Monitoring Intelligence

> Real-time satellite intelligence for flood monitoring across India, powered by AI & remote sensing.

🔗 **Live:** https://terra-sentinel-ohyh.vercel.app/ &nbsp;|&nbsp; 💻 **GitHub:** https://github.com/ZEEL56/terra_sentinel

---

## 📌 Overview

TerraSentinel is a full-stack SaaS platform that leverages AI-driven remote sensing and satellite data to monitor flood-prone regions across India in real time. It provides disaster analytics, geospatial intelligence, and predictive flood models to support emergency response and research.

---

## ✨ Features

- 🛰️ **Live Flood Map** — Real-time flood visualization powered by 15+ satellite sources
- 🤖 **AI Flood Detection** — Machine learning models analyzing flood risk across Indian states
- 📊 **Flood Analytics** — Hydrological analytics & predictive flood models
- 🗺️ **Geospatial Intelligence** — Disaster mapping & earth observation data
- 🔌 **Open API** — Data access for researchers & emergency responders
- 🌐 **3D Rotating Globe** — Interactive Earth visualization using React Three Fiber
- ✨ **Smooth Animations** — Framer Motion powered scroll animations and transitions
- 📱 **Fully Responsive** — Optimized for all screen sizes

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Three Fiber + Three.js | 3D Globe |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| PostgreSQL | Primary database |
| JavaScript | Backend logic & DB scripts |

### Hosting
| Service | Purpose |
|---|---|
| Vercel | Frontend deployment |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL

### 1. Clone the repository
```bash
git clone https://github.com/ZEEL56/terra_sentinel.git
cd terra_sentinel
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Setup backend
```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file in the backend folder:
```env
DATABASE_URL=your_postgresql_connection_string
PORT=5000
```

### 5. Setup the database
```bash
node setup-database.js
node populate-comprehensive-data.js
```

### 6. Run the development servers

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
node server.js
```

### 7. Open in browser
```
http://localhost:3000
```

---

## 📁 Project Structure

```
terra_sentinel/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── GlobeScene.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── SatelliteLayerSection.tsx
│       ├── AIAnalysisSection.tsx
│       └── PlatformPreviewSection.tsx
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── setup-database.js
│   ├── populate-comprehensive-data.js
│   ├── comprehensive-dashboard-data.sql
│   └── package.json
└── ...
```

---

## 🌍 Monitored Regions

- Gujarat • Assam • Maharashtra • Kerala — and more across India

---

## 👥 Team

| Name | GitHub |
|---|---|
| Zeel | [@ZEEL56](https://github.com/ZEEL56) |
| Aastha Israni | (https://github.com/aastha11-hub) |

---

## 📄 License

MIT License — feel free to use, modify, and distribute.



export type SatelliteSource = {
  id: number
  name: string
  description: string
  type: string
  resolution: string
  use_case: string
  created_at: string
}

export const mockSources: SatelliteSource[] = [
  {
    id: 1,
    name: 'ISRO',
    description:
      'Primary national provider of Earth observation missions supporting disaster management, water monitoring, and environmental intelligence.',
    type: 'Government',
    resolution: 'Varies',
    use_case: 'Disaster management, water monitoring, environmental intelligence',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Bhuvan Geoportal',
    description:
      "ISRO's geospatial platform providing map services and thematic layers that can support flood situational awareness.",
    type: 'Portal',
    resolution: 'Varies',
    use_case: 'Flood situational awareness, mapping services',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'RISAT',
    description:
      'Radar Imaging Satellite series enabling all-weather imaging and strong performance during cloud cover and heavy rainfall.',
    type: 'Radar Satellite',
    resolution: '1-3m',
    use_case: 'All-weather imaging, flood monitoring',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Resourcesat',
    description:
      'Optical remote sensing mission supporting land and water monitoring with multi-spectral observations.',
    type: 'Optical Satellite',
    resolution: '5.8m-23.5m',
    use_case: 'Land and water monitoring, agricultural monitoring',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Cartosat',
    description:
      'High-resolution optical imaging mission useful for detailed mapping and impacted-area assessment.',
    type: 'Optical Satellite',
    resolution: '0.65-2.5m',
    use_case: 'Detailed mapping, impact assessment',
    created_at: new Date().toISOString(),
  },
]

import { AcceleratorSpec, AcceleratorType, DeploymentRegion, RegionData } from '../types/datacenter';

export const ACCELERATOR_SPECS: Record<AcceleratorType, AcceleratorSpec> = {
  gb200: {
    id: 'gb200',
    name: 'NVIDIA GB200 NVL72',
    vendor: 'NVIDIA',
    kwPerRack: 120,
    gpusPerRack: 72,
    requiresLiquid: true,
    rackWeightLbs: 3800,
    voltageTier: '800V DC',
    description: 'Blackwell architecture with 72 GPUs, 36 Grace CPUs, full D2C liquid loop with 800V DC busway.'
  },
  b200: {
    id: 'b200',
    name: 'NVIDIA HGX B200 (8-Way)',
    vendor: 'NVIDIA',
    kwPerRack: 65,
    gpusPerRack: 48,
    requiresLiquid: true,
    rackWeightLbs: 2600,
    voltageTier: '800V DC',
    description: 'Dense Blackwell compute cluster with hybrid secondary liquid cold plates and high-flow air.'
  },
  h100: {
    id: 'h100',
    name: 'NVIDIA H100 / H200 SXM5',
    vendor: 'NVIDIA',
    kwPerRack: 40,
    gpusPerRack: 32,
    requiresLiquid: false,
    rackWeightLbs: 2200,
    voltageTier: '480V AC',
    description: 'Hopper architecture, capable of high-density air containment or hybrid rear-door heat exchangers.'
  },
  custom_asic: {
    id: 'custom_asic',
    name: 'Custom Hyperscale AI ASIC',
    vendor: 'Custom OEM',
    kwPerRack: 85,
    gpusPerRack: 64,
    requiresLiquid: true,
    rackWeightLbs: 3100,
    voltageTier: '800V DC',
    description: 'Proprietary AI training/inference ASIC cluster optimized for massive matrix multiplication rows.'
  }
};

export const REGIONAL_DATA: Record<DeploymentRegion, RegionData> = {
  'us-east': {
    id: 'us-east',
    name: 'Northern Virginia (Data Center Alley)',
    gridName: 'PJM Interconnection',
    powerTariffPerKWh: 0.082,
    waterCostPerKGal: 4.80,
    gridCarbonIntensityKgMWh: 340,
    ambientDryBulbC: 36,
    ambientWetBulbC: 26,
    gridQueueYears: 5.0
  },
  'us-central': {
    id: 'us-central',
    name: 'Texas ERCOT (Abilene / Dallas)',
    gridName: 'ERCOT ISO',
    powerTariffPerKWh: 0.065,
    waterCostPerKGal: 6.20,
    gridCarbonIntensityKgMWh: 380,
    ambientDryBulbC: 43,
    ambientWetBulbC: 25,
    gridQueueYears: 2.5
  },
  'eu-west': {
    id: 'eu-west',
    name: 'Nordics (Luleå / Hamina)',
    gridName: 'Nord Pool (100% Hydro/Wind)',
    powerTariffPerKWh: 0.052,
    waterCostPerKGal: 3.10,
    gridCarbonIntensityKgMWh: 35,
    ambientDryBulbC: 24,
    ambientWetBulbC: 17,
    gridQueueYears: 1.5
  },
  'us-west': {
    id: 'us-west',
    name: 'Silicon Valley / Santa Clara',
    gridName: 'CAISO (Strict Air / Water)',
    powerTariffPerKWh: 0.145,
    waterCostPerKGal: 9.50,
    gridCarbonIntensityKgMWh: 210,
    ambientDryBulbC: 34,
    ambientWetBulbC: 20,
    gridQueueYears: 4.5
  },
  'eu-central': {
    id: 'eu-central',
    name: 'Frankfurt / Rhein-Main (FLAP-D)',
    gridName: 'Amprion / TenneT',
    powerTariffPerKWh: 0.165,
    waterCostPerKGal: 7.80,
    gridCarbonIntensityKgMWh: 310,
    ambientDryBulbC: 33,
    ambientWetBulbC: 22,
    gridQueueYears: 3.5
  }
};

export const LEAD_TIME_MATRIX = {
  transformer: {
    conventional: { weeks: 124, name: 'Medium-Voltage Step-Down Oil Transformer (LPT)' },
    sst: { weeks: 44, name: 'Modular Solid-State Transformer Skids' }
  },
  btm: {
    grid_only: { weeks: 20, name: 'Standard Utility Interconnect Feeder' },
    aero_turbine: { weeks: 72, name: 'Aeroderivative Dual-Fuel Gas Turbine Package' },
    gas_recip: { weeks: 58, name: 'Medium-Speed Natural Gas Reciprocating Gensets' },
    fuel_cell: { weeks: 48, name: 'Containerized Solid Oxide Fuel Cell Arrays' }
  },
  cooling: {
    d2c_l2l: { weeks: 36, name: 'Liquid-to-Liquid CDUs & Secondary Fluid Network' },
    immersion: { weeks: 42, name: 'Precision Immersion Tanks & Fluid Loop' },
    rdhx: { weeks: 28, name: 'Active Rear Door Heat Exchanger Coils' },
    air_hvac: { weeks: 32, name: 'Computer Room Air Handlers (CRAH) & Chillers' }
  },
  switchgear: {
    gis: { weeks: 50, name: 'Gas-Insulated High-Voltage Switchgear' },
    ais: { weeks: 64, name: 'Air-Insulated Substation Yard Switchgear' }
  },
  envelope: {
    stick_built: { weeks: 68, name: 'Hardened Cast-in-Place Concrete Building Envelope' },
    modular_skid: { weeks: 32, name: 'Pre-Engineered Offsite Power & Cooling Modules' }
  }
};

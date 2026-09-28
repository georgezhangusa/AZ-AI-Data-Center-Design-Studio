import { PresetArchitecture } from '../types/datacenter';

export const ARCHITECTURE_PRESETS: PresetArchitecture[] = [
  {
    id: 'blackwell-100mw',
    title: '100 MW Blackwell Flagship',
    category: 'Hyperscale Training',
    badge: 'Flagship Tier IV',
    description: 'Purpose-built for massive clusters of NVIDIA GB200 NVL72 racks with 800V DC busways, aeroderivative gas turbines for fast-track energization, and zero-water adiabatic heat rejection.',
    config: {
      ingressMode: 'top-down',
      gpuType: 'gb200',
      gpuCount: 48000,
      region: 'us-central',
      fixedUtilityMW: 100,
      targetRackDensityKW: 120,
      landAcreage: 35,
      substationType: 'gis',
      dualUtilityFeed: true,
      transformerType: 'sst',
      serverPower: '800vdc',
      btmPower: 'aero_turbine',
      bessType: 'lfp_short',
      coolingLoop: 'd2c_l2l',
      rejectionPlant: 'adiabatic_dry',
      redundancy: 'n_plus_1',
      envelopeType: 'stick_built'
    }
  },
  {
    id: 'sovereign-50mw',
    title: '50 MW Sovereign AI Microgrid',
    category: 'Sovereign / National AI',
    badge: 'Islandable Microgrid',
    description: 'Engineered for national AI independence with dual-fuel reciprocating generation, high-density LFP storage, Solid-State Transformers, and Direct-to-Chip cooling.',
    config: {
      ingressMode: 'top-down',
      gpuType: 'b200',
      gpuCount: 24000,
      region: 'us-east',
      fixedUtilityMW: 50,
      targetRackDensityKW: 65,
      landAcreage: 20,
      substationType: 'gis',
      dualUtilityFeed: true,
      transformerType: 'sst',
      serverPower: '800vdc',
      btmPower: 'gas_recip',
      bessType: 'lfp_long',
      coolingLoop: 'd2c_l2l',
      rejectionPlant: 'adiabatic_dry',
      redundancy: '2n',
      envelopeType: 'stick_built'
    }
  },
  {
    id: 'rapid-modular-20mw',
    title: '20 MW Rapid-Deploy Edge AI',
    category: 'Fast-Track Modular',
    badge: '11-Month COD',
    description: 'Pre-fabricated offsite containerized power skids and modular liquid cooling blocks to bypass 3-year utility substation lead times.',
    config: {
      ingressMode: 'bottom-up',
      gpuType: 'gb200',
      gpuCount: 10000,
      region: 'us-west',
      fixedUtilityMW: 20,
      targetRackDensityKW: 120,
      landAcreage: 8,
      substationType: 'gis',
      dualUtilityFeed: false,
      transformerType: 'sst',
      serverPower: '800vdc',
      btmPower: 'gas_recip',
      bessType: 'lfp_short',
      coolingLoop: 'd2c_l2l',
      rejectionPlant: 'adiabatic_dry',
      redundancy: 'n_plus_1',
      envelopeType: 'modular_skid'
    }
  },
  {
    id: 'nordic-immersion-40mw',
    title: '40 MW Nordic Zero-Carbon Cluster',
    category: 'Ultra-Green ESG',
    badge: 'PUE 1.08 / Net-Zero',
    description: 'Deployed in Scandinavia with 100% hydro/wind power, two-phase immersion cooling tanks, free ambient cooling 310 days/year, and district heating export readiness.',
    config: {
      ingressMode: 'top-down',
      gpuType: 'custom_asic',
      gpuCount: 30000,
      region: 'eu-west',
      fixedUtilityMW: 45,
      targetRackDensityKW: 85,
      landAcreage: 18,
      substationType: 'ais',
      dualUtilityFeed: true,
      transformerType: 'sst',
      serverPower: '800vdc',
      btmPower: 'grid_only',
      bessType: 'flywheel',
      coolingLoop: 'immersion',
      rejectionPlant: 'adiabatic_dry',
      redundancy: 'n_plus_1',
      envelopeType: 'stick_built'
    }
  }
];

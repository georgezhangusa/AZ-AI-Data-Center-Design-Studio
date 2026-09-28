export type IngressMode = 'top-down' | 'bottom-up';

export type AcceleratorType = 'gb200' | 'h100' | 'b200' | 'custom_asic';

export interface AcceleratorSpec {
  id: AcceleratorType;
  name: string;
  vendor: string;
  kwPerRack: number;
  gpusPerRack: number;
  requiresLiquid: boolean;
  rackWeightLbs: number;
  voltageTier: '800V DC' | '480V AC';
  description: string;
}

export type DeploymentRegion = 'us-east' | 'us-central' | 'eu-west' | 'us-west' | 'eu-central';

export interface RegionData {
  id: DeploymentRegion;
  name: string;
  gridName: string;
  powerTariffPerKWh: number; // USD
  waterCostPerKGal: number; // USD
  gridCarbonIntensityKgMWh: number; // kg CO2e / MWh
  ambientDryBulbC: number;
  ambientWetBulbC: number;
  gridQueueYears: number;
}

export type SubstationType = 'gis' | 'ais';
export type TransformerType = 'sst' | 'conventional';
export type ServerPowerArch = '800vdc' | '480vac';
export type BtmPowerType = 'grid_only' | 'aero_turbine' | 'gas_recip' | 'fuel_cell';
export type BessType = 'lfp_short' | 'lfp_long' | 'flywheel';
export type CoolingLoopType = 'd2c_l2l' | 'immersion' | 'rdhx' | 'air_hvac';
export type RejectionPlantType = 'adiabatic_dry' | 'hybrid_tower' | 'chiller_economizer';
export type RedundancyType = 'n_plus_1' | '2n';
export type EnvelopeType = 'stick_built' | 'modular_skid';

export interface DataCenterConfig {
  // Step 1: Ingress
  ingressMode: IngressMode;
  gpuType: AcceleratorType;
  gpuCount: number;
  region: DeploymentRegion;
  fixedUtilityMW: number;
  targetRackDensityKW: number;
  landAcreage: number;

  // Step 2: Subsystems
  substationType: SubstationType;
  dualUtilityFeed: boolean;
  transformerType: TransformerType;
  serverPower: ServerPowerArch;
  btmPower: BtmPowerType;
  bessType: BessType;
  coolingLoop: CoolingLoopType;
  rejectionPlant: RejectionPlantType;
  redundancy: RedundancyType;
  envelopeType: EnvelopeType;
}

export interface PhysicsAlert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  remedyActionTitle: string;
  autoFix: () => Partial<DataCenterConfig>;
}

export interface EngineeringCalculation {
  rackDensityKW: number;
  totalRacks: number;
  criticalITLoadMW: number;
  facilityTotalLoadMW: number;
  pue: number;
  wue: number;
  cue: number; // Carbon usage effectiveness (kg CO2e / kWh)
  whiteSpaceSqFt: number;
  graySpaceSqFt: number;
  substationYardSqFt: number;
  totalFootprintSqFt: number;
  structuralSlabLoadPcf: number;
  totalCoolantFlowGPM: number;
  heatDissipationTons: number;

  // CapEx
  substationCapExM: number;
  transformersCapExM: number;
  btmGenCapExM: number;
  bessCapExM: number;
  coolingPlantCapExM: number;
  powerDistributionCapExM: number;
  civilStructuralCapExM: number;
  epcManagementCapExM: number;
  totalCapExM: number;
  capexPerMW: number;

  // OpEx
  annualPowerCostM: number;
  annualWaterCostM: number;
  annualMaintenanceM: number;
  totalAnnualOpExM: number;

  // Supply Chain & Schedule
  criticalPathWeeks: number;
  bottleneckComponent: string;
  projectedCODDate: string;

  // Physics & Compliance
  alerts: PhysicsAlert[];
  isViable: boolean;
}

export type BusinessPersona = 'neocloud' | 'colo' | 'enterprise';

export interface PersonaMetrics {
  title: string;
  primaryStatLabel: string;
  primaryStatValue: string;
  secondaryStatLabel: string;
  secondaryStatValue: string;
  tertiaryStatLabel: string;
  tertiaryStatValue: string;
  narrative: string;
  breakdown: { label: string; value: string; hint?: string }[];
}

export interface PresetArchitecture {
  id: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  config: DataCenterConfig;
}

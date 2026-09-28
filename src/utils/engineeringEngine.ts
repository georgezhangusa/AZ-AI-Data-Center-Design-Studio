import { ACCELERATOR_SPECS, LEAD_TIME_MATRIX, REGIONAL_DATA } from '../data/constants';
import {
  BusinessPersona,
  DataCenterConfig,
  EngineeringCalculation,
  PersonaMetrics,
  PhysicsAlert
} from '../types/datacenter';

export function calculateEngineeringMetrics(config: DataCenterConfig): EngineeringCalculation {
  const accelerator = ACCELERATOR_SPECS[config.gpuType] || ACCELERATOR_SPECS.gb200;
  const region = REGIONAL_DATA[config.region] || REGIONAL_DATA['us-east'];

  // 1. Sizing and Loads
  let rackDensityKW = accelerator.kwPerRack;
  let totalRacks = 0;
  let criticalITLoadMW = 0;

  if (config.ingressMode === 'top-down') {
    rackDensityKW = accelerator.kwPerRack;
    totalRacks = Math.ceil(config.gpuCount / accelerator.gpusPerRack);
    criticalITLoadMW = (totalRacks * rackDensityKW) / 1000;
  } else {
    rackDensityKW = config.targetRackDensityKW;
    // In bottom-up, available utility power drives capacity
    // Reserve ~16% for preliminary cooling/losses
    criticalITLoadMW = config.fixedUtilityMW * 0.84;
    totalRacks = Math.max(1, Math.floor((criticalITLoadMW * 1000) / rackDensityKW));
  }

  // 2. Thermodynamic & PUE Formulation
  let basePUE = 1.08;
  if (config.coolingLoop === 'd2c_l2l') basePUE += 0.04;
  else if (config.coolingLoop === 'immersion') basePUE += 0.02;
  else if (config.coolingLoop === 'rdhx') basePUE += 0.06;
  else if (config.coolingLoop === 'air_hvac') basePUE += 0.35; // huge fan/chiller penalty

  if (config.rejectionPlant === 'hybrid_tower') basePUE += 0.03;
  else if (config.rejectionPlant === 'chiller_economizer') basePUE += 0.05;

  if (config.transformerType === 'conventional') basePUE += 0.02; // iron/copper losses
  if (config.serverPower === '480vac') basePUE += 0.03; // triple transformation losses

  if (config.region === 'us-central') basePUE += 0.03; // hot Texas summers
  if (config.region === 'eu-west') basePUE -= 0.02; // cold Nordic ambient

  const pue = Math.max(1.06, Number(basePUE.toFixed(2)));
  const facilityTotalLoadMW = Number((criticalITLoadMW * pue).toFixed(1));

  // 3. Water Usage (WUE) & Carbon (CUE)
  let wue = 0.02; // L/kWh for closed loop adiabatic
  if (config.rejectionPlant === 'hybrid_tower') {
    wue = 1.65;
  } else if (config.rejectionPlant === 'chiller_economizer') {
    wue = 0.45;
  }

  const annualKWh = facilityTotalLoadMW * 1000 * 8760 * 0.90;
  const annualMWh = annualKWh / 1000;
  const annualCO2Tons = (annualMWh * region.gridCarbonIntensityKgMWh) / 1000;
  const cue = Number(((annualCO2Tons * 1000) / annualKWh).toFixed(3)); // kg CO2e / kWh

  // 4. Space Planning & Structural Specs
  const whiteSpaceSqFt = totalRacks * 80; // 80 sq ft per rack (aisles, clearance, CDU manifolds)
  const graySpaceSqFt = Math.round(whiteSpaceSqFt * (config.redundancy === '2n' ? 0.75 : 0.60));
  const substationYardSqFt = Math.round(facilityTotalLoadMW * (config.substationType === 'gis' ? 450 : 1200));
  const coolingFarmSqFt = Math.round(facilityTotalLoadMW * 550);
  const totalFootprintSqFt = whiteSpaceSqFt + graySpaceSqFt + substationYardSqFt + coolingFarmSqFt;
  const structuralSlabLoadPcf = config.coolingLoop === 'immersion' ? 6200 : 4500;

  // Mechanical specs
  const heatDissipationTons = Math.round(criticalITLoadMW * 284.3);
  const totalCoolantFlowGPM = Math.round(criticalITLoadMW * 195); // ~195 GPM per MW critical load

  // 5. Physics & Engineering Constraint Validation Engine
  const alerts: PhysicsAlert[] = [];

  // Rule 1: High Density requires Liquid Cooling
  if (rackDensityKW > 35 && config.coolingLoop === 'air_hvac') {
    alerts.push({
      id: 'thermal_runaway',
      level: 'critical',
      title: 'Thermal Feasibility Violation',
      message: `Rack density of ${rackDensityKW} kW/rack exceeds the physical heat rejection threshold of air CRAH/HVAC systems (limit 35 kW/rack). Severe thermal throttling or physical equipment destruction will occur.`,
      remedyActionTitle: 'Upgrade to Direct-to-Chip (D2C) Liquid CDUs',
      autoFix: () => ({ coolingLoop: 'd2c_l2l' })
    });
  }

  // Rule 2: Substation capacity vs Grid Only
  if (config.ingressMode === 'bottom-up' && config.fixedUtilityMW < facilityTotalLoadMW && config.btmPower === 'grid_only') {
    alerts.push({
      id: 'utility_deficit',
      level: 'critical',
      title: 'Utility Grid Interconnect Deficit',
      message: `Total required facility power (${facilityTotalLoadMW} MW) exceeds the available utility grid interconnect (${config.fixedUtilityMW} MW). The facility cannot operate at full compute density without on-site Behind-The-Meter generation.`,
      remedyActionTitle: 'Deploy Aeroderivative Gas Turbines (BTM)',
      autoFix: () => ({ btmPower: 'aero_turbine' })
    });
  }

  // Rule 3: Supply Chain Transformer Bottleneck
  if (config.transformerType === 'conventional') {
    alerts.push({
      id: 'lpt_supply_chain',
      level: 'warning',
      title: 'Extended Supply Chain Lead Time (124 Weeks)',
      message: 'Conventional Oil-Filled Large Power Transformers currently face global order backlogs of 110–140 weeks, pushing project COD out past 2.5 years.',
      remedyActionTitle: 'Switch to Modular Solid-State Transformers (SST)',
      autoFix: () => ({ transformerType: 'sst' })
    });
  }

  // Rule 4: High Density 480V AC distribution penalty
  if (rackDensityKW >= 100 && config.serverPower === '480vac') {
    alerts.push({
      id: 'copper_losses',
      level: 'info',
      title: 'Electrical Distribution Efficiency Penalty',
      message: 'At 120 kW/rack, 480V AC requires thick copper busbars and incurs 4.2% higher I²R ohmic losses than 800V DC central rectification.',
      remedyActionTitle: 'Convert to 800V DC Central Busway',
      autoFix: () => ({ serverPower: '800vdc' })
    });
  }

  // Rule 5: Arid water restrictions
  if ((config.region === 'us-central' || config.region === 'us-west') && config.rejectionPlant === 'hybrid_tower') {
    alerts.push({
      id: 'water_permitting',
      level: 'warning',
      title: 'Municipal Water Permitting Risk',
      message: 'Evaporative cooling towers in water-stressed regions consume over 1.2M gallons/day for this MW scale, creating high risk of municipal permit denial or community moratoriums.',
      remedyActionTitle: 'Switch to Zero-Water Closed-Loop Adiabatic Coolers',
      autoFix: () => ({ rejectionPlant: 'adiabatic_dry' })
    });
  }

  const isViable = !alerts.some(a => a.level === 'critical');

  // 6. CapEx Modeling ($ Millions)
  const redundancyMultiplier = config.redundancy === '2n' ? 1.28 : 1.0;

  // Substation
  let subBaseM = facilityTotalLoadMW * 0.16;
  if (config.substationType === 'gis') subBaseM *= 1.22;
  if (config.dualUtilityFeed) subBaseM *= 1.35;
  const substationCapExM = Number(subBaseM.toFixed(2));

  // Transformers
  let transBaseM = facilityTotalLoadMW * (config.transformerType === 'sst' ? 0.18 : 0.12);
  const transformersCapExM = Number((transBaseM * redundancyMultiplier).toFixed(2));

  // Behind-The-Meter Generation
  let btmM = 0;
  if (config.btmPower === 'aero_turbine') btmM = facilityTotalLoadMW * 1.15;
  else if (config.btmPower === 'gas_recip') btmM = facilityTotalLoadMW * 0.95;
  else if (config.btmPower === 'fuel_cell') btmM = facilityTotalLoadMW * 1.65;
  const btmGenCapExM = Number(btmM.toFixed(2));

  // BESS Energy Storage
  let bessM = criticalITLoadMW * 0.42; // standard 15-min LFP
  if (config.bessType === 'lfp_long') bessM = criticalITLoadMW * 1.15;
  else if (config.bessType === 'flywheel') bessM = criticalITLoadMW * 0.55;
  const bessCapExM = Number((bessM * (config.redundancy === '2n' ? 1.25 : 1.0)).toFixed(2));

  // Cooling Plant (CDUs, fluid loops, dry coolers)
  let coolingM = criticalITLoadMW * 0.58;
  if (config.coolingLoop === 'd2c_l2l') coolingM += criticalITLoadMW * 0.22;
  else if (config.coolingLoop === 'immersion') coolingM += criticalITLoadMW * 0.45;
  else if (config.coolingLoop === 'air_hvac') coolingM += criticalITLoadMW * 0.15;

  if (config.rejectionPlant === 'adiabatic_dry') coolingM += criticalITLoadMW * 0.18;
  else if (config.rejectionPlant === 'hybrid_tower') coolingM += criticalITLoadMW * 0.12;
  const coolingPlantCapExM = Number((coolingM * redundancyMultiplier).toFixed(2));

  // Power Distribution (Busways, RPP, Switchgear)
  let pwrDistM = criticalITLoadMW * (config.serverPower === '800vdc' ? 0.32 : 0.44);
  const powerDistributionCapExM = Number((pwrDistM * redundancyMultiplier).toFixed(2));

  // Civil & Structural Shell
  let civilM = (totalFootprintSqFt * 280) / 1e6; // $280/sq ft base
  if (config.envelopeType === 'modular_skid') civilM *= 0.82; // offsite modular savings
  const civilStructuralCapExM = Number(civilM.toFixed(2));

  // Direct Equipment & Civil Subtotal
  const directCapEx = substationCapExM + transformersCapExM + btmGenCapExM + bessCapExM + coolingPlantCapExM + powerDistributionCapExM + civilStructuralCapExM;

  // EPC Engineering Management, Permitting, Insurance & Contingency (9.5%)
  const epcManagementCapExM = Number((directCapEx * 0.095).toFixed(2));

  const totalCapExM = Number((directCapEx + epcManagementCapExM).toFixed(1));
  const capexPerMW = Number((totalCapExM / Math.max(1, facilityTotalLoadMW)).toFixed(2));

  // 7. OpEx Modeling ($ Millions / year)
  // Power
  const annualPowerCostM = Number(((annualMWh * region.powerTariffPerKWh * 1000) / 1e6).toFixed(2));

  // Water
  const annualWaterGallons = annualKWh * (wue * 0.264172); // convert liters to gal
  const annualWaterCostM = Number(((annualWaterGallons / 1000) * region.waterCostPerKGal / 1e6).toFixed(2));

  // Maintenance & Spares (~2.2% of mechanical/electrical CapEx)
  const annualMaintenanceM = Number(((directCapEx * 0.022) + 0.8).toFixed(2));

  const totalAnnualOpExM = Number((annualPowerCostM + annualWaterCostM + annualMaintenanceM).toFixed(2));

  // 8. Supply Chain Critical Path & COD Date
  let leadWeeks = 36;
  let bottleneck = 'Modular Liquid CDUs';

  const transLead = LEAD_TIME_MATRIX.transformer[config.transformerType].weeks;
  if (transLead > leadWeeks) {
    leadWeeks = transLead;
    bottleneck = LEAD_TIME_MATRIX.transformer[config.transformerType].name;
  }

  const btmLead = LEAD_TIME_MATRIX.btm[config.btmPower].weeks;
  if (btmLead > leadWeeks) {
    leadWeeks = btmLead;
    bottleneck = LEAD_TIME_MATRIX.btm[config.btmPower].name;
  }

  const envelopeLead = LEAD_TIME_MATRIX.envelope[config.envelopeType].weeks;
  if (envelopeLead > leadWeeks) {
    leadWeeks = envelopeLead;
    bottleneck = LEAD_TIME_MATRIX.envelope[config.envelopeType].name;
  }

  // Commissioning & Testing buffer (8 weeks)
  const criticalPathWeeks = leadWeeks + 8;

  // Projected COD date based on current time (Sept 2026)
  const baseDate = new Date('2026-09-28');
  const codDate = new Date(baseDate.getTime() + (criticalPathWeeks * 7 * 24 * 60 * 60 * 1000));
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const projectedCODDate = `${monthNames[codDate.getMonth()]} ${codDate.getFullYear()}`;

  return {
    rackDensityKW,
    totalRacks,
    criticalITLoadMW,
    facilityTotalLoadMW,
    pue,
    wue,
    cue,
    whiteSpaceSqFt,
    graySpaceSqFt,
    substationYardSqFt,
    totalFootprintSqFt,
    structuralSlabLoadPcf,
    totalCoolantFlowGPM,
    heatDissipationTons,
    substationCapExM,
    transformersCapExM,
    btmGenCapExM,
    bessCapExM,
    coolingPlantCapExM,
    powerDistributionCapExM,
    civilStructuralCapExM,
    epcManagementCapExM,
    totalCapExM,
    capexPerMW,
    annualPowerCostM,
    annualWaterCostM,
    annualMaintenanceM,
    totalAnnualOpExM,
    criticalPathWeeks,
    bottleneckComponent: bottleneck,
    projectedCODDate,
    alerts,
    isViable
  };
}

export function calculatePersonaROI(
  persona: BusinessPersona,
  config: DataCenterConfig,
  calc: EngineeringCalculation
): PersonaMetrics {
  const accelerator = ACCELERATOR_SPECS[config.gpuType] || ACCELERATOR_SPECS.gb200;
  const totalGPUs = config.ingressMode === 'top-down'
    ? config.gpuCount
    : calc.totalRacks * accelerator.gpusPerRack;

  if (persona === 'neocloud') {
    // GPUaaS Neocloud (e.g. CoreWeave, Lambda, Crusoe)
    const ratePerHour = config.gpuType === 'gb200' ? 2.65 : config.gpuType === 'b200' ? 2.20 : 1.85;
    const utilization = 0.82; // 82% cluster utilization
    const annualHours = 8760;
    const grossRevenueAnnualM = (totalGPUs * ratePerHour * annualHours * utilization) / 1e6;
    const grossMarginM = grossRevenueAnnualM - calc.totalAnnualOpExM;
    const netEbitdaM = grossMarginM - (calc.totalCapExM * 0.08); // 8% SG&A / networking overhead
    const paybackYears = Number((calc.totalCapExM / Math.max(1, netEbitdaM)).toFixed(1));

    return {
      title: 'GPU-as-a-Service (Neocloud) Economics',
      primaryStatLabel: 'Annual Gross Rental Rev',
      primaryStatValue: `$${grossRevenueAnnualM.toFixed(1)}M / yr`,
      secondaryStatLabel: 'Adjusted EBITDA',
      secondaryStatValue: `$${netEbitdaM.toFixed(1)}M / yr`,
      tertiaryStatLabel: 'CapEx Payback Window',
      tertiaryStatValue: `${paybackYears} Years`,
      narrative: `Modeled on dedicated cluster leasing for ${totalGPUs.toLocaleString()} accelerators at $${ratePerHour.toFixed(2)}/GPU-hour under 82% annualized reservation. High thermal density and 800V DC direct distribution safeguard against GPU clock throttling, protecting SLA revenues.`,
      breakdown: [
        { label: 'Cluster Capacity', value: `${totalGPUs.toLocaleString()} GPUs` },
        { label: 'Rental Benchmark', value: `$${ratePerHour.toFixed(2)} / GPU-hr` },
        { label: 'Annual Utilization', value: '82.0%' },
        { label: 'Power & Thermal OpEx', value: `$${calc.totalAnnualOpExM.toFixed(1)}M / yr` },
        { label: '5-Year Cumulative EBITDA', value: `$${(netEbitdaM * 5).toFixed(1)}M` }
      ]
    };
  }

  if (persona === 'colo') {
    // Wholesale Colocation Developer (e.g. Digital Realty, Vantage, QTS)
    const leaseRateKWPerMonth = calc.rackDensityKW >= 100 ? 165 : 140; // High-density premium
    const annualLeaseRevM = ((calc.criticalITLoadMW * 1000) * leaseRateKWPerMonth * 12) / 1e6;
    const noiM = annualLeaseRevM * 0.84; // 84% NOI margin after facility staffing
    const yieldOnCost = Number(((noiM / calc.totalCapExM) * 100).toFixed(1));
    const exitCapRate = 0.065; // 6.50% exit cap
    const assetValuationM = Number((noiM / exitCapRate).toFixed(1));

    return {
      title: 'Wholesale Colocation Developer Economics',
      primaryStatLabel: 'Triple-Net Lease Revenue',
      primaryStatValue: `$${annualLeaseRevM.toFixed(1)}M / yr`,
      secondaryStatLabel: 'Unlevered Yield on Cost',
      secondaryStatValue: `${yieldOnCost}%`,
      tertiaryStatLabel: 'Stabilized Asset Value',
      tertiaryStatValue: `$${assetValuationM}M`,
      narrative: `Reflects long-term 15-year master service agreements with hyperscaler AI tenants at $${leaseRateKWPerMonth}/kW/month. Direct-to-chip readiness commands a +18% premium over legacy air-cooled whitespace facilities.`,
      breakdown: [
        { label: 'Critical IT Capacity', value: `${calc.criticalITLoadMW.toFixed(1)} MW` },
        { label: 'Lease Rate (NNN)', value: `$${leaseRateKWPerMonth} / kW / month` },
        { label: 'Annual Net Operating Income', value: `$${noiM.toFixed(1)}M / yr` },
        { label: 'CapEx Investment Basis', value: `$${calc.totalCapExM.toFixed(1)}M` },
        { label: 'Value Creation Spread', value: `+$${(assetValuationM - calc.totalCapExM).toFixed(1)}M` }
      ]
    };
  }

  // Enterprise Private AI TCO vs Public Cloud
  const cloudHourlyRate = config.gpuType === 'gb200' ? 4.10 : config.gpuType === 'b200' ? 3.40 : 2.95;
  const cloudAnnualEquivalentM = (totalGPUs * cloudHourlyRate * 8760 * 0.85) / 1e6;
  const cloud5YrTCOM = cloudAnnualEquivalentM * 5;
  const selfBuild5YrTCOM = calc.totalCapExM + (calc.totalAnnualOpExM * 5);
  const netSavings5YrM = Number((cloud5YrTCOM - selfBuild5YrTCOM).toFixed(1));

  return {
    title: 'Enterprise Private AI vs Public Cloud TCO',
    primaryStatLabel: '5-Yr Public Cloud Cost',
    primaryStatValue: `$${cloud5YrTCOM.toFixed(1)}M`,
    secondaryStatLabel: '5-Yr Design-Build TCO',
    secondaryStatValue: `$${selfBuild5YrTCOM.toFixed(1)}M`,
    tertiaryStatLabel: 'Net 5-Year Capital Savings',
    tertiaryStatValue: `$${netSavings5YrM}M`,
    narrative: `Compares on-demand hyperscale cloud GPU instance billing against owning an engineered AI facility. Amortizing capital investment over a 5-year operational lifecycle yields massive margin preservation for sovereign or Fortune 500 AI model training.`,
    breakdown: [
      { label: 'Equivalent Cloud Tariff', value: `$${cloudHourlyRate.toFixed(2)} / GPU-hr` },
      { label: 'Annual Cloud Spend', value: `$${cloudAnnualEquivalentM.toFixed(1)}M / yr` },
      { label: 'Facility CapEx Basis', value: `$${calc.totalCapExM.toFixed(1)}M` },
      { label: '5-Yr Cumulative OpEx', value: `$${(calc.totalAnnualOpExM * 5).toFixed(1)}M` },
      { label: 'Cost Reduction Percentage', value: `${((netSavings5YrM / cloud5YrTCOM) * 100).toFixed(0)}%` }
    ]
  };
}

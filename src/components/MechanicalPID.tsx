import React, { useState } from 'react';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { Droplet, Gauge, Thermometer, Wind } from 'lucide-react';

interface MechanicalPIDProps {
  config: DataCenterConfig;
  calc: EngineeringCalculation;
}

export const MechanicalPID: React.FC<MechanicalPIDProps> = ({ config, calc }) => {
  const [activePump, setActivePump] = useState<'pump1' | 'pump2' | 'both'>('both');
  const [ambientTempOverride, setAmbientTempOverride] = useState<number>(32);

  // Thermodynamic calculation values
  const supplyTempC = config.coolingLoop === 'immersion' ? 38 : 32;
  const returnTempC = config.coolingLoop === 'immersion' ? 52 : 46;
  const deltaTC = returnTempC - supplyTempC;

  return (
    <div className="space-y-4">
      {/* P&ID Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 shadow-xs rounded-xl p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700">CDU Pump Status:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setActivePump('both')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  activePump === 'both' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lead + Lag (2x 100%)
              </button>
              <button
                onClick={() => setActivePump('pump1')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  activePump === 'pump1' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pump 1 Active
              </button>
              <button
                onClick={() => setActivePump('pump2')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  activePump === 'pump2' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pump 2 Active
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
          <span className="flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-blue-600" />
            Loop Flow: <strong className="text-slate-900">{calc.totalCoolantFlowGPM.toLocaleString()} GPM</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            Delta T: <strong className="text-slate-900">{deltaTC}°C</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-emerald-600" />
            Loop Pressure: <strong className="text-slate-900">42 PSI</strong>
          </span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 overflow-x-auto shadow-2xl">
        <svg viewBox="0 0 960 480" className="w-full min-w-[850px] font-sans">
          {/* Loop Annotations */}
          <text x="30" y="30" fill="#2dd4bf" fontSize="13" fontWeight="bold" fontFamily="monospace">
            MECHANICAL P&ID: FACILITY WATER SYSTEM (FWS) & TECHNOLOGY COOLING SYSTEM (TCS)
          </text>
          <text x="30" y="48" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            Heat Dissipation: {calc.heatDissipationTons.toLocaleString()} Tons ({calc.criticalITLoadMW.toFixed(1)} MWth) · ASHRAE W4 Fluid Envelope
          </text>

          {/* 1. HEAT REJECTION PLANT (Dry Coolers / Cooling Towers) */}
          <g transform="translate(40, 90)">
            <rect x="0" y="0" width="220" height="340" rx="8" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
            <text x="110" y="28" textAnchor="middle" fill="#5eead4" fontSize="12" fontWeight="bold">
              HEAT REJECTION FARM
            </text>
            <text x="110" y="45" textAnchor="middle" fill="#ccfbf1" fontSize="9" fontFamily="monospace">
              {config.rejectionPlant.toUpperCase()}
            </text>

            {/* Dry cooler modules */}
            {[0, 1, 2, 3].map((idx) => (
              <g key={idx} transform={`translate(15, ${65 + idx * 65})`}>
                <rect x="0" y="0" width="190" height="52" rx="4" fill="#134e4a" stroke="#2dd4bf" strokeWidth="1" />
                <circle cx="50" cy="26" r="16" fill="#0f766e" stroke="#5eead4" strokeWidth="1.5" />
                <circle cx="140" cy="26" r="16" fill="#0f766e" stroke="#5eead4" strokeWidth="1.5" />
                <path d="M 50 14 L 50 38 M 38 26 L 62 26" stroke="#5eead4" strokeWidth="2" />
                <path d="M 140 14 L 140 38 M 128 26 L 152 26" stroke="#5eead4" strokeWidth="2" />
                <text x="95" y="30" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">VFD FAN</text>
              </g>
            ))}
          </g>

          {/* Primary Facility Water Piping (Blue = Cold Supply, Red = Hot Return) */}
          {/* Cold FWS Supply Pipe: Dry Coolers -> CDUs */}
          <path
            d="M 260 170 L 390 170 L 390 200"
            fill="none"
            stroke="#0284c7"
            strokeWidth="5"
          />
          <text x="325" y="160" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
            FWS SUPPLY: 28°C
          </text>

          {/* Hot FWS Return Pipe: CDUs -> Dry Coolers */}
          <path
            d="M 390 350 L 390 380 L 260 380"
            fill="none"
            stroke="#ef4444"
            strokeWidth="5"
          />
          <text x="325" y="398" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold" fontFamily="monospace">
            FWS RETURN: 42°C
          </text>

          {/* 2. CENTRAL COOLANT DISTRIBUTION UNIT (CDU) */}
          <g transform="translate(390, 100)">
            <rect x="0" y="0" width="230" height="320" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <text x="115" y="28" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">
              COOLANT DISTRIBUTION UNIT (CDU)
            </text>
            <text x="115" y="44" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              Liquid-to-Liquid Brazed Plate (N+1)
            </text>

            {/* Brazed Plate Heat Exchanger core */}
            <rect x="30" y="70" width="170" height="80" rx="4" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
            <text x="115" y="105" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
              PLATE HEAT EXCHANGER
            </text>
            <text x="115" y="122" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="monospace">
              SS316L Stainless Plates (Zero Risk Cross-Fluid)
            </text>

            {/* Dual Redundant TCS Pumps */}
            {/* Pump 1 */}
            <g transform="translate(30, 180)">
              <circle cx="25" cy="25" r="22" fill={activePump !== 'pump2' ? '#10b981' : '#475569'} stroke="#ffffff" strokeWidth="1.5" />
              <text x="25" y="29" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">P-01</text>
              <text x="60" y="22" fill="#ffffff" fontSize="9" fontWeight="bold">TCS Pump 1</text>
              <text x="60" y="35" fill="#94a3b8" fontSize="8" fontFamily="monospace">VFD 1,750 RPM</text>
            </g>

            {/* Pump 2 */}
            <g transform="translate(30, 245)">
              <circle cx="25" cy="25" r="22" fill={activePump !== 'pump1' ? '#10b981' : '#475569'} stroke="#ffffff" strokeWidth="1.5" />
              <text x="25" y="29" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">P-02</text>
              <text x="60" y="22" fill="#ffffff" fontSize="9" fontWeight="bold">TCS Pump 2</text>
              <text x="60" y="35" fill="#94a3b8" fontSize="8" fontFamily="monospace">VFD Standby/Sync</text>
            </g>
          </g>

          {/* Secondary Technology Cooling System (TCS) Loop: CDU -> Server Racks */}
          {/* Cold TCS Supply to Racks */}
          <path
            d="M 620 200 L 730 200"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="5"
          />
          <text x="675" y="190" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold" fontFamily="monospace">
            TCS SUPPLY: {supplyTempC}°C
          </text>

          {/* Hot TCS Return from Racks */}
          <path
            d="M 730 350 L 620 350"
            fill="none"
            stroke="#f97316"
            strokeWidth="5"
          />
          <text x="675" y="370" textAnchor="middle" fill="#fb923c" fontSize="10" fontWeight="bold" fontFamily="monospace">
            TCS RETURN: {returnTempC}°C
          </text>

          {/* 3. AI SERVER RACK WITH DIRECT-TO-CHIP COLD PLATES */}
          <g transform="translate(730, 90)">
            <rect x="0" y="0" width="190" height="340" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <text x="95" y="26" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
              GB200 NVL72 RACK LINEUP
            </text>
            <text x="95" y="42" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              {calc.rackDensityKW} kW Direct Cold Plates
            </text>

            {/* Server Trays with Cold Plates */}
            {[0, 1, 2, 3, 4].map((trayIdx) => (
              <g key={trayIdx} transform={`translate(15, ${60 + trayIdx * 52})`}>
                <rect x="0" y="0" width="160" height="42" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <rect x="10" y="8" width="30" height="26" rx="2" fill="#0284c7" />
                <rect x="50" y="8" width="30" height="26" rx="2" fill="#0284c7" />
                <rect x="90" y="8" width="30" height="26" rx="2" fill="#0284c7" />
                <text x="25" y="24" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">GPU</text>
                <text x="65" y="24" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">GPU</text>
                <text x="105" y="24" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">CPU</text>

                {/* Quick Disconnect Couplings */}
                <circle cx="140" cy="15" r="4" fill="#06b6d4" />
                <circle cx="140" cy="27" r="4" fill="#f97316" />
              </g>
            ))}

            <text x="95" y="325" textAnchor="middle" fill="#5eead4" fontSize="8" fontFamily="monospace">
              Quick-Disconnect Manifold (QD4)
            </text>
          </g>
        </svg>
      </div>

      {/* Hydraulic & Mechanical Specifications Table */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Fluid Medium</span>
          <span className="font-bold text-slate-900">25% Propylene Glycol / Treated DI Water</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Supply Fluid Temp</span>
          <span className="font-bold text-blue-700 font-mono">{supplyTempC}°C (89.6°F) Non-Condensing</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Return Fluid Temp</span>
          <span className="font-bold text-amber-700 font-mono">{returnTempC}°C (114.8°F)</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Water Consumption</span>
          <span className="font-bold text-emerald-700 font-mono">{calc.wue} L/kWh WUE ({config.rejectionPlant === 'adiabatic_dry' ? 'Zero Water' : 'Evaporative'})</span>
        </div>
      </div>
    </div>
  );
};

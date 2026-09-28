import React, { useState } from 'react';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { AlertCircle, CheckCircle2, Power, RefreshCw, Zap } from 'lucide-react';

interface SingleLineDiagramProps {
  config: DataCenterConfig;
  calc: EngineeringCalculation;
}

export const SingleLineDiagram: React.FC<SingleLineDiagramProps> = ({ config, calc }) => {
  const [gridOnline, setGridOnline] = useState<boolean>(true);
  const [pathAActive, setPathAActive] = useState<boolean>(true);
  const [pathBActive, setPathBActive] = useState<boolean>(config.redundancy === '2n');
  const [generatorRunning, setGeneratorRunning] = useState<boolean>(false);

  const toggleGrid = () => {
    const nextGrid = !gridOnline;
    setGridOnline(nextGrid);
    if (!nextGrid) {
      setGeneratorRunning(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Interactive Controls & Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 shadow-xs rounded-xl p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Utility Feed:</span>
            <button
              onClick={toggleGrid}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer ${
                gridOnline
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
              }`}
            >
              <Power className="w-3 h-3" />
              {gridOnline ? 'Grid Online (115kV Active)' : 'Grid Tripped (Simulated Outage)'}
            </button>
          </div>

          {config.btmPower !== 'grid_only' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">BTM Generation:</span>
              <button
                onClick={() => setGeneratorRunning(!generatorRunning)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer ${
                  generatorRunning
                    ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Zap className="w-3 h-3" />
                {generatorRunning ? 'Turbines Synced & Islanded' : 'Standby / Cold'}
              </button>
            </div>
          )}
        </div>

        <div className="text-xs font-mono text-slate-600 flex items-center gap-3">
          <span>Topology: <strong className="text-slate-900">{config.redundancy === '2n' ? '2N True Concurrent' : 'N+1 Redundant'}</strong></span>
          <span>Bus: <strong className="text-blue-700">{config.serverPower === '800vdc' ? '800V DC Rectified' : '480V AC 3-Phase'}</strong></span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 overflow-x-auto shadow-2xl">
        <svg viewBox="0 0 960 480" className="w-full min-w-[850px] font-sans">
          <defs>
            <linearGradient id="pwrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <linearGradient id="dcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Grid Level: 115kV / 230kV Drop */}
          <g>
            <circle cx="100" cy="50" r="16" fill={gridOnline ? '#2563eb' : '#475569'} />
            <text x="100" y="54" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">UTIL</text>
            <text x="100" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">115kV Drop</text>

            {/* Utility Breaker CB-01 */}
            <line x1="100" y1="66" x2="100" y2="110" stroke={gridOnline ? '#3b82f6' : '#64748b'} strokeWidth="3" />
            <rect x="85" y="110" width="30" height="20" rx="3" fill="#0f172a" stroke={gridOnline ? '#10b981' : '#ef4444'} strokeWidth="2" />
            <text x="100" y="124" textAnchor="middle" fill={gridOnline ? '#10b981' : '#ef4444'} fontSize="9" fontWeight="bold">
              {gridOnline ? '52-1 [C]' : '52-1 [O]'}
            </text>
          </g>

          {/* BTM Generation / Gas Turbine Branch */}
          <g>
            <circle cx="280" cy="50" r="16" fill={generatorRunning ? '#9333ea' : '#334155'} />
            <text x="280" y="54" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">GEN</text>
            <text x="280" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              {config.btmPower === 'aero_turbine' ? 'Aero Turbine 34kV' : config.btmPower === 'gas_recip' ? 'Recip Genset 13.8kV' : 'No Onsite Gen'}
            </text>

            <line x1="280" y1="66" x2="280" y2="110" stroke={generatorRunning ? '#a855f7' : '#475569'} strokeWidth="3" />
            <rect x="265" y="110" width="30" height="20" rx="3" fill="#0f172a" stroke={generatorRunning ? '#10b981' : '#64748b'} strokeWidth="2" />
            <text x="280" y="124" textAnchor="middle" fill={generatorRunning ? '#10b981' : '#94a3b8'} fontSize="9" fontWeight="bold">
              {generatorRunning ? '52-G [C]' : '52-G [O]'}
            </text>
          </g>

          {/* Automatic Transfer / Synchronization Bus (34.5kV MV Bus) */}
          <g>
            <line x1="70" y1="150" x2="310" y2="150" stroke="#facc15" strokeWidth="5" />
            <text x="190" y="142" textAnchor="middle" fill="#facc15" fontSize="11" fontWeight="bold" fontFamily="monospace">
              MAIN 34.5kV MV SWITCHGEAR BUS [{config.substationType.toUpperCase()}]
            </text>

            <line x1="100" y1="130" x2="100" y2="150" stroke={gridOnline ? '#3b82f6' : '#64748b'} strokeWidth="3" />
            <line x1="280" y1="130" x2="280" y2="150" stroke={generatorRunning ? '#a855f7' : '#475569'} strokeWidth="3" />
          </g>

          {/* Feeder to Step-Down Transformation */}
          <g>
            <line x1="190" y1="150" x2="190" y2="190" stroke="#facc15" strokeWidth="3" />
            <rect x="175" y="190" width="30" height="20" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="190" y="204" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">52-T1</text>
            <line x1="190" y1="210" x2="190" y2="240" stroke="#facc15" strokeWidth="3" />

            {/* Transformer Block */}
            <g transform="translate(130, 240)">
              <rect x="0" y="0" width="120" height="55" rx="6" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" />
              <text x="60" y="22" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                {config.transformerType === 'sst' ? 'SOLID-STATE (SST)' : 'OIL-FILLED (LPT)'}
              </text>
              <text x="60" y="38" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="monospace">
                34.5kV / 4.16kV · {calc.facilityTotalLoadMW} MVA
              </text>
            </g>
          </g>

          {/* Redundant Distribution Paths A & B */}
          {/* Path A */}
          <g>
            <line x1="160" y1="295" x2="160" y2="340" stroke="#3b82f6" strokeWidth="3" />
            <text x="160" y="325" textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">PATH A (FEEDER 1) </text>

            {/* UPS & BESS Block */}
            <rect x="90" y="340" width="140" height="50" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="160" y="360" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">
              UPS & BESS BANK A
            </text>
            <text x="160" y="376" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              {config.bessType === 'lfp_long' ? '2-HR LFP BESS' : '15-MIN CRITICAL LFP'}
            </text>

            <line x1="160" y1="390" x2="160" y2="425" stroke="#3b82f6" strokeWidth="3" />
          </g>

          {/* Path B (if 2N Redundancy) */}
          <g>
            <line x1="220" y1="295" x2="360" y2="340" stroke={config.redundancy === '2n' ? '#3b82f6' : '#475569'} strokeWidth={config.redundancy === '2n' ? '3' : '1.5'} strokeDasharray={config.redundancy === '2n' ? '' : '4 4'} />
            
            <rect x="290" y="340" width="140" height="50" rx="6" fill="#0f172a" stroke={config.redundancy === '2n' ? '#10b981' : '#475569'} strokeWidth="2" />
            <text x="360" y="360" textAnchor="middle" fill={config.redundancy === '2n' ? '#10b981' : '#64748b'} fontSize="10" fontWeight="bold">
              {config.redundancy === '2n' ? 'UPS & BESS BANK B' : '[RESERVE / TIE PATH]'}
            </text>
            <text x="360" y="376" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              {config.redundancy === '2n' ? 'CONCURRENT 2N SYNC' : 'N+1 SINGLE RUN'}
            </text>

            <line x1="360" y1="390" x2="360" y2="425" stroke={config.redundancy === '2n' ? '#3b82f6' : '#475569'} strokeWidth="3" />
          </g>

          {/* Central DC Rectification or AC Busway */}
          <g>
            <line x1="120" y1="425" x2="400" y2="425" stroke={config.serverPower === '800vdc' ? '#06b6d4' : '#c084fc'} strokeWidth="5" />
            <text x="260" y="445" textAnchor="middle" fill={config.serverPower === '800vdc' ? '#06b6d4' : '#c084fc'} fontSize="11" fontWeight="bold" fontFamily="monospace">
              {config.serverPower === '800vdc' ? '800V DC CENTRAL RECTIFIED BUSWAY' : '480V AC CONVENTIONAL POWER DISTRIBUTION'}
            </text>

            {/* Feeder to Racks */}
            <line x1="400" y1="425" x2="520" y2="425" stroke={config.serverPower === '800vdc' ? '#06b6d4' : '#c084fc'} strokeWidth="4" />
          </g>

          {/* AI Server Racks Lineup */}
          <g transform="translate(540, 60)">
            <rect x="0" y="0" width="390" height="380" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <text x="20" y="30" fill="#38bdf8" fontSize="12" fontWeight="bold">AI COMPUTE WHITE SPACE ROW</text>
            <text x="20" y="48" fill="#94a3b8" fontSize="9" fontFamily="monospace">
              {calc.totalRacks} Racks · {config.gpuType.toUpperCase()} ({calc.rackDensityKW} kW/rack)
            </text>

            {/* Draw Racks in Row */}
            {[0, 1, 2, 3, 4, 5].map((rackIdx) => (
              <g key={rackIdx} transform={`translate(20, ${70 + rackIdx * 48})`}>
                <rect x="0" y="0" width="220" height="38" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                <rect x="8" y="6" width="12" height="26" rx="2" fill={config.coolingLoop === 'air_hvac' ? '#ef4444' : '#0284c7'} />
                <text x="30" y="18" fill="#ffffff" fontSize="9" fontWeight="bold">RACK-0{rackIdx + 1}: {calc.rackDensityKW} kW</text>
                <text x="30" y="30" fill="#64748b" fontSize="8" fontFamily="monospace">
                  Bus Tap: {config.serverPower === '800vdc' ? '800V DC (150A)' : '480V AC 3P (145A)'}
                </text>

                {/* CDU Loop indicator */}
                <circle cx="205" cy="19" r="6" fill={config.coolingLoop === 'air_hvac' ? '#ef4444' : '#10b981'} />
                <text x="205" y="22" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                  {config.coolingLoop === 'air_hvac' ? 'AIR' : 'D2C'}
                </text>
              </g>
            ))}

            {/* In-Row CDU / Secondary Fluid Manifold */}
            <rect x="260" y="70" width="110" height="278" rx="6" fill="#134e4a" stroke="#2dd4bf" strokeWidth="1.5" />
            <text x="315" y="100" textAnchor="middle" fill="#5eead4" fontSize="10" fontWeight="bold">IN-ROW CDU</text>
            <text x="315" y="120" textAnchor="middle" fill="#ccfbf1" fontSize="8" fontFamily="monospace">Plate Exchanger</text>
            <text x="315" y="140" textAnchor="middle" fill="#99f6e4" fontSize="8" fontFamily="monospace">Supply: 32°C</text>
            <text x="315" y="160" textAnchor="middle" fill="#f87171" fontSize="8" fontFamily="monospace">Return: 46°C</text>
            <text x="315" y="180" textAnchor="middle" fill="#5eead4" fontSize="8" fontFamily="monospace">
              Flow: {Math.round(calc.totalCoolantFlowGPM / 12)} GPM
            </text>
          </g>
        </svg>
      </div>

      {/* Schematic Key & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="font-bold text-slate-800 block mb-1">Standard Compliance</span>
          <span className="text-slate-600">IEEE 1584 Arc Flash rated, UL 891 switchboards, OCP Open Rack v3 compliant 800V DC busway architecture.</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="font-bold text-slate-800 block mb-1">Fault Coordination</span>
          <span className="text-slate-600">Electronic trip units with zone-selective interlocking (ZSI) and 100kA short-circuit withstand rating.</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="font-bold text-slate-800 block mb-1">Concurrent Maintainability</span>
          <span className="text-slate-600">{config.redundancy === '2n' ? 'Full Tier IV 2N path redundancy allows complete servicing of either electrical path without downtime.' : 'Tier III N+1 redundancy provides module-level concurrent maintenance.'}</span>
        </div>
      </div>
    </div>
  );
};

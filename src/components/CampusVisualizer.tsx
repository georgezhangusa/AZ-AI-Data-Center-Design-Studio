import React, { useEffect, useRef, useState } from 'react';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { Eye, Layers, Maximize2, RotateCcw, Thermometer, ZoomIn, ZoomOut } from 'lucide-react';

interface CampusVisualizerProps {
  config: DataCenterConfig;
  calc: EngineeringCalculation;
}

type ViewMode = 'isometric' | 'topdown' | 'thermal';

export const CampusVisualizer: React.FC<CampusVisualizerProps> = ({ config, calc }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('isometric');
  const [zoom, setZoom] = useState<number>(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pulseOffsetRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      pulseOffsetRef.current = (pulseOffsetRef.current + 0.4) % 24;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.save();

      // Background
      if (viewMode === 'thermal') {
        ctx.fillStyle = '#060a14';
      } else {
        ctx.fillStyle = '#0b1120';
      }
      ctx.fillRect(0, 0, w, h);

      // Center and apply zoom
      ctx.translate(w / 2, h / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-w / 2, -h / 2);

      // Draw subtle grid
      ctx.strokeStyle = viewMode === 'thermal' ? 'rgba(30, 41, 59, 0.4)' : 'rgba(30, 41, 59, 0.6)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (viewMode === 'isometric') {
        renderIsometricCampus(ctx, w, h, config, calc, pulseOffsetRef.current, selectedZone);
      } else if (viewMode === 'topdown') {
        renderTopDownSitePlan(ctx, w, h, config, calc, pulseOffsetRef.current, selectedZone);
      } else {
        renderThermalHeatmap(ctx, w, h, config, calc, pulseOffsetRef.current);
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config, calc, viewMode, zoom, selectedZone]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Hit testing approximate regions
    if (x < 240 && y < 240) {
      setSelectedZone('substation');
    } else if (x < 240 && y >= 240) {
      setSelectedZone('btm');
    } else if (x >= 240 && x <= 640) {
      setSelectedZone('white_space');
    } else if (x > 640) {
      setSelectedZone('cooling');
    } else {
      setSelectedZone(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Visualizer Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg">
          <button
            onClick={() => setViewMode('isometric')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'isometric'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            3D Isometric
          </button>
          <button
            onClick={() => setViewMode('topdown')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'topdown'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            2D Site Layout
          </button>
          <button
            onClick={() => setViewMode('thermal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'thermal'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Thermal FLIR
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setZoom(prev => Math.min(1.8, prev + 0.15))}
            className="p-1.5 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg transition shadow-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.7, prev - 0.15))}
            className="p-1.5 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg transition shadow-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setZoom(1); setSelectedZone(null); }}
            className="p-1.5 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg transition shadow-xs"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-slate-500 font-mono pl-1">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded-xl border border-slate-200 bg-slate-950 overflow-hidden shadow-md">
        <canvas
          ref={canvasRef}
          width={920}
          height={440}
          onClick={handleCanvasClick}
          className="w-full cursor-crosshair block"
        />

        {/* On-Canvas Campus Legend & Telemetry */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur border border-slate-200 shadow-sm rounded-lg p-2.5 text-[11px] space-y-1 pointer-events-none">
          <div className="text-slate-900 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Facility Total: {calc.facilityTotalLoadMW} MW
          </div>
          <div className="text-slate-600 font-mono">
            Critical IT: {calc.criticalITLoadMW.toFixed(1)} MW · Racks: {calc.totalRacks}
          </div>
          <div className="text-slate-500 text-[10px]">
            Click any campus sector below to inspect subsystem engineering specs
          </div>
        </div>

        {/* Selected Zone Inspector Overlay */}
        {selectedZone && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/98 backdrop-blur border border-blue-400 rounded-xl p-3.5 shadow-xl flex items-center justify-between animate-fadeIn">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600">Sector Details</span>
              <h5 className="text-xs font-bold text-slate-900">
                {selectedZone === 'substation' && `High-Voltage Substation Yard (${config.substationType.toUpperCase()} - ${calc.facilityTotalLoadMW} MVA)`}
                {selectedZone === 'btm' && `BTM Power & Energy Storage Yard (${config.btmPower.toUpperCase()} + ${config.bessType.toUpperCase()})`}
                {selectedZone === 'white_space' && `High-Density Compute White Space (${calc.totalRacks} Racks · ${calc.rackDensityKW} kW/rack)`}
                {selectedZone === 'cooling' && `Central Heat Rejection Farm (${config.rejectionPlant.toUpperCase()} · ${calc.heatDissipationTons.toLocaleString()} Tons)`}
              </h5>
              <p className="text-[11px] text-slate-600">
                {selectedZone === 'substation' && `Dual-fed 115kV/230kV step-down to 34.5kV. Substation yard footprint: ${calc.substationYardSqFt.toLocaleString()} sq ft.`}
                {selectedZone === 'btm' && `On-site fast-track generation with ride-through battery storage sized for instantaneous ramp synchronization.`}
                {selectedZone === 'white_space' && `Direct-to-chip secondary fluid loop with ${config.serverPower === '800vdc' ? '800V DC central busway' : '480V AC distribution'} and ${calc.structuralSlabLoadPcf} lbs/sq ft structural slab rating.`}
                {selectedZone === 'cooling' && `Cooling system operating at ${calc.wue} L/kWh WUE with total circulation flow of ${calc.totalCoolantFlowGPM.toLocaleString()} GPM.`}
              </p>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- RENDERING ROUTINES ---

function renderIsometricCampus(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: DataCenterConfig,
  calc: EngineeringCalculation,
  pulse: number,
  selectedZone: string | null
) {
  // Isometric projection helper
  const originX = w * 0.48;
  const originY = h * 0.22;

  const toIso = (x: number, y: number, z: number) => {
    const isoX = originX + (x - y) * 1.35;
    const isoY = originY + (x + y) * 0.75 - z * 1.2;
    return { x: isoX, y: isoY };
  };

  // Draw 3D Box helper
  const drawIsoBox = (
    x: number, y: number, z: number,
    wBox: number, lBox: number, hBox: number,
    topColor: string, leftColor: string, rightColor: string,
    isSelected: boolean
  ) => {
    // Vertices
    const p1 = toIso(x, y, z + hBox);
    const p2 = toIso(x + wBox, y, z + hBox);
    const p3 = toIso(x + wBox, y + lBox, z + hBox);
    const p4 = toIso(x, y + lBox, z + hBox);

    const b1 = toIso(x, y + lBox, z);
    const b2 = toIso(x + wBox, y + lBox, z);
    const b3 = toIso(x + wBox, y, z);

    // Left face
    ctx.fillStyle = leftColor;
    ctx.beginPath();
    ctx.moveTo(p4.x, p4.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.lineTo(b1.x, b1.y);
    ctx.closePath();
    ctx.fill();

    // Right face
    ctx.fillStyle = rightColor;
    ctx.beginPath();
    ctx.moveTo(p3.x, p3.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(b3.x, b3.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.closePath();
    ctx.fill();

    // Top face
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();

    // Outlines
    ctx.strokeStyle = isSelected ? '#60a5fa' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.stroke();
  };

  // 1. Campus Ground Concrete Pad
  const groundPad = [
    toIso(-140, -110, 0),
    toIso(230, -110, 0),
    toIso(230, 160, 0),
    toIso(-140, 160, 0)
  ];
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(groundPad[0].x, groundPad[0].y);
  ctx.lineTo(groundPad[1].x, groundPad[1].y);
  ctx.lineTo(groundPad[2].x, groundPad[2].y);
  ctx.lineTo(groundPad[3].x, groundPad[3].y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.stroke();

  // 2. Main Data Hall Building (White Space Envelope)
  const isWhiteSelected = selectedZone === 'white_space';
  const hallTop = isWhiteSelected ? '#2563eb' : '#1e293b';
  const hallLeft = isWhiteSelected ? '#1d4ed8' : '#0f172a';
  const hallRight = isWhiteSelected ? '#3b82f6' : '#334155';
  drawIsoBox(0, -60, 0, 140, 150, 48, hallTop, hallLeft, hallRight, isWhiteSelected);

  // Data Hall Roof Details (Liquid cooling manifolds / skylights)
  for (let i = 0; i < 4; i++) {
    const rx = 15 + i * 28;
    drawIsoBox(rx, -45, 48, 16, 120, 4, '#475569', '#334155', '#64748b', false);
  }

  // 3. High Voltage Substation Yard
  const isSubSelected = selectedZone === 'substation';
  drawIsoBox(-120, -90, 0, 80, 70, 12, isSubSelected ? '#1e3a8a' : '#172554', '#0f172a', '#1e293b', isSubSelected);
  // Transformers inside substation
  for (let t = 0; t < 3; t++) {
    drawIsoBox(-105 + t * 24, -75, 12, 16, 18, 18, '#3b82f6', '#1d4ed8', '#60a5fa', false);
  }

  // 4. BTM Microgrid & BESS Yard
  const isBtmSelected = selectedZone === 'btm';
  drawIsoBox(-120, 10, 0, 80, 110, 10, isBtmSelected ? '#581c87' : '#31104b', '#1e0c33', '#4a1575', isBtmSelected);
  // Turbines or Recip engines
  if (config.btmPower !== 'grid_only') {
    for (let g = 0; g < 2; g++) {
      drawIsoBox(-105 + g * 35, 30, 10, 24, 30, 22, '#a855f7', '#7e22ce', '#c084fc', false);
    }
  }
  // BESS Containers
  for (let b = 0; b < 3; b++) {
    drawIsoBox(-108 + b * 24, 80, 10, 18, 25, 14, '#10b981', '#047857', '#34d399', false);
  }

  // 5. Heat Rejection Farm (Dry Coolers / Cooling Towers)
  const isCoolSelected = selectedZone === 'cooling';
  drawIsoBox(165, -60, 0, 50, 150, 8, isCoolSelected ? '#065f46' : '#042f2e', '#022120', '#0d4e48', isCoolSelected);
  // Dry Cooler Banks
  for (let c = 0; c < 5; c++) {
    const cy = -45 + c * 26;
    drawIsoBox(170, cy, 8, 38, 18, 16, '#0d9488', '#0f766e', '#14b8a6', false);
  }

  // 6. Animated Power Interconnect Traces (Substation -> Hall)
  const pSub = toIso(-40, -40, 12);
  const pHallPwr = toIso(0, -30, 20);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = -pulse;
  ctx.beginPath();
  ctx.moveTo(pSub.x, pSub.y);
  ctx.lineTo(pHallPwr.x, pHallPwr.y);
  ctx.stroke();

  // 7. Animated Coolant Pipe Traces (Data Hall -> Cooling Farm)
  const pHallCool = toIso(140, 20, 15);
  const pCoolFarm = toIso(165, 20, 15);

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 6]);
  ctx.lineDashOffset = pulse;
  ctx.beginPath();
  ctx.moveTo(pHallCool.x, pHallCool.y);
  ctx.lineTo(pCoolFarm.x, pCoolFarm.y);
  ctx.stroke();

  // Reset line dash
  ctx.setLineDash([]);

  // Labels
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  const subLabelPos = toIso(-80, -95, 22);
  ctx.fillText('SUBSTATION YARD', subLabelPos.x - 45, subLabelPos.y);

  const hallLabelPos = toIso(70, -65, 55);
  ctx.fillText(`AI DATA HALL (${calc.rackDensityKW} kW/rack)`, hallLabelPos.x - 60, hallLabelPos.y);

  const coolLabelPos = toIso(185, -65, 28);
  ctx.fillText('HEAT REJECTION', coolLabelPos.x - 45, coolLabelPos.y);
}

function renderTopDownSitePlan(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: DataCenterConfig,
  calc: EngineeringCalculation,
  pulse: number,
  selectedZone: string | null
) {
  // 1. Data Center Main Envelope (Data Hall)
  const hallX = 260, hallY = 70, hallW = 380, hallH = 300;
  const isHallSel = selectedZone === 'white_space';

  ctx.fillStyle = isHallSel ? '#1e293b' : '#111827';
  ctx.strokeStyle = isHallSel ? '#60a5fa' : '#334155';
  ctx.lineWidth = 2;
  ctx.fillRect(hallX, hallY, hallW, hallH);
  ctx.strokeRect(hallX, hallY, hallW, hallH);

  // Draw Rack Lineups
  const rows = 7;
  const cols = 12;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rx = hallX + 30 + c * 27;
      const ry = hallY + 35 + r * 36;
      ctx.fillStyle = config.coolingLoop === 'air_hvac' ? '#475569' : '#0284c7';
      ctx.fillRect(rx, ry, 18, 22);
    }
  }

  // CDU Pump Lineup along interior wall
  for (let cdu = 0; cdu < 6; cdu++) {
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(hallX + hallW - 22, hallY + 35 + cdu * 42, 14, 28);
  }

  // Hall label
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(`WHITE SPACE: ${calc.totalRacks} RACKS · ${config.gpuType.toUpperCase()}`, hallX + 24, hallY - 12);
  ctx.font = '10px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`800V DC BUSWAY · D2C MANIFOLD · ${calc.whiteSpaceSqFt.toLocaleString()} SQ FT`, hallX + 24, hallY + hallH - 12);

  // 2. High Voltage Substation Yard
  const subX = 35, subY = 70, subW = 180, subH = 135;
  const isSubSel = selectedZone === 'substation';
  ctx.fillStyle = isSubSel ? '#172554' : '#0f172a';
  ctx.strokeStyle = isSubSel ? '#60a5fa' : '#1d4ed8';
  ctx.fillRect(subX, subY, subW, subH);
  ctx.strokeRect(subX, subY, subW, subH);

  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('HV SUBSTATION YARD', subX + 14, subY + 22);
  ctx.font = '9px monospace';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`115kV/34.5kV [${config.transformerType.toUpperCase()}]`, subX + 14, subY + 40);
  ctx.fillText(`Utility Cap: ${calc.facilityTotalLoadMW} MVA`, subX + 14, subY + 56);

  // Draw transformer blocks
  for (let t = 0; t < 3; t++) {
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(subX + 14 + t * 52, subY + 74, 42, 42);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px monospace';
    ctx.fillText(`TX-${t + 1}`, subX + 24 + t * 52, subY + 98);
  }

  // 3. Behind-The-Meter Power & BESS Yard
  const btmX = 35, btmY = 230, btmW = 180, btmH = 140;
  const isBtmSel = selectedZone === 'btm';
  ctx.fillStyle = isBtmSel ? '#3b0764' : '#180728';
  ctx.strokeStyle = isBtmSel ? '#c084fc' : '#7e22ce';
  ctx.fillRect(btmX, btmY, btmW, btmH);
  ctx.strokeRect(btmX, btmY, btmW, btmH);

  ctx.fillStyle = '#e9d5ff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('BTM GENERATION & BESS', btmX + 14, btmY + 22);
  ctx.font = '9px monospace';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`Gen: ${config.btmPower.toUpperCase()}`, btmX + 14, btmY + 40);
  ctx.fillText(`Storage: ${config.bessType.toUpperCase()}`, btmX + 14, btmY + 56);

  // Turbine / Engine skids
  ctx.fillStyle = '#9333ea';
  ctx.fillRect(btmX + 14, btmY + 70, 70, 50);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(btmX + 96, btmY + 70, 70, 50);
  ctx.fillStyle = '#ffffff';
  ctx.font = '8px monospace';
  ctx.fillText('TURBINE', btmX + 28, btmY + 98);
  ctx.fillText('BESS LFP', btmX + 108, btmY + 98);

  // 4. Heat Rejection Plant
  const coolX = 680, coolY = 70, coolW = 200, coolH = 300;
  const isCoolSel = selectedZone === 'cooling';
  ctx.fillStyle = isCoolSel ? '#042f2e' : '#021817';
  ctx.strokeStyle = isCoolSel ? '#2dd4bf' : '#0f766e';
  ctx.fillRect(coolX, coolY, coolW, coolH);
  ctx.strokeRect(coolX, coolY, coolW, coolH);

  ctx.fillStyle = '#5eead4';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('HEAT REJECTION FARM', coolX + 16, coolY + 24);
  ctx.font = '9px monospace';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(config.rejectionPlant.toUpperCase(), coolX + 16, coolY + 42);
  ctx.fillText(`Dissipation: ${calc.heatDissipationTons.toLocaleString()} Tons`, coolX + 16, coolY + 58);

  // Cooler Banks with spinning fan visualizers
  for (let i = 0; i < 5; i++) {
    const by = coolY + 75 + i * 42;
    ctx.fillStyle = '#134e4a';
    ctx.fillRect(coolX + 16, by, 168, 30);

    // Fans
    for (let f = 0; f < 3; f++) {
      const fx = coolX + 45 + f * 50;
      ctx.fillStyle = '#2dd4bf';
      ctx.beginPath();
      ctx.arc(fx, by + 15, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. Connecting Flow Traces
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = -pulse;
  ctx.beginPath();
  ctx.moveTo(subX + subW, subY + 70);
  ctx.lineTo(hallX, subY + 70);
  ctx.stroke();

  // Coolant supply & return
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 6]);
  ctx.lineDashOffset = pulse;
  ctx.beginPath();
  ctx.moveTo(hallX + hallW, 160);
  ctx.lineTo(coolX, 160);
  ctx.moveTo(hallX + hallW, 260);
  ctx.lineTo(coolX, 260);
  ctx.stroke();
  ctx.setLineDash([]);
}

function renderThermalHeatmap(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: DataCenterConfig,
  calc: EngineeringCalculation,
  pulse: number
) {
  // Dark thermal background
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, w, h);

  // Gradient heat halos
  const hallX = 450, hallY = 220;

  // Compute Hall Heat Radial Gradient (Peak 45°C - 60°C core)
  const maxThermalRadius = config.coolingLoop === 'air_hvac' ? 240 : 160;
  const gradient = ctx.createRadialGradient(hallX, hallY, 20, hallX, hallY, maxThermalRadius);
  if (config.coolingLoop === 'air_hvac') {
    // Severe thermal runaway heat signature
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.85)'); // Hot red
    gradient.addColorStop(0.3, 'rgba(249, 115, 22, 0.7)'); // Orange
    gradient.addColorStop(0.6, 'rgba(234, 179, 8, 0.4)'); // Yellow
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  } else {
    // Controlled direct-to-chip heat signature
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.75)'); // Controlled core heat
    gradient.addColorStop(0.4, 'rgba(59, 130, 246, 0.4)'); // Fast coolant absorption
    gradient.addColorStop(0.8, 'rgba(16, 185, 129, 0.2)'); // Liquid return
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  }

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(hallX, hallY, maxThermalRadius, 0, Math.PI * 2);
  ctx.fill();

  // Substation transformer thermal spots
  for (let i = 0; i < 3; i++) {
    const tx = 130;
    const ty = 120 + i * 40;
    const gTx = ctx.createRadialGradient(tx, ty, 5, tx, ty, 45);
    gTx.addColorStop(0, 'rgba(249, 115, 22, 0.8)');
    gTx.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gTx;
    ctx.beginPath();
    ctx.arc(tx, ty, 45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Heat Rejection Dry Coolers (Exhaust heat plume)
  const coolGradient = ctx.createRadialGradient(780, 220, 20, 780, 220, 140);
  coolGradient.addColorStop(0, 'rgba(234, 179, 8, 0.6)');
  coolGradient.addColorStop(0.7, 'rgba(6, 182, 212, 0.3)');
  coolGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coolGradient;
  ctx.beginPath();
  ctx.arc(780, 220, 140, 0, Math.PI * 2);
  ctx.fill();

  // Overlay FLIR Thermographic Legend
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('FLIR THERMOGRAPHY SIMULATION [32°C - 78°C]', 30, 35);
  ctx.font = '10px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`Peak Compute Core: ${config.coolingLoop === 'air_hvac' ? '86.4°C [ALERT: CRITICAL]' : '42.8°C [NOMINAL]'}`, 30, 52);
  ctx.fillText(`Secondary Fluid Delta T: 14.2°C · CDU Primary Flow: ${calc.totalCoolantFlowGPM.toLocaleString()} GPM`, 30, 68);

  // Draw thermal bar scale
  const barX = 30, barY = 380, barW = 240, barH = 12;
  const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
  barGrad.addColorStop(0, '#3b82f6');
  barGrad.addColorStop(0.35, '#10b981');
  barGrad.addColorStop(0.7, '#eab308');
  barGrad.addColorStop(1, '#ef4444');
  ctx.fillStyle = barGrad;
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '9px monospace';
  ctx.fillText('20°C', barX, barY + 24);
  ctx.fillText('40°C', barX + 75, barY + 24);
  ctx.fillText('60°C', barX + 150, barY + 24);
  ctx.fillText('85°C+', barX + barW - 25, barY + 24);
}

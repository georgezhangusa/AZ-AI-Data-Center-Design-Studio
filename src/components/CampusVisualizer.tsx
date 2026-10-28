import React, { useEffect, useRef, useState } from 'react';
import { DataCenterConfig, EngineeringCalculation } from '../types/datacenter';
import { Eye, Layers, Moon, RotateCcw, Sun, Thermometer, ZoomIn, ZoomOut } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface CampusVisualizerProps {
  config: DataCenterConfig;
  calc: EngineeringCalculation;
}

type ViewMode = 'isometric' | 'topdown' | 'thermal';

export const CampusVisualizer: React.FC<CampusVisualizerProps> = ({ config, calc }) => {
  const { t, lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('isometric');
  const [canvasTheme, setCanvasTheme] = useState<'light' | 'dark'>('light');
  const [zoom, setZoom] = useState<number>(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pulseOffsetRef = useRef<number>(0);
  const fanRotationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const isLight = canvasTheme === 'light';

    const render = () => {
      if (!isRunning) return;
      pulseOffsetRef.current = (pulseOffsetRef.current + 0.5) % 36;
      fanRotationRef.current = (fanRotationRef.current + 0.08) % (Math.PI * 2);

      // Hi-DPI Retina Display Crispness
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const displayWidth = Math.round(rect.width || 920);
      const displayHeight = Math.round(rect.height || 440);

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Map from virtual 920x440 coordinate system to actual element size
      const scaleX = displayWidth / 920;
      const scaleY = displayHeight / 440;
      ctx.scale(scaleX, scaleY);

      const w = 920;
      const h = 440;

      ctx.clearRect(0, 0, w, h);

      // Canvas background (clean light drafting paper or dark cyber aesthetic)
      const bgGradient = ctx.createRadialGradient(w * 0.5, h * 0.45, 60, w * 0.5, h * 0.5, w * 0.65);
      if (viewMode === 'thermal') {
        if (isLight) {
          bgGradient.addColorStop(0, '#f8fafc');
          bgGradient.addColorStop(1, '#f1f5f9');
        } else {
          bgGradient.addColorStop(0, '#0a0d18');
          bgGradient.addColorStop(1, '#020409');
        }
      } else {
        if (isLight) {
          bgGradient.addColorStop(0, '#ffffff');
          bgGradient.addColorStop(1, '#f1f5f9');
        } else {
          bgGradient.addColorStop(0, '#0f172a');
          bgGradient.addColorStop(1, '#020617');
        }
      }
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);

      // Subtle CAD Blueprint grid
      ctx.save();
      ctx.strokeStyle = isLight
        ? (viewMode === 'thermal' ? 'rgba(100, 116, 139, 0.12)' : 'rgba(148, 163, 184, 0.28)')
        : (viewMode === 'thermal' ? 'rgba(56, 189, 248, 0.04)' : 'rgba(56, 189, 248, 0.07)');
      ctx.lineWidth = 1;
      const gridSize = 28;
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

      // Micro grid crosshairs
      ctx.fillStyle = isLight ? 'rgba(100, 116, 139, 0.25)' : 'rgba(148, 163, 184, 0.15)';
      for (let x = gridSize * 2; x < w; x += gridSize * 4) {
        for (let y = gridSize * 2; y < h; y += gridSize * 4) {
          ctx.fillRect(x - 2, y, 5, 1);
          ctx.fillRect(x, y - 2, 1, 5);
        }
      }
      ctx.restore();

      // Apply Interactive Zoom centered on viewport
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-w / 2, -h / 2);

      if (viewMode === 'isometric') {
        renderIsometricCampus(ctx, w, h, config, calc, pulseOffsetRef.current, fanRotationRef.current, selectedZone, isLight);
      } else if (viewMode === 'topdown') {
        renderTopDownSitePlan(ctx, w, h, config, calc, pulseOffsetRef.current, fanRotationRef.current, selectedZone, isLight);
      } else {
        renderThermalHeatmap(ctx, w, h, config, calc, pulseOffsetRef.current, isLight);
      }

      ctx.restore(); // Undo zoom
      ctx.restore(); // Undo dpr and virtual scaling

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config, calc, viewMode, zoom, selectedZone, canvasTheme]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 920;
    const y = ((e.clientY - rect.top) / rect.height) * 440;

    if (viewMode === 'isometric') {
      if (x >= 630) {
        setSelectedZone(prev => prev === 'cooling' ? null : 'cooling');
      } else if (x >= 380 && y >= 140) {
        setSelectedZone(prev => prev === 'white_space' ? null : 'white_space');
      } else if (x < 380 && y >= 110) {
        setSelectedZone(prev => prev === 'btm' ? null : 'btm');
      } else if (y < 160 && x >= 320 && x < 520) {
        setSelectedZone(prev => prev === 'substation' ? null : 'substation');
      } else {
        setSelectedZone(null);
      }
    } else {
      if (x < 265 && y < 220) {
        setSelectedZone(prev => prev === 'substation' ? null : 'substation');
      } else if (x < 265 && y >= 220) {
        setSelectedZone(prev => prev === 'btm' ? null : 'btm');
      } else if (x >= 265 && x <= 655) {
        setSelectedZone(prev => prev === 'white_space' ? null : 'white_space');
      } else if (x > 655) {
        setSelectedZone(prev => prev === 'cooling' ? null : 'cooling');
      } else {
        setSelectedZone(null);
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Visualizer Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg">
          <button
            onClick={() => setViewMode('isometric')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-75 flex items-center gap-1.5 cursor-pointer select-none ${
              viewMode === 'isometric'
                ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold border border-blue-600 border-b-[2px] border-b-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {t.deliverables.visualizerIsometric}
          </button>
          <button
            onClick={() => setViewMode('topdown')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-75 flex items-center gap-1.5 cursor-pointer select-none ${
              viewMode === 'topdown'
                ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold border border-blue-600 border-b-[2px] border-b-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {t.deliverables.visualizerSite}
          </button>
          <button
            onClick={() => setViewMode('thermal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-75 flex items-center gap-1.5 cursor-pointer select-none ${
              viewMode === 'thermal'
                ? 'bg-gradient-to-b from-red-500 to-red-600 text-white font-bold border border-red-600 border-b-[2px] border-b-red-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            {t.deliverables.visualizerThermal}
          </button>
        </div>

        {/* Zoom & Viewport Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Canvas Theme Toggle */}
          <button
            onClick={() => setCanvasTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5 active:translate-y-[1px]"
            title={canvasTheme === 'light' ? t.deliverables.darkCanvas : t.deliverables.lightCanvas}
          >
            {canvasTheme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[11px] font-medium hidden sm:inline">{t.deliverables.darkCanvas}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-medium hidden sm:inline">{t.deliverables.lightCanvas}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setZoom(prev => Math.min(1.8, +(prev + 0.15).toFixed(2)))}
            className="p-1.5 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg transition shadow-xs cursor-pointer active:translate-y-[1px]"
            title={t.deliverables.zoomIn}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.7, +(prev - 0.15).toFixed(2)))}
            className="p-1.5 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg transition shadow-xs cursor-pointer active:translate-y-[1px]"
            title={t.deliverables.zoomOut}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setZoom(1); setSelectedZone(null); }}
            className="p-1.5 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg transition shadow-xs cursor-pointer active:translate-y-[1px]"
            title={lang === 'zh' ? '重置视角' : lang === 'fr' ? 'Réinitialiser la vue' : 'Reset View'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-slate-500 font-mono pl-1 text-[11px] font-semibold">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Canvas Viewport Container */}
      <div className={`relative rounded-2xl overflow-hidden transition-colors duration-200 ${
        canvasTheme === 'light'
          ? 'border border-slate-300 bg-slate-100 shadow-md ring-1 ring-slate-900/5'
          : 'border border-slate-800/80 bg-slate-950 shadow-2xl ring-1 ring-white/10'
      } group`}>
        <canvas
          ref={canvasRef}
          width={920}
          height={440}
          onClick={handleCanvasClick}
          className="w-full h-auto cursor-crosshair block aspect-[920/440]"
        />

        {/* Tactical HUD Header */}
        <div className={`absolute top-3 left-3 backdrop-blur-md rounded-xl p-3 text-[11px] space-y-1.5 pointer-events-none transition-colors ${
          canvasTheme === 'light'
            ? 'bg-white/92 border border-slate-200 shadow-lg text-slate-800 ring-1 ring-slate-900/5'
            : 'bg-slate-900/90 border border-slate-700/80 shadow-lg text-white ring-1 ring-white/5'
        }`}>
          <div className={`font-bold flex items-center gap-2 ${canvasTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
            <span>{lang === 'zh' ? '园区总负荷' : lang === 'fr' ? 'Puissance du site' : 'Facility Load'}: <strong className={canvasTheme === 'light' ? 'text-emerald-600 font-mono' : 'text-emerald-400 font-mono'}>{calc.facilityTotalLoadMW} MW</strong></span>
            <span className="text-slate-400 font-normal">| PUE <strong className={canvasTheme === 'light' ? 'text-blue-600 font-mono' : 'text-blue-400 font-mono'}>{calc.pue}</strong></span>
          </div>
          <div className={`font-mono text-[10px] flex items-center gap-2 ${canvasTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
            <span>{lang === 'zh' ? '关键IT负荷' : lang === 'fr' ? 'IT critique' : 'Critical IT'}: <span className={`${canvasTheme === 'light' ? 'text-blue-600' : 'text-cyan-300'} font-bold`}>{calc.criticalITLoadMW.toFixed(1)} MW</span></span>
            <span>·</span>
            <span>{lang === 'zh' ? '机柜数' : lang === 'fr' ? 'Baies' : 'Racks'}: <span className={`${canvasTheme === 'light' ? 'text-slate-800' : 'text-slate-100'} font-bold`}>{calc.totalRacks}</span></span>
            <span>·</span>
            <span>{lang === 'zh' ? '占地' : lang === 'fr' ? 'Superficie' : 'Footprint'}: <span className={`${canvasTheme === 'light' ? 'text-slate-800' : 'text-slate-100'} font-bold`}>{Math.round(calc.totalFootprintSqFt / 1000)}k sq ft</span></span>
          </div>
          <div className={`text-[10px] flex items-center gap-1.5 pt-0.5 border-t ${canvasTheme === 'light' ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
            <span className={canvasTheme === 'light' ? 'text-blue-600 font-mono' : 'text-blue-400 font-mono'}>▸</span>
            <span>{lang === 'zh' ? '点击下方任意分区查看实时工程遥测数据' : lang === 'fr' ? 'Cliquez sur une zone ci-dessous pour inspecter les données en direct' : 'Click any sector below to inspect real-time engineering telemetry'}</span>
          </div>
        </div>

        {/* Viewport Live Telemetry Chip */}
        <div className={`absolute top-3 right-3 backdrop-blur rounded-lg px-2.5 py-1 text-[10px] font-mono pointer-events-none flex items-center gap-2 shadow-xs transition-colors ${
          canvasTheme === 'light'
            ? 'bg-white/90 border border-slate-200 text-slate-700'
            : 'bg-slate-900/80 border border-slate-700/80 text-slate-300'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
          <span>{lang === 'zh' ? 'BIM 3D 引擎 · 运行中' : lang === 'fr' ? 'MOTEUR BIM 3D · EN DIRECT' : 'BIM 3D ENGINE · LIVE'}</span>
        </div>

        {/* Selected Zone Inspector Overlay */}
        {selectedZone && (
          <div className={`absolute bottom-3 left-3 right-3 backdrop-blur-md rounded-xl p-3.5 shadow-xl flex items-center justify-between animate-fadeIn transition-colors ${
            canvasTheme === 'light'
              ? 'bg-white/95 border border-blue-400/80 ring-1 ring-blue-500/20 text-slate-800'
              : 'bg-slate-900/95 border border-blue-500/80 ring-1 ring-blue-500/30 text-white'
          }`}>
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border ${
                  canvasTheme === 'light'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                }`}>
                  {lang === 'zh' ? '分区遥测' : lang === 'fr' ? 'Télémétrie secteur' : 'Sector Telemetry'}
                </span>
                <span className={`text-xs font-bold ${canvasTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {selectedZone === 'substation' && (lang === 'zh' ? `高压变电站配电场 (${config.substationType.toUpperCase()} - ${calc.facilityTotalLoadMW} MVA)` : lang === 'fr' ? `Poste haute tension (${config.substationType.toUpperCase()} - ${calc.facilityTotalLoadMW} MVA)` : `High-Voltage Substation Yard (${config.substationType.toUpperCase()} - ${calc.facilityTotalLoadMW} MVA)`)}
                  {selectedZone === 'btm' && (lang === 'zh' ? `表后自备发电与储能站 (${config.btmPower.toUpperCase()} + ${config.bessType.toUpperCase()})` : lang === 'fr' ? `Génération sur site & BESS (${config.btmPower.toUpperCase()} + ${config.bessType.toUpperCase()})` : `BTM Power & Energy Storage Yard (${config.btmPower.toUpperCase()} + ${config.bessType.toUpperCase()})`)}
                  {selectedZone === 'white_space' && (lang === 'zh' ? `高密算力主机房 (${calc.totalRacks} 机柜 · ${calc.rackDensityKW} kW/机柜)` : lang === 'fr' ? `Salle blanche haute densité (${calc.totalRacks} baies · ${calc.rackDensityKW} kW/baie)` : `High-Density Compute White Space (${calc.totalRacks} Racks · ${calc.rackDensityKW} kW/rack)`)}
                  {selectedZone === 'cooling' && (lang === 'zh' ? `中央散热水冷与排热场 (${config.rejectionPlant.toUpperCase()} · ${calc.heatDissipationTons.toLocaleString()} 冷吨)` : lang === 'fr' ? `Centrale de rejet thermique (${config.rejectionPlant.toUpperCase()} · ${calc.heatDissipationTons.toLocaleString()} Tonnes)` : `Central Heat Rejection Farm (${config.rejectionPlant.toUpperCase()} · ${calc.heatDissipationTons.toLocaleString()} Tons)`)}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed ${canvasTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                {selectedZone === 'substation' && (lang === 'zh'
                  ? `双路 115kV/230kV 降压至 34.5kV。变电站占地面积：${calc.substationYardSqFt.toLocaleString()} 平方英尺。配备双重冗余变压器间隔、集油池以及防火防爆隔墙。`
                  : lang === 'fr'
                  ? `Double alimentation 115kV/230kV abaisseur vers 34,5kV. Emprise du poste: ${calc.substationYardSqFt.toLocaleString()} sq ft. Baies de transformateurs redondantes avec bacs de rétention et murs coupe-feu.`
                  : `Dual-fed 115kV/230kV step-down to 34.5kV. Substation yard footprint: ${calc.substationYardSqFt.toLocaleString()} sq ft. Dual redundant transformer bays with oil containment trenches and blast mitigation firewalls.`)}
                {selectedZone === 'btm' && (lang === 'zh'
                  ? `具备即时爬坡调频功能的厂区并网分布式发电机组，配合锂电/飞轮储能系统，实现微电网级快速无缝切岛运行与电网电压支撑。`
                  : lang === 'fr'
                  ? `Génération rapide sur site couplée à un stockage d'énergie par batterie pour synchronisation instantanée et stabilisation de fréquence en îlotage.`
                  : `On-site fast-track generation with ride-through battery storage sized for instantaneous ramp synchronization and microgrid frequency stabilization.`)}
                {selectedZone === 'white_space' && (lang === 'zh'
                  ? `芯片级液冷二次循环回路，配置 ${config.serverPower === '800vdc' ? '800V DC 直流母线' : '480V AC 交流配电'} 及 ${calc.structuralSlabLoadPcf} 磅/平方英尺承重楼板。全封闭热通道与双重冗余 CDU 冷却动力分配。`
                  : lang === 'fr'
                  ? `Boucle secondaire de liquide direct-on-chip avec ${config.serverPower === '800vdc' ? 'busway central 800V CC' : 'distribution 480V CA'} et dalle portante de ${calc.structuralSlabLoadPcf} lbs/sq ft. Confinement en allée chaude avec CDU redondants.`
                  : `Direct-to-chip secondary fluid loop with ${config.serverPower === '800vdc' ? '800V DC central busway' : '480V AC distribution'} and ${calc.structuralSlabLoadPcf} lbs/sq ft structural slab rating. Hot aisle containment with dual redundant CDU distribution.`)}
                {selectedZone === 'cooling' && (lang === 'zh'
                  ? `水资源利用效率达 ${calc.wue} L/kWh，总冷媒循环流量达 ${calc.totalCoolantFlowGPM.toLocaleString()} GPM。变频绝热干冷器配合环境干球温度智能自适应调度。`
                  : lang === 'fr'
                  ? `Système de refroidissement fonctionnant avec un WUE de ${calc.wue} L/kWh et un débit total de ${calc.totalCoolantFlowGPM.toLocaleString()} GPM. Aéroréfrigérants adiabatiques à variateurs de fréquence.`
                  : `Cooling system operating at ${calc.wue} L/kWh WUE with total circulation flow of ${calc.totalCoolantFlowGPM.toLocaleString()} GPM. Variable frequency drive adiabatic dry coolers with intelligent ambient dry-bulb optimization.`)}
              </p>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className={`text-xs px-3 py-1.5 rounded-lg transition ml-4 shrink-0 cursor-pointer ${
                canvasTheme === 'light'
                  ? 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300'
                  : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {lang === 'zh' ? '关闭' : lang === 'fr' ? 'Fermer' : 'Dismiss'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ISOMETRIC RENDERING ROUTINE ---

function renderIsometricCampus(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: DataCenterConfig,
  calc: EngineeringCalculation,
  pulse: number,
  fanRotation: number,
  selectedZone: string | null,
  isLight: boolean
) {
  // Center projection origin - shifted downward so rear structures are fully visible
  const originX = w * 0.49;
  const originY = h * 0.41;

  const toIso = (x: number, y: number, z: number) => {
    const isoX = originX + (x - y) * 1.12;
    const isoY = originY + (x + y) * 0.54 - z * 0.95;
    return { x: isoX, y: isoY };
  };

  // Helper: Draw 3D Box with realistic lighting, bevels, and drop shadow
  const drawIsoBox = (
    x: number, y: number, z: number,
    wBox: number, lBox: number, hBox: number,
    topColor: string, leftColor: string, rightColor: string,
    isSelected: boolean,
    castShadow = true
  ) => {
    // Ground Contact Drop Shadow
    if (castShadow && z <= 0.5) {
      ctx.save();
      ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.16)' : 'rgba(2, 6, 23, 0.65)';
      ctx.filter = isLight ? 'blur(8px)' : 'blur(6px)';
      const s1 = toIso(x - 6, y + lBox + 10, 0);
      const s2 = toIso(x + wBox + 14, y + lBox + 10, 0);
      const s3 = toIso(x + wBox + 14, y - 6, 0);
      const s4 = toIso(x - 6, y - 6, 0);
      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
      ctx.lineTo(s3.x, s3.y);
      ctx.lineTo(s4.x, s4.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Vertices
    const p1 = toIso(x, y, z + hBox);
    const p2 = toIso(x + wBox, y, z + hBox);
    const p3 = toIso(x + wBox, y + lBox, z + hBox);
    const p4 = toIso(x, y + lBox, z + hBox);

    const b1 = toIso(x, y + lBox, z);
    const b2 = toIso(x + wBox, y + lBox, z);
    const b3 = toIso(x + wBox, y, z);

    // Left face (Ambient shadow side)
    ctx.fillStyle = leftColor;
    ctx.beginPath();
    ctx.moveTo(p4.x, p4.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.lineTo(b1.x, b1.y);
    ctx.closePath();
    ctx.fill();

    // Right face (Direct light side)
    ctx.fillStyle = rightColor;
    ctx.beginPath();
    ctx.moveTo(p3.x, p3.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(b3.x, b3.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.closePath();
    ctx.fill();

    // Top face (Skylight)
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();

    // Subtle edge highlight
    ctx.strokeStyle = isSelected
      ? '#2563eb'
      : isLight
      ? 'rgba(15, 23, 42, 0.14)'
      : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = isSelected ? 2.5 : 0.8;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(p3.x, p3.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.stroke();
  };

  // 1. Campus Site Ground Pad
  const groundCorners = [
    toIso(-160, -130, 0),
    toIso(255, -130, 0),
    toIso(255, 180, 0),
    toIso(-160, 180, 0)
  ];

  // Ground Outer Landscape Rim
  ctx.fillStyle = isLight ? '#e2e8f0' : '#081222';
  ctx.beginPath();
  ctx.moveTo(groundCorners[0].x, groundCorners[0].y);
  ctx.lineTo(groundCorners[1].x, groundCorners[1].y);
  ctx.lineTo(groundCorners[2].x, groundCorners[2].y);
  ctx.lineTo(groundCorners[3].x, groundCorners[3].y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = isLight ? '#cbd5e1' : '#1e3a5f';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Perimeter Service Road
  const roadCorners = [
    toIso(-150, -120, 0),
    toIso(245, -120, 0),
    toIso(245, 170, 0),
    toIso(-150, 170, 0)
  ];
  ctx.strokeStyle = isLight ? 'rgba(71, 85, 105, 0.45)' : 'rgba(148, 163, 184, 0.25)';
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(roadCorners[0].x, roadCorners[0].y);
  ctx.lineTo(roadCorners[1].x, roadCorners[1].y);
  ctx.lineTo(roadCorners[2].x, roadCorners[2].y);
  ctx.lineTo(roadCorners[3].x, roadCorners[3].y);
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);

  // Inner Concrete Foundation Slab
  const slabCorners = [
    toIso(-135, -105, 0),
    toIso(230, -105, 0),
    toIso(230, 155, 0),
    toIso(-135, 155, 0)
  ];
  ctx.fillStyle = isLight ? '#f1f5f9' : '#0f172a';
  ctx.beginPath();
  ctx.moveTo(slabCorners[0].x, slabCorners[0].y);
  ctx.lineTo(slabCorners[1].x, slabCorners[1].y);
  ctx.lineTo(slabCorners[2].x, slabCorners[2].y);
  ctx.lineTo(slabCorners[3].x, slabCorners[3].y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = isLight ? '#94a3b8' : '#334155';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 2. High Voltage Substation Yard
  const isSubSelected = selectedZone === 'substation';
  const subYardTop = isLight
    ? (isSubSelected ? '#bfdbfe' : '#e2e8f0')
    : (isSubSelected ? '#1e3a8a' : '#111e38');
  const subYardLeft = isLight
    ? (isSubSelected ? '#93c5fd' : '#cbd5e1')
    : (isSubSelected ? '#172554' : '#0b1324');
  const subYardRight = isLight
    ? (isSubSelected ? '#60a5fa' : '#dbeafe')
    : (isSubSelected ? '#2563eb' : '#1c2d52');
  drawIsoBox(-125, -95, 0, 85, 75, 8, subYardTop, subYardLeft, subYardRight, isSubSelected);

  // Substation Security Perimeter Fence Posts & Yellow Line
  const subFence = [
    toIso(-125, -95, 8),
    toIso(-40, -95, 8),
    toIso(-40, -20, 8),
    toIso(-125, -20, 8)
  ];
  ctx.strokeStyle = isLight ? '#ca8a04' : '#eab308';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(subFence[0].x, subFence[0].y);
  ctx.lineTo(subFence[1].x, subFence[1].y);
  ctx.lineTo(subFence[2].x, subFence[2].y);
  ctx.lineTo(subFence[3].x, subFence[3].y);
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);

  // Substation Power Step-Down Transformers
  for (let t = 0; t < 3; t++) {
    const tx = -112 + t * 26;
    const ty = -80;
    // Transformer main body
    drawIsoBox(tx, ty, 8, 18, 20, 20, '#3b82f6', '#1d4ed8', '#60a5fa', false, false);
    // Transformer cooling radiator fin attachments
    drawIsoBox(tx + 2, ty - 4, 8, 14, 4, 16, '#2563eb', '#1e40af', '#3b82f6', false, false);
    // Ceramic High-Voltage Bushing terminals on top
    for (let b = 0; b < 2; b++) {
      const bx = tx + 4 + b * 8;
      drawIsoBox(bx, ty + 8, 28, 4, 4, 8, '#f8fafc', '#94a3b8', '#cbd5e1', false, false);
    }
  }

  // 3. Behind-The-Meter (BTM) Generation & BESS Yard
  const isBtmSelected = selectedZone === 'btm';
  const btmYardTop = isLight
    ? (isBtmSelected ? '#e9d5ff' : '#f3e8ff')
    : (isBtmSelected ? '#581c87' : '#231138');
  const btmYardLeft = isLight
    ? (isBtmSelected ? '#d8b4fe' : '#e9d5ff')
    : (isBtmSelected ? '#3b0764' : '#140822');
  const btmYardRight = isLight
    ? (isBtmSelected ? '#c084fc' : '#fae8ff')
    : (isBtmSelected ? '#7e22ce' : '#391c5a');
  drawIsoBox(-125, 5, 0, 85, 115, 8, btmYardTop, btmYardLeft, btmYardRight, isBtmSelected);

  // Gas Turbines / Recip Engines
  if (config.btmPower !== 'grid_only') {
    for (let g = 0; g < 2; g++) {
      const gx = -110 + g * 38;
      // Turbine Enclosure
      drawIsoBox(gx, 22, 8, 28, 34, 22, '#a855f7', '#6b21a8', '#c084fc', false, false);
      // Dual Vertical Exhaust Stacks
      drawIsoBox(gx + 18, 32, 30, 6, 6, 16, '#94a3b8', '#64748b', '#cbd5e1', false, false);
      drawIsoBox(gx + 18, 44, 30, 6, 6, 16, '#94a3b8', '#64748b', '#cbd5e1', false, false);
    }
  }

  // BESS Battery Energy Storage Container Units (LFP)
  for (let b = 0; b < 3; b++) {
    const bx = -112 + b * 26;
    drawIsoBox(bx, 82, 8, 20, 28, 16, '#10b981', '#047857', '#34d399', false, false);
    // Green Battery Status Indicator Bar on Container front
    const pLed = toIso(bx + 18, 86, 20);
    ctx.fillStyle = '#34d399';
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(pLed.x, pLed.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 4. Main AI Data Hall Building (The Hero White Space Envelope)
  const isWhiteSelected = selectedZone === 'white_space';
  const hallTop = isLight
    ? (isWhiteSelected ? '#1d4ed8' : '#334155')
    : (isWhiteSelected ? '#1e40af' : '#1e293b');
  const hallLeft = isLight
    ? (isWhiteSelected ? '#1e3a8a' : '#1e293b')
    : (isWhiteSelected ? '#0f172a' : '#0c1322');
  const hallRight = isLight
    ? (isWhiteSelected ? '#2563eb' : '#475569')
    : (isWhiteSelected ? '#2563eb' : '#27354a');
  drawIsoBox(0, -60, 0, 145, 155, 52, hallTop, hallLeft, hallRight, isWhiteSelected);

  // Exterior Architectural Clerestory Windows with Glowing Server Hall Blue
  const pulseAlpha = 0.5 + Math.sin(pulse * 0.4) * 0.25;
  for (let w = 0; w < 4; w++) {
    const wx = 12 + w * 32;
    // Illuminated window strip
    ctx.save();
    ctx.fillStyle = `rgba(56, 189, 248, ${pulseAlpha})`;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    const w1 = toIso(wx, -60.2, 28);
    const w2 = toIso(wx + 22, -60.2, 28);
    const w3 = toIso(wx + 22, -60.2, 38);
    const w4 = toIso(wx, -60.2, 38);
    ctx.beginPath();
    ctx.moveTo(w1.x, w1.y);
    ctx.lineTo(w2.x, w2.y);
    ctx.lineTo(w3.x, w3.y);
    ctx.lineTo(w4.x, w4.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Rooftop Parapet Rim & Manifold Pods
  for (let i = 0; i < 4; i++) {
    const rx = 18 + i * 30;
    // Rooftop CDU / Air Handler penthouse
    drawIsoBox(rx, -46, 52, 18, 126, 6, '#475569', '#334155', '#64748b', false, false);
    // Rooftop Piping Runs
    drawIsoBox(rx + 5, -42, 58, 8, 118, 3, '#0284c7', '#0369a1', '#38bdf8', false, false);
  }

  // 5. Heat Rejection Farm (Adiabatic Dry Coolers / Cooling Towers)
  const isCoolSelected = selectedZone === 'cooling';
  const coolYardTop = isLight
    ? (isCoolSelected ? '#99f6e4' : '#ccfbf1')
    : (isCoolSelected ? '#065f46' : '#082f2c');
  const coolYardLeft = isLight
    ? (isCoolSelected ? '#5eead4' : '#99f6e4')
    : (isCoolSelected ? '#022c29' : '#031715');
  const coolYardRight = isLight
    ? (isCoolSelected ? '#2dd4bf' : '#e6fffa')
    : (isCoolSelected ? '#0d9488' : '#0d4e48');
  drawIsoBox(170, -60, 0, 55, 155, 8, coolYardTop, coolYardLeft, coolYardRight, isCoolSelected);

  // Dry Cooler Cells with Animated Rotating Fans
  for (let c = 0; c < 5; c++) {
    const cy = -46 + c * 28;
    drawIsoBox(175, cy, 8, 44, 20, 18, '#0f766e', '#115e59', '#14b8a6', false, false);

    // Fan Cowls with animated rotation
    const fanCenter = toIso(197, cy + 10, 26);
    ctx.save();
    ctx.strokeStyle = isLight ? '#0d9488' : '#2dd4bf';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(fanCenter.x, fanCenter.y, 10, 5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating blades
    ctx.strokeStyle = isLight ? '#14b8a6' : '#5eead4';
    ctx.lineWidth = 1.5;
    for (let b = 0; b < 3; b++) {
      const angle = fanRotation + (b * Math.PI * 2) / 3;
      const bx = fanCenter.x + Math.cos(angle) * 8;
      const by = fanCenter.y + Math.sin(angle) * 4;
      ctx.beginPath();
      ctx.moveTo(fanCenter.x, fanCenter.y);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 6. Glowing Animated Power Conduits (Yellow/Amber Pulse)
  const pSub = toIso(-40, -42, 10);
  const pHallPwr = toIso(0, -32, 22);

  ctx.save();
  ctx.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.4)' : 'rgba(234, 179, 8, 0.4)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(pSub.x, pSub.y);
  ctx.lineTo(pHallPwr.x, pHallPwr.y);
  ctx.stroke();

  // Glowing traveling power particles
  ctx.strokeStyle = isLight ? '#b45309' : '#fef08a';
  ctx.shadowColor = isLight ? '#d97706' : '#eab308';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([8, 14]);
  ctx.lineDashOffset = -pulse;
  ctx.beginPath();
  ctx.moveTo(pSub.x, pSub.y);
  ctx.lineTo(pHallPwr.x, pHallPwr.y);
  ctx.stroke();
  ctx.restore();

  // 7. Glowing Animated Coolant Fluid Conduits (Cyan Supply / Return)
  const pHallCoolSupply = toIso(145, 15, 18);
  const pCoolFarmSupply = toIso(170, 15, 18);

  const pHallCoolReturn = toIso(145, 45, 18);
  const pCoolFarmReturn = toIso(170, 45, 18);

  ctx.save();
  // Supply loop
  ctx.strokeStyle = isLight ? '#0284c7' : '#06b6d4';
  ctx.shadowColor = isLight ? '#38bdf8' : '#22d3ee';
  ctx.shadowBlur = 8;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([7, 10]);
  ctx.lineDashOffset = pulse;
  ctx.beginPath();
  ctx.moveTo(pHallCoolSupply.x, pHallCoolSupply.y);
  ctx.lineTo(pCoolFarmSupply.x, pCoolFarmSupply.y);
  ctx.stroke();

  // Return loop
  ctx.strokeStyle = isLight ? '#1d4ed8' : '#3b82f6';
  ctx.shadowColor = isLight ? '#60a5fa' : '#60a5fa';
  ctx.shadowBlur = 6;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([7, 10]);
  ctx.lineDashOffset = -pulse;
  ctx.beginPath();
  ctx.moveTo(pHallCoolReturn.x, pHallCoolReturn.y);
  ctx.lineTo(pCoolFarmReturn.x, pCoolFarmReturn.y);
  ctx.stroke();
  ctx.restore();

  // 8. Architectural Perspective Sector Badges & Labels
  ctx.save();
  // Substation
  const subLabelPos = toIso(-80, -98, 26);
  drawTechTag(ctx, subLabelPos.x, subLabelPos.y, 'HV SUBSTATION', `${calc.facilityTotalLoadMW} MVA`, '#3b82f6', isLight);

  // AI Data Hall
  const hallLabelPos = toIso(72, -62, 62);
  drawTechTag(ctx, hallLabelPos.x, hallLabelPos.y, `AI DATA HALL`, `${calc.totalRacks} RACKS · ${calc.rackDensityKW} kW`, isLight ? '#0284c7' : '#38bdf8', isLight);

  // Heat Rejection
  const coolLabelPos = toIso(198, -62, 34);
  drawTechTag(ctx, coolLabelPos.x, coolLabelPos.y, 'HEAT REJECTION', `${calc.heatDissipationTons.toLocaleString()} TONS`, isLight ? '#0d9488' : '#14b8a6', isLight);

  // BTM Generation
  const btmLabelPos = toIso(-80, 8, 22);
  drawTechTag(ctx, btmLabelPos.x, btmLabelPos.y, 'BTM & BESS', `${config.btmPower.toUpperCase()}`, isLight ? '#7e22ce' : '#a855f7', isLight);
  ctx.restore();
}

// Tech Callout Tag Helper
function drawTechTag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  title: string,
  subtitle: string,
  accentColor: string,
  isLight: boolean
) {
  ctx.save();
  ctx.font = 'bold 9px monospace';
  const titleWidth = ctx.measureText(title).width;
  ctx.font = '8px monospace';
  const subWidth = ctx.measureText(subtitle).width;
  const boxWidth = Math.max(titleWidth, subWidth) + 16;
  const boxHeight = 24;

  const bx = x - boxWidth / 2;
  const by = y - boxHeight / 2;

  // Drop shadow
  ctx.shadowColor = isLight ? 'rgba(15, 23, 42, 0.14)' : 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = isLight ? 6 : 4;
  ctx.shadowOffsetY = isLight ? 2 : 1;

  // Background
  ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(15, 23, 42, 0.88)';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(bx, by, boxWidth, boxHeight, 4);
  ctx.fill();
  ctx.stroke();

  // Reset shadow for text
  ctx.shadowColor = 'transparent';

  // Texts
  ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
  ctx.font = 'bold 9px monospace';
  ctx.fillText(title, bx + 8, by + 10);
  ctx.fillStyle = accentColor;
  ctx.font = '8px monospace';
  ctx.fillText(subtitle, bx + 8, by + 20);
  ctx.restore();
}

// --- 2D SITE PLAN BLUEPRINT ROUTINE ---

function renderTopDownSitePlan(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: DataCenterConfig,
  calc: EngineeringCalculation,
  pulse: number,
  fanRotation: number,
  selectedZone: string | null,
  isLight: boolean
) {
  // Main Data Hall Dimensions
  const hallX = 265, hallY = 65, hallW = 390, hallH = 310;
  const isHallSel = selectedZone === 'white_space';

  // White Space Envelope
  ctx.save();
  ctx.fillStyle = isLight
    ? (isHallSel ? '#e2e8f0' : '#ffffff')
    : (isHallSel ? '#1e293b' : '#0f172a');
  ctx.strokeStyle = isLight
    ? (isHallSel ? '#2563eb' : '#94a3b8')
    : (isHallSel ? '#60a5fa' : '#334155');
  ctx.lineWidth = 2;
  ctx.fillRect(hallX, hallY, hallW, hallH);
  ctx.strokeRect(hallX, hallY, hallW, hallH);

  // Dimension lines & architectural markers
  ctx.strokeStyle = isLight ? 'rgba(71, 85, 105, 0.4)' : 'rgba(148, 163, 184, 0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(hallX, hallY - 14);
  ctx.lineTo(hallX + hallW, hallY - 14);
  ctx.moveTo(hallX + hallW + 14, hallY);
  ctx.lineTo(hallX + hallW + 14, hallY + hallH);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = isLight ? '#475569' : '#94a3b8';
  ctx.font = '9px monospace';
  ctx.fillText("380'-0\" WHITE SPACE SPAN", hallX + hallW / 2 - 65, hallY - 18);

  // Server Rack Arrays (Hot Aisle / Cold Aisle pods)
  const rows = 7;
  const cols = 12;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rx = hallX + 32 + c * 27;
      const ry = hallY + 38 + r * 37;
      ctx.fillStyle = config.coolingLoop === 'air_hvac' ? '#475569' : '#0284c7';
      ctx.fillRect(rx, ry, 19, 23);

      // Blinking rack activity LED
      ctx.fillStyle = (r + c + Math.floor(pulse / 4)) % 3 === 0 ? '#38bdf8' : '#0369a1';
      ctx.fillRect(rx + 2, ry + 2, 4, 3);
    }
  }

  // CDU Distribution Lineup
  for (let cdu = 0; cdu < 6; cdu++) {
    const cduY = hallY + 38 + cdu * 43;
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(hallX + hallW - 24, cduY, 15, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px monospace';
    ctx.fillText('CDU', hallX + hallW - 22, cduY + 16);
  }

  // Hall Title & Engineering Specs
  ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(`COMPUTE WHITE SPACE: ${calc.totalRacks} RACKS · ${config.gpuType.toUpperCase()}`, hallX + 24, hallY + 22);
  ctx.font = '10px monospace';
  ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
  ctx.fillText(`${config.serverPower === '800vdc' ? '800V DC BUSWAY' : '480V AC BUS'} · ${calc.whiteSpaceSqFt.toLocaleString()} SQ FT · ${calc.rackDensityKW} kW/RACK`, hallX + 24, hallY + hallH - 12);
  ctx.restore();

  // 2. High Voltage Substation Yard
  const subX = 35, subY = 65, subW = 190, subH = 140;
  const isSubSel = selectedZone === 'substation';
  ctx.save();
  ctx.fillStyle = isLight ? (isSubSel ? '#dbeafe' : '#eff6ff') : (isSubSel ? '#172554' : '#0b1329');
  ctx.strokeStyle = isLight ? '#3b82f6' : (isSubSel ? '#60a5fa' : '#1d4ed8');
  ctx.lineWidth = 1.5;
  ctx.fillRect(subX, subY, subW, subH);
  ctx.strokeRect(subX, subY, subW, subH);

  ctx.fillStyle = isLight ? '#1e40af' : '#93c5fd';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('HV SUBSTATION YARD', subX + 14, subY + 22);
  ctx.font = '9px monospace';
  ctx.fillStyle = isLight ? '#475569' : '#cbd5e1';
  ctx.fillText(`115kV/34.5kV [${config.transformerType.toUpperCase()}]`, subX + 14, subY + 38);
  ctx.fillText(`Utility Cap: ${calc.facilityTotalLoadMW} MVA`, subX + 14, subY + 52);

  // Transformers
  for (let t = 0; t < 3; t++) {
    const tx = subX + 16 + t * 56;
    const ty = subY + 70;
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(tx, ty, 46, 46);
    ctx.strokeStyle = '#60a5fa';
    ctx.strokeRect(tx, ty, 46, 46);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`TX-${t + 1}`, tx + 12, ty + 26);
  }
  ctx.restore();

  // 3. BTM Generation & BESS Yard
  const btmX = 35, btmY = 230, btmW = 190, btmH = 145;
  const isBtmSel = selectedZone === 'btm';
  ctx.save();
  ctx.fillStyle = isLight ? (isBtmSel ? '#f3e8ff' : '#faf5ff') : (isBtmSel ? '#3b0764' : '#180728');
  ctx.strokeStyle = isLight ? '#a855f7' : (isBtmSel ? '#c084fc' : '#7e22ce');
  ctx.lineWidth = 1.5;
  ctx.fillRect(btmX, btmY, btmW, btmH);
  ctx.strokeRect(btmX, btmY, btmW, btmH);

  ctx.fillStyle = isLight ? '#6b21a8' : '#e9d5ff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('BTM GENERATION & BESS', btmX + 14, btmY + 22);
  ctx.font = '9px monospace';
  ctx.fillStyle = isLight ? '#475569' : '#cbd5e1';
  ctx.fillText(`Gen: ${config.btmPower.toUpperCase()} · ${config.bessType.toUpperCase()}`, btmX + 14, btmY + 38);

  // Turbine Skid & BESS
  ctx.fillStyle = '#9333ea';
  ctx.fillRect(btmX + 14, btmY + 56, 75, 68);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(btmX + 100, btmY + 56, 75, 68);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px monospace';
  ctx.fillText('TURBINE', btmX + 26, btmY + 94);
  ctx.fillText('BESS LFP', btmX + 112, btmY + 94);
  ctx.restore();

  // 4. Heat Rejection Farm
  const coolX = 690, coolY = 65, coolW = 195, coolH = 310;
  const isCoolSel = selectedZone === 'cooling';
  ctx.save();
  ctx.fillStyle = isLight ? (isCoolSel ? '#ccfbf1' : '#f0fdfa') : (isCoolSel ? '#042f2e' : '#031918');
  ctx.strokeStyle = isLight ? '#0f766e' : (isCoolSel ? '#2dd4bf' : '#0f766e');
  ctx.lineWidth = 1.5;
  ctx.fillRect(coolX, coolY, coolW, coolH);
  ctx.strokeRect(coolX, coolY, coolW, coolH);

  ctx.fillStyle = isLight ? '#0f766e' : '#5eead4';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('HEAT REJECTION FARM', coolX + 16, coolY + 22);
  ctx.font = '9px monospace';
  ctx.fillStyle = isLight ? '#475569' : '#cbd5e1';
  ctx.fillText(`${config.rejectionPlant.toUpperCase()} · ${calc.heatDissipationTons.toLocaleString()} TONS`, coolX + 16, coolY + 38);

  // Cooler Banks with Animated Fans
  for (let i = 0; i < 5; i++) {
    const by = coolY + 58 + i * 48;
    ctx.fillStyle = isLight ? '#0d9488' : '#134e4a';
    ctx.fillRect(coolX + 14, by, 168, 38);

    for (let f = 0; f < 3; f++) {
      const fx = coolX + 42 + f * 52;
      const fy = by + 19;
      ctx.fillStyle = '#2dd4bf';
      ctx.beginPath();
      ctx.arc(fx, fy, 11, 0, Math.PI * 2);
      ctx.fill();

      // Fan blade motion
      ctx.strokeStyle = '#0f766e';
      ctx.lineWidth = 2;
      for (let b = 0; b < 4; b++) {
        const angle = fanRotation + (b * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx + Math.cos(angle) * 9, fy + Math.sin(angle) * 9);
        ctx.stroke();
      }
    }
  }
  ctx.restore();

  // 5. Interconnect Buses with Animated Pulse
  ctx.save();
  // Power bus
  ctx.strokeStyle = isLight ? '#d97706' : '#eab308';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = -pulse;
  ctx.beginPath();
  ctx.moveTo(subX + subW, subY + 70);
  ctx.lineTo(hallX, subY + 70);
  ctx.stroke();

  // Coolant supply & return
  ctx.strokeStyle = isLight ? '#0284c7' : '#06b6d4';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 6]);
  ctx.lineDashOffset = pulse;
  ctx.beginPath();
  ctx.moveTo(hallX + hallW, 160);
  ctx.lineTo(coolX, 160);
  ctx.moveTo(hallX + hallW, 260);
  ctx.lineTo(coolX, 260);
  ctx.stroke();
  ctx.restore();
}

// --- THERMAL FLIR SIMULATION ROUTINE ---

function renderThermalHeatmap(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: DataCenterConfig,
  calc: EngineeringCalculation,
  pulse: number,
  isLight: boolean
) {
  // Thermographic background
  ctx.fillStyle = isLight ? '#f8fafc' : '#02040a';
  ctx.fillRect(0, 0, w, h);

  const hallX = 460, hallY = 220;

  // High-Density Core Heat Dissipation Radial Gradient
  const maxThermalRadius = config.coolingLoop === 'air_hvac' ? 250 : 170;
  const gradient = ctx.createRadialGradient(hallX, hallY, 15, hallX, hallY, maxThermalRadius);
  if (config.coolingLoop === 'air_hvac') {
    // Air cooling bottleneck thermal spread
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.95)');
    gradient.addColorStop(0.35, 'rgba(249, 115, 22, 0.8)');
    gradient.addColorStop(0.65, 'rgba(234, 179, 8, 0.45)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  } else {
    // Direct-to-chip controlled liquid heat extraction
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.85)');
    gradient.addColorStop(0.3, 'rgba(234, 179, 8, 0.5)');
    gradient.addColorStop(0.6, 'rgba(6, 182, 212, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  }

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(hallX, hallY, maxThermalRadius, 0, Math.PI * 2);
  ctx.fill();

  // Transformer Heat Hotspots
  for (let i = 0; i < 3; i++) {
    const tx = 135;
    const ty = 125 + i * 44;
    const gTx = ctx.createRadialGradient(tx, ty, 6, tx, ty, 50);
    gTx.addColorStop(0, 'rgba(249, 115, 22, 0.85)');
    gTx.addColorStop(0.6, 'rgba(234, 179, 8, 0.3)');
    gTx.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gTx;
    ctx.beginPath();
    ctx.arc(tx, ty, 50, 0, Math.PI * 2);
    ctx.fill();
  }

  // Heat Rejection Thermal Plumes
  const coolGradient = ctx.createRadialGradient(790, 220, 25, 790, 220, 150);
  coolGradient.addColorStop(0, 'rgba(234, 179, 8, 0.7)');
  coolGradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.35)');
  coolGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coolGradient;
  ctx.beginPath();
  ctx.arc(790, 220, 150, 0, Math.PI * 2);
  ctx.fill();

  // FLIR Crosshair & Hotspot Tracker
  const peakTemp = config.coolingLoop === 'air_hvac' ? '88.4°C [CRITICAL ALERT]' : '43.2°C [OPTIMAL]';
  const crossX = hallX + Math.sin(pulse * 0.1) * 10;
  const crossY = hallY + Math.cos(pulse * 0.1) * 8;

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(crossX, crossY, 18, 0, Math.PI * 2);
  ctx.moveTo(crossX - 25, crossY);
  ctx.lineTo(crossX + 25, crossY);
  ctx.moveTo(crossX, crossY - 25);
  ctx.lineTo(crossX, crossY + 25);
  ctx.stroke();

  // Hotspot Text Callout
  ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
  ctx.font = 'bold 10px monospace';
  ctx.fillText(`PEAK JUNCTION: ${peakTemp}`, crossX + 28, crossY - 8);
  ctx.fillStyle = isLight ? '#475569' : '#94a3b8';
  ctx.font = '9px monospace';
  ctx.fillText(`PRIMARY CHIP DELTA T: 14.8°C`, crossX + 28, crossY + 6);

  // FLIR Calibration Legend Overlay
  ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.3)';
  ctx.beginPath();
  ctx.roundRect(25, 20, 310, 68, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('FLIR RADIOMETRIC THERMOGRAPHY [20°C - 90°C]', 36, 38);
  ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
  ctx.font = '9px monospace';
  ctx.fillText(`EMISSIVITY: ε = 0.95 · SENSOR: CALIBRATED UNCOOLED MICROBOLOMETER`, 36, 52);
  ctx.fillText(`TOTAL FLOW: ${calc.totalCoolantFlowGPM.toLocaleString()} GPM · WUE: ${calc.wue} L/kWh`, 36, 66);

  // Thermal Bar Scale
  const barX = 25, barY = 385, barW = 280, barH = 12;
  const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
  barGrad.addColorStop(0, '#3b82f6');
  barGrad.addColorStop(0.28, '#06b6d4');
  barGrad.addColorStop(0.55, '#10b981');
  barGrad.addColorStop(0.78, '#eab308');
  barGrad.addColorStop(1, '#ef4444');
  ctx.fillStyle = barGrad;
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 4);
  ctx.fill();

  ctx.fillStyle = isLight ? '#475569' : '#94a3b8';
  ctx.font = '9px monospace';
  ctx.fillText('20°C', barX, barY + 24);
  ctx.fillText('40°C', barX + 80, barY + 24);
  ctx.fillText('65°C', barX + 165, barY + 24);
  ctx.fillText('90°C+', barX + barW - 28, barY + 24);
  ctx.restore();
}

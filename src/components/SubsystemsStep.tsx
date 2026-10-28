import React from 'react';
import {
  BessType,
  BtmPowerType,
  CoolingLoopType,
  DataCenterConfig,
  EngineeringCalculation,
  EnvelopeType,
  RedundancyType,
  RejectionPlantType,
  ServerPowerArch,
  SubstationType,
  TransformerType
} from '../types/datacenter';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Building,
  CheckCircle,
  Clock,
  Cpu,
  Flame,
  Layers,
  ShieldCheck,
  Snowflake,
  Wrench,
  Zap
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface SubsystemsStepProps {
  config: DataCenterConfig;
  calc: EngineeringCalculation;
  onChangeConfig: (updates: Partial<DataCenterConfig>) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const SubsystemsStep: React.FC<SubsystemsStepProps> = ({
  config,
  calc,
  onChangeConfig,
  onPrev,
  onNext
}) => {
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Context */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          {t.subsystems.title}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {t.subsystems.subtitle}
        </p>
      </div>

      {/* ACTIVE PHYSICS CONSTRAINT ALERTS BANNER */}
      {calc.alerts.length > 0 && (
        <div className="space-y-3">
          {calc.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition shadow-xs ${
                alert.level === 'critical'
                  ? 'border-red-200 bg-red-50 text-red-900'
                  : alert.level === 'warning'
                  ? 'border-amber-200 bg-amber-50 text-amber-900'
                  : 'border-blue-200 bg-blue-50 text-blue-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    alert.level === 'critical'
                      ? 'text-red-600'
                      : alert.level === 'warning'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }`}
                />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">{alert.title}</h4>
                  <p className="text-xs opacity-90 mt-1 leading-relaxed">{alert.message}</p>
                </div>
              </div>

              <button
                onClick={() => onChangeConfig(alert.autoFix())}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  alert.level === 'critical'
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : alert.level === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                {alert.remedyActionTitle}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Subsystem Configuration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DOMAIN 1: POWER & GRID INFRASTRUCTURE */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Zap className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {t.subsystems.secElectrical}
            </h3>
          </div>

          {/* Substation Type */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              {t.subsystems.substation}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeConfig({ substationType: 'gis' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.substationType === 'gis'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">{lang === 'zh' ? 'GIS (气体绝缘开关站)' : lang === 'fr' ? 'GIS (Sous Enveloppe Métallique)' : 'GIS (Gas-Insulated)'}</div>
                <div className="text-[10px] text-slate-500">{lang === 'zh' ? '占地节省 70%，室内全封闭' : lang === 'fr' ? 'Emprise au sol réduite de 70%' : '70% smaller yard footprint'}</div>
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ substationType: 'ais' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.substationType === 'ais'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">{lang === 'zh' ? 'AIS (空气绝缘变电站)' : lang === 'fr' ? 'AIS (Isolé dans l\'Air)' : 'AIS (Air-Insulated)'}</div>
                <div className="text-[10px] text-slate-500">{lang === 'zh' ? '传统室外开敞式布置' : lang === 'fr' ? 'Poste extérieur ouvert classique' : 'Traditional outdoor open yard'}</div>
              </button>
            </div>
          </div>

          {/* Transformer Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-800">
                {t.subsystems.transformers}
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {config.transformerType === 'sst' 
                  ? (lang === 'zh' ? '交期：44 周' : lang === 'fr' ? 'Délai : 44 sem.' : 'Lead Time: 44 Wks') 
                  : (lang === 'zh' ? '交期：124 周' : lang === 'fr' ? 'Délai : 124 sem.' : 'Lead Time: 124 Wks')}
              </span>
            </div>
            <select
              value={config.transformerType}
              onChange={(e) => onChangeConfig({ transformerType: e.target.value as TransformerType })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
            >
              <option value="sst">
                {lang === 'zh' ? '固态电力电子变压器 (SST) — 模块化撬块、高效高密 (44周)' : lang === 'fr' ? 'Transformateur à État Solide (SST) — Skids Modulaires (44 sem.)' : 'Solid-State Transformer (SST) — Modular Skids, High Efficiency (44 Wks)'}
              </option>
              <option value="conventional">
                {lang === 'zh' ? '传统大型油浸式主变 (LPT) — 供应链极度紧张 (124周)' : lang === 'fr' ? 'Transformateur Traditionnel à Huile (LPT) (124 sem.)' : 'Conventional Oil-Filled Large Power Transformer (LPT) (124 Wks)'}
              </option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {lang === 'zh' 
                ? 'SST 支持毫秒级数字调压，可直通 800V DC 直流母线，占地减半。' 
                : lang === 'fr' 
                ? 'Le SST offre une régulation rapide et une conversion directe moyenne tension vers DC/LV.' 
                : 'SST offers solid-state fast voltage regulation and direct MV to DC/LV conversion.'}
            </span>
          </div>

          {/* Server Power Architecture */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              {t.subsystems.serverPower}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeConfig({ serverPower: '800vdc' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.serverPower === '800vdc'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">{lang === 'zh' ? '800V DC 集中直流母线' : lang === 'fr' ? 'Jeu de Barres 800V DC' : '800V DC Central Busway'}</div>
                <div className="text-[10px] text-slate-500">{lang === 'zh' ? '综合效率 98.4%，铜缆节省 38%' : lang === 'fr' ? 'Rendement 98.4%, 38% moins de cuivre' : '98.4% efficiency, 38% less copper'}</div>
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ serverPower: '480vac' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.serverPower === '480vac'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">{lang === 'zh' ? '480V AC 交流配电' : lang === 'fr' ? 'Distribution 480V AC' : '480V AC Distribution'}</div>
                <div className="text-[10px] text-slate-500">{lang === 'zh' ? '传统三相交流 PDU / RPP 列头柜' : lang === 'fr' ? 'PDU / RPP triphasé traditionnel' : 'Conventional 3-phase PDU/RPP'}</div>
              </button>
            </div>
          </div>

          {/* Behind-The-Meter Generation */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              {t.subsystems.btmGen}
            </label>
            <select
              value={config.btmPower}
              onChange={(e) => onChangeConfig({ btmPower: e.target.value as BtmPowerType })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
            >
              <option value="grid_only">{lang === 'zh' ? '纯电网市电进线 (受制于电网排队)' : lang === 'fr' ? 'Réseau Électrique Seul (File d\'attente)' : 'Utility Interconnect Only (Subject to Grid Queues)'}</option>
              <option value="aero_turbine">{lang === 'zh' ? '航改型燃气轮机 (LM2500 级快速通电)' : lang === 'fr' ? 'Turbines à Gaz Aéro-dérivées (GE LM2500)' : 'Aeroderivative Gas Turbines (Baker Hughes / GE LM2500 Fast-Track)'}</option>
              <option value="gas_recip">{lang === 'zh' ? '天然气往复式内燃机 (高电效率热电联供)' : lang === 'fr' ? 'Moteurs Gaz Alternatifs (Wärtsilä / CAT)' : 'Natural Gas Reciprocating Engines (Wärtsilä / CAT High-Efficiency)'}</option>
              <option value="fuel_cell">{lang === 'zh' ? '固体氧化物燃料电池微电网 SOFC (零排放)' : lang === 'fr' ? 'Micro-réseaux à Piles à Combustible SOFC' : 'Solid Oxide Fuel Cell Microgrid Arrays (Zero NOx/SOx)'}</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {lang === 'zh' ? '隔墙发电模式可跨过漫长的输电网审批，使 COD 投产提速 18–36 个月。' : lang === 'fr' ? 'La production BTM contourne les délais de raccordement et avance le COD de 18 à 36 mois.' : 'BTM generation bypasses utility transmission interconnect queues, pulling COD forward by 18-36 months.'}
            </span>
          </div>

          {/* Energy Storage BESS */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              {t.subsystems.bess}
            </label>
            <select
              value={config.bessType}
              onChange={(e) => onChangeConfig({ bessType: e.target.value as BessType })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
            >
              <option value="lfp_short">{lang === 'zh' ? '模块化磷酸铁锂电池 UPS (15分钟负载跨越)' : lang === 'fr' ? 'UPS Batteries LFP (15 min de réserve critique)' : 'Modular LFP Battery UPS (15-min Critical Load Ride-Through)'}</option>
              <option value="lfp_long">{lang === 'zh' ? '电网级长时 BESS 储能 (2小时削峰填谷与孤岛运行)' : lang === 'fr' ? 'BESS Longue Durée (2 h d\'écrêtement et îlotage)' : 'Long-Duration Utility BESS (2-Hour Peak Shaving & Islanding)'}</option>
              <option value="flywheel">{lang === 'zh' ? '磁悬浮飞轮储能 (无化学品极速动态电网支撑)' : lang === 'fr' ? 'Stockage Volant d\'Inertie (Sans chimie, dynamique)' : 'Kinetic Flywheel Storage (Chemical-Free Fast Dynamic Stabilization)'}</option>
            </select>
          </div>
        </div>

        {/* DOMAIN 2: THERMAL & STRUCTURAL SYSTEMS */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Snowflake className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {t.subsystems.secMechanical}
            </h3>
          </div>

          {/* Cooling Loop / Heat Extraction */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              {t.subsystems.coolingLoop}
            </label>
            <select
              value={config.coolingLoop}
              onChange={(e) => onChangeConfig({ coolingLoop: e.target.value as CoolingLoopType })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
            >
              <option value="d2c_l2l">{lang === 'zh' ? '芯片级液-液直冷 CDU (功耗 >35 kW/柜强制要求)' : lang === 'fr' ? 'CDU Liquide-Liquide Direct-sur-Puce D2C (>35 kW/baie)' : 'Direct-to-Chip (D2C) Liquid-to-Liquid CDUs (Required for >35 kW/rack)'}</option>
              <option value="immersion">{lang === 'zh' ? '单相全浸没式液冷槽 (100–150+ kW/槽)' : lang === 'fr' ? 'Bacs à Immersion Monophasée (100–150+ kW/bac)' : 'Single-Phase Immersion Cooling Tanks (100–150+ kW/tank)'}</option>
              <option value="rdhx">{lang === 'zh' ? '主动式微通道背板热交换器 (RDHx)' : lang === 'fr' ? 'Échangeurs Portes Arrière Actifs (RDHx)' : 'Active Rear-Door Heat Exchangers (RDHx)'}</option>
              <option value="air_hvac">{lang === 'zh' ? '传统精密风冷 CRAH / 水冷冷冻水系统' : lang === 'fr' ? 'Climatisation Traditionnelle Air CRAH / Eau Glacée' : 'Traditional Air CRAH / Chilled Water HVAC (Legacy air limit)'}</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {calc.rackDensityKW > 35 && config.coolingLoop === 'air_hvac' ? (
                <span className="text-red-600 font-semibold">
                  {lang === 'zh' ? `物理规则违规：传统风冷无法支持 ${calc.rackDensityKW} kW/机柜的超高密度。` : lang === 'fr' ? `Violation de règle : le refroidissement par air ne peut pas dissiper ${calc.rackDensityKW} kW/baie.` : `Rule Violation: Air cooling cannot support ${calc.rackDensityKW} kW/rack density.`}
                </span>
              ) : (
                lang === 'zh' ? '芯片级液冷 CDU 分配纯水直达 GPU/CPU 高温导热板。' : lang === 'fr' ? 'Les CDU D2C alimentent en fluide caloporteur les plaques froides des GPU.' : 'D2C CDUs supply clean water to cold plates directly on GPUs/CPUs.'
              )}
            </span>
          </div>

          {/* Heat Rejection Primary Plant */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              {t.subsystems.rejectionPlant}
            </label>
            <select
              value={config.rejectionPlant}
              onChange={(e) => onChangeConfig({ rejectionPlant: e.target.value as RejectionPlantType })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none shadow-xs"
            >
              <option value="adiabatic_dry">{lang === 'zh' ? '封闭式绝热干冷器 (WUE: 0.02 L/kWh — 极低耗水)' : lang === 'fr' ? 'Refroidisseurs Secs Adiabatiques (WUE: 0.02 L/kWh)' : 'Closed-Loop Adiabatic Dry Coolers (WUE: 0.02 L/kWh — Zero Water Waste)'}</option>
              <option value="hybrid_tower">{lang === 'zh' ? '混流蒸发式冷却塔 (WUE: 1.65 L/kWh — 耗水量大)' : lang === 'fr' ? 'Tours de Refroidissement Hybrides (WUE: 1.65 L/kWh)' : 'Hybrid Evaporative Cooling Towers (WUE: 1.65 L/kWh — High Water)'}</option>
              <option value="chiller_economizer">{lang === 'zh' ? '带板式换热节能器的离心冷水机组' : lang === 'fr' ? 'Groupes Froids avec Échangeur Économiseur' : 'Chilled Water Plant with Economizer Bypass Plates'}</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {lang === 'zh' ? '绝热干冷器规避了市政供水限制与军团菌合规风险。' : lang === 'fr' ? 'Les refroidisseurs secs adiabatiques éliminent les risques liés à l\'eau municipale.' : 'Adiabatic dry coolers eliminate municipal water risks and Legionella compliance mandates.'}
            </span>
          </div>

          {/* Mechanical & Electrical Redundancy */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              {t.subsystems.redundancy}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeConfig({ redundancy: 'n_plus_1' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.redundancy === 'n_plus_1'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">{lang === 'zh' ? 'N+1 在线冗余' : lang === 'fr' ? 'Redondance N+1' : 'N+1 Redundancy'}</div>
                <div className="text-[10px] text-slate-500">{lang === 'zh' ? '符合 Tier III 在线可维护标准' : lang === 'fr' ? 'Standard Tier III maintenable' : 'Tier III standard performance'}</div>
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ redundancy: '2n' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.redundancy === '2n'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">{lang === 'zh' ? '2N 容错双活' : lang === 'fr' ? 'Redondance 2N Tolérante' : '2N Concurrent'}</div>
                <div className="text-[10px] text-slate-500">{lang === 'zh' ? '符合 Tier IV 关键业务容错' : lang === 'fr' ? 'Tier IV double alimentation totale' : 'Tier IV mission-critical dual paths'}</div>
              </button>
            </div>
          </div>

          {/* Structural Deployment Envelope */}
          <div>
            <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
              {t.subsystems.envelope}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeConfig({ envelopeType: 'stick_built' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.envelopeType === 'stick_built'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">{lang === 'zh' ? '重型钢筋混凝土建筑' : lang === 'fr' ? 'Bâtiment Béton Renforcé' : 'Hardened Concrete Shell'}</div>
                <div className="text-[10px] text-slate-500">{lang === 'zh' ? '承重 6,000 磅/平方英尺' : lang === 'fr' ? 'Dalle 30 tonnes/m² structurée' : '6,000 lbs/sq ft structural slab'}</div>
              </button>
              <button
                type="button"
                onClick={() => onChangeConfig({ envelopeType: 'modular_skid' })}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  config.envelopeType === 'modular_skid'
                    ? 'border-blue-500 bg-blue-50/80 text-slate-900 font-semibold ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">{lang === 'zh' ? '预制集装箱模块化撬块' : lang === 'fr' ? 'Skids Modulaires Préfabriqués' : 'Modular Prefab Skids'}</div>
                <div className="text-[10px] text-slate-500">{lang === 'zh' ? '工期缩短 9 个月，快速 COD' : lang === 'fr' ? 'Accélère la livraison de 9 mois' : 'Accelerates delivery by 9 months'}</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={onPrev}
          className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-2 cursor-pointer border border-slate-300 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'zh' ? '返回第 1 步' : lang === 'fr' ? 'Retour Étape 1' : 'Back to Step 1'}</span>
        </button>

        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <span>{lang === 'zh' ? '生成工程成果与 ROI 交付包' : lang === 'fr' ? 'Générer les Livrables & ROI' : 'Generate Deliverables & ROI'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  BusinessPersona,
  DataCenterConfig,
  EngineeringCalculation
} from '../types/datacenter';
import { calculatePersonaROI } from '../utils/engineeringEngine';
import { CampusVisualizer } from './CampusVisualizer';
import { MechanicalPID } from './MechanicalPID';
import { SingleLineDiagram } from './SingleLineDiagram';
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  FileSpreadsheet,
  Globe2,
  Layers,
  Leaf,
  Network,
  PieChart,
  Send,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface DeliverablesStepProps {
  config: DataCenterConfig;
  calc: EngineeringCalculation;
  onOpenPushEpc: () => void;
  onPrint: () => void;
  onOpenExport?: () => void;
  onOpenCompare?: () => void;
}

type TabKey = 'aerial' | 'sld' | 'pid' | 'roi' | 'bom' | 'esg';

export const DeliverablesStep: React.FC<DeliverablesStepProps> = ({
  config,
  calc,
  onOpenPushEpc,
  onPrint,
  onOpenExport,
  onOpenCompare
}) => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('aerial');
  const [persona, setPersona] = useState<BusinessPersona>('neocloud');

  const roiData = calculatePersonaROI(persona, config, calc);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {t.deliverables.title}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.deliverables.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.deliverables.btnCompare}</span>
            </button>
          )}
          <button
            onClick={onOpenExport || onPrint}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.deliverables.btnExport}</span>
          </button>
          <button
            onClick={onOpenPushEpc}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.deliverables.btnSubmitEpc}</span>
          </button>
        </div>
      </div>

      {/* Deliverables Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('aerial')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'aerial'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          {t.deliverables.tabCampus}
        </button>
        <button
          onClick={() => setActiveTab('sld')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'sld'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          {t.deliverables.tabSLD}
        </button>
        <button
          onClick={() => setActiveTab('pid')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'pid'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          {t.deliverables.tabPID}
        </button>
        <button
          onClick={() => setActiveTab('roi')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'roi'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          {t.deliverables.tabFinancial}
        </button>
        <button
          onClick={() => setActiveTab('bom')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'bom'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          {t.deliverables.tabBOM}
        </button>
        <button
          onClick={() => setActiveTab('esg')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'esg'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          {lang === 'zh' ? 'ESG 与可持续发展指标' : lang === 'fr' ? 'ESG et durabilité environnementale' : 'ESG & Sustainability'}
        </button>
      </div>

      {/* TAB CONTENT 1: AERIAL & CAMPUS VISUALIZATION */}
      {activeTab === 'aerial' && (
        <div className="space-y-4">
          <CampusVisualizer config={config} calc={calc} />
        </div>
      )}

      {/* TAB CONTENT 2: ELECTRICAL SLD */}
      {activeTab === 'sld' && (
        <div className="space-y-4">
          <SingleLineDiagram config={config} calc={calc} />
        </div>
      )}

      {/* TAB CONTENT 3: MECHANICAL P&ID */}
      {activeTab === 'pid' && (
        <div className="space-y-4">
          <MechanicalPID config={config} calc={calc} />
        </div>
      )}

      {/* TAB CONTENT 4: ROI & BUSINESS ARCHETYPES */}
      {activeTab === 'roi' && (
        <div className="space-y-6">
          {/* Persona Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {lang === 'zh' ? '利益相关方商业架构模型' : lang === 'fr' ? 'Modèle économique des parties prenantes' : 'Stakeholder Business Archetype'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'zh' ? '选择对应商业运作模式，动态测算资本回报率与现金流。' : lang === 'fr' ? 'Sélectionnez un modèle pour contextualiser le rendement du capital et la trésorerie.' : 'Select business model to contextualize return on capital and cash flows.'}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setPersona('neocloud')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  persona === 'neocloud' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'zh' ? '算力即服务 / 新兴云' : lang === 'fr' ? 'GPUaaS / Néo-cloud' : 'GPUaaS / Neocloud'}
              </button>
              <button
                onClick={() => setPersona('colo')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  persona === 'colo' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'zh' ? '批发型托管数据中心' : lang === 'fr' ? 'Colocation de gros' : 'Wholesale Colocation'}
              </button>
              <button
                onClick={() => setPersona('enterprise')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  persona === 'enterprise' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'zh' ? '企业专属私有算力云' : lang === 'fr' ? 'Cloud privé d\'entreprise' : 'Enterprise Private Cloud'}
              </button>
            </div>
          </div>

          {/* Persona Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">{roiData.primaryStatLabel}</span>
              <span className="text-2xl font-black text-emerald-600 font-mono tracking-tight">{roiData.primaryStatValue}</span>
              <span className="text-[10px] text-slate-400 block">
                {lang === 'zh' ? '测算年度现金流入' : lang === 'fr' ? 'Génération de trésorerie annuelle calculée' : 'Calculated annual cash generation'}
              </span>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">{roiData.secondaryStatLabel}</span>
              <span className="text-2xl font-black text-blue-600 font-mono tracking-tight">{roiData.secondaryStatValue}</span>
              <span className="text-[10px] text-slate-400 block">
                {lang === 'zh' ? '扣除电力运维后净营运利润率' : lang === 'fr' ? 'Marge opérationnelle nette après coût électrique' : 'Net operating margin post power OpEx'}
              </span>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block">{roiData.tertiaryStatLabel}</span>
              <span className="text-2xl font-black text-indigo-600 font-mono tracking-tight">{roiData.tertiaryStatValue}</span>
              <span className="text-[10px] text-slate-400 block">
                {lang === 'zh' ? '无杠杆资本回收周期' : lang === 'fr' ? 'Amortissement du capital non levé' : 'Unlevered capital amortization'}
              </span>
            </div>
          </div>

          {/* Financial Breakdown Table & Narrative */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {lang === 'zh' ? '财务模型计划参数' : lang === 'fr' ? 'Paramètres du plan financier' : 'Financial Schedule Parameters'}
              </h4>
              <div className="divide-y divide-slate-200 text-xs">
                {roiData.breakdown.map((row, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-600">{row.label}</span>
                    <span className="font-mono font-bold text-slate-900">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  {lang === 'zh' ? '高管投资论证摘要' : lang === 'fr' ? 'Thèse d\'investissement exécutive' : 'Executive Investment Thesis'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{roiData.narrative}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {lang === 'zh' ? '银行级可融资 EPC 承保标准' : lang === 'fr' ? 'Standard de souscription EPC bancable' : 'Bankable EPC Underwriting Standard'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {lang === 'zh'
                    ? '包含完整厂务平衡设施 (BOP)、电网接入费用、调试预备金以及 Tier III/IV 达标保证。'
                    : lang === 'fr'
                    ? 'Comprend l\'équilibre complet de l\'installation (BOP), les frais de raccordement, les imprévus de mise en service et garanties Tier III/IV.'
                    : 'Includes full balance-of-plant (BOP), utility interconnection fees, commissioning contingency, and Tier III/IV compliance guarantees.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: ITEMIZED BILL OF MATERIALS (BOM) */}
      {activeTab === 'bom' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {lang === 'zh' ? '初步前端工程设计 (FEED) 物料清单 (BOM)' : lang === 'fr' ? 'Nomenclature FEED préliminaire (BOM)' : 'Preliminary Front-End Engineering Design (FEED) Bill of Materials'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'zh' ? `针对 ${calc.facilityTotalLoadMW} MW 设施的设备明细核算与土建预算。` : lang === 'fr' ? `Calendrier d'équipements chiffré et budget de génie civil pour installation de ${calc.facilityTotalLoadMW} MW.` : `Priced equipment schedule and civil construction budget for ${calc.facilityTotalLoadMW} MW facility.`}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-xs">
              {lang === 'zh' ? '总 CapEx 资本支出' : lang === 'fr' ? 'CapEx total' : 'Total CapEx'}: ${calc.totalCapExM}M
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">{lang === 'zh' ? '子系统工程领域' : lang === 'fr' ? 'Sous-système' : 'Subsystem Domain'}</th>
                  <th className="py-3 px-4">{lang === 'zh' ? '技术规范与设备基准' : lang === 'fr' ? 'Spécification technique' : 'Specification & Manufacturer Baseline'}</th>
                  <th className="py-3 px-4">{lang === 'zh' ? '采购交付周期' : lang === 'fr' ? 'Délai d\'approvisionnement' : 'Procurement Lead Time'}</th>
                  <th className="py-3 px-4 text-right">{lang === 'zh' ? '成本 ($M)' : lang === 'fr' ? 'Coût ($M)' : 'Cost ($M)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-slate-800">
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">{lang === 'zh' ? '高压变电站' : lang === 'fr' ? 'Poste haute tension' : 'High-Voltage Substation'}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.substationType.toUpperCase()} {lang === 'zh' ? '变电站' : lang === 'fr' ? 'Poste' : 'Substation'}, 115kV/34.5kV, {config.dualUtilityFeed ? (lang === 'zh' ? '双路市电进线' : lang === 'fr' ? 'Double alimentation' : 'Dual Utility Feeds') : (lang === 'zh' ? '单路进线' : lang === 'fr' ? 'Simple alimentation' : 'Single Feed')}
                  </td>
                  <td className="py-3 px-4 text-slate-600">50–64 {lang === 'zh' ? '周' : lang === 'fr' ? 'sem.' : 'Weeks'}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.substationCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">{lang === 'zh' ? '变压与降压层' : lang === 'fr' ? 'Couche de transformation' : 'Transformation Layer'}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.transformerType === 'sst' ? (lang === 'zh' ? '模块化固态变压器 (SST)' : lang === 'fr' ? 'Transformateurs à semi-conducteurs (SST)' : 'Modular Solid-State Transformers (SST)') : (lang === 'zh' ? '油浸式中压变压器 (LPT)' : lang === 'fr' ? 'Transformateurs à bain d\'huile (LPT)' : 'Oil-Filled MV Transformers (LPT)')} ({config.redundancy.toUpperCase()})
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {config.transformerType === 'sst' ? (lang === 'zh' ? '44 周' : lang === 'fr' ? '44 sem.' : '44 Weeks') : (lang === 'zh' ? '124 周 (关键长周期瓶颈)' : lang === 'fr' ? '124 sem. (Goulot)' : '124 Weeks (Bottleneck)')}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.transformersCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">{lang === 'zh' ? '表后自备发电 (BTM)' : lang === 'fr' ? 'Génération BTM' : 'BTM Generation'}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.btmPower === 'aero_turbine' ? (lang === 'zh' ? '航改型双燃料燃气轮机 (快速并网)' : lang === 'fr' ? 'Turbines à gaz aérodérivées' : 'Aeroderivative Dual-Fuel Gas Turbines (Fast-Track)') : config.btmPower === 'gas_recip' ? (lang === 'zh' ? '往复式天然气发电机组' : lang === 'fr' ? 'Groupes électrogènes au gaz' : 'Reciprocating Natural Gas Gensets') : config.btmPower === 'fuel_cell' ? (lang === 'zh' ? '固体氧化物燃料电池 (SOFC)' : lang === 'fr' ? 'Piles à combustible' : 'Solid Oxide Fuel Cells') : (lang === 'zh' ? '仅市电网供电' : lang === 'fr' ? 'Réseau uniquement' : 'Utility Grid Only')}
                  </td>
                  <td className="py-3 px-4 text-slate-600">20–72 {lang === 'zh' ? '周' : lang === 'fr' ? 'sem.' : 'Weeks'}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.btmGenCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">{lang === 'zh' ? 'UPS 与储能系统' : lang === 'fr' ? 'Onduleurs UPS & BESS' : 'UPS & Energy Storage'}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.bessType === 'lfp_long' ? (lang === 'zh' ? '2小时磷酸铁锂储能电站 (削峰与孤岛)' : lang === 'fr' ? 'BESS LFP 2h (Effacement de pointe)' : '2-Hour Utility BESS (Peak Shaving & Islanding)') : config.bessType === 'flywheel' ? (lang === 'zh' ? '飞轮动能储能系统' : lang === 'fr' ? 'Stockage cinétique à volant d\'inertie' : 'Kinetic Flywheel Storage') : (lang === 'zh' ? '15分钟模块化磷酸铁锂电池 UPS' : lang === 'fr' ? 'Onduleur batterie modulaire LFP 15min' : '15-min Modular LFP Battery UPS')}
                  </td>
                  <td className="py-3 px-4 text-slate-600">32–40 {lang === 'zh' ? '周' : lang === 'fr' ? 'sem.' : 'Weeks'}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.bessCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">{lang === 'zh' ? '冷热系统与 CDU' : lang === 'fr' ? 'Refroidissement & CDU' : 'Cooling & CDUs'}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {lang === 'zh' ? `液冷分配单元 (CDU), 二次流体管网, ${config.rejectionPlant.toUpperCase()} 排热系统` : lang === 'fr' ? `CDU liquides, boucle secondaire, rejet ${config.rejectionPlant.toUpperCase()}` : `Liquid CDUs, Secondary Fluid Network, ${config.rejectionPlant.toUpperCase()} Heat Rejection`}
                  </td>
                  <td className="py-3 px-4 text-slate-600">36 {lang === 'zh' ? '周' : lang === 'fr' ? 'sem.' : 'Weeks'}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.coolingPlantCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">{lang === 'zh' ? '末端配电' : lang === 'fr' ? 'Distribution électrique' : 'Power Distribution'}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.serverPower === '800vdc' ? (lang === 'zh' ? '800V DC 中央母线槽与列头整流柜' : lang === 'fr' ? 'Busway central 800V CC & redresseurs' : '800V DC Central Busway & End-of-Row Rectifiers') : (lang === 'zh' ? '480V AC 配电、PDU 与 RPP 列头柜' : lang === 'fr' ? 'Distribution 480V CA, PDU & RPP' : '480V AC Distribution, PDUs & RPPs')}
                  </td>
                  <td className="py-3 px-4 text-slate-600">28 {lang === 'zh' ? '周' : lang === 'fr' ? 'sem.' : 'Weeks'}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.powerDistributionCapExM}M</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">{lang === 'zh' ? '土建与结构外壳' : lang === 'fr' ? 'Génie civil & structure' : 'Civil & Structural Shell'}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {config.envelopeType === 'modular_skid' ? (lang === 'zh' ? '厂制预工程模块化箱体' : lang === 'fr' ? 'Modules préfabriqués hors site' : 'Pre-Engineered Offsite Modular Skids') : (lang === 'zh' ? '加固混凝土建筑 (6,000 磅/平方英尺承重)' : lang === 'fr' ? 'Structure béton armé (6 000 lbs/sq ft)' : 'Hardened Concrete Shell (6,000 lbs/sq ft)')} ({calc.totalFootprintSqFt.toLocaleString()} sq ft)
                  </td>
                  <td className="py-3 px-4 text-slate-600">32–68 {lang === 'zh' ? '周' : lang === 'fr' ? 'sem.' : 'Weeks'}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.civilStructuralCapExM}M</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">{lang === 'zh' ? 'EPC 总包工程与调试管理' : lang === 'fr' ? 'Ingénierie EPC & Commissioning' : 'EPC Engineering & Commissioning'}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {lang === 'zh' ? 'FEED 研究、环评规划、Level 1-5 全流程联调、工程保险' : lang === 'fr' ? 'Études FEED, permis, commissioning Niveaux 1-5, assurances' : 'FEED studies, permitting, Level 1-5 commissioning, project insurance'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{lang === 'zh' ? '贯穿全程' : lang === 'fr' ? 'Continu' : 'Continuous'}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${calc.epcManagementCapExM}M</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-100 border-t border-slate-200 font-bold">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right text-slate-900">
                    {lang === 'zh' ? '预计总 CAPEX 资本支出:' : lang === 'fr' ? 'CAPEX TOTAL ESTIMÉ :' : 'TOTAL ESTIMATED CAPEX:'}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-700 font-mono text-sm">${calc.totalCapExM}M</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: ESG & SUSTAINABILITY SCORECARD */}
      {activeTab === 'esg' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                {lang === 'zh' ? 'PUE (设计能效)' : lang === 'fr' ? 'PUE (Conception)' : 'PUE (Design)'}
              </span>
              <span className="text-2xl font-black text-emerald-600 font-mono">{calc.pue.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {lang === 'zh' ? 'Tier-1 顶级能效' : lang === 'fr' ? 'Efficacité Tier-1' : 'Tier-1 Efficiency'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                {lang === 'zh' ? 'WUE (水资源利用)' : lang === 'fr' ? 'WUE (Consommation d\'eau)' : 'WUE (Water Usage)'}
              </span>
              <span className="text-2xl font-black text-blue-600 font-mono">{calc.wue} L/kWh</span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {config.rejectionPlant === 'adiabatic_dry' ? (lang === 'zh' ? '零水损耗设计' : lang === 'fr' ? 'Zéro gaspillage d\'eau' : 'Zero Water Waste') : (lang === 'zh' ? '蒸发冷凝水耗' : lang === 'fr' ? 'Consommation évaporative' : 'Evaporative Consumption')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                {lang === 'zh' ? 'CUE (碳排放强度)' : lang === 'fr' ? 'CUE (Intensité carbone)' : 'CUE (Carbon Intensity)'}
              </span>
              <span className="text-2xl font-black text-amber-600 font-mono">{calc.cue} kg/kWh</span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {lang === 'zh' ? '范围 2 电网足迹' : lang === 'fr' ? 'Empreinte Scope 2 réseau' : 'Scope 2 Grid Footprint'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                {lang === 'zh' ? '余热回收潜力' : lang === 'fr' ? 'Récupération de chaleur' : 'Heat Reuse Potential'}
              </span>
              <span className="text-2xl font-black text-indigo-600 font-mono">46°C / 115°F</span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {lang === 'zh' ? '支持区域供热管网' : lang === 'fr' ? 'Prêt pour réseau de chaleur' : 'District Heat Ready'}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {lang === 'zh' ? '环境与环评审批合规概况' : lang === 'fr' ? 'Profil environnemental et permis' : 'Environmental & Permitting Profile'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 space-y-1">
                <span className="font-bold text-slate-900">
                  {lang === 'zh' ? '声学与噪音抑制' : lang === 'fr' ? 'Atténuation acoustique' : 'Acoustic & Noise Mitigation'}
                </span>
                <p className="text-slate-600">
                  {lang === 'zh'
                    ? '绝热干冷器采用变频风机阵列，厂界噪音严格控制在 55 dBA 以下，满足严苛市政噪声红线。'
                    : lang === 'fr'
                    ? 'Ventilateurs VFD sur aéroréfrigérants adiabatiques conçus pour maintenir moins de 55 dBA en limite de propriété.'
                    : 'VFD fan arrays on adiabatic dry coolers engineered to maintain <55 dBA sound pressure at the property line boundary.'}
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 space-y-1">
                <span className="font-bold text-slate-900">
                  {lang === 'zh' ? '空气环评审批与 NOx 排放标准' : lang === 'fr' ? 'Permis d\'air et conformité NOx' : 'Air Permitting & NOx Compliance'}
                </span>
                <p className="text-slate-600">
                  {config.btmPower === 'aero_turbine' ? (lang === 'zh' ? '配置选择性催化还原 (SCR) 模块，实现 <2.5 ppm NOx 极低排放合规。' : lang === 'fr' ? 'Pack SCR permettant d\'atteindre une conformité NOx < 2,5 ppm.' : 'Selective Catalytic Reduction (SCR) package achieves <2.5 ppm NOx compliance.') : config.btmPower === 'fuel_cell' ? (lang === 'zh' ? '固体氧化物燃料电池无燃烧颗粒物产生。' : lang === 'fr' ? 'Piles à combustible sans particules de combustion.' : 'Solid oxide fuel cells emit zero combustion particulate matter.') : (lang === 'zh' ? '市电网直供模式下本地范围 1 燃烧排放为零。' : lang === 'fr' ? 'Zéro émission Scope 1 locale sur réseau électrique.' : 'Zero localized Scope 1 combustion emissions on utility grid feed.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

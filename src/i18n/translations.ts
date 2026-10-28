export type Language = 'en' | 'zh' | 'fr';

export interface Translations {
  common: {
    appTitle: string;
    developer: string;
    version: string;
    next: string;
    prev: string;
    active: string;
    select: string;
    close: string;
    copy: string;
    copied: string;
    download: string;
    submit: string;
    cancel: string;
    gpus: string;
    racks: string;
    mw: string;
    gw: string;
    sqft: string;
    gpm: string;
    years: string;
    weeks: string;
    tons: string;
    perKWh: string;
    perYear: string;
    generating: string;
  };
  header: {
    step1: string;
    step2: string;
    step3: string;
    readme: string;
    langLabel: string;
  };
  workload: {
    title: string;
    subtitle: string;
    presetsTitle: string;
    presetsSubtitle: string;
    trackA_title: string;
    trackA_tag: string;
    trackA_desc: string;
    trackB_title: string;
    trackB_tag: string;
    trackB_desc: string;
    siliconTitle: string;
    clusterScaleTitle: string;
    calculatedEnvelopes: string;
    activeEnclosures: string;
    criticalIT: string;
    whiteSpaceArea: string;
    coolantCirculation: string;
    regionTitle: string;
    gridPrefix: string;
    summerAmbient: string;
    dryBulb: string;
    wetBulb: string;
    queueYears: string;
    substationCapTitle: string;
    substationCapSub: string;
    rackDensityTitle: string;
    rackDensitySub: string;
    siteParcelTitle: string;
    siteParcelSub: string;
    btnNext: string;
  };
  subsystems: {
    title: string;
    subtitle: string;
    secElectrical: string;
    secElectricalSub: string;
    secMechanical: string;
    secMechanicalSub: string;
    secFacility: string;
    secFacilitySub: string;
    substation: string;
    substationSub: string;
    dualFeed: string;
    dualFeedSub: string;
    transformers: string;
    transformersSub: string;
    serverPower: string;
    serverPowerSub: string;
    btmGen: string;
    btmGenSub: string;
    bess: string;
    bessSub: string;
    coolingLoop: string;
    coolingLoopSub: string;
    rejectionPlant: string;
    rejectionPlantSub: string;
    redundancy: string;
    redundancySub: string;
    envelope: string;
    envelopeSub: string;
    remedyApplied: string;
  };
  synthesis: {
    title: string;
    viable: string;
    criticalViolation: string;
    engineeringAlerts: string;
    totalCapEx: string;
    annualOpEx: string;
    designPUE: string;
    wueMetric: string;
    criticalPathLead: string;
    projectedCOD: string;
    viewDeliverables: string;
    autoFix: string;
  };
  deliverables: {
    title: string;
    subtitle: string;
    btnExport: string;
    btnSubmitEpc: string;
    btnCompare: string;
    tabCampus: string;
    tabSLD: string;
    tabPID: string;
    tabBOM: string;
    tabFinancial: string;
    tabSignoff: string;
    visualizerIsometric: string;
    visualizerSite: string;
    visualizerThermal: string;
    lightCanvas: string;
    darkCanvas: string;
    zoomIn: string;
    zoomOut: string;
    campusMetricsTotalRacks: string;
    campusMetricsITLoad: string;
    campusMetricsTotalFootprint: string;
    campusMetricsCapEx: string;
    campusMetricsOpEx: string;
    campusMetricsPUE: string;
    campusMetricsCOD: string;
  };
  readme: {
    title: string;
    subtitle: string;
    overviewTitle: string;
    overviewText: string;
    workflowTitle: string;
    stage1Title: string;
    stage1Item1: string;
    stage1Item2: string;
    stage2Title: string;
    stage2Item1: string;
    stage2Item2: string;
    stage3Title: string;
    stage3Item1: string;
    stage3Item2: string;
    contactTitle: string;
    contactText: string;
    contactAuthor: string;
    emailBtn: string;
    copiedNotice: string;
    linkedinBtn: string;
  };
  exportModal: {
    title: string;
    subtitle: string;
    opt1Title: string;
    opt1Desc: string;
    opt1Btn: string;
    opt2Title: string;
    opt2Desc: string;
    opt2Btn: string;
    opt3Title: string;
    opt3Desc: string;
    opt3Btn: string;
    opt4Title: string;
    opt4Desc: string;
    opt4Btn: string;
    footerSubmit: string;
    footerClose: string;
  };
  epcModal: {
    title: string;
    subtitle: string;
    pipelineStage: string;
    facilityDesignPack: string;
    itCapacity: string;
    facilityDemand: string;
    estCapEx: string;
    targetCOD: string;
    contractorSelect: string;
    submitSuccess: string;
    submitBtn: string;
    closeBtn: string;
  };
  compareModal: {
    title: string;
    subtitle: string;
    colMetric: string;
    colCurrent: string;
    colFlagship: string;
    colModular: string;
    metricAccelerators: string;
    metricRacks: string;
    metricITLoad: string;
    metricFacilityLoad: string;
    metricPUE: string;
    metricTotalCapEx: string;
    metricAnnualOpEx: string;
    metricCooling: string;
    metricPowerArch: string;
    metricLeadTime: string;
    metricCOD: string;
    closeBtn: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      appTitle: 'AZ AI Data Center Design Studio',
      developer: 'Developer: George Zhang',
      version: 'v1.1.0',
      next: 'Next Step',
      prev: 'Previous Step',
      active: 'Active',
      select: 'Select',
      close: 'Close',
      copy: 'Copy',
      copied: 'Copied!',
      download: 'Download',
      submit: 'Submit',
      cancel: 'Cancel',
      gpus: 'GPUs',
      racks: 'Racks',
      mw: 'MW',
      gw: 'GW',
      sqft: 'sq ft',
      gpm: 'GPM',
      years: 'years',
      weeks: 'weeks',
      tons: 'tons',
      perKWh: '/kWh',
      perYear: '/yr',
      generating: 'Generating PDF Deck...'
    },
    header: {
      step1: '1. Workload Ingress',
      step2: '2. Component Physics',
      step3: '3. Deliverables & ROI',
      readme: 'Readme',
      langLabel: 'Language'
    },
    workload: {
      title: 'Step 1: Workload Ingress & Preliminary Sizing',
      subtitle: 'Select your engineering ingress track: top-down AI accelerator workload sizing, or bottom-up utility power constraint envelope.',
      presetsTitle: 'Validated Reference Architectures',
      presetsSubtitle: '1-Click Fast Configuration',
      trackA_title: 'Track A: Top-Down',
      trackA_tag: 'Compute & Cluster Sizing',
      trackA_desc: 'Specify AI accelerator silicon (GB200 NVL72, B200, H100) and GPU cluster scale. Engine calculates critical IT megawatts, thermal dissipation, and whitespace dimensions.',
      trackB_title: 'Track B: Bottom-Up',
      trackB_tag: 'Site & Grid Interconnect',
      trackB_desc: 'Start with available high-voltage substation interconnect megawatt capacity and land parcel acreage to determine achievable AI rack density and GPU capacity.',
      siliconTitle: 'AI Accelerator Architecture',
      clusterScaleTitle: 'Target Cluster Scale (Total Accelerators)',
      calculatedEnvelopes: 'Calculated White Space Envelopes',
      activeEnclosures: 'Active Enclosures',
      criticalIT: 'Critical IT Demand',
      whiteSpaceArea: 'White Space Area',
      coolantCirculation: 'Coolant Circulation',
      regionTitle: 'Deployment Region & Power Tariff',
      gridPrefix: 'Grid',
      summerAmbient: 'Summer Ambient',
      dryBulb: 'Dry',
      wetBulb: 'Wet',
      queueYears: 'yr queue',
      substationCapTitle: 'Substation Interconnect Cap (MW)',
      substationCapSub: 'Utility-committed MV feeder capacity',
      rackDensityTitle: 'Target Rack Density (kW)',
      rackDensitySub: 'Average kW per server cabinet',
      siteParcelTitle: 'Site Parcel Size (Acres)',
      siteParcelSub: 'Usable building & yard land footprint',
      btnNext: 'Proceed to Step 2: Component Physics'
    },
    subsystems: {
      title: 'Step 2: Component Engineering & Physical Plant',
      subtitle: 'Configure the electrical substation, power distribution, thermal cooling plant, energy storage, and structural envelope.',
      secElectrical: 'A. Substation & Power Infrastructure',
      secElectricalSub: 'Grid connection, transformation, on-site generation & battery backup',
      secMechanical: 'B. Thermal Loop & Heat Rejection Plant',
      secMechanicalSub: 'Liquid CDU manifolding, dry coolers, and heat rejection infrastructure',
      secFacility: 'C. Reliability Tier & Civil Envelope',
      secFacilitySub: 'Electrical/mechanical redundancy and facility modular construction method',
      substation: 'High-Voltage Substation Yard',
      substationSub: 'GIS compact indoor switchgear vs AIS air-insulated outdoor yard',
      dualFeed: 'Dual Utility Feeder Interconnect',
      dualFeedSub: 'Independent utility feeds for concurrent maintainability',
      transformers: 'Medium-to-Low Voltage Transformers',
      transformersSub: 'Solid-State Transformers (SST) vs Conventional Oil-Filled (LPT)',
      serverPower: 'Rack Power Distribution Topology',
      serverPowerSub: '800V DC central rectified busway vs traditional 480V AC distribution',
      btmGen: 'Behind-The-Meter (BTM) Generation',
      btmGenSub: 'On-site continuous power to bypass utility interconnection queue delays',
      bess: 'Battery Energy Storage (BESS)',
      bessSub: 'Ride-through power for dynamic AI training workload step transients',
      coolingLoop: 'In-Row Primary Cooling Loop',
      coolingLoopSub: 'Liquid heat transfer directly coupled to high-density GPU heat sinks',
      rejectionPlant: 'Secondary Heat Rejection Plant',
      rejectionPlantSub: 'Outdoor fluid coolers, hybrid towers, or mechanical chillers',
      redundancy: 'System Redundancy Architecture',
      redundancySub: 'Tier III N+1 concurrent maintainability vs Tier IV 2N fault tolerance',
      envelope: 'Civil Structural & Envelope Scheme',
      envelopeSub: 'Rapid pre-fabricated modular skids vs traditional on-site stick built',
      remedyApplied: 'Auto-remedy available'
    },
    synthesis: {
      title: 'Synthesis',
      viable: 'Physics Design Feasible',
      criticalViolation: 'Critical Design Alert',
      engineeringAlerts: 'Engineering Warnings',
      totalCapEx: 'Estimated Total CapEx',
      annualOpEx: 'Estimated Annual OpEx',
      designPUE: 'Design Annual PUE',
      wueMetric: 'Water Usage (WUE)',
      criticalPathLead: 'Critical Path Lead Time',
      projectedCOD: 'Target Commercial Operation (COD)',
      viewDeliverables: 'View Engineering Deliverables',
      autoFix: 'Auto-Fix'
    },
    deliverables: {
      title: 'Step 3: Engineering Deliverables & Commercial Analysis',
      subtitle: 'Inspect generated electrical and mechanical schematics, bill of materials, full campus CAD plans, and financial ROI models.',
      btnExport: 'Export Pitch Pack',
      btnSubmitEpc: 'Submit to CRM & EPC',
      btnCompare: 'Compare Designs',
      tabCampus: 'Campus Master Plan & 3D',
      tabSLD: 'Electrical Single-Line (SLD)',
      tabPID: 'Mechanical Piping & Instrumentation (P&ID)',
      tabBOM: 'Itemized Bill of Materials (BOM)',
      tabFinancial: 'Commercial ROI & TCO Model',
      tabSignoff: 'Engineering Governance Sign-Off',
      visualizerIsometric: '3D Isometric',
      visualizerSite: '2D Site Layout',
      visualizerThermal: 'Thermal FLIR',
      lightCanvas: 'Light Canvas',
      darkCanvas: 'Dark Canvas',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      campusMetricsTotalRacks: 'Total Enclosures',
      campusMetricsITLoad: 'Critical IT Load',
      campusMetricsTotalFootprint: 'Total Footprint',
      campusMetricsCapEx: 'Total Estimated CapEx',
      campusMetricsOpEx: 'Annual Power & OpEx',
      campusMetricsPUE: 'PUE / Cooling Efficiency',
      campusMetricsCOD: 'Target Commissioning COD'
    },
    readme: {
      title: 'About & Project README',
      subtitle: 'AZ AI Data Center Design Studio • Developer: George Zhang',
      overviewTitle: 'System Overview',
      overviewText: 'Engineered an interactive software for AI data center design that converts workload requirements into preliminary facility plans. Users configure GPUs, racks, substations, switchgear, 800V DC power, batteries, generators, cooling, and redundancy. It calculates capacity, PUE, costs, footprint, water use, and schedule, then generates engineering, financial, visualization, and proposal deliverable packages.',
      workflowTitle: 'Three-Stage Design & Configuration Workflow',
      stage1Title: 'Workload Ingress and Sizing',
      stage1Item1: 'Select AI accelerator architecture, rack density, GPU count, and deployment region.',
      stage1Item2: 'System calculates estimated racks, critical IT load, white-space area, and coolant flow.',
      stage2Title: 'Component Engineering',
      stage2Item1: 'Configure substations, GIS/AIS yards, transformers, 800V DC or 480V AC distribution, generators, batteries, cooling systems, redundancy, and building structure.',
      stage2Item2: 'Continuously show engineering, cost, capacity, PUE, water usage, footprint, lead time, and projected COD metrics.',
      stage3Title: 'Deliverables and ROI',
      stage3Item1: 'Generate or view aerial campus plans, electrical single-lines, mechanical P&IDs, ROI/TCO, BOMs, ESG analysis, 3D isometrics, site layouts, and thermal views.',
      stage3Item2: 'Export a pitch pack, or submit the design to CRM estimating and EPC workflows.',
      contactTitle: 'Collaboration & Inquiries',
      contactText: 'This is a conceptual demonstration. If you think it could become a useful application, we can collaborate to make it happen. Please get in touch with the author:',
      contactAuthor: 'George Zhang',
      emailBtn: 'z_george@yahoo.com',
      copiedNotice: 'Email copied to clipboard!',
      linkedinBtn: 'Connect on LinkedIn'
    },
    exportModal: {
      title: 'Export FEED Pitch Pack & Project Artifacts',
      subtitle: 'Generate client-ready documentation, engineering schematics, and structured data for capital allocation, utility interconnection filings, and EPC vendor engagement.',
      opt1Title: 'Front-End Engineering Design (FEED) Deck',
      opt1Desc: 'Comprehensive 4-page formal engineering package with SLD diagrams, P&ID fluid loop schedules, and executive baseline.',
      opt1Btn: 'Download Vector PDF Deck',
      opt2Title: 'Itemized Bill of Materials (BOM)',
      opt2Desc: 'Structured CSV containing equipment model numbers, vendor lead times, unit costs, and CapEx allocations.',
      opt2Btn: 'Download BOM (.CSV)',
      opt3Title: 'Raw Configuration JSON Spec',
      opt3Desc: 'Machine-readable snapshot for CI/CD pipelines, digital twins, and programmatic API integrations.',
      opt3Btn: 'Copy Raw JSON',
      opt4Title: 'Executive Summary Markdown',
      opt4Desc: 'Clean Markdown briefing summarizing MW capacity, thermal metrics, and projected commercial timelines.',
      opt4Btn: 'Copy Executive Brief',
      footerSubmit: 'Submit to CRM & EPC',
      footerClose: 'Close'
    },
    epcModal: {
      title: 'Submit Design to CRM & EPC Estimating Pipeline',
      subtitle: 'Push validated front-end engineering design packages directly into enterprise estimating pipelines, CRM lead routing, and EPC partner pre-qualification.',
      pipelineStage: 'Enterprise Estimating Stage',
      facilityDesignPack: 'Facility FEED Design Package',
      itCapacity: 'Critical IT Capacity',
      facilityDemand: 'Total Facility Demand',
      estCapEx: 'Estimated CapEx',
      targetCOD: 'Projected COD Date',
      contractorSelect: 'Select Qualified EPC Contractor Partner',
      submitSuccess: 'Package successfully submitted to CRM & EPC estimating workflow!',
      submitBtn: 'Push to CRM & Estimating',
      closeBtn: 'Close'
    },
    compareModal: {
      title: 'Reference Architecture Comparison Matrix',
      subtitle: 'Evaluate your active custom engineering design side-by-side with industry validated baseline architectures.',
      colMetric: 'Design Metric',
      colCurrent: 'Current Active Design',
      colFlagship: '100 MW Blackwell Flagship',
      colModular: '20 MW Rapid Modular Edge',
      metricAccelerators: 'AI Accelerator Silicon',
      metricRacks: 'Total Active Enclosures',
      metricITLoad: 'Critical IT Load',
      metricFacilityLoad: 'Total Facility Demand',
      metricPUE: 'Design Annual PUE',
      metricTotalCapEx: 'Estimated Total CapEx',
      metricAnnualOpEx: 'Estimated Annual OpEx',
      metricCooling: 'Primary Cooling Loop',
      metricPowerArch: 'Rack Power Distribution',
      metricLeadTime: 'Critical Path Lead Time',
      metricCOD: 'Target Commissioning COD',
      closeBtn: 'Close Comparison'
    }
  },
  zh: {
    common: {
      appTitle: 'AZ智算中心设计智能体',
      developer: '开发者：George Zhang',
      version: 'v1.1.0',
      next: '下一步',
      prev: '上一步',
      active: '已生效',
      select: '选择',
      close: '关闭',
      copy: '复制',
      copied: '已复制！',
      download: '下载',
      submit: '提交',
      cancel: '取消',
      gpus: '颗 GPU',
      racks: '个机柜',
      mw: 'MW 兆瓦',
      gw: 'GW 吉瓦',
      sqft: '平方英尺',
      gpm: '加仑/分钟 (GPM)',
      years: '年',
      weeks: '周',
      tons: '冷吨 (RT)',
      perKWh: '/千瓦时 ($/kWh)',
      perYear: '/年',
      generating: '正在生成 PDF 工程案卷...'
    },
    header: {
      step1: '1. 工作负载与规模初拟',
      step2: '2. 组件物理与系统工程',
      step3: '3. 交付成果与投资回报',
      readme: '工程指南',
      langLabel: '语言'
    },
    workload: {
      title: '第一步：工作负载引入与初步规模测算',
      subtitle: '选择工程切入路径：自顶向下由 AI 算力负载推算，或自底向上受限于电网供电容量及用地约束。',
      presetsTitle: '经验证的标准参考架构',
      presetsSubtitle: '一键快速载入预设配置',
      trackA_title: '路径 A：自顶向下',
      trackA_tag: '算力与集群规模驱动',
      trackA_desc: '选定 AI 加速芯片（GB200 NVL72、B200、H100）及集群规模。计算引擎实时推算关键 IT 兆瓦数、散热负荷及机房物理面积。',
      trackB_title: '路径 B：自底向上',
      trackB_tag: '站点与电网容量驱动',
      trackB_desc: '根据变电站可用供电容量（MW）与场地面积，反向推导可容纳的最大 AI 机柜密度与 GPU 算力极限。',
      siliconTitle: 'AI 加速器芯片与机架架构',
      clusterScaleTitle: '目标集群规模（总加速卡数量）',
      calculatedEnvelopes: '实时计算之机房物理指标',
      activeEnclosures: '在运机柜总量',
      criticalIT: '关键 IT 功耗需求',
      whiteSpaceArea: '机房白区净面积',
      coolantCirculation: '冷却液循环流量',
      regionTitle: '部署区域与工业用电费率',
      gridPrefix: '电网',
      summerAmbient: '夏季设计环境',
      dryBulb: '干球',
      wetBulb: '湿球',
      queueYears: '年排队周期',
      substationCapTitle: '变电站引入容量限制 (MW)',
      substationCapSub: '电力公司已核准的中压供电负荷',
      rackDensityTitle: '目标机柜设计密度 (kW/机柜)',
      rackDensitySub: '单机柜平均热负荷与配电规格',
      siteParcelTitle: '规划用地面积 (英亩 / Acres)',
      siteParcelSub: '机房主体与变电站室外设施用地',
      btnNext: '进入第二步：组件物理与系统工程'
    },
    subsystems: {
      title: '第二步：系统工程与物理设施配置',
      subtitle: '细化配置高压变电站、中压配电、一次/二次液冷管路、自备应急电源、电池储能及建筑结构方案。',
      secElectrical: 'A. 变电站与电力能源基础设施',
      secElectricalSub: '市电进线、电压转换、场内发电及电池储能保障',
      secMechanical: 'B. 冷却循环回路与室外冷源系统',
      secMechanicalSub: '芯片级液冷分配单元 (CDU)、密闭绝热冷却器及散热系统',
      secFacility: 'C. 可靠性冗余等级与土建工程方案',
      secFacilitySub: '机电系统容错冗余标准与现场装配式模块化施工工法',
      substation: '高压进线变电站形式',
      substationSub: 'GIS 紧凑型室内六氟化硫开关站 vs AIS 传统空气绝缘室外变电站',
      dualFeed: '双回路独立市电进线',
      dualFeedSub: '两条完全物理隔离的供电电网路由，支持在线维护与无缝切换',
      transformers: '中低压降压变压器类型',
      transformersSub: '固态电力电子变压器 (SST) vs 传统油浸式大型变压器 (LPT)',
      serverPower: '机柜内部配电拓扑结构',
      serverPowerSub: '800V DC 直流母线集中整流 vs 传统 480V AC 交流三次配电',
      btmGen: '场内自备电站 (BTM 隔墙电厂)',
      btmGenSub: '就地部署航改燃气轮机或往复式内燃机，规避电网 3-5 年漫长排队',
      bess: '电池储能系统 (BESS)',
      bessSub: '平抑大模型分布式训练负载瞬态脉冲，提供不间断电网支撑',
      coolingLoop: '机架内主冷却循环方式',
      coolingLoopSub: '芯片级液-液直冷 (D2C) 或两相全浸没式液冷技术',
      rejectionPlant: '室外二级散热冷源方案',
      rejectionPlantSub: '零水耗密闭绝热干冷器、混流冷却塔或带自然冷却冷水机组',
      redundancy: '系统可靠性与机电冗余架构',
      redundancySub: 'Tier III N+1 在线可维护标准 vs Tier IV 2N 容错双活架构',
      envelope: '建筑土建与结构外壳方案',
      envelopeSub: '工厂预制集装箱模块化撬块 vs 传统现场混凝土钢结构现浇',
      remedyApplied: '提供工程自动修复方案'
    },
    synthesis: {
      title: '实时工程综合评估',
      viable: '物理可行性校验通过',
      criticalViolation: '物理约束严重违规',
      engineeringAlerts: '工程设计警示',
      totalCapEx: '预估总投资 (CapEx)',
      annualOpEx: '预估年度运营成本 (OpEx)',
      designPUE: '全年平均综合 PUE',
      wueMetric: '水资源利用效率 (WUE)',
      criticalPathLead: '供应链关键路径周期',
      projectedCOD: '预计投产商业运营日 (COD)',
      viewDeliverables: '查看完整工程交付成果',
      autoFix: '一键自动修复'
    },
    deliverables: {
      title: '第三步：工程交付物案卷与商业可行性评估',
      subtitle: '审阅自动生成的电气单线图、暖通管道仪表图 (P&ID)、详细设备物料清单 (BOM)、三维园区渲染及财务收益模型。',
      btnExport: '导出项目提案包',
      btnSubmitEpc: '提交至 CRM 与 EPC 概算',
      btnCompare: '方案横向对比',
      tabCampus: '园区总体规划与 3D 渲染',
      tabSLD: '电气高低压单线图 (SLD)',
      tabPID: '暖通管道与仪表流程图 (P&ID)',
      tabBOM: '设备物料清单与供应链 (BOM)',
      tabFinancial: '商业 ROI 与 TCO 经济模型',
      tabSignoff: '主任工程师工程校审签章',
      visualizerIsometric: '3D 轴测透视',
      visualizerSite: '2D 总平面布局',
      visualizerThermal: '热成像 FLIR',
      lightCanvas: '亮色底图',
      darkCanvas: '暗色底图',
      zoomIn: '放大画布',
      zoomOut: '缩小画布',
      campusMetricsTotalRacks: '在运机柜总量',
      campusMetricsITLoad: 'IT 关键负荷需求',
      campusMetricsTotalFootprint: '占地总面积',
      campusMetricsCapEx: '预计项目总投资',
      campusMetricsOpEx: '年均电费与综合能耗',
      campusMetricsPUE: '能效指标 PUE / 冷却系数',
      campusMetricsCOD: '计划通电投运日 (COD)'
    },
    readme: {
      title: '关于系统与项目工程说明 (README)',
      subtitle: 'AZ 智算中心工程设计工作台 • 开发者：George Zhang',
      overviewTitle: '系统概述',
      overviewText: '本系统是一套面向未来吉瓦级 AI 智算中心的互动式工程设计软件，能够将高密算力需求直接转化为可落地的初步设施规划方案。工程人员可自主配置 GPU 芯片规格、机柜密度、高压变电站、中压配电、800V DC 直流母线、储能电池、场内发电、液冷散热及冗余等级。系统内建严谨的热力学与电气计算核心，自动推算供电容量、PUE、投资成本、占地面积、用水量和工程工期，并生成可直接用于报建与招投标的工程交付包。',
      workflowTitle: '三阶段设计与配置工程流程',
      stage1Title: '阶段一：工作负载引入与规模测算',
      stage1Item1: '选择 AI 加速器芯片架构、单柜功率密度、GPU 总集群规模及目标部署地理区域。',
      stage1Item2: '计算引擎自动推导所需机柜数、IT 关键总功率、白区建筑面积及冷却液循环流量需求。',
      stage2Title: '阶段二：组件物理与系统工程深化',
      stage2Item1: '细化配置高压变电站（GIS/AIS 开关站）、变压器规格、800V DC 或 480V AC 配电、场内发电、电池储能、液冷回路、冗余等级和建筑工法。',
      stage2Item2: '实时监测物理可行性、工程投资、供电容量、PUE、耗水量、占地面积、设备供应链交期及预计商业投产日 (COD)。',
      stage3Title: '阶段三：交付成果物与投资收益评估',
      stage3Item1: '自动生成并查看园区三维鸟瞰图、电气高压单线图、暖通 P&ID 管道仪表图、ROI/TCO 分析、物料清单 (BOM)、ESG 碳足迹报告及热成像云图。',
      stage3Item2: '一键导出标准立项 Pitch Pack 案卷，或无缝提交至 CRM 销售漏斗与总包 EPC 概算预算工作流。',
      contactTitle: '合作交流与项目探讨',
      contactText: '本系统目前为概念验证原型。若您认为该工具有助于提升智算中心工程规划效率，欢迎与作者携手推进产品化落地。敬请联系作者：',
      contactAuthor: 'George Zhang',
      emailBtn: 'z_george@yahoo.com',
      copiedNotice: '邮箱地址已复制到剪贴板！',
      linkedinBtn: '在领英 (LinkedIn) 上建立联系'
    },
    exportModal: {
      title: '导出 FEED 工程提案案卷与项目资料包',
      subtitle: '生成面向投资人、政府电网报批、供电局并网审查及 EPC 总包商招投标的完整前端工程设计 (FEED) 成果包。',
      opt1Title: '前端工程设计 (FEED) 完整 PDF 报告',
      opt1Desc: '包含电气 SLD 单线图、暖通 P&ID 管路平衡表及主要机电技术规范的 4 页正式工程文档。',
      opt1Btn: '下载高保真矢量 PDF 案卷',
      opt2Title: '细化设备采购物料清单 (BOM)',
      opt2Desc: '包含关键设备型号、供应商长周期备货周期、单价概算及分项投资明细的 CSV 表格。',
      opt2Btn: '下载物料清单 (.CSV)',
      opt3Title: '原始工程配置 JSON 规范',
      opt3Desc: '用于 CI/CD 流水线、数字孪生系统及第三方自动化接口对接的标准数据快照。',
      opt3Btn: '复制原始 JSON 格式',
      opt4Title: '高管汇报摘要 Markdown 文档',
      opt4Desc: '简洁梳理兆瓦级功耗、散热平衡指标及商业交付时间线的 Markdown 文本。',
      opt4Btn: '复制高管汇报文案',
      footerSubmit: '提交至 CRM 与 EPC 概算',
      footerClose: '关闭'
    },
    epcModal: {
      title: '提交设计方案至 CRM 销售漏斗与 EPC 预算系统',
      subtitle: '将经过物理验证的前端工程设计案卷直接推送至企业项目管理系统与 EPC 总包合作商预算管道。',
      pipelineStage: '企业概算推进阶段',
      facilityDesignPack: '智算中心 FEED 核心工程案卷',
      itCapacity: '关键 IT 规划容量',
      facilityDemand: '全厂设计供电总容量',
      estCapEx: '预估总投资 (CapEx)',
      targetCOD: '计划通电投产日 (COD)',
      contractorSelect: '选择具备资质的 EPC 战略合作承包商',
      submitSuccess: '工程方案已成功推送至 CRM 销售管理与 EPC 概算通道！',
      submitBtn: '确认提交至 CRM 与总包概算',
      closeBtn: '关闭'
    },
    compareModal: {
      title: '参考架构设计方案横向比对矩阵',
      subtitle: '将当前定制的工程配置与行业公认的成熟旗舰标准架构进行多维度技术与经济性对比。',
      colMetric: '工程与商业指标',
      colCurrent: '当前自定义设计',
      colFlagship: '100 MW Blackwell 旗舰训练中心',
      colModular: '20 MW 边缘快速预制模块中心',
      metricAccelerators: 'AI 加速器芯片架构',
      metricRacks: '在运机柜总数量',
      metricITLoad: 'IT 关键计算总负荷',
      metricFacilityLoad: '全厂供电需求总负荷',
      metricPUE: '全年平均综合 PUE',
      metricTotalCapEx: '预估工程总投资 (CapEx)',
      metricAnnualOpEx: '年均运营能耗成本 (OpEx)',
      metricCooling: '机架一次侧冷却循环',
      metricPowerArch: '机柜内部配电拓扑',
      metricLeadTime: '供应链关键长周期瓶颈',
      metricCOD: '预计商业通电投产日期 (COD)',
      closeBtn: '关闭对比矩阵'
    }
  },
  fr: {
    common: {
      appTitle: 'Studio de Conception de Datacenter IA AZ',
      developer: 'Développeur : George Zhang',
      version: 'v1.1.0',
      next: 'Étape Suivante',
      prev: 'Étape Précédente',
      active: 'Actif',
      select: 'Sélectionner',
      close: 'Fermer',
      copy: 'Copier',
      copied: 'Copié !',
      download: 'Télécharger',
      submit: 'Soumettre',
      cancel: 'Annuler',
      gpus: 'GPU',
      racks: 'Baies',
      mw: 'MW',
      gw: 'GW',
      sqft: 'pi²',
      gpm: 'GPM (gal/min)',
      years: 'ans',
      weeks: 'semaines',
      tons: 'tonnes (RT)',
      perKWh: '/kWh',
      perYear: '/an',
      generating: 'Génération du dossier PDF...'
    },
    header: {
      step1: '1. Ingestion de Charge',
      step2: '2. Physique des Composants',
      step3: '3. Livrables & Rentabilité',
      readme: 'Guide / README',
      langLabel: 'Langue'
    },
    workload: {
      title: 'Étape 1 : Ingestion de Charge & Dimensionnement Préliminaire',
      subtitle: 'Choisissez votre approche d\'ingénierie : dimensionnement descendant basé sur les accélérateurs IA, ou ascendant contraint par le réseau électrique.',
      presetsTitle: 'Architectures de Référence Validées',
      presetsSubtitle: 'Configuration Rapide en 1 Clic',
      trackA_title: 'Piste A : Descendante (Top-Down)',
      trackA_tag: 'Calcul & Échelle de Cluster',
      trackA_desc: 'Définissez le silicium (GB200 NVL72, B200, H100) et l\'échelle de cluster GPU. Le moteur calcule les mégawatts informatiques, la dissipation thermique et la surface nécessaire.',
      trackB_title: 'Piste B : Ascendante (Bottom-Up)',
      trackB_tag: 'Raccordement Réseau & Foncier',
      trackB_desc: 'Partez de la puissance disponible au poste source et de la superficie du terrain pour déduire la densité de baies et la capacité GPU atteignables.',
      siliconTitle: 'Architecture des Accélérateurs IA',
      clusterScaleTitle: 'Échelle Cible du Cluster (Accélérateurs Totaux)',
      calculatedEnvelopes: 'Enveloppe Physique et Spatiale Calculée',
      activeEnclosures: 'Baies Informatiques Actives',
      criticalIT: 'Puissance IT Critique',
      whiteSpaceArea: 'Surface Utile Salles Blanches',
      coolantCirculation: 'Débit de Fluide Caloporteur',
      regionTitle: 'Région de Déploiement & Tarif Électrique',
      gridPrefix: 'Réseau',
      summerAmbient: 'Ambiance Été',
      dryBulb: 'Sec',
      wetBulb: 'Humide',
      queueYears: 'ans d\'attente',
      substationCapTitle: 'Capacité Raccordement Poste (MW)',
      substationCapSub: 'Capacité d\'alimentation moyenne tension réservée',
      rackDensityTitle: 'Densité Cible par Baie (kW)',
      rackDensitySub: 'Puissance moyenne par armoire serveur',
      siteParcelTitle: 'Superficie du Terrain (Acres)',
      siteParcelSub: 'Emprise au sol utilisable pour bâtiments et cours',
      btnNext: 'Passer à l\'Étape 2 : Physique des Composants'
    },
    subsystems: {
      title: 'Étape 2 : Ingénierie des Composants & Installations',
      subtitle: 'Configurez le poste haute tension, la distribution électrique, la centrale thermique de refroidissement, le stockage d\'énergie et l\'enveloppe du bâtiment.',
      secElectrical: 'A. Poste Source & Infrastructure Électrique',
      secElectricalSub: 'Raccordement réseau, transformation, production locale et stockage par batteries',
      secMechanical: 'B. Boucle Thermique & Rejet de Chaleur',
      secMechanicalSub: 'Distribution liquide CDU, aéroréfrigérants et infrastructures de refroidissement',
      secFacility: 'C. Niveau de Redondance & Bâtiment',
      secFacilitySub: 'Tolérance aux pannes électrique/mécanique et méthode de construction modulaire',
      substation: 'Poste de Transformation Haute Tension',
      substationSub: 'Poste sous enveloppe métallique (GIS) vs poste ouvert isolé dans l\'air (AIS)',
      dualFeed: 'Raccordement Réseau à Double Alimentation',
      dualFeedSub: 'Lignes réseau indépendantes pour une maintenabilité simultanée',
      transformers: 'Transformateurs Moyenne / Basse Tension',
      transformersSub: 'Transformateurs à état solide (SST) vs transformateurs conventionnels à huile (LPT)',
      serverPower: 'Topologie de Distribution Électrique Baies',
      serverPowerSub: 'Jeu de barres 800V DC centralisé vs distribution traditionnelle 480V AC',
      btmGen: 'Production d\'Énergie sur Site (BTM)',
      btmGenSub: 'Production locale continue pour contourner les délais de raccordement au réseau',
      bess: 'Stockage d\'Énergie par Batteries (BESS)',
      bessSub: 'Absorption des transitoires de charge liés à l\'entraînement de modèles IA',
      coolingLoop: 'Boucle de Refroidissement Primaire',
      coolingLoopSub: 'Refroidissement liquide direct-sur-puce (D2C) ou immersion totale',
      rejectionPlant: 'Centrale de Rejet Thermique Secondaire',
      rejectionPlantSub: 'Aéroréfrigérants adiabatiques secs, tours hybrides ou groupes froids',
      redundancy: 'Architecture de Redondance du Système',
      redundancySub: 'Maintenabilité simultanée Tier III N+1 vs tolérance aux pannes Tier IV 2N',
      envelope: 'Enveloppe et Structure du Bâtiment',
      envelopeSub: 'Skids modulaires préfabriqués en usine vs construction traditionnelle sur site',
      remedyApplied: 'Correction automatique recommandée'
    },
    synthesis: {
      title: 'Synthèse en Temps Réel',
      viable: 'Conception Physique Faisable',
      criticalViolation: 'Alerte Critique de Conception',
      engineeringAlerts: 'Avertissements d\'Ingénierie',
      totalCapEx: 'CapEx Total Estimé',
      annualOpEx: 'OpEx Annuel Estimé',
      designPUE: 'PUE Annuel Calculé',
      wueMetric: 'Consommation d\'Eau (WUE)',
      criticalPathLead: 'Délai sur le Chemin Critique',
      projectedCOD: 'Date Cible de Mise en Service (COD)',
      viewDeliverables: 'Consulter les Livrables d\'Ingénierie',
      autoFix: 'Corriger Auto'
    },
    deliverables: {
      title: 'Étape 3 : Livrables d\'Ingénierie & Analyse Commerciale',
      subtitle: 'Consultez les schémas électriques et mécaniques générés, la nomenclature d\'équipements, les plans du campus et les modèles de rentabilité financière.',
      btnExport: 'Exporter le Pitch Pack',
      btnSubmitEpc: 'Transmettre au CRM & Devis EPC',
      btnCompare: 'Comparer les Conceptions',
      tabCampus: 'Plan Masse du Campus & 3D',
      tabSLD: 'Schéma Unifilaire Électrique (SLD)',
      tabPID: 'Schéma Tuyauterie & Instrumentation (P&ID)',
      tabBOM: 'Nomenclature Détaillée (BOM)',
      tabFinancial: 'Modèle Financier ROI & TCO',
      tabSignoff: 'Visa et Approbation de l\'Ingénierie',
      visualizerIsometric: 'Isométrique 3D',
      visualizerSite: 'Plan 2D du Site',
      visualizerThermal: 'Infrarouge FLIR',
      lightCanvas: 'Fond Clair',
      darkCanvas: 'Fond Sombre',
      zoomIn: 'Zoom Avant',
      zoomOut: 'Zoom Arrière',
      campusMetricsTotalRacks: 'Baies Informatiques',
      campusMetricsITLoad: 'Charge IT Critique',
      campusMetricsTotalFootprint: 'Emprise au Sol Totale',
      campusMetricsCapEx: 'Investissement Estimé (CapEx)',
      campusMetricsOpEx: 'Coût Annuel d\'Énergie & OpEx',
      campusMetricsPUE: 'Efficacité PUE / Refroidissement',
      campusMetricsCOD: 'Mise en Service Cible (COD)'
    },
    readme: {
      title: 'À Propos & Manuel du Projet (README)',
      subtitle: 'AZ AI Data Center Design Studio • Développeur : George Zhang',
      overviewTitle: 'Présentation du Système',
      overviewText: 'Logiciel interactif conçu pour l\'ingénierie de datacenters IA convertissant les exigences de charge en plans préliminaires d\'installations. Les utilisateurs configurent les GPU, les baies, les postes haute tension, les tableaux, l\'alimentation 800V DC, les batteries, les générateurs, le refroidissement et la redondance. Le moteur calcule la capacité, le PUE, les coûts, l\'empreinte spatiale, l\'eau et le calendrier, puis génère des dossiers complets d\'ingénierie, financiers, visuels et commerciaux.',
      workflowTitle: 'Flux de Travail en Trois Étapes de Conception',
      stage1Title: '1. Ingestion de Charge et Dimensionnement',
      stage1Item1: 'Sélectionnez l\'architecture de processeur IA, la densité de baie, le nombre de GPU et la zone géographique.',
      stage1Item2: 'Le système déduit le nombre de baies, la charge IT critique, la surface blanche et les débits hydrauliques.',
      stage2Title: '2. Ingénierie des Composants',
      stage2Item1: 'Configurez les postes HT (GIS/AIS), transformateurs, distribution 800V DC ou 480V AC, groupes électrogènes, batteries, refroidissement, redondance et bâtiment.',
      stage2Item2: 'Affichez en continu les métriques d\'ingénierie, coûts, capacité, PUE, eau, délais et date de mise en service (COD).',
      stage3Title: '3. Livrables et Rentabilité (ROI)',
      stage3Item1: 'Générez et visualisez les plans masse aériens, schémas unifilaires, schémas P&ID, ROI/TCO, nomenclatures (BOM), analyse ESG, vues isométriques et thermiques.',
      stage3Item2: 'Exportez un pitch pack complet ou poussez le projet vers les flux d\'estimation CRM et d\'appels d\'offres EPC.',
      contactTitle: 'Collaboration & Contacts',
      contactText: 'Il s\'agit d\'une démonstration conceptuelle. Si vous estimez que cet outil peut accélérer la conception de vos projets d\'infrastructures IA, nous pouvons collaborer. Contactez l\'auteur :',
      contactAuthor: 'George Zhang',
      emailBtn: 'z_george@yahoo.com',
      copiedNotice: 'Adresse e-mail copiée dans le presse-papier !',
      linkedinBtn: 'Rejoindre sur LinkedIn'
    },
    exportModal: {
      title: 'Exporter le Dossier FEED & Documents du Projet',
      subtitle: 'Générez la documentation client, les schémas d\'ingénierie et les données structurées pour l\'allocation de capitaux, les demandes de raccordement et la sélection EPC.',
      opt1Title: 'Dossier FEED (Front-End Engineering Design)',
      opt1Desc: 'Dossier complet de 4 pages avec schémas SLD, schémas fluidiques P&ID et synthèse de direction.',
      opt1Btn: 'Télécharger le PDF Vectoriel',
      opt2Title: 'Nomenclature des Équipements (BOM)',
      opt2Desc: 'Fichier CSV structuré contenant les références, les délais fabricants, les coûts unitaires et la ventilation CapEx.',
      opt2Btn: 'Télécharger la BOM (.CSV)',
      opt3Title: 'Spécification Brute JSON',
      opt3Desc: 'Instantané lisible par machine pour les pipelines CI/CD, jumeaux numériques et intégrations API.',
      opt3Btn: 'Copier le JSON Brut',
      opt4Title: 'Synthèse Exécutive en Markdown',
      opt4Desc: 'Note de synthèse au format Markdown résumant la puissance en MW, les métriques thermiques et le calendrier.',
      opt4Btn: 'Copier la Note Exécutive',
      footerSubmit: 'Soumettre au CRM & EPC',
      footerClose: 'Fermer'
    },
    epcModal: {
      title: 'Transmettre la Conception au CRM & Estimation EPC',
      subtitle: 'Injectez directement les dossiers d\'ingénierie validés dans vos flux de devis d\'entreprise et de préqualification des partenaires EPC.',
      pipelineStage: 'Étape d\'Estimation d\'Entreprise',
      facilityDesignPack: 'Dossier de Conception FEED du Datacenter',
      itCapacity: 'Capacité Informatique Critique',
      facilityDemand: 'Demande Électrique Totale du Site',
      estCapEx: 'Investissement Estimé (CapEx)',
      targetCOD: 'Date Cible de Mise en Service (COD)',
      contractorSelect: 'Sélectionner le Partenaire EPC Qualifié',
      submitSuccess: 'Dossier transmis avec succès au pipeline CRM & chiffrage EPC !',
      submitBtn: 'Pousser vers CRM & Estimation',
      closeBtn: 'Fermer'
    },
    compareModal: {
      title: 'Matrice de Comparaison des Architectures',
      subtitle: 'Comparez votre conception personnalisée côte à côte avec les architectures de référence validées par l\'industrie.',
      colMetric: 'Métrique de Conception',
      colCurrent: 'Conception Active Actuelle',
      colFlagship: '100 MW Blackwell Flagship',
      colModular: '20 MW Edge Modulaire Rapide',
      metricAccelerators: 'Processeur IA Accélérateur',
      metricRacks: 'Baies Informatiques Actives',
      metricITLoad: 'Charge IT Critique',
      metricFacilityLoad: 'Demande Totale du Site',
      metricPUE: 'PUE Annuel Calculé',
      metricTotalCapEx: 'Investissement Total Estimé',
      metricAnnualOpEx: 'Coût OpEx Annuel Estimé',
      metricCooling: 'Boucle de Refroidissement Primaire',
      metricPowerArch: 'Distribution Électrique Baies',
      metricLeadTime: 'Délai sur le Chemin Critique',
      metricCOD: 'Date Cible de Mise en Service',
      closeBtn: 'Fermer la Comparaison'
    }
  }
};

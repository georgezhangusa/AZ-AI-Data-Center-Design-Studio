import React, { useMemo, useState } from 'react';
import { ARCHITECTURE_PRESETS } from './data/presets';
import { DataCenterConfig } from './types/datacenter';
import { calculateEngineeringMetrics } from './utils/engineeringEngine';
import { Header } from './components/Header';
import { WorkloadStep } from './components/WorkloadStep';
import { SubsystemsStep } from './components/SubsystemsStep';
import { DeliverablesStep } from './components/DeliverablesStep';
import { LiveSynthesisSidebar } from './components/LiveSynthesisSidebar';
import { CompareModal } from './components/CompareModal';
import { PushToEpcModal } from './components/PushToEpcModal';
import { FormalDesignDocPrint } from './components/FormalDesignDocPrint';
import { DeliverablesModal } from './components/DeliverablesModal';
import { ExportPitchPackModal } from './components/ExportPitchPackModal';
import { ReadmeModal } from './components/ReadmeModal';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isPushEpcOpen, setIsPushEpcOpen] = useState<boolean>(false);
  const [isDeliverablesModalOpen, setIsDeliverablesModalOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isReadmeOpen, setIsReadmeOpen] = useState<boolean>(false);

  // Core Data Center Configuration State
  const [config, setConfig] = useState<DataCenterConfig>({
    ingressMode: 'top-down',
    gpuType: 'gb200',
    gpuCount: 1000000,
    region: 'us-east',
    fixedUtilityMW: 50,
    targetRackDensityKW: 120,
    landAcreage: 25,
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
  });

  // Real-time engineering physics and cost calculations
  const calc = useMemo(() => {
    return calculateEngineeringMetrics(config);
  }, [config]);

  const handleUpdateConfig = (updates: Partial<DataCenterConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = ARCHITECTURE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setConfig({ ...preset.config });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Global Navigation Top Bar */}
      <Header
        currentStep={currentStep}
        onSetStep={setCurrentStep}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenPushEpc={() => setIsPushEpcOpen(true)}
        onPrint={handlePrint}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenReadme={() => setIsReadmeOpen(true)}
      />

      {/* 2. Main Studio Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Step Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {currentStep === 1 && (
            <WorkloadStep
              config={config}
              calc={calc}
              onChangeConfig={handleUpdateConfig}
              onApplyPreset={handleApplyPreset}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <SubsystemsStep
              config={config}
              calc={calc}
              onChangeConfig={handleUpdateConfig}
              onPrev={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <DeliverablesStep
              config={config}
              calc={calc}
              onOpenPushEpc={() => setIsPushEpcOpen(true)}
              onPrint={handlePrint}
              onOpenExport={() => setIsExportOpen(true)}
              onOpenCompare={() => setIsCompareOpen(true)}
            />
          )}
        </main>

        {/* Right Synthesis Sidebar */}
        <LiveSynthesisSidebar
          config={config}
          calc={calc}
          currentStep={currentStep}
          onSetStep={setCurrentStep}
          onOpenDeliverablesModal={() => setIsDeliverablesModalOpen(true)}
        />
      </div>

      {/* 3. Multi-Configuration Comparison Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentConfig={config}
        currentCalc={calc}
        onApplyPreset={handleApplyPreset}
      />

      {/* 4. CRM & EPC Estimating Pipeline Modal */}
      <PushToEpcModal
        isOpen={isPushEpcOpen}
        onClose={() => setIsPushEpcOpen(false)}
        config={config}
        calc={calc}
      />

      {/* 5. Comprehensive FEED Deliverables Package Modal */}
      <DeliverablesModal
        isOpen={isDeliverablesModalOpen}
        onClose={() => setIsDeliverablesModalOpen(false)}
        config={config}
        calc={calc}
        onPrint={handlePrint}
        onOpenPushEpc={() => setIsPushEpcOpen(true)}
        onGoToStep3={() => {
          setCurrentStep(3);
          setIsDeliverablesModalOpen(false);
        }}
      />

      {/* 6. Export Pitch Pack & Deliverables Modal */}
      <ExportPitchPackModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
        calc={calc}
        onPrint={handlePrint}
        onOpenPushEpc={() => setIsPushEpcOpen(true)}
      />

      {/* 7. Print Layout for Formal Design Document & FEED Deck */}
      <FormalDesignDocPrint config={config} calc={calc} />

      {/* 8. About & Project README Modal */}
      <ReadmeModal
        isOpen={isReadmeOpen}
        onClose={() => setIsReadmeOpen(false)}
      />
    </div>
  );
}

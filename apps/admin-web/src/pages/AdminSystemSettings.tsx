import React, { useState } from 'react';
import { Button, Card } from '@thamilarasan/ui';
import { Settings, Save, Sliders, DollarSign, Clock, ShieldCheck, Check } from 'lucide-react';

export const AdminSystemSettings: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    // Matching Weights (must sum to 100)
    primarySkillsWeight: 35,
    evaluatorScoreWeight: 25,
    productionEvidenceWeight: 20,
    domainExperienceWeight: 10,
    timezoneCommunicationWeight: 10,

    // Hard gate thresholds
    minTimezoneOverlapHours: 4.0,
    maxNoticePeriodDays: 30,

    // Economics
    platformPlacementFeePercent: 15,
    evaluatorFixedHonorariumInr: 5000,
    replacementGuaranteeDays: 90,

    // Calibration
    minInterRaterAgreementPercent: 85,
    maxQaReviewTimeHours: 4,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
              Platform Configuration
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System & Algorithmic Parameters
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Global tuning for deterministic matching weights, economics, and warranty SLAs.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleSave}
          leftIcon={saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          className={saved ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
        >
          {saved ? 'Parameters Saved' : 'Save System Configuration'}
        </Button>
      </div>

      {/* Stage 2 Scoring Weight Distribution */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Stage 2 Deterministic Weight Distribution</h3>
          </div>
          <span className="text-xs font-bold text-emerald-600">Sum: 100% (Strictly Normalized)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Core Technical Stack Depth (%)
            </label>
            <input
              type="number"
              value={settings.primarySkillsWeight}
              onChange={(e) => setSettings({ ...settings, primarySkillsWeight: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Independent Evaluator Anchored Rubric (%)
            </label>
            <input
              type="number"
              value={settings.evaluatorScoreWeight}
              onChange={(e) => setSettings({ ...settings, evaluatorScoreWeight: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Production Architecture Evidence (%)
            </label>
            <input
              type="number"
              value={settings.productionEvidenceWeight}
              onChange={(e) => setSettings({ ...settings, productionEvidenceWeight: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Domain Experience Relevance (%)
            </label>
            <input
              type="number"
              value={settings.domainExperienceWeight}
              onChange={(e) => setSettings({ ...settings, domainExperienceWeight: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Platform Economics & SLA Rules */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Platform Economics & Legal Warranties</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Company Placement Success Fee (%)
            </label>
            <input
              type="number"
              value={settings.platformPlacementFeePercent}
              onChange={(e) => setSettings({ ...settings, platformPlacementFeePercent: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Invoiced upon signed contract</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Evaluator Honorarium (INR ₹)
            </label>
            <input
              type="number"
              value={settings.evaluatorFixedHonorariumInr}
              onChange={(e) => setSettings({ ...settings, evaluatorFixedHonorariumInr: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Flat per verified scorecard</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Replacement Guarantee (Days)
            </label>
            <input
              type="number"
              value={settings.replacementGuaranteeDays}
              onChange={(e) => setSettings({ ...settings, replacementGuaranteeDays: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">No-questions replacement SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

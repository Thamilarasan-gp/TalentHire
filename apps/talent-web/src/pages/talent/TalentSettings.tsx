import React, { useState } from 'react';
import { Button } from '@thamilarasan/ui';
import { Bell, Shield, Key } from 'lucide-react';

export const TalentSettings: React.FC = () => {
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Candidate Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage profile visibility, security, and notification channels.</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900">Profile Privacy & Sourcing Status</h3>
        <div className="space-y-3 text-xs">
          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
            <div>
              <span className="font-bold text-slate-900 block">Actively open to international remote offers</span>
              <span className="text-slate-500">Allows matching engine to propose your profile for vetted requirements</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
            <div>
              <span className="font-bold text-slate-900 block">Hide current employer identity from public preview</span>
              <span className="text-slate-500">Only verified hiring companies with scheduled interviews can view current employer</span>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button size="sm" onClick={() => setSaved(true)}>
            {saved ? 'Preferences Saved' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Button } from '@thamilarasan/ui';
import { Building2, Globe, MapPin, ShieldCheck } from 'lucide-react';

export const CompanyProfile: React.FC = () => {
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Company Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Enterprise organizational details and billing credentials.</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-cyan-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            VF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Vanguard FinTech</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500">New York, USA • Financial Services • 201–500 Employees</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Official Company Website</label>
            <input
              type="text"
              defaultValue="https://vanguardfintech.com"
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Corporate HQ</label>
            <input
              type="text"
              defaultValue="New York, USA"
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="font-semibold text-slate-700 block mb-1">Company Description</label>
          <textarea
            rows={3}
            defaultValue="Vanguard FinTech is an international financial infrastructure company scaling next-generation real-time transaction processing platforms."
            className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button size="sm" onClick={() => setSaved(true)} className="bg-cyan-600 hover:bg-cyan-700 border-cyan-600">
            {saved ? 'Profile Updated' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Button } from '@thamilarasan/ui';
import { ShieldCheck, Plus, X } from 'lucide-react';

export const EvaluatorSettings: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [exEmployers, setExEmployers] = useState(['LegacyCorp Tier 1', 'OldCo Enterprise Systems']);
  const [newEmployer, setNewEmployer] = useState('');

  const addEmployer = () => {
    if (newEmployer && !exEmployers.includes(newEmployer)) {
      setExEmployers([...exEmployers, newEmployer]);
      setNewEmployer('');
    }
  };

  const removeEmployer = (emp: string) => {
    setExEmployers(exEmployers.filter((e) => e !== emp));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Evaluator Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage conflict-of-interest exclusion lists and payout details.</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 mb-1">
            Automatic Conflict-of-Interest Exclusion List
          </h3>
          <p className="text-xs text-slate-500">
            Candidates with current or previous employment history at these companies will be automatically blocked from your assignment pool.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add former company or employer..."
            value={newEmployer}
            onChange={(e) => setNewEmployer(e.target.value)}
            className="text-xs p-2.5 border border-slate-200 rounded-lg flex-1 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <Button size="sm" onClick={addEmployer} leftIcon={<Plus className="w-4 h-4 mr-1" />}>
            Add Company
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {exEmployers.map((emp) => (
            <span
              key={emp}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
            >
              <span>{emp}</span>
              <button onClick={() => removeEmployer(emp)} className="text-slate-400 hover:text-rose-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button
            size="md"
            onClick={() => setSaved(true)}
            className="bg-purple-600 hover:bg-purple-700 border-purple-600"
          >
            {saved ? 'Settings Saved' : 'Save Conflict Rules'}
          </Button>
        </div>
      </div>
    </div>
  );
};

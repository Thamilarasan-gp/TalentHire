import React, { useState } from 'react';
import { Button } from '@thamilarasan/ui';
import { Clock, CheckCircle2, Calendar } from 'lucide-react';

export const Availability: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [slots, setSlots] = useState([
    { day: 'Monday', time: '18:00 – 22:00 IST', active: true },
    { day: 'Tuesday', time: '18:00 – 22:00 IST', active: false },
    { day: 'Wednesday', time: '18:00 – 22:00 IST', active: true },
    { day: 'Thursday', time: '18:00 – 22:00 IST', active: false },
    { day: 'Friday', time: '19:00 – 23:00 IST', active: true },
    { day: 'Saturday', time: '10:00 – 18:00 IST', active: true },
    { day: 'Sunday', time: 'Offline / Rest', active: false },
  ]);

  const toggleDay = (idx: number) => {
    setSlots((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Availability & Scheduling Hours</h1>
        <p className="text-xs text-slate-500 mt-1">
          Define your weekly windows for conducting 60-minute technical evaluation interviews.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-3">
          {slots.map((slot, idx) => (
            <div
              key={slot.day}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                slot.active
                  ? 'bg-purple-50/50 border-purple-200/80'
                  : 'bg-slate-50 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={slot.active}
                  onChange={() => toggleDay(idx)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{slot.day}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{slot.time}</span>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                slot.active ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {slot.active ? 'Available for Assignment' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button
            size="md"
            onClick={() => setSaved(true)}
            className="bg-purple-600 hover:bg-purple-700 border-purple-600"
          >
            {saved ? 'Availability Saved' : 'Save Weekly Schedule'}
          </Button>
        </div>
      </div>
    </div>
  );
};

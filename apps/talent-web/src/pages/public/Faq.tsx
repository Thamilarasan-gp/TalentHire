import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const Faq: React.FC = () => {
  const faqs = [
    {
      q: 'Does the candidate ever pay any fee?',
      a: 'Never. In our core model, software candidates never pay for profile vetting, evaluation, matching, or placement.',
    },
    {
      q: 'Does the evaluator make the final hiring decision?',
      a: 'No. The independent evaluator evaluates technical capability and records objective rubric evidence. The hiring company always retains 100% of final hiring authority.',
    },
    {
      q: 'Are evaluators incentivized if their evaluated candidate gets hired?',
      a: 'Strictly no. Evaluators are paid a fixed honorarium per completed technical evaluation and scorecard submission. They receive zero bonus or commission on candidate hires, ensuring 100% conflict-free objectivity.',
    },
    {
      q: 'What happens if fewer candidates qualify than the company requested?',
      a: 'We never fabricate candidate numbers or lower benchmarks. If 10 candidates are requested and 7 meet the standard, the company receives the verified 7 with full transparency, and our sourcing engine continues sourcing until the quota is filled.',
    },
    {
      q: 'What guarantee does the company receive on hired engineers?',
      a: 'All standard placements include a 90-day replacement guarantee. If a candidate leaves or underperforms within 90 days, we source and evaluate a replacement at zero additional platform cost.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Got Questions?</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={faq.q}
            className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-blue-600"
            >
              <span>{faq.q}</span>
              {openIndex === idx ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

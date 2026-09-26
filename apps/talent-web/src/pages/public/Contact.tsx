import React, { useState } from 'react';
import { Mail, MessageSquare, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@thamilarasan/ui';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Get in Touch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Connect with Inayon
        </h1>
        <p className="text-sm text-slate-600">
          Whether you are an international engineering team or an evaluator candidate, we are here to assist.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Message Received</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our enterprise client success team will review your inquiry and follow up within 4 business hours.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Thamilarasan"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="director@enterprise.com"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">I am interested in:</label>
              <select className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Hiring Indian Engineers (Enterprise Tier)</option>
                <option>Joining the Evaluator Expert Network</option>
                <option>Candidate Inquiry</option>
                <option>Partnership & Integration</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Message</label>
              <textarea
                rows={4}
                required
                placeholder="Tell us about your team size, required tech stack, or questions..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <Button type="submit" size="md" className="w-full">
              Send Inquiry
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

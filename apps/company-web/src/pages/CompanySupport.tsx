import React, { useEffect, useState } from 'react';
import { HelpCircle, CheckCircle2, MessageSquare, Plus, Clock } from 'lucide-react';
import { api } from '@thamilarasan/api-client';
import { Button, StatusBadge } from '@thamilarasan/ui';
import { formatDate } from '@thamilarasan/utils';

export const CompanySupport: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('EVALUATION');
  const [priority, setPriority] = useState('MEDIUM');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadTickets = () => {
    api.getSupportTickets().then((res) => {
      if (res.success && res.data) setTickets(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setSubmitting(true);

    try {
      const res = await api.createSupportTicket({
        subject,
        category,
        priority,
        message,
      });

      if (res.success && res.data) {
        setTickets([res.data, ...tickets]);
        setSubject('');
        setMessage('');
        setShowForm(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Support & SLA</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dedicated engineering talent partner support with guaranteed 4-hour SLA response.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-600 hover:bg-cyan-700"
          leftIcon={<Plus className="w-4 h-4 mr-1" />}
        >
          {showForm ? 'Cancel' : 'New Ticket'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900">Create Priority Support Ticket</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Need additional candidate matches for AWS System Design"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-cyan-500"
              >
                <option value="EVALUATION">Evaluation Rubric & QA</option>
                <option value="SHORTLIST">Shortlist Calibration</option>
                <option value="INTERVIEW">Interview Scheduling</option>
                <option value="BILLING">Billing & NET 30 Terms</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Details & Context</label>
            <textarea
              rows={4}
              required
              placeholder="Describe your question, request, or requirement adjustment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" type="submit" isLoading={submitting} className="bg-cyan-600">
              Submit Ticket
            </Button>
          </div>
        </form>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading support history...</div>
        ) : tickets && tickets.length > 0 ? (
          tickets.map((t) => (
            <div key={t.id} className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{t.subject}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                    {t.category}
                  </span>
                </div>
                <StatusBadge status={t.status || 'OPEN'} size="sm" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {t.messages?.[0]?.text || 'No message content'}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Ticket ID: {t.id}</span>
                <span>Created {formatDate(t.createdAt)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-xs text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-semibold text-slate-800">No active support tickets</p>
            <p className="text-slate-400">All hiring operations are running smoothly.</p>
          </div>
        )}
      </div>
    </div>
  );
};

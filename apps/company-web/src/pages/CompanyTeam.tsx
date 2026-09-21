import React, { useEffect, useState } from 'react';
import { Users, Plus, Shield, Trash2, X, AlertCircle } from 'lucide-react';
import { api } from '@thamilarasan/api-client';
import { Button, StatusBadge } from '@thamilarasan/ui';

export const CompanyTeam: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'COMPANY_RECRUITER' | 'COMPANY_HIRING_MANAGER' | 'COMPANY_ADMIN'>('COMPANY_HIRING_MANAGER');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadTeam = () => {
    api.getCompanyTeam().then((res) => {
      if (res.success && res.data) setMembers(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.inviteTeamMember({
        email: inviteEmail,
        fullName: inviteName,
        role: inviteRole,
      });

      if (res.success && res.data) {
        setMembers([...members, res.data]);
        setIsInviting(false);
        setInviteEmail('');
        setInviteName('');
      } else {
        setError(res.error || 'Failed to invite team member');
      }
    } catch (err: any) {
      setError(err.message || 'Error sending invitation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this member from your organization?')) {
      await api.deleteTeamMember(id);
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hiring Team Members</h1>
          <p className="text-xs text-slate-500 mt-1">Manage team access and role-based permissions (RBAC).</p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsInviting(!isInviting)}
          className="bg-cyan-600 hover:bg-cyan-700 border-cyan-600"
          leftIcon={<Plus className="w-4 h-4 mr-1" />}
        >
          {isInviting ? 'Cancel' : 'Invite Member'}
        </Button>
      </div>

      {isInviting && (
        <form onSubmit={handleInvite} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Invite Organization Teammate</h3>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Sarah Chen"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Corporate Email</label>
              <input
                type="email"
                required
                placeholder="sarah.chen@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Role Permissions</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-cyan-500 font-semibold"
              >
                <option value="COMPANY_HIRING_MANAGER">Hiring Manager (Review & Interview)</option>
                <option value="COMPANY_RECRUITER">Recruiter (Requirements & Shortlists)</option>
                <option value="COMPANY_ADMIN">Company Admin (Full Access)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" type="submit" isLoading={submitting} className="bg-cyan-600">
              Send Organization Invitation
            </Button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading organization members...</div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3.5">Member Name</th>
                <th className="px-6 py-3.5">Assigned Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => (
                <tr key={m.id || m.email} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 block">{m.fullName || m.name || m.email.split('@')[0]}</span>
                    <span className="text-[11px] text-slate-500">{m.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                      {m.role || 'COMPANY_MEMBER'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {m.role !== 'COMPANY_ADMIN' && (
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

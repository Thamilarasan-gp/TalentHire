import {
  User,
  Company,
  HiringRequirement,
  Candidate,
  Evaluator,
  Evaluation,
  Shortlist,
  Interview,
  Offer,
  Placement,
  Invoice,
  EvaluatorPayout,
  AuditLog,
  Notification
} from '@thamilarasan/types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: any;
  total?: number;
  page?: number;
  limit?: number;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'http://localhost:5000/api') {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('tg_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('tg_token', token);
      } else {
        localStorage.removeItem('tg_token');
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('tg_token');
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: json.error || `HTTP error ${response.status}: ${response.statusText}`,
        };
      }
      return json;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      return {
        success: false,
        error: message,
      };
    }
  }

  // Auth
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    const res = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Companies
  async getCompanies(query?: string): Promise<ApiResponse<Company[]>> {
    return this.request<Company[]>(`/companies${query ? `?${query}` : ''}`);
  }

  async getCompany(id: string): Promise<ApiResponse<Company>> {
    return this.request<Company>(`/companies/${id}`);
  }

  // Requirements
  async getRequirements(query?: string): Promise<ApiResponse<HiringRequirement[]>> {
    return this.request<HiringRequirement[]>(`/requirements${query ? `?${query}` : ''}`);
  }

  async getRequirement(id: string): Promise<ApiResponse<HiringRequirement>> {
    return this.request<HiringRequirement>(`/requirements/${id}`);
  }

  async createRequirement(data: Partial<HiringRequirement>): Promise<ApiResponse<HiringRequirement>> {
    return this.request<HiringRequirement>('/requirements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Candidates
  async getCandidates(query?: string): Promise<ApiResponse<Candidate[]>> {
    return this.request<Candidate[]>(`/candidates${query ? `?${query}` : ''}`);
  }

  async getCandidate(id: string): Promise<ApiResponse<Candidate>> {
    return this.request<Candidate>(`/candidates/${id}`);
  }

  // Evaluators
  async getEvaluators(query?: string): Promise<ApiResponse<Evaluator[]>> {
    return this.request<Evaluator[]>(`/evaluators${query ? `?${query}` : ''}`);
  }

  async getEvaluator(id: string): Promise<ApiResponse<Evaluator>> {
    return this.request<Evaluator>(`/evaluators/${id}`);
  }

  // Evaluations
  async getEvaluations(query?: string): Promise<ApiResponse<Evaluation[]>> {
    return this.request<Evaluation[]>(`/evaluations${query ? `?${query}` : ''}`);
  }

  async getEvaluation(id: string): Promise<ApiResponse<Evaluation>> {
    return this.request<Evaluation>(`/evaluations/${id}`);
  }

  async submitScorecard(id: string, scorecardData: Partial<Evaluation>): Promise<ApiResponse<Evaluation>> {
    return this.request<Evaluation>(`/evaluations/${id}/scorecard`, {
      method: 'POST',
      body: JSON.stringify(scorecardData),
    });
  }

  async reviewQa(id: string, qaVerdict: { status: 'APPROVED' | 'REJECTED'; notes: string }): Promise<ApiResponse<Evaluation>> {
    return this.request<Evaluation>(`/evaluations/${id}/qa`, {
      method: 'POST',
      body: JSON.stringify(qaVerdict),
    });
  }

  // Shortlists
  async getShortlists(query?: string): Promise<ApiResponse<Shortlist[]>> {
    return this.request<Shortlist[]>(`/shortlists${query ? `?${query}` : ''}`);
  }

  async getShortlist(id: string): Promise<ApiResponse<Shortlist>> {
    return this.request<Shortlist>(`/shortlists/${id}`);
  }

  async generateShortlist(requirementId: string, count: number = 10): Promise<ApiResponse<Shortlist>> {
    return this.request<Shortlist>('/shortlists/generate', {
      method: 'POST',
      body: JSON.stringify({ requirementId, count }),
    });
  }

  // Interviews
  async getInterviews(query?: string): Promise<ApiResponse<Interview[]>> {
    return this.request<Interview[]>(`/interviews${query ? `?${query}` : ''}`);
  }

  async scheduleInterview(data: Partial<Interview>): Promise<ApiResponse<Interview>> {
    return this.request<Interview>('/interviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Offers & Placements
  async getOffers(query?: string): Promise<ApiResponse<Offer[]>> {
    return this.request<Offer[]>(`/offers${query ? `?${query}` : ''}`);
  }

  async createOffer(data: Partial<Offer>): Promise<ApiResponse<Offer>> {
    return this.request<Offer>('/offers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPlacements(query?: string): Promise<ApiResponse<Placement[]>> {
    return this.request<Placement[]>(`/placements${query ? `?${query}` : ''}`);
  }

  // Finance
  async getInvoices(query?: string): Promise<ApiResponse<Invoice[]>> {
    return this.request<Invoice[]>(`/finance/invoices${query ? `?${query}` : ''}`);
  }

  async getPayouts(query?: string): Promise<ApiResponse<EvaluatorPayout[]>> {
    return this.request<EvaluatorPayout[]>(`/finance/payouts${query ? `?${query}` : ''}`);
  }

  // Audit Logs & Notifications
  async getAuditLogs(query?: string): Promise<ApiResponse<AuditLog[]>> {
    return this.request<AuditLog[]>(`/audit${query ? `?${query}` : ''}`);
  }

  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.request<Notification[]>('/notifications');
  }

  // Admin Stats
  async getAdminStats(): Promise<ApiResponse<Record<string, unknown>>> {
    return this.request<Record<string, unknown>>('/admin/stats');
  }

  // ==========================================
  // Company Portal Dedicated API Endpoints
  // ==========================================

  async registerCompany(data: {
    fullName: string;
    email: string;
    password?: string;
    companyName: string;
    website?: string;
    country?: string;
    size?: string;
    industry?: string;
    role?: string;
  }): Promise<ApiResponse<{ token: string; user: User; company: Company }>> {
    const res = await this.request<{ token: string; user: User; company: Company }>('/company/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async getCompanyMe(): Promise<ApiResponse<Company>> {
    return this.request<Company>('/company/me');
  }

  async getCompanyOpenings(query?: string): Promise<ApiResponse<HiringRequirement[]>> {
    const endpoint = query ? `/company/openings?${query}` : '/company/openings';
    return this.request<HiringRequirement[]>(endpoint);
  }

  async getCompanyDashboard(): Promise<ApiResponse<any>> {
    return this.request<any>('/company/dashboard');
  }

  async getOnboardingProgress(): Promise<ApiResponse<{ step: number; onboardingData: any; company: Company }>> {
    return this.request<{ step: number; onboardingData: any; company: Company }>('/company/onboarding');
  }

  async saveOnboardingProgress(step: number, data: any): Promise<ApiResponse<{ step: number; onboardingData: any; company: Company }>> {
    return this.request<{ step: number; onboardingData: any; company: Company }>('/company/onboarding', {
      method: 'POST',
      body: JSON.stringify({ step, data }),
    });
  }

  async getCompanyTeam(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/company/team');
  }

  async inviteTeamMember(data: { email: string; fullName?: string; role?: string }): Promise<ApiResponse<User>> {
    return this.request<User>('/company/team/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteTeamMember(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/team/${id}`, {
      method: 'DELETE',
    });
  }

  async getCompanyNotes(candidateId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/company/notes/${candidateId}`);
  }

  async saveCompanyNote(candidateId: string, data: { notes: string; rating?: number }): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/notes/${candidateId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCompanyAnalytics(): Promise<ApiResponse<any>> {
    return this.request<any>('/company/analytics');
  }

  // Quick Match
  async getQuickMatches(query?: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/quick-match${query ? `?${query}` : ''}`);
  }

  async getQuickMatchCandidate(candidateId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/quick-match/${candidateId}`);
  }

  async inviteQuickMatchCandidate(candidateId: string, requirementId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/quick-match/${candidateId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ requirementId }),
    });
  }

  async requestTopUpEvaluation(candidateId: string, requirementId: string, missingSkills?: string[]): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/quick-match/${candidateId}/top-up`, {
      method: 'POST',
      body: JSON.stringify({ requirementId, missingSkills }),
    });
  }

  // Candidate Applications (Dedicated Pipeline)
  async getCompanyApplications(query?: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/company/applications${query ? `?${query}` : ''}`);
  }

  async getCompanyApplication(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/applications/${id}`);
  }

  async getReusableEvaluation(candidateId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/candidates/${candidateId}/reusable-evaluation`);
  }

  // Google Calendar / Meet Integration
  async getGoogleIntegrationStatus(): Promise<ApiResponse<{ isConnected: boolean; calendarEmail?: string }>> {
    return this.request<{ isConnected: boolean; calendarEmail?: string }>('/company/integrations/google/status');
  }

  async getGoogleConnectUrl(): Promise<ApiResponse<{ url: string }>> {
    return this.request<{ url: string }>('/company/integrations/google/connect');
  }

  // Interviews & Feedback
  async getCompanyInterviews(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/company/interviews');
  }

  async scheduleCompanyInterview(data: {
    candidateId: string;
    requirementId?: string;
    interviewType?: string;
    scheduledAt: string;
    durationMinutes?: number;
    interviewerNames?: string[];
    useGoogleMeet?: boolean;
    meetingLink?: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/company/interviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCompanyFeedbacks(query?: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/company/feedbacks${query ? `?${query}` : ''}`);
  }

  async submitInterviewFeedback(
    interviewId: string,
    data: { feedbackNotes: string; rating: number; companyDecision: string }
  ): Promise<ApiResponse<any>> {
    return this.request<any>(`/company/interviews/${interviewId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCompanyMe(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/company/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateUserMe(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getCompanyOffers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/company/offers');
  }

  async createCompanyOffer(data: {
    candidateId: string;
    requirementId?: string;
    annualSalaryUsd: number;
    bonusUsd?: number;
    equityTerms?: string;
    proposedStartDate?: string;
    expiryDate?: string;
    terms?: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/company/offers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInterviewedCandidates(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/company/interviewed-candidates');
  }

  async getSupportTickets(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/company/support');
  }

  async createSupportTicket(data: { subject: string; message: string; category?: string; priority?: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/company/support', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();

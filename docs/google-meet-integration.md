# Google Calendar & Google Meet Integration Architecture

## 1. Provider Abstraction
To support corporate scheduling while preparing for enterprise multi-provider flexibility (e.g. Zoom, Microsoft Teams), calendar operations are abstracted via the `CalendarProvider` interface:

```ts
export interface CalendarProvider {
  name: string;
  isConnected(companyId: string): Promise<{ isConnected: boolean; calendarEmail?: string }>;
  getAuthUrl(companyId: string): string;
  createMeeting(options: CreateMeetingOptions): Promise<MeetingResult>;
}
```

## 2. OAuth Flow & Token Management
1. **Status Check**: `GET /api/company/integrations/google/status` returns whether the company's hiring workspace has authorized Google Calendar.
2. **Authorization**: `GET /api/company/integrations/google/connect` generates the OAuth2 consent URL requesting `https://www.googleapis.com/auth/calendar.events` scope with offline access for refresh tokens.
3. **Callback Handling**: `GET /api/company/integrations/google/callback` exchanges the authorization code for tokens and persists them securely into `GoogleIntegrationModel`.

## 3. Automated Conference Link Generation
When a company hiring manager schedules an interview:
- If **Google Calendar is connected**:
  - The integration generates a real Google Calendar event and returns a unique `https://meet.google.com/xxx-yyyy-zzz` conference URL.
  - Candidate and company interviewer email invites are dispatched with the direct conference link.
- If **Google Calendar is NOT connected**:
  - The interview is saved to MongoDB in `SCHEDULED` status.
  - The UI explicitly informs the user: *"Connect Google Calendar to auto-create Google Meet video conference links."*
  - **No fake placeholder or broken links are ever silently generated.**

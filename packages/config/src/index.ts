/**
 * INAYON - DESIGN SYSTEM TOKENS & PLATFORM CONFIG
 * Brand: Inayon
 * Positioning: Find. Evaluate. Hire.
 * Aesthetic: High-end B2B SaaS, deep navy, electric blue, controlled emerald, airy typography.
 */

export const BRAND = {
  name: 'Inayon',
  tagline: 'Find. Evaluate. Hire.',
  subheadline: 'One Platform. Many Possibilities. Verified Talent for a Global Tomorrow.',
  motto: 'Build Without Borders',
  mission: 'People • Skills • Opportunities • Without Borders',
  pills: [
    'Companies Hire Faster',
    'Engineers Grow Your Career',
    'Evaluators Share Your Expertise',
    'A Stronger Global Tech Community'
  ]
} as const;

export const THEME_COLORS = {
  // Foundations
  navy: {
    950: '#070A11',
    900: '#0A0E17', // Main deep foundation
    850: '#0F1523',
    800: '#141C2E',
    700: '#1E293B',
  },
  surface: {
    pure: '#FFFFFF',
    light: '#F8FAFC',
    subtle: '#F1F5F9',
    border: '#E2E8F0',
    darkCard: '#111827',
    darkBorder: 'rgba(255, 255, 255, 0.08)',
  },
  // Accents
  electricBlue: {
    default: '#2563EB',
    hover: '#1D4ED8',
    subtle: '#EFF6FF',
    glow: 'rgba(37, 99, 235, 0.25)',
  },
  cyan: {
    default: '#06B6D4',
    light: '#ECFEFF',
  },
  // Status Colors
  status: {
    success: {
      text: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      dot: '#10B981',
    },
    warning: {
      text: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
      dot: '#F59E0B',
    },
    danger: {
      text: '#DC2626',
      bg: '#FEF2F2',
      border: '#FECACA',
      dot: '#EF4444',
    },
    info: {
      text: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      dot: '#3B82F6',
    },
    neutral: {
      text: '#475569',
      bg: '#F1F5F9',
      border: '#CBD5E1',
      dot: '#64748B',
    },
    purple: {
      text: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      dot: '#8B5CF6',
    }
  }
} as const;

export const DEFAULT_MATCH_WEIGHTS = {
  coreTechnicalSkills: 35,
  relevantExperience: 20,
  verifiedEvidence: 20,
  domainExperience: 10,
  communication: 10,
  availability: 5,
} as const;

export const EVALUATION_FEE_INR = {
  standard: 3500,
  specialist: 5500,
  leadPrincipal: 7500,
  calibrationBonus: 1000,
} as const;

export const PLATFORM_PORTS = {
  api: 5000,
  talentWeb: 3000,
  adminWeb: 3001,
  companyWeb: 3002,
} as const;

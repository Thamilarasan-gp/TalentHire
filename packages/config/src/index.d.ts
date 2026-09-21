/**
 * TALENT HIRE - DESIGN SYSTEM TOKENS & PLATFORM CONFIG
 * Brand: TALENT HIRE
 * Positioning: Find. Evaluate. Hire.
 * Aesthetic: High-end B2B SaaS, deep navy, electric blue, controlled emerald, airy typography.
 */
export declare const BRAND: {
    readonly name: "TALENT HIRE";
    readonly tagline: "Find. Evaluate. Hire.";
    readonly subheadline: "One Platform. Many Possibilities. Verified Talent for a Global Tomorrow.";
    readonly motto: "Build Without Borders";
    readonly mission: "People • Skills • Opportunities • Without Borders";
    readonly pills: readonly ["Companies Hire Faster", "Engineers Grow Your Career", "Evaluators Share Your Expertise", "A Stronger Global Tech Community"];
};
export declare const THEME_COLORS: {
    readonly navy: {
        readonly 950: "#070A11";
        readonly 900: "#0A0E17";
        readonly 850: "#0F1523";
        readonly 800: "#141C2E";
        readonly 700: "#1E293B";
    };
    readonly surface: {
        readonly pure: "#FFFFFF";
        readonly light: "#F8FAFC";
        readonly subtle: "#F1F5F9";
        readonly border: "#E2E8F0";
        readonly darkCard: "#111827";
        readonly darkBorder: "rgba(255, 255, 255, 0.08)";
    };
    readonly electricBlue: {
        readonly default: "#2563EB";
        readonly hover: "#1D4ED8";
        readonly subtle: "#EFF6FF";
        readonly glow: "rgba(37, 99, 235, 0.25)";
    };
    readonly cyan: {
        readonly default: "#06B6D4";
        readonly light: "#ECFEFF";
    };
    readonly status: {
        readonly success: {
            readonly text: "#059669";
            readonly bg: "#ECFDF5";
            readonly border: "#A7F3D0";
            readonly dot: "#10B981";
        };
        readonly warning: {
            readonly text: "#D97706";
            readonly bg: "#FFFBEB";
            readonly border: "#FDE68A";
            readonly dot: "#F59E0B";
        };
        readonly danger: {
            readonly text: "#DC2626";
            readonly bg: "#FEF2F2";
            readonly border: "#FECACA";
            readonly dot: "#EF4444";
        };
        readonly info: {
            readonly text: "#2563EB";
            readonly bg: "#EFF6FF";
            readonly border: "#BFDBFE";
            readonly dot: "#3B82F6";
        };
        readonly neutral: {
            readonly text: "#475569";
            readonly bg: "#F1F5F9";
            readonly border: "#CBD5E1";
            readonly dot: "#64748B";
        };
        readonly purple: {
            readonly text: "#7C3AED";
            readonly bg: "#F5F3FF";
            readonly border: "#DDD6FE";
            readonly dot: "#8B5CF6";
        };
    };
};
export declare const DEFAULT_MATCH_WEIGHTS: {
    readonly coreTechnicalSkills: 35;
    readonly relevantExperience: 20;
    readonly verifiedEvidence: 20;
    readonly domainExperience: 10;
    readonly communication: 10;
    readonly availability: 5;
};
export declare const EVALUATION_FEE_INR: {
    readonly standard: 3500;
    readonly specialist: 5500;
    readonly leadPrincipal: 7500;
    readonly calibrationBonus: 1000;
};
export declare const PLATFORM_PORTS: {
    readonly api: 5000;
    readonly talentWeb: 3000;
    readonly adminWeb: 3001;
    readonly companyWeb: 3002;
};

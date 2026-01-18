import { notFound } from "next/navigation";
import FeatureClient from "./FeatureClient";

type FeatureKey = "jwt-inspector" | "github-scanner" | "security-advisor";

type FeatureData = {
  slug: FeatureKey;
  name: string;
  tagline: string;
  summary: string;
  iconName: "key" | "scan" | "shield";
  bullets: string[];
  details: {
    intro: string;
    sections: { title: string; points: string[] }[];
  };
  works: { title: string; desc: string; iconName: "sparkles" | "git" | "scan" | "badge" | "check" | "shield" }[];
  outputs: { label: string; value: string }[];
  cta: { title: string; desc: string };
  ctaLink: string;
  next: FeatureKey;
  prev: FeatureKey;
};

const FEATURES: Record<FeatureKey, FeatureData> = {
  "jwt-inspector": {
    slug: "jwt-inspector",
    name: "JWT Inspector",
    tagline: "Decode. Validate. Harden.",
    summary:
      "SafeDev helps you quickly decode JWTs, flag risky configurations, and understand claims that affect security and authorization.",
    iconName: "key",
    bullets: [
      "Instant decoding (header, payload, signature details)",
      "Highlights weak/unsafe token patterns and claim issues",
      "Expiry + clock skew awareness with clear guidance",
      "Actionable recommendations for secure JWT handling",
    ],
    works: [
      { title: "Paste Token", desc: "Drop in a JWT and SafeDev parses header, payload, and signature metadata.", iconName: "sparkles" },
      { title: "Detect Risks", desc: "Flags common issues like missing expiry, weak alg usage, and risky claims.", iconName: "shield" },
      { title: "Fix & Recheck", desc: "Get remediation guidance and validate a corrected token configuration.", iconName: "badge" },
    ],
    outputs: [
      { label: "Risk Level", value: "Low / Medium / High" },
      { label: "Claim Warnings", value: "exp, aud, iss, nbf, scope" },
      { label: "Recommendations", value: "Prioritized fix list" },
    ],
    cta: { title: "Secure tokens in minutes", desc: "Join the waitlist to get SafeDev early access and launch updates." },
    ctaLink: process.env.NEXT_PUBLIC_JWT_EXTENSION_URL || "/github",
    next: "github-scanner",
    prev: "security-advisor",
    details: {
  intro:
    "JWT Inspector is designed to help you understand exactly what a token is asserting, whether it’s safe, and what you should change before it becomes a security incident.",
  sections: [
    {
      title: "Decode and explain the token",
      points: [
        "Parses header and payload into a readable view with clear labeling.",
        "Shows algorithm info and highlights risky or unexpected configurations.",
        "Makes claim meaning obvious (issuer, audience, scopes/roles, subject).",
      ],
    },
    {
      title: "Validate security-critical claims",
      points: [
        "Checks expiry (`exp`), not-before (`nbf`), and issued-at (`iat`) expectations.",
        "Flags missing or overly-long expirations (tokens that live too long).",
        "Highlights common auth mistakes like missing `aud`/`iss` validation patterns.",
      ],
    },
    {
      title: "Spot common JWT risk patterns",
      points: [
        "Warns when claim sets look permissive or inconsistent (e.g., broad roles/scopes).",
        "Surfaces suspicious claim combinations that may indicate mis-issuance.",
        "Guides you on safe defaults (short TTLs, strict issuer/audience validation).",
      ],
    },
    {
      title: "Actionable remediation guidance",
      points: [
        "Provides specific next steps to fix what was detected (not generic advice).",
        "Gives safer configuration recommendations for your auth/JWT library setup.",
        "Helps you verify changes by rechecking an updated token configuration.",
      ],
    },
  ],
},

  },

  "github-scanner": {
    slug: "github-scanner",
    name: "GitHub Scanner",
    tagline: "Find secrets before they ship.",
    summary:
      "Scan repos for hardcoded secrets, risky configs, and patterns that commonly lead to leaks—without slowing your workflow.",
    iconName: "scan",
    bullets: [
      "Detect hardcoded tokens, API keys, secrets, and credentials",
      "Find risky patterns and misconfigurations",
      "Context-aware findings with file/line pointers",
      "Remediation suggestions tailored to what was detected",
    ],
    works: [
      { title: "Connect Repo", desc: "Authenticate and select repositories you want to scan.", iconName: "git" },
      { title: "Scan & Triage", desc: "SafeDev reports issues with clear context and severity.", iconName: "scan" },
      { title: "Fix & Verify", desc: "Apply recommended changes and rescan to confirm improvements.", iconName: "check" },
    ],
    outputs: [
      { label: "Findings", value: "Secrets + risky patterns" },
      { label: "Severity", value: "Prioritized list" },
      { label: "Remediation", value: "Step-by-step guidance" },
    ],
    cta: { title: "Protect your repos proactively", desc: "Join the waitlist to scan with SafeDev as soon as it launches." },
    ctaLink: "/github",
    next: "security-advisor",
    prev: "jwt-inspector",
    details: {
  intro:
    "GitHub Scanner helps you detect secrets and risky patterns inside repositories before they leak into production logs, commits, or public forks.",
  sections: [
    {
      title: "Detect secrets and credentials",
      points: [
        "Finds common secret formats (API keys, tokens, credentials, private keys).",
        "Detects hardcoded environment variables and config values in code.",
        "Highlights likely secret candidates based on patterns and context.",
      ],
    },
    {
      title: "Locate issues with context",
      points: [
        "Pinpoints file locations and relevant snippets (so fixes are quick).",
        "Groups similar issues to reduce noise and focus on real risks.",
        "Helps differentiate test/demo keys vs production-like secrets.",
      ],
    },
    {
      title: "Misconfiguration and insecure patterns",
      points: [
        "Flags risky configurations that commonly lead to leaks or weak auth.",
        "Detects patterns like insecure defaults, debug logging of tokens, or exposed endpoints.",
        "Surfaces repeat offenders across repos to help standardize fixes.",
      ],
    },
    {
      title: "Remediation workflow",
      points: [
        "Recommends safe storage (env vars, secret managers) and cleanup steps.",
        "Suggests rotation steps when a real secret is found (invalidate + replace).",
        "Supports rescanning to confirm the issue is fully removed.",
      ],
    },
  ],
},

  },

  "security-advisor": {
    slug: "security-advisor",
    name: "Security Advisor",
    tagline: "Clear score. Clear fixes.",
    summary:
      "Get a simple security score and a prioritized remediation plan, so your team knows exactly what to fix next.",
    iconName: "shield",
    bullets: [
      "Readable security score with rationale",
      "Prioritized remediation plan by impact",
      "Guidance aligned to common secure defaults",
      "Track improvements by rescanning and comparing results",
    ],
    works: [
      { title: "Aggregate Signals", desc: "Combines scan results into a unified security overview.", iconName: "sparkles" },
      { title: "Prioritize Fixes", desc: "Ranks issues by impact and urgency with practical guidance.", iconName: "badge" },
      { title: "Improve Over Time", desc: "Track progress with rescans and updated scoring.", iconName: "shield" },
    ],
    outputs: [
      { label: "Security Score", value: "0–100 with breakdown" },
      { label: "Top Risks", value: "Most impactful issues" },
      { label: "Next Steps", value: "Action plan checklist" },
    ],
    cta: { title: "Get a security plan you can execute", desc: "Join the waitlist and get SafeDev early access." },
    ctaLink: "/github",
    next: "jwt-inspector",
    prev: "github-scanner",
    details: {
  intro:
    "Security Advisor turns scan results into a clear plan: what matters most, what to fix first, and how to steadily improve your security posture.",
  sections: [
    {
      title: "Unified security score",
      points: [
        "Summarizes findings into a single score with a breakdown by category.",
        "Explains why the score changed and what contributed most to risk.",
        "Helps teams communicate security status without deep security jargon.",
      ],
    },
    {
      title: "Prioritized remediation plan",
      points: [
        "Ranks issues by impact and exploitability—so you fix the right things first.",
        "Separates quick wins from deeper fixes to improve velocity.",
        "Provides a checklist-style plan your team can follow and track.",
      ],
    },
    {
      title: "Policy and best-practice guidance",
      points: [
        "Recommends secure defaults and policies (rotation cadence, TTLs, repo hygiene).",
        "Encourages repeatable guardrails (pre-commit checks, CI scanning patterns).",
        "Helps reduce recurring incidents by standardizing better practices.",
      ],
    },
    {
      title: "Progress over time",
      points: [
        "Supports rescans and comparisons so improvements are measurable.",
        "Helps spot recurring sources of issues (teams, repos, patterns).",
        "Encourages continuous improvement instead of one-time cleanup.",
      ],
    },
  ],
},

  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!Object.prototype.hasOwnProperty.call(FEATURES, slug)) notFound();

  const feature = FEATURES[slug as FeatureKey];
  const prev = FEATURES[feature.prev];
  const next = FEATURES[feature.next];

  return <FeatureClient feature={feature} prev={prev} next={next} />;
}

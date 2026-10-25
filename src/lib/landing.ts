export interface LandingBadge {
  label: string;
  sub: string;
  color: string;
}

export interface LandingCapability {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  accent: string;
}

export interface LandingProblem {
  title: string;
  desc: string;
}

export interface LandingStep {
  num: string;
  title: string;
  label: string;
  desc: string;
  color: string;
}

export interface LandingProof {
  title: string;
  type: string;
  desc: string;
  tags: string[];
  accent: string;
  href?: string;
  metric?: string;
}

export interface LandingFaq {
  question: string;
  answer: string;
}

export interface LandingLink {
  href: string;
  label: string;
  desc?: string;
}

export interface ServiceLandingConfig {
  /** Route path without leading slash, e.g. hire-astro-developer */
  slug: string;
  keyword: string;
  title: string;
  description: string;
  tags: string[];
  accent: string;
  accentSecondary: string;
  eyebrow: string;
  h1Before: string;
  h1Accent: string;
  lead: string;
  heroPoints: string[];
  primaryCta: string;
  secondaryCta: string;
  badges: LandingBadge[];
  capabilitiesIntro: string;
  capabilitiesTitle: string;
  capabilitiesAccent: string;
  capabilities: LandingCapability[];
  problemsHeading: string;
  problemsIntro: string;
  problems: LandingProblem[];
  processHeading: string;
  processIntro: string;
  process: LandingStep[];
  techHeading: string;
  techIntro: string;
  tech: { name: string; color: string }[];
  reasonsHeading: string;
  reasons: string[];
  proofHeading: string;
  proofIntro: string;
  proof: LandingProof[];
  faqs: LandingFaq[];
  relatedServices: LandingLink[];
  relatedReads: LandingLink[];
  midCtaHeading: string;
  midCtaBody: string;
}

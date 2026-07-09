import { ResumeData } from '@/types/resume';

export interface ATSFeedback {
  section: string;
  message: string;
  severity: 'error' | 'warning' | 'tip' | 'success';
}

export interface ATSBreakdown {
  format: number;       // max 20
  structure: number;    // max 25
  keywords: number;     // max 30
  jdMatch: number;      // max 25 — 0 if no JD pasted
}

export interface ATSResult {
  totalScore: number;        // 0–100
  breakdown: ATSBreakdown;
  feedback: ATSFeedback[];
  missingKeywords: string[];
  matchedKeywords: string[];
  matchPercent: number | null; // null = no JD provided
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const ACTION_VERBS = [
  'built', 'developed', 'designed', 'implemented', 'engineered', 'architected',
  'led', 'managed', 'launched', 'shipped', 'deployed', 'optimized', 'reduced',
  'increased', 'improved', 'created', 'automated', 'integrated', 'migrated',
  'refactored', 'researched', 'analyzed', 'collaborated', 'mentored', 'trained',
  'delivered', 'scaled', 'maintained', 'established', 'pioneered', 'streamlined',
];

const QUANTITY_REGEX = /\b\d+[\w%+xX]*\b|\$\d+/g;

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+/]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

function extractKeywordsFromJD(jd: string): string[] {
  const words = extractWords(jd);
  // Remove common stop words
  const stop = new Set([
    'the', 'and', 'for', 'are', 'was', 'with', 'you', 'our', 'will', 'have',
    'that', 'this', 'from', 'they', 'your', 'what', 'which', 'able', 'also',
    'work', 'team', 'role', 'join', 'help', 'must', 'can', 'use', 'used',
    'using', 'would', 'should', 'experience', 'skills', 'knowledge',
  ]);
  const freq: Record<string, number> = {};
  words.forEach(w => {
    if (!stop.has(w)) freq[w] = (freq[w] ?? 0) + 1;
  });
  // Return words that appear ≥ 1 time, sorted by freq
  return Object.entries(freq)
    .filter(([, c]) => c >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w)
    .slice(0, 60);
}

function resumeText(resume: ResumeData): string {
  const parts: string[] = [
    resume.personalInfo.summary,
    resume.personalInfo.jobTitle,
    ...resume.experience.map(e => `${e.position} ${e.company} ${e.description}`),
    ...resume.projects.map(p => `${p.name} ${p.description} ${p.technologies}`),
    ...resume.skills.map(s => s.name),
    ...resume.certifications.map(c => c.name),
  ];
  return parts.join(' ').toLowerCase();
}

// ─── Sub-scorers ─────────────────────────────────────────────────────────────

function scoreFormat(resume: ResumeData): { score: number; feedback: ATSFeedback[] } {
  let score = 0;
  const feedback: ATSFeedback[] = [];
  const { personalInfo } = resume;

  // Email (4 pts)
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
    score += 4;
  } else {
    feedback.push({ section: 'personalInfo', message: 'Email address is missing or invalid.', severity: 'error' });
  }

  // Phone (3 pts)
  if (personalInfo.phone && personalInfo.phone.replace(/\D/g, '').length >= 7) {
    score += 3;
  } else {
    feedback.push({ section: 'personalInfo', message: 'Phone number is missing or too short.', severity: 'warning' });
  }

  // LinkedIn (3 pts)
  if (personalInfo.linkedin) {
    score += 3;
  } else {
    feedback.push({ section: 'personalInfo', message: 'LinkedIn profile URL missing — ATS systems often look for this.', severity: 'tip' });
  }

  // Dates in experience (5 pts)
  const missingDates = resume.experience.filter(e => !e.startDate);
  if (missingDates.length === 0 && resume.experience.length > 0) {
    score += 5;
  } else if (resume.experience.length > 0) {
    feedback.push({ section: 'experience', message: `${missingDates.length} experience entr${missingDates.length > 1 ? 'ies are' : 'y is'} missing start dates.`, severity: 'warning' });
  }

  // Job title (5 pts)
  if (personalInfo.jobTitle) {
    score += 5;
  } else {
    feedback.push({ section: 'personalInfo', message: 'Job title is missing — ATS often keyword-matches on this field.', severity: 'error' });
  }

  return { score: Math.min(score, 20), feedback };
}

function scoreStructure(resume: ResumeData): { score: number; feedback: ATSFeedback[] } {
  let score = 0;
  const feedback: ATSFeedback[] = [];

  if (resume.personalInfo.summary && resume.personalInfo.summary.length > 50) {
    score += 5;
  } else {
    feedback.push({ section: 'personalInfo', message: 'Write a professional summary of at least 50 characters.', severity: 'warning' });
  }

  if (resume.experience.length >= 1) {
    score += 8;
    if (resume.experience.length >= 2) score += 2;
  } else {
    feedback.push({ section: 'experience', message: 'Add at least one work experience entry.', severity: 'error' });
  }

  if (resume.education.length >= 1) {
    score += 5;
  } else {
    feedback.push({ section: 'education', message: 'Add your educational background.', severity: 'warning' });
  }

  if (resume.skills.length >= 5) {
    score += 5;
    if (resume.skills.length >= 10) score += 2;
  } else {
    feedback.push({ section: 'skills', message: `You have ${resume.skills.length} skill${resume.skills.length !== 1 ? 's' : ''} — aim for at least 5–10 to pass keyword filters.`, severity: 'warning' });
  }

  if (resume.projects.length >= 1) score += 3;

  return { score: Math.min(score, 25), feedback };
}

function scoreKeywords(resume: ResumeData): { score: number; feedback: ATSFeedback[] } {
  let score = 0;
  const feedback: ATSFeedback[] = [];
  const text = resumeText(resume);
  const words = extractWords(text);

  // Action verbs (15 pts)
  const verbsFound = ACTION_VERBS.filter(v => words.includes(v));
  const verbScore = Math.min(15, Math.round((verbsFound.length / 8) * 15));
  score += verbScore;
  if (verbsFound.length < 4) {
    feedback.push({ section: 'experience', message: `Only ${verbsFound.length} strong action verbs detected. Use words like "built", "led", "reduced", "shipped".`, severity: 'tip' });
  }

  // Quantified achievements (15 pts)
  const quantities = text.match(QUANTITY_REGEX) ?? [];
  const quantScore = Math.min(15, quantities.length * 3);
  score += quantScore;
  if (quantities.length < 3) {
    feedback.push({ section: 'experience', message: 'Add measurable outcomes (numbers, %, $) — ATS and recruiters reward quantification.', severity: 'tip' });
  } else {
    feedback.push({ section: 'experience', message: `Great — ${quantities.length} quantified achievements found.`, severity: 'success' });
  }

  return { score: Math.min(score, 30), feedback };
}

function scoreJDMatch(resume: ResumeData, jd: string): { score: number; feedback: ATSFeedback[]; missing: string[]; matched: string[]; matchPercent: number } {
  const feedback: ATSFeedback[] = [];
  const jdKeywords = extractKeywordsFromJD(jd);
  const text = resumeText(resume);

  const matched: string[] = [];
  const missing: string[] = [];

  jdKeywords.slice(0, 40).forEach(kw => {
    if (text.includes(kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const matchPercent = jdKeywords.length > 0
    ? Math.round((matched.length / Math.min(jdKeywords.length, 40)) * 100)
    : 0;

  const score = Math.min(25, Math.round((matchPercent / 100) * 25));

  if (matchPercent < 40) {
    feedback.push({ section: 'personalInfo', message: `Low JD match (${matchPercent}%). Consider incorporating more keywords from the job description.`, severity: 'error' });
  } else if (matchPercent < 70) {
    feedback.push({ section: 'personalInfo', message: `Moderate JD match (${matchPercent}%). ${missing.length} keywords are still missing.`, severity: 'warning' });
  } else {
    feedback.push({ section: 'personalInfo', message: `Strong JD match (${matchPercent}%)! Your resume aligns well with this role.`, severity: 'success' });
  }

  return { score, feedback, missing: missing.slice(0, 20), matched, matchPercent };
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function calculateATSScore(resume: ResumeData, jd?: string): ATSResult {
  const fmt = scoreFormat(resume);
  const str = scoreStructure(resume);
  const kw = scoreKeywords(resume);

  let jdScore = 0;
  let missingKeywords: string[] = [];
  let matchedKeywords: string[] = [];
  let matchPercent: number | null = null;
  const jdFeedback: ATSFeedback[] = [];

  if (jd && jd.trim().length > 20) {
    const jdResult = scoreJDMatch(resume, jd);
    jdScore = jdResult.score;
    missingKeywords = jdResult.missing;
    matchedKeywords = jdResult.matched;
    matchPercent = jdResult.matchPercent;
    jdFeedback.push(...jdResult.feedback);
  }

  const breakdown: ATSBreakdown = {
    format: fmt.score,
    structure: str.score,
    keywords: kw.score,
    jdMatch: jdScore,
  };

  const baseTotal = fmt.score + str.score + kw.score;
  // If no JD: scale to 75 pts max (the 25 JD pts become a bonus at 0)
  const totalScore = jd && jd.trim().length > 20
    ? Math.min(100, baseTotal + jdScore)
    : Math.min(100, Math.round((baseTotal / 75) * 100));

  const allFeedback = [...fmt.feedback, ...str.feedback, ...kw.feedback, ...jdFeedback];

  return {
    totalScore,
    breakdown,
    feedback: allFeedback,
    missingKeywords,
    matchedKeywords,
    matchPercent,
  };
}

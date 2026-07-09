import React, { useState, useEffect, useCallback } from 'react';
import { calculateATSScore, ATSResult, ATSFeedback } from '@/lib/atsScorer';
import { ResumeData } from '@/types/resume';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Target, AlertTriangle, CheckCircle2, Info, Lightbulb,
  ChevronDown, ChevronUp, Zap, X, Search
} from 'lucide-react';

interface ATSPanelProps {
  resumeData: ResumeData;
}

const SECTION_LABELS: Record<string, string> = {
  personalInfo: 'Personal Info',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
};

function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? '#10b981' :
    score >= 50 ? '#f59e0b' : '#ef4444';

  const label =
    score >= 75 ? 'Strong' :
    score >= 50 ? 'Fair' : 'Weak';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black" style={{ color }}>{score}</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">/100</span>
        </div>
      </div>
      <span className="text-sm font-bold" style={{ color }}>{label} ATS Score</span>
    </div>
  );
}

function BreakdownBar({ label, score, max, color }: { label: string; score: number; max: number; color: string }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{score}/{max}</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function FeedbackIcon({ severity }: { severity: ATSFeedback['severity'] }) {
  if (severity === 'error') return <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />;
  if (severity === 'warning') return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />;
  if (severity === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />;
  return <Lightbulb className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />;
}

function FeedbackCard({ item }: { item: ATSFeedback }) {
  const bg =
    item.severity === 'error'   ? 'bg-red-50 border-red-200' :
    item.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
    item.severity === 'success' ? 'bg-emerald-50 border-emerald-200' :
    'bg-blue-50 border-blue-200';

  return (
    <div className={`flex gap-2.5 p-3 rounded-xl border ${bg}`}>
      <FeedbackIcon severity={item.severity} />
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {SECTION_LABELS[item.section] ?? item.section}
        </span>
        <p className="text-xs text-foreground leading-relaxed mt-0.5">{item.message}</p>
      </div>
    </div>
  );
}

export function ATSPanel({ resumeData }: ATSPanelProps) {
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<ATSResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [showMissing, setShowMissing] = useState(true);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const recalculate = useCallback((data: ResumeData, jdText: string) => {
    const r = calculateATSScore(data, jdText || undefined);
    setResult(r);
  }, []);

  // Recalculate immediately on mount
  useEffect(() => {
    recalculate(resumeData, jd);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced recalculate on resume change (800ms)
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const t = setTimeout(() => recalculate(resumeData, jd), 800);
    setDebounceTimer(t);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData, jd]);

  if (!result) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const errors = result.feedback.filter(f => f.severity === 'error');
  const warnings = result.feedback.filter(f => f.severity === 'warning');
  const tips = result.feedback.filter(f => f.severity === 'tip' || f.severity === 'success');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" /> ATS Score
        </h2>
        <p className="text-sm text-muted-foreground">
          Live readability score for Applicant Tracking Systems — recalculates as you edit.
        </p>
      </div>

      {/* Score Ring */}
      <div className="flex justify-center py-4">
        <ScoreRing score={result.totalScore} />
      </div>

      {/* Breakdown */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowBreakdown(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Score Breakdown
          </span>
          {showBreakdown ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {showBreakdown && (
          <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
            <BreakdownBar label="Format Validity" score={result.breakdown.format} max={20} color="#6366f1" />
            <BreakdownBar label="Section Structure" score={result.breakdown.structure} max={25} color="#8b5cf6" />
            <BreakdownBar label="Keyword Quality" score={result.breakdown.keywords} max={30} color="#0ea5e9" />
            <BreakdownBar
              label={result.matchPercent !== null ? `JD Match (${result.matchPercent}%)` : 'JD Match (paste JD below)'}
              score={result.breakdown.jdMatch}
              max={25}
              color="#10b981"
            />
          </div>
        )}
      </div>

      {/* JD Textarea */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Target Job Description</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste the full JD to unlock keyword match analysis and missing skills list.
        </p>
        <Textarea
          value={jd}
          onChange={e => setJd(e.target.value)}
          placeholder="Paste the job description here…"
          rows={5}
          className="rounded-xl resize-none text-xs"
        />
        {jd && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setJd('')}
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </Button>
        )}

        {/* Match % badge */}
        {result.matchPercent !== null && (
          <div className="flex items-center gap-2 pt-1">
            <div
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: result.matchPercent >= 70 ? '#10b981' : result.matchPercent >= 40 ? '#f59e0b' : '#ef4444' }}
            >
              {result.matchPercent}% Match
            </div>
            <span className="text-xs text-muted-foreground">
              {result.matchedKeywords.length} of {result.matchedKeywords.length + result.missingKeywords.length} JD keywords found
            </span>
          </div>
        )}
      </div>

      {/* Missing Keywords */}
      {result.missingKeywords.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowMissing(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" /> Missing Keywords ({result.missingKeywords.length})
            </span>
            {showMissing ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {showMissing && (
            <div className="px-4 pb-4 pt-3 border-t border-border flex flex-wrap gap-1.5">
              {result.missingKeywords.map(kw => (
                <Badge key={kw} variant="outline" className="text-[10px] text-red-600 border-red-200 bg-red-50">
                  {kw}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Matched Keywords */}
      {result.matchedKeywords.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Matched Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.matchedKeywords.slice(0, 20).map(kw => (
              <Badge key={kw} variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-white">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Cards */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" /> Inline Feedback
        </p>
        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((f, i) => <FeedbackCard key={i} item={f} />)}
          </div>
        )}
        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((f, i) => <FeedbackCard key={i} item={f} />)}
          </div>
        )}
        {tips.length > 0 && (
          <div className="space-y-2">
            {tips.map((f, i) => <FeedbackCard key={i} item={f} />)}
          </div>
        )}
      </div>
    </div>
  );
}

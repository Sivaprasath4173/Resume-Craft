import React, { useState } from 'react';
import { generateQuestions, QuestionGroup, InterviewQuestion } from '@/lib/interviewPrep';
import { ResumeData, RoleTag } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Brain, RefreshCw, Loader2, Check, Circle,
  FolderOpen, Briefcase, Heart, Lightbulb, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

const ROLE_OPTIONS: (RoleTag | 'auto')[] = ['auto', 'SDE', 'AI/GenAI', 'Full-stack', 'Data', 'DevOps', 'Design', 'PM'];

interface InterviewPrepPanelProps {
  resumeData: ResumeData;
}

function QuestionCard({
  q,
  onToggle,
}: {
  q: InterviewQuestion;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`border rounded-2xl p-4 transition-all duration-200 ${
        q.practiced
          ? 'bg-emerald-50 border-emerald-200 opacity-80'
          : 'bg-card border-border hover:border-primary/20 hover:shadow-sm'
      }`}
    >
      <div className="flex gap-3 items-start">
        <button
          onClick={() => onToggle(q.id)}
          className="flex-shrink-0 mt-0.5"
          title={q.practiced ? 'Mark as not practiced' : 'Mark as practiced'}
        >
          {q.practiced
            ? <Check className="w-4 h-4 text-emerald-500" />
            : <Circle className="w-4 h-4 text-muted-foreground/40 hover:text-primary transition-colors" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm leading-relaxed ${q.practiced ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {q.question}
          </p>
          {q.source && (
            <Badge variant="outline" className="text-[9px] mt-1.5 h-4 px-1.5 text-muted-foreground">
              {q.source}
            </Badge>
          )}
          {q.hint && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(v => !v)}
                className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
              >
                <Lightbulb className="w-3 h-3" />
                {expanded ? 'Hide hint' : 'Show hint'}
                {expanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
              </button>
              {expanded && (
                <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mt-1.5 leading-relaxed">
                  💡 {q.hint}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionsTab({ questions, onToggle }: { questions: InterviewQuestion[]; onToggle: (id: string) => void }) {
  const practiced = questions.filter(q => q.practiced).length;
  return (
    <div className="space-y-3">
      {questions.length > 0 && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">{practiced}/{questions.length} practiced</span>
          <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: questions.length ? `${(practiced / questions.length) * 100}%` : '0%' }}
            />
          </div>
        </div>
      )}
      {questions.map(q => (
        <QuestionCard key={q.id} q={q} onToggle={onToggle} />
      ))}
      {questions.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8 italic">
          Click "Generate Questions" above to start.
        </p>
      )}
    </div>
  );
}

export function InterviewPrepPanel({ resumeData }: InterviewPrepPanelProps) {
  const [targetRole, setTargetRole] = useState<string>('auto');
  const [questions, setQuestions] = useState<QuestionGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [practicedMap, setPracticedMap] = useState<Record<string, boolean>>({});

  const allQuestions = questions
    ? [...questions.project, ...questions.role, ...questions.behavioral]
    : [];
  const totalPracticed = allQuestions.filter(q => practicedMap[q.id]).length;

  const enriched = (qs: InterviewQuestion[]) =>
    qs.map(q => ({ ...q, practiced: practicedMap[q.id] ?? false }));

  const handleGenerate = async () => {
    setLoading(true);
    setPracticedMap({});
    try {
      const role = targetRole === 'auto' ? undefined : targetRole;
      const result = await generateQuestions(resumeData, role);
      setQuestions(result);
    } catch (e) {
      toast.error('Failed to generate questions. Check your Gemini API key.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id: string) => {
    setPracticedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const total = allQuestions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" /> Interview Prep
        </h2>
        <p className="text-sm text-muted-foreground">
          AI-generated questions tailored to your specific projects, skills, and experience.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 space-y-3">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label className="text-xs mb-1.5 block">Target Role</Label>
            <Select value={targetRole} onValueChange={setTargetRole}>
              <SelectTrigger className="rounded-xl h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (from resume title)</SelectItem>
                {ROLE_OPTIONS.filter(r => r !== 'auto').map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-xl gap-2 h-9"
          >
            {loading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
            ) : questions ? (
              <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
            ) : (
              <><Brain className="w-3.5 h-3.5" /> Generate</>
            )}
          </Button>
        </div>

        {total > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {totalPracticed}/{total} questions practiced
            </span>
            <div className="w-32 h-1.5 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: total ? `${(totalPracticed / total) * 100}%` : '0%' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      {questions && (
        <Tabs defaultValue="project">
          <TabsList className="w-full rounded-xl">
            <TabsTrigger value="project" className="flex-1 text-xs gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" /> Project
              <Badge variant="outline" className="text-[9px] h-4 px-1 ml-0.5">{questions.project.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="role" className="flex-1 text-xs gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Role
              <Badge variant="outline" className="text-[9px] h-4 px-1 ml-0.5">{questions.role.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="behavioral" className="flex-1 text-xs gap-1.5">
              <Heart className="w-3.5 h-3.5" /> Behavioral
              <Badge variant="outline" className="text-[9px] h-4 px-1 ml-0.5">{questions.behavioral.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="project" className="mt-4">
            <QuestionsTab questions={enriched(questions.project)} onToggle={handleToggle} />
          </TabsContent>
          <TabsContent value="role" className="mt-4">
            <QuestionsTab questions={enriched(questions.role)} onToggle={handleToggle} />
          </TabsContent>
          <TabsContent value="behavioral" className="mt-4">
            <QuestionsTab questions={enriched(questions.behavioral)} onToggle={handleToggle} />
          </TabsContent>
        </Tabs>
      )}

      {!questions && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          <Brain className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Click "Generate" to create interview questions</p>
          <p className="text-xs mt-1 opacity-70">Requires <code className="bg-secondary px-1 rounded text-[10px]">VITE_GEMINI_API_KEY</code> in your <code className="bg-secondary px-1 rounded text-[10px]">.env</code> file.</p>
        </div>
      )}
    </div>
  );
}

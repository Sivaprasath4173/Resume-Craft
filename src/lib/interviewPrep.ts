import { ResumeData } from '@/types/resume';

export interface InterviewQuestion {
  id: string;
  question: string;
  hint?: string;
  category: 'project' | 'role' | 'behavioral';
  source?: string; // e.g. "React + Node.js e-commerce app"
  practiced?: boolean;
}

export interface QuestionGroup {
  project: InterviewQuestion[];
  role: InterviewQuestion[];
  behavioral: InterviewQuestion[];
}

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

function buildPrompt(resume: ResumeData, targetRole?: string): string {
  const { personalInfo, experience, projects, skills } = resume;

  const expSummary = experience.map(e =>
    `- ${e.position} at ${e.company}: ${e.description?.slice(0, 200)}`
  ).join('\n');

  const projSummary = projects.map(p =>
    `- ${p.name} (${p.technologies}): ${p.description?.slice(0, 200)}`
  ).join('\n');

  const skillList = skills.map(s => s.name).join(', ');
  const role = targetRole ?? personalInfo.jobTitle ?? 'Software Engineer';

  return `You are an expert technical interview coach. Based ONLY on the specific resume content below, generate interview questions. 
Do NOT ask generic questions — each question must reference specific technologies, projects, or experiences listed.

Resume Owner: ${personalInfo.fullName}
Target Role: ${role}

Work Experience:
${expSummary || '(none listed)'}

Projects:
${projSummary || '(none listed)'}

Skills: ${skillList || '(none listed)'}

Generate exactly 15 questions in this JSON format (no markdown, no code fences, just raw JSON):
{
  "project": [
    { "question": "...", "hint": "...", "source": "project or experience name" },
    { "question": "...", "hint": "...", "source": "..." },
    { "question": "...", "hint": "...", "source": "..." },
    { "question": "...", "hint": "...", "source": "..." },
    { "question": "...", "hint": "...", "source": "..." }
  ],
  "role": [
    { "question": "...", "hint": "...", "source": "..." },
    { "question": "...", "hint": "...", "source": "..." },
    { "question": "...", "hint": "...", "source": "..." },
    { "question": "...", "hint": "...", "source": "..." },
    { "question": "...", "hint": "...", "source": "..." }
  ],
  "behavioral": [
    { "question": "...", "hint": "...", "source": "..." },
    { "question": "...", "hint": "...", "source": "..." },
    { "question": "...", "hint": "...", "source": "..." },
    { "question": "...", "hint": "...", "source": "..." },
    { "question": "...", "hint": "...", "source": "..." }
  ]
}

Rules:
- project questions must reference a specific named project or technology from the resume
- role questions must reference specific skills/tools listed
- behavioral questions should reference specific experiences from the resume
- hints should be short coaching tips (1 sentence)
- Do not output anything other than the JSON object`;
}

export async function generateQuestions(
  resumeData: ResumeData,
  targetRole?: string
): Promise<QuestionGroup> {
  const key = import.meta.env.VITE_GEMINI_API_KEY;

  if (!key) {
    return { project: [], role: [], behavioral: [] };
  }

  const body = {
    contents: [{ role: 'user', parts: [{ text: buildPrompt(resumeData, targetRole) }] }],
    generationConfig: { temperature: 0.6, maxOutputTokens: 1500 },
  };

  const resp = await fetch(`${GEMINI_ENDPOINT}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  const data = await resp.json();
  let text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

  // Strip markdown code blocks if present
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  const parsed = JSON.parse(text) as { project: any[]; role: any[]; behavioral: any[] };

  const mapQ = (q: any, category: InterviewQuestion['category']): InterviewQuestion => ({
    id: crypto.randomUUID(),
    question: q.question,
    hint: q.hint,
    source: q.source,
    category,
    practiced: false,
  });

  return {
    project: (parsed.project ?? []).map(q => mapQ(q, 'project')),
    role: (parsed.role ?? []).map(q => mapQ(q, 'role')),
    behavioral: (parsed.behavioral ?? []).map(q => mapQ(q, 'behavioral')),
  };
}



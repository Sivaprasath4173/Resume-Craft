export interface RewriteResult {
  status: 'success' | 'needs_details' | 'error';
  rewritten?: string;
  missingDetailsPrompt?: string;
  errorMessage?: string;
}

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const STRICT_SYSTEM_PROMPT = `You are a professional resume bullet point writer. Your ONLY job is to rephrase and restructure text the user provides.

ABSOLUTE RULES — never break these:
1. NEVER invent metrics, percentages, numbers, dollar amounts, or outcomes that the user did not provide.
2. NEVER add technologies, tools, languages, or frameworks not mentioned in the input.
3. NEVER add company names, team sizes, timelines, or dates not provided.
4. If the bullet is too vague to improve without inventing details, respond ONLY with exactly: NEEDS_DETAILS: <one sentence explaining what specific info would help>
5. Start every bullet with a strong past-tense action verb.
6. Keep the rewrite concise — ideally one to two lines.
7. Do NOT use filler phrases like "successfully", "effectively", "responsible for".
8. Output ONLY the rewritten bullet text, nothing else.`;

function extractNumbers(text: string): string[] {
  return (text.match(/\d+[\w%+]*/g) ?? []);
}

function containsInventedNumbers(original: string, rewritten: string): boolean {
  const originalNums = new Set(extractNumbers(original));
  const rewrittenNums = extractNumbers(rewritten);
  return rewrittenNums.some(n => !originalNums.has(n));
}

export async function rewriteBullet(
  original: string,
  userContext: string,
  apiKey?: string
): Promise<RewriteResult> {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!key) {
    return {
      status: 'error',
      errorMessage: 'Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.',
    };
  }

  if (!original.trim()) {
    return { status: 'needs_details', missingDetailsPrompt: 'The bullet point is empty. Add some content first.' };
  }

  const combined = userContext.trim()
    ? `Original bullet: ${original}\n\nUser-provided context/details to incorporate: ${userContext}`
    : `Original bullet: ${original}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${STRICT_SYSTEM_PROMPT}\n\n---\n\n${combined}` }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 200,
    },
  };

  try {
    const resp = await fetch(`${GEMINI_ENDPOINT}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return { status: 'error', errorMessage: `API error ${resp.status}: ${err.slice(0, 200)}` };
    }

    const data = await resp.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

    if (!text) {
      return { status: 'error', errorMessage: 'Empty response from AI.' };
    }

    // Handle NEEDS_DETAILS signal
    if (text.startsWith('NEEDS_DETAILS:')) {
      return {
        status: 'needs_details',
        missingDetailsPrompt: text.replace('NEEDS_DETAILS:', '').trim(),
      };
    }

    // Guard: check if AI invented numbers
    if (containsInventedNumbers(original, text)) {
      return {
        status: 'needs_details',
        missingDetailsPrompt:
          'The AI would need to invent metrics to improve this bullet. Please provide specific numbers, percentages, or outcomes so the rewrite is accurate.',
      };
    }

    return { status: 'success', rewritten: text };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { status: 'error', errorMessage: message };
  }
}

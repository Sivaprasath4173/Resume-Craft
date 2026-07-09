import React, { useState } from 'react';
import { rewriteBullet } from '@/lib/aiRewriter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sparkles, Loader2, Check, X, Edit2, AlertTriangle,
  ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface BulletRewriterProps {
  original: string;
  onAccept: (newText: string) => void;
  label?: string;
}

type RewriteState = 'idle' | 'loading' | 'success' | 'needs_details' | 'error';

export function BulletRewriter({ original, onAccept, label = 'Description' }: BulletRewriterProps) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState('');
  const [state, setState] = useState<RewriteState>('idle');
  const [rewritten, setRewritten] = useState('');
  const [editedRewrite, setEditedRewrite] = useState('');
  const [detailsPrompt, setDetailsPrompt] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editing, setEditing] = useState(false);

  const handleRewrite = async () => {
    setState('loading');
    setRewritten('');
    setEditedRewrite('');
    setDetailsPrompt('');
    setErrorMsg('');

    const result = await rewriteBullet(original, context);

    if (result.status === 'success' && result.rewritten) {
      setState('success');
      setRewritten(result.rewritten);
      setEditedRewrite(result.rewritten);
    } else if (result.status === 'needs_details') {
      setState('needs_details');
      setDetailsPrompt(result.missingDetailsPrompt ?? '');
    } else {
      setState('error');
      setErrorMsg(result.errorMessage ?? 'Unknown error');
    }
  };

  const handleAccept = () => {
    const final = editing ? editedRewrite : rewritten;
    onAccept(final);
    toast.success('Bullet point updated!');
    setOpen(false);
    setState('idle');
    setContext('');
  };

  const handleReject = () => {
    setState('idle');
    setRewritten('');
    setEditedRewrite('');
  };

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-primary/80 hover:text-primary transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5" />
        ✨ Rewrite with AI
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {open && (
        <div className="mt-2 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Before */}
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Current {label}
            </Label>
            <div className="bg-white border border-border rounded-xl p-3 text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
              {original || <span className="italic text-muted-foreground">Empty — add some content first.</span>}
            </div>
          </div>

          {/* Context */}
          {(state === 'idle' || state === 'needs_details' || state === 'error') && (
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Add context <span className="font-normal normal-case">(numbers, tools, dates — optional but recommended)</span>
              </Label>
              {state === 'needs_details' && (
                <div className="flex gap-2 mb-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">{detailsPrompt}</p>
                </div>
              )}
              {state === 'error' && (
                <div className="flex gap-2 mb-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{errorMsg}</p>
                </div>
              )}
              <Textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder={'e.g. "Reduced load time by 40%, used Redis, shipped in Q1 2024"'}
                rows={2}
                className="rounded-xl resize-none text-xs"
              />
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={handleRewrite}
                  className="gap-1.5 text-xs h-8 rounded-xl bg-violet-600 hover:bg-violet-700"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {state === 'needs_details' || state === 'error' ? 'Try Again' : 'Rewrite'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setOpen(false)} className="text-xs h-8 rounded-xl">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Loading */}
          {state === 'loading' && (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <div className="relative w-10 h-10">
                <Loader2 className="w-10 h-10 animate-spin text-violet-300" />
                <Sparkles className="w-4 h-4 text-violet-600 absolute inset-0 m-auto" />
              </div>
              <p className="text-xs text-muted-foreground">Crafting your rewrite…</p>
            </div>
          )}

          {/* After / Success */}
          {state === 'success' && (
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1.5 block flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Rewritten Version
              </Label>
              <div className="bg-white border border-emerald-200 rounded-xl p-3 relative">
                {editing ? (
                  <Textarea
                    value={editedRewrite}
                    onChange={e => setEditedRewrite(e.target.value)}
                    rows={4}
                    className="rounded-lg resize-none text-xs border-0 p-0 focus-visible:ring-0"
                    autoFocus
                  />
                ) : (
                  <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">{rewritten}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="gap-1.5 text-xs h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700"
                >
                  <Check className="w-3.5 h-3.5" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(v => !v)}
                  className="gap-1.5 text-xs h-8 rounded-xl"
                >
                  <Edit2 className="w-3.5 h-3.5" /> {editing ? 'Done Editing' : 'Edit'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setState('idle'); setContext(''); }}
                  className="gap-1.5 text-xs h-8 rounded-xl"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReject}
                  className="gap-1.5 text-xs h-8 rounded-xl text-destructive hover:bg-destructive/10"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

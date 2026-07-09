import React, { useState, useEffect } from 'react';
import { ReviewComment } from '@/types/review';
import { subscribeComments, addComment } from '@/lib/shareLinks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, User, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface CommentPanelProps {
  token: string;
  mode: 'read-only' | 'comment';
  activeSection?: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const SECTION_LABELS: Record<string, string> = {
  personalInfo: 'Personal Info',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
};

export function CommentPanel({ token, mode, activeSection }: CommentPanelProps) {
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [selectedSection, setSelectedSection] = useState(activeSection ?? 'personalInfo');
  const [submitting, setSubmitting] = useState(false);
  const [collapseMap, setCollapseMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsub = subscribeComments(token, setComments);
    return unsub;
  }, [token]);

  useEffect(() => {
    if (activeSection) setSelectedSection(activeSection);
  }, [activeSection]);

  const grouped = comments.reduce<Record<string, ReviewComment[]>>((acc, c) => {
    const key = c.section;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const handleSubmit = async () => {
    if (!commentText.trim()) { toast.error('Comment cannot be empty'); return; }
    if (!authorName.trim()) { toast.error('Please enter your name'); return; }
    setSubmitting(true);
    try {
      await addComment(token, selectedSection, commentText.trim(), authorName.trim());
      setCommentText('');
      toast.success('Comment posted!');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const sections = Object.keys({ ...SECTION_LABELS, ...grouped });

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Comments
          {comments.length > 0 && (
            <span className="text-xs font-normal text-muted-foreground">({comments.length})</span>
          )}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {sections.map(section => {
          const sectionComments = grouped[section] ?? [];
          const label = SECTION_LABELS[section] ?? section;
          const collapsed = collapseMap[section];

          return (
            <div key={section} className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-secondary/40 transition-colors"
                onClick={() => setCollapseMap(m => ({ ...m, [section]: !m[section] }))}
              >
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  {label}
                  {sectionComments.length > 0 && (
                    <span className="bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {sectionComments.length}
                    </span>
                  )}
                </span>
                {collapsed ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronUp className="w-3 h-3 text-muted-foreground" />}
              </button>
              {!collapsed && (
                <div className="px-3 pb-3 pt-1 space-y-2 border-t border-border">
                  {sectionComments.length === 0 && (
                    <p className="text-[10px] text-muted-foreground italic py-1">No comments yet on this section.</p>
                  )}
                  {sectionComments.map(c => (
                    <div key={c.id} className="flex gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold">{c.authorName}</span>
                          <span className="text-[10px] text-muted-foreground">{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed mt-0.5">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-30" />
            <p className="text-xs">No comments yet. Be the first to leave feedback!</p>
          </div>
        )}
      </div>

      {/* Comment form */}
      {mode === 'comment' && (
        <div className="border-t border-border px-3 py-3 space-y-2 bg-card">
          <Input
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            placeholder="Your name"
            className="rounded-xl h-8 text-xs"
          />
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-muted-foreground">Commenting on:</span>
            <select
              className="text-[10px] border border-border rounded-lg px-2 py-1 bg-background text-foreground"
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
            >
              {Object.entries(SECTION_LABELS).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Leave feedback…"
              rows={2}
              className="rounded-xl resize-none text-xs flex-1"
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
            />
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={submitting}
              className="self-end rounded-xl h-10 w-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[9px] text-muted-foreground">Ctrl+Enter to send</p>
        </div>
      )}
    </div>
  );
}

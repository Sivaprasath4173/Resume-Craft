import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShareLink, markAllRead } from '@/lib/shareLinks';
import { ShareLink } from '@/types/review';
import { ResumeData } from '@/types/resume';
import { CommentPanel } from '@/components/review/CommentPanel';
import { Loader2, FileText, MessageSquare, Eye, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ModernTemplate, MinimalTemplate, ProfessionalTemplate
} from '@/components/resume/ResumeTemplates';

function ResumePreview({ data }: { data: ResumeData }) {
  const template = data.template ?? 'modern';
  const design = data.design ?? { font: 'Inter', accentColor: '#0f172a', margins: 'standard' };
  return (
    <div>
      <style>{`
        #review-resume { font-family: '${design.font}', sans-serif !important; }
        :root { --resume-accent: ${design.accentColor}; }
      `}</style>
      <div id="review-resume" className="bg-white text-slate-950 min-h-[297mm]">
        {template === 'modern'       && <ModernTemplate data={data} />}
        {template === 'minimal'      && <MinimalTemplate data={data} />}
        {template === 'professional' && <ProfessionalTemplate data={data} />}
        {/* Fallback for any legacy template — render Modern */}
        {!['modern','minimal','professional'].includes(template) && <ModernTemplate data={data} />}
      </div>
    </div>
  );
}

export default function ReviewView() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [linkData, setLinkData] = useState<ShareLink | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [activeSection, setActiveSection] = useState('personalInfo');

  useEffect(() => {
    if (!token) { setNotFound(true); setLoading(false); return; }
    getShareLink(token).then(link => {
      if (!link) { setNotFound(true); setLoading(false); return; }
      setLinkData(link);
      try {
        setResumeData(JSON.parse(link.resumeSnapshot));
      } catch {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !linkData || !resumeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <AlertTriangle className="w-10 h-10 opacity-40" />
        <p className="text-lg font-semibold">Link not found or expired</p>
        <Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const ownerName = resumeData.personalInfo.fullName || 'Someone';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">ResumeCraft</p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Reviewing {ownerName}'s resume
              {linkData.mode === 'read-only' && ' (read-only)'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {linkData.mode === 'comment' && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl h-8 text-xs"
              onClick={() => setShowComments(v => !v)}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2 rounded-xl h-8 text-xs" onClick={() => navigate('/')}>
            Get ResumeCraft
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Resume */}
        <div className={`flex-1 overflow-y-auto p-6 flex justify-center ${showComments && linkData.mode === 'comment' ? '' : ''}`}>
          <div className="w-full max-w-[210mm] bg-white shadow-xl rounded-lg overflow-hidden">
            <ResumePreview data={resumeData} />
          </div>
        </div>

        {/* Comment panel */}
        {showComments && linkData.mode === 'comment' && token && (
          <aside className="w-80 border-l border-border bg-background flex flex-col flex-shrink-0">
            <CommentPanel
              token={token}
              mode="comment"
              activeSection={activeSection}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

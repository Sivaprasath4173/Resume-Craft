import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon, Briefcase, GraduationCap, Code, FolderOpen, Award, Languages,
  ChevronLeft, ChevronRight, Download, Eye, Sparkles, Save, FileText,
  Plus, Trash2, CheckCircle2, Loader2, ArrowLeft, Palette, LogOut, Layout, GripVertical
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useResume } from '@/hooks/ResumeContext';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import {
  ModernTemplate, MinimalTemplate, ProfessionalTemplate, CreativeTemplate, ExecutiveTemplate, TechTemplate,
  ElegantTemplate, TechnicalTemplate, AcademicTemplate, StartupTemplate, CorporateTemplate,
  DesignerTemplate, SimpleTemplate, VintageTemplate, ModernistTemplate, CompactTemplate
} from '@/components/resume/ResumeTemplates';
import { TemplateId } from '@/types/resume';

const sections = [
  { id: 'personalInfo', label: 'Personal Info', icon: UserIcon, desc: 'Basic details' },
  { id: 'experience', label: 'Experience', icon: Briefcase, desc: 'Work history' },
  { id: 'education', label: 'Education', icon: GraduationCap, desc: 'Academic background' },
  { id: 'skills', label: 'Skills', icon: Code, desc: 'Technical & soft skills' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, desc: 'Personal & professional' },
  { id: 'certifications', label: 'Certifications', icon: Award, desc: 'Credentials & courses' },
  { id: 'languages', label: 'Languages', icon: Languages, desc: 'Spoken languages' },
  { id: 'design', label: 'Design', icon: Layout, desc: 'Fonts & Colors' },
] as const;

const templates: { id: TemplateId; name: string; color: string }[] = [
  { id: 'modern', name: 'Modern', color: 'bg-slate-800' },
  { id: 'minimal', name: 'Minimal', color: 'bg-slate-400' },
  { id: 'professional', name: 'Professional', color: 'bg-emerald-600' },
  { id: 'creative', name: 'Creative', color: 'bg-violet-600' },
  { id: 'executive', name: 'Executive', color: 'bg-amber-700' },
  { id: 'tech', name: 'Tech', color: 'bg-slate-950 border border-emerald-500' },
  { id: 'elegant', name: 'Elegant', color: 'bg-orange-50 border border-orange-200' },
  { id: 'technical', name: 'Dev', color: 'bg-blue-900 shadow-lg shadow-blue-900/20' },
  { id: 'academic', name: 'Scholar', color: 'bg-stone-100 border-2 border-stone-800' },
  { id: 'startup', name: 'Unicorn', color: 'bg-indigo-600' },
  { id: 'corporate', name: 'Global', color: 'bg-sky-950' },
  { id: 'designer', name: 'Aura', color: 'bg-black shadow-[0_0_15px_rgba(255,255,255,0.1)]' },
  { id: 'simple', name: 'Pure', color: 'bg-slate-50 border border-slate-200' },
  { id: 'vintage', name: 'Retro', color: 'bg-[#f4f1ea] border border-[#2c1810]' },
  { id: 'modernist', name: 'Bauhaus', color: 'bg-gray-100 border-l-4 border-red-600' },
  { id: 'compact', name: 'Dense', color: 'bg-teal-50 border-t-2 border-teal-900' },
];

const aiSuggestions: Record<string, string[]> = {
  summary: [
    'Results-driven software engineer with 3+ years of experience building scalable web applications using React and Node.js.',
    'Creative product designer passionate about crafting intuitive user experiences that drive engagement and business growth.',
    'Recent CS graduate eager to contribute technical skills and fresh perspectives to an innovative development team.',
  ],
  description: [
    'Developed and maintained RESTful APIs serving 100K+ daily active users, reducing response time by 40%.',
    'Led cross-functional team of 5 engineers to deliver mobile app 2 weeks ahead of schedule under tight deadline.',
    'Implemented automated testing suite achieving 90% code coverage, eliminating critical production bugs.',
  ],
};

export default function Builder() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('personalInfo');
  const [showPreview, setShowPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiField, setAiField] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const store = useResume();
  const { resumeData, completionScore, lastSaved } = store;
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const handleDownload = () => {
    window.print();
  };

  const handleAISuggest = async (field: string) => {
    setAiField(field);
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setAiLoading(false);
  };

  const applyAISuggestion = (text: string) => {
    if (aiField === 'summary') {
      store.updatePersonalInfo({ summary: text });
    }
    setAiField(null);
  };

  const sectionIndex = sections.findIndex(s => s.id === activeSection);

  // Filter out 'design' from draggable sections, keep it separate
  const activeSectionsList = resumeData.sectionOrder.filter(id => id !== 'design');

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(activeSectionsList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Add 'design' back at the end or wherever appropriate if needed, but we keep it separate visually
    const newOrder = [...items, 'design'] as any;
    store.setSectionOrder(newOrder);
  };

  // Default design if undefined
  const design = resumeData.design || { font: 'Inter', accentColor: '#0f172a', margins: 'standard' };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Lora:ital,wght@0,400;0,600;1,400&family=Open+Sans:wght@400;600;800&family=Playfair+Display:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap');
        
        #resume-preview-content {
          font-family: '${design.font}', sans-serif !important;
        }
        
        /* Force override inner tailwind classes to respect user choice */
        #resume-preview-content .font-sans,
        #resume-preview-content .font-serif,
        #resume-preview-content .font-mono,
        #resume-preview-content div,
        #resume-preview-content p,
        #resume-preview-content h1,
        #resume-preview-content h2,
        #resume-preview-content h3,
        #resume-preview-content span {
          font-family: '${design.font}', sans-serif;
        }

        :root {
          --resume-accent: ${design.accentColor || '#0f172a'};
        }
      `}</style>
      {/* Top bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4 no-print sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:block">Home</span>
          </Button>
          <div className="w-px h-5 bg-border"></div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm hidden sm:block">ResumeCraft</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex-1 max-w-xs hidden md:block">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Profile Completion</span>
            <span className="text-xs font-semibold text-primary">{completionScore}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${completionScore}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-muted-foreground hidden md:flex items-center gap-1.5 opacity-80">
              <div className="flex items-center gap-1">
                {user ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Cloud Synced</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Saved Locally</span>
                  </>
                )}
              </div>
            </span>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden border border-border shadow-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-medium leading-none">{user.displayName || 'User'}</p>
                    <p className="text-[10px] leading-none text-muted-foreground italic truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5">
                  <LogOut className="w-4 h-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/auth')} className="rounded-lg h-8 text-xs">
              Sign In
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex rounded-lg h-8 text-xs" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-3.5 h-3.5" /> {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary rounded-lg gap-2 h-8 text-xs font-medium" onClick={handleDownload}>
            <Download className="w-3.5 h-3.5" /> <span className="hidden sm:block">Download PDF</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - section nav */}
        <aside className={`w-52 border-r border-border bg-card flex-shrink-0 overflow-y-auto no-print ${showPreview ? 'hidden' : 'hidden md:block'}`}>
          {/* Template selector */}
          <div className="p-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Template
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => store.setTemplate(t.id)}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border-2 transition-all ${resumeData.template === t.id
                    ? 'border-primary bg-primary-light'
                    : 'border-transparent hover:border-border'
                    }`}
                >
                  <div className={`w-8 h-10 ${t.color} rounded-sm`}></div>
                  <span className="text-xs text-muted-foreground">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section nav with Drag & Drop */}
          <nav className="p-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 pt-1 flex items-center justify-between">
              Sections
              <span className="text-[10px] bg-secondary px-1.5 rounded text-muted-foreground/80">Drag to reorder</span>
            </p>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections-nav">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {activeSectionsList.map((sectionId, index) => {
                      const section = sections.find(s => s.id === sectionId) || { id: sectionId, label: sectionId, icon: FileText, desc: '' };
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;

                      return (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <button
                                onClick={() => { setActiveSection(section.id); setShowPreview(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all group relative ${isActive
                                  ? 'bg-primary text-primary-foreground shadow-primary'
                                  : 'hover:bg-secondary text-foreground'
                                  } ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary rotate-2 bg-card z-50' : ''}`}
                              >
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 cursor-grab active:cursor-grabbing" {...provided.dragHandleProps}>
                                  <GripVertical className="w-3 h-3" />
                                </div>
                                <Icon className="w-4 h-4 flex-shrink-0 ml-1.5" />
                                <div className="min-w-0">
                                  <div className="text-sm font-medium leading-none">{section.label}</div>
                                  <div className={`text-xs mt-0.5 truncate ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                    {section.desc}
                                  </div>
                                </div>
                              </button>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {/* Design & Info always at bottom, not draggable necessarily or separate */}
            <div className="mt-2 pt-2 border-t border-border">
              {['design'].map(id => {
                const s = sections.find(sec => sec.id === id)!;
                const Icon = s.icon;
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => { setActiveSection(s.id); setShowPreview(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all ${isActive
                      ? 'bg-primary text-primary-foreground shadow-primary'
                      : 'hover:bg-secondary text-foreground'
                      }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium leading-none">{s.label}</div>
                      <div className={`text-xs mt-0.5 truncate ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {s.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main form area */}
        <main className={`flex-1 overflow-y-auto ${showPreview ? 'hidden' : 'block'}`}>
          <div className="max-w-2xl mx-auto p-6">
            {activeSection === 'personalInfo' && (
              <PersonalInfoForm store={store} onAISuggest={handleAISuggest} aiLoading={aiLoading} aiField={aiField} onApplySuggestion={applyAISuggestion} />
            )}
            {activeSection === 'experience' && <ExperienceForm store={store} onAISuggest={handleAISuggest} aiLoading={aiLoading} />}
            {activeSection === 'education' && <EducationForm store={store} />}
            {activeSection === 'skills' && <SkillsForm store={store} />}
            {activeSection === 'projects' && <ProjectsForm store={store} />}
            {activeSection === 'certifications' && <CertificationsForm store={store} />}
            {activeSection === 'languages' && <LanguagesForm store={store} />}
            {activeSection === 'design' && <DesignForm store={store} showPreview={showPreview} setShowPreview={setShowPreview} />}

            {/* Next/Prev navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => sectionIndex > 0 && setActiveSection(sections[sectionIndex - 1].id)}
                disabled={sectionIndex === 0}
                className="gap-2 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              {sectionIndex < sections.length - 1 ? (
                <Button
                  onClick={() => setActiveSection(sections[sectionIndex + 1].id)}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary rounded-xl"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleDownload}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary rounded-xl"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Right preview panel */}
        {/* Right preview panel */}
        <aside className={`flex-shrink-0 border-l border-border bg-secondary/30 overflow-y-auto duration-300 transition-all ${showPreview ? 'fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-8' : 'w-[420px] hidden lg:block'}`}>
          {!showPreview && (
            <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-2.5 flex items-center justify-between no-print">
              <span className="text-sm font-semibold text-foreground">Live Preview</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Auto-updating</span>
              </div>
            </div>
          )}

          <div className={`${showPreview ? 'w-[210mm] max-w-full h-[85vh] overflow-y-auto bg-white text-slate-950 rounded shadow-2xl animate-scale-in relative scrollbar-hide' : 'p-4'}`} id="resume-preview" ref={previewRef}>
            {showPreview && (
              <Button
                variant="ghost"
                size="icon"
                className="sticky top-2 right-2 left-full ml-auto z-50 hover:bg-slate-100 rounded-full text-slate-500 hover:text-red-500"
                onClick={() => setShowPreview(false)}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
            <div id="resume-preview-content" className={`overflow-hidden ${showPreview ? 'min-h-[297mm] bg-white' : 'bg-card rounded-xl shadow-card border border-border'}`} style={{ minHeight: showPreview ? '297mm' : '600px', transform: 'scale(1)', transformOrigin: 'top center' }}>
              {resumeData.template === 'modern' && <ModernTemplate data={resumeData} />}
              {resumeData.template === 'minimal' && <MinimalTemplate data={resumeData} />}
              {resumeData.template === 'professional' && <ProfessionalTemplate data={resumeData} />}
              {resumeData.template === 'creative' && <CreativeTemplate data={resumeData} />}
              {resumeData.template === 'executive' && <ExecutiveTemplate data={resumeData} />}
              {resumeData.template === 'tech' && <TechTemplate data={resumeData} />}
              {resumeData.template === 'elegant' && <ElegantTemplate data={resumeData} />}
              {resumeData.template === 'technical' && <TechnicalTemplate data={resumeData} />}
              {resumeData.template === 'academic' && <AcademicTemplate data={resumeData} />}
              {resumeData.template === 'startup' && <StartupTemplate data={resumeData} />}
              {resumeData.template === 'corporate' && <CorporateTemplate data={resumeData} />}
              {resumeData.template === 'designer' && <DesignerTemplate data={resumeData} />}
              {resumeData.template === 'simple' && <SimpleTemplate data={resumeData} />}
              {resumeData.template === 'vintage' && <VintageTemplate data={resumeData} />}
              {resumeData.template === 'modernist' && <ModernistTemplate data={resumeData} />}
              {resumeData.template === 'compact' && <CompactTemplate data={resumeData} />}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ── Form sections ────────────────────────────────────────────────────────────

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-xl font-bold mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function AIButton({ onClick, loading, field, activeField }: { onClick: () => void; loading: boolean; field: string; activeField: string | null }) {
  const isLoading = loading && activeField === field;
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={loading}
      className="gap-2 text-primary border-primary/30 hover:bg-primary-light rounded-lg text-xs"
    >
      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
      Improve with AI
    </Button>
  );
}

function AISuggestionPanel({ suggestions, onApply, onClose }: { suggestions: string[]; onApply: (s: string) => void; onClose: () => void }) {
  return (
    <div className="mt-2 p-3 bg-primary-light border border-primary/20 rounded-xl animate-scale-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> AI Suggestions
        </span>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div key={i} className="p-2.5 bg-card rounded-lg border border-border text-xs text-foreground leading-relaxed cursor-pointer hover:border-primary/40 transition-colors" onClick={() => { onApply(s); onClose(); }}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalInfoForm({ store, onAISuggest, aiLoading, aiField, onApplySuggestion }: any) {
  const p = store.resumeData.personalInfo;
  const update = (key: string, value: string) => store.updatePersonalInfo({ [key]: value });

  return (
    <div>
      <SectionHeader title="Personal Information" desc="This information appears at the top of your resume." />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs mb-1.5 block">Full Name *</Label>
            <Input value={p.fullName} onChange={e => update('fullName', e.target.value)} placeholder="John Doe" className="rounded-xl" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Job Title *</Label>
            <Input value={p.jobTitle} onChange={e => update('jobTitle', e.target.value)} placeholder="Software Engineer" className="rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs mb-1.5 block">Email *</Label>
            <Input value={p.email} onChange={e => update('email', e.target.value)} placeholder="john@example.com" type="email" className="rounded-xl" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Phone</Label>
            <Input value={p.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 234 567 8900" className="rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs mb-1.5 block">Location</Label>
            <Input value={p.location} onChange={e => update('location', e.target.value)} placeholder="San Francisco, CA" className="rounded-xl" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Website</Label>
            <Input value={p.website} onChange={e => update('website', e.target.value)} placeholder="https://yoursite.com" className="rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs mb-1.5 block">LinkedIn</Label>
            <Input value={p.linkedin} onChange={e => update('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" className="rounded-xl" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">GitHub</Label>
            <Input value={p.github} onChange={e => update('github', e.target.value)} placeholder="github.com/johndoe" className="rounded-xl" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs">Professional Summary</Label>
            <AIButton onClick={() => onAISuggest('summary')} loading={aiLoading} field="summary" activeField={aiField} />
          </div>
          <Textarea
            value={p.summary}
            onChange={e => update('summary', e.target.value)}
            placeholder="Write a compelling 2-3 sentence summary of your professional background..."
            rows={4}
            className="rounded-xl resize-none"
          />
          {aiField === 'summary' && !aiLoading && (
            <AISuggestionPanel
              suggestions={aiSuggestions.summary}
              onApply={onApplySuggestion}
              onClose={() => { }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ExperienceForm({ store, onAISuggest, aiLoading }: any) {
  const { experience } = store.resumeData;

  return (
    <div>
      <SectionHeader title="Work Experience" desc="Add your relevant work experience, starting with the most recent." />
      <div className="space-y-4">
        {experience.map((exp: any, idx: number) => (
          <div key={exp.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold">Position {idx + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => store.removeExperience(exp.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Job Title</Label>
                  <Input value={exp.position} onChange={e => store.updateExperience(exp.id, { position: e.target.value })} placeholder="Software Engineer" className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Company</Label>
                  <Input value={exp.company} onChange={e => store.updateExperience(exp.id, { company: e.target.value })} placeholder="Acme Corp" className="rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Location</Label>
                  <Input value={exp.location} onChange={e => store.updateExperience(exp.id, { location: e.target.value })} placeholder="NYC" className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Start Date</Label>
                  <Input value={exp.startDate} onChange={e => store.updateExperience(exp.id, { startDate: e.target.value })} placeholder="Jan 2022" className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">End Date</Label>
                  <Input value={exp.current ? 'Present' : exp.endDate} onChange={e => store.updateExperience(exp.id, { endDate: e.target.value })} placeholder="Present" disabled={exp.current} className="rounded-xl" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={e => store.updateExperience(exp.id, { current: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor={`current-${exp.id}`} className="text-xs cursor-pointer">I currently work here</Label>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs">Description</Label>
                  <AIButton onClick={() => onAISuggest('description')} loading={aiLoading} field={`desc-${exp.id}`} activeField={null} />
                </div>
                <Textarea
                  value={exp.description}
                  onChange={e => store.updateExperience(exp.id, { description: e.target.value })}
                  placeholder="• Developed features that improved user engagement by 25%&#10;• Led a team of 4 engineers to deliver project on time"
                  rows={4}
                  className="rounded-xl resize-none"
                />
              </div>
            </div>
          </div>
        ))}
        <Button onClick={store.addExperience} variant="outline" className="w-full rounded-xl border-dashed gap-2 hover:border-primary hover:text-primary">
          <Plus className="w-4 h-4" /> Add Experience
        </Button>
      </div>
    </div>
  );
}

function EducationForm({ store }: any) {
  const { education } = store.resumeData;
  return (
    <div>
      <SectionHeader title="Education" desc="Add your academic background and qualifications." />
      <div className="space-y-4">
        {education.map((edu: any, idx: number) => (
          <div key={edu.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold">Education {idx + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => store.removeEducation(edu.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs mb-1.5 block">Institution</Label>
                <Input value={edu.institution} onChange={e => store.updateEducation(edu.id, { institution: e.target.value })} placeholder="MIT" className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Degree</Label>
                  <Input value={edu.degree} onChange={e => store.updateEducation(edu.id, { degree: e.target.value })} placeholder="Bachelor's" className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Field of Study</Label>
                  <Input value={edu.field} onChange={e => store.updateEducation(edu.id, { field: e.target.value })} placeholder="Computer Science" className="rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Start Year</Label>
                  <Input value={edu.startDate} onChange={e => store.updateEducation(edu.id, { startDate: e.target.value })} placeholder="2018" className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">End Year</Label>
                  <Input value={edu.endDate} onChange={e => store.updateEducation(edu.id, { endDate: e.target.value })} placeholder="2022" className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">GPA (optional)</Label>
                  <Input value={edu.gpa} onChange={e => store.updateEducation(edu.id, { gpa: e.target.value })} placeholder="3.8" className="rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <Button onClick={store.addEducation} variant="outline" className="w-full rounded-xl border-dashed gap-2 hover:border-primary hover:text-primary">
          <Plus className="w-4 h-4" /> Add Education
        </Button>
      </div>
    </div>
  );
}

function SkillsForm({ store }: any) {
  const { skills } = store.resumeData;
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div>
      <SectionHeader title="Skills" desc="Add your technical skills, tools, and technologies." />
      <div className="space-y-3">
        {skills.map((skill: any) => (
          <div key={skill.id} className="flex gap-3 items-center">
            <Input
              value={skill.name}
              onChange={e => store.updateSkill(skill.id, { name: e.target.value })}
              placeholder="e.g. React, Python, Figma"
              className="rounded-xl flex-1"
            />
            <Select value={skill.level} onValueChange={v => store.updateSkill(skill.id, { level: v })}>
              <SelectTrigger className="w-36 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => store.removeSkill(skill.id)} className="text-destructive hover:bg-destructive/10 rounded-lg px-2">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button onClick={store.addSkill} variant="outline" className="w-full rounded-xl border-dashed gap-2 hover:border-primary hover:text-primary">
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
      </div>
    </div>
  );
}

function ProjectsForm({ store }: any) {
  const { projects } = store.resumeData;
  return (
    <div>
      <SectionHeader title="Projects" desc="Showcase your personal or professional projects." />
      <div className="space-y-4">
        {projects.map((proj: any, idx: number) => (
          <div key={proj.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold">Project {idx + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => store.removeProject(proj.id)} className="text-destructive hover:bg-destructive/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Project Name</Label>
                  <Input value={proj.name} onChange={e => store.updateProject(proj.id, { name: e.target.value })} placeholder="My Awesome App" className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Technologies</Label>
                  <Input value={proj.technologies} onChange={e => store.updateProject(proj.id, { technologies: e.target.value })} placeholder="React, Node.js, PostgreSQL" className="rounded-xl" />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Project Link</Label>
                <Input value={proj.link} onChange={e => store.updateProject(proj.id, { link: e.target.value })} placeholder="https://github.com/..." className="rounded-xl" />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Description</Label>
                <Textarea
                  value={proj.description}
                  onChange={e => store.updateProject(proj.id, { description: e.target.value })}
                  placeholder="Briefly describe what you built and the impact it had..."
                  rows={3}
                  className="rounded-xl resize-none"
                />
              </div>
            </div>
          </div>
        ))}
        <Button onClick={store.addProject} variant="outline" className="w-full rounded-xl border-dashed gap-2 hover:border-primary hover:text-primary">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>
    </div>
  );
}

function CertificationsForm({ store }: any) {
  const { certifications } = store.resumeData;
  return (
    <div>
      <SectionHeader title="Certifications" desc="Add professional certifications and licenses." />
      <div className="space-y-4">
        {certifications.map((cert: any, idx: number) => (
          <div key={cert.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold">Certification {idx + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => store.removeCertification(cert.id)} className="text-destructive hover:bg-destructive/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs mb-1.5 block">Certification Name</Label>
                <Input value={cert.name} onChange={e => store.updateCertification(cert.id, { name: e.target.value })} placeholder="AWS Solutions Architect" className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Issuing Organization</Label>
                  <Input value={cert.issuer} onChange={e => store.updateCertification(cert.id, { issuer: e.target.value })} placeholder="Amazon Web Services" className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Date</Label>
                  <Input value={cert.date} onChange={e => store.updateCertification(cert.id, { date: e.target.value })} placeholder="Dec 2023" className="rounded-xl" />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Credential Link (optional)</Label>
                <Input value={cert.link} onChange={e => store.updateCertification(cert.id, { link: e.target.value })} placeholder="https://verify.example.com/..." className="rounded-xl" />
              </div>
            </div>
          </div>
        ))}
        <Button onClick={store.addCertification} variant="outline" className="w-full rounded-xl border-dashed gap-2 hover:border-primary hover:text-primary">
          <Plus className="w-4 h-4" /> Add Certification
        </Button>
      </div>
    </div>
  );
}

function LanguagesForm({ store }: any) {
  const { languages } = store.resumeData;
  const proficiencies = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];
  return (
    <div>
      <SectionHeader title="Languages" desc="List the languages you speak and your proficiency level." />
      <div className="space-y-3">
        {languages.map((lang: any) => (
          <div key={lang.id} className="flex gap-3 items-center">
            <Input
              value={lang.name}
              onChange={e => store.updateLanguage(lang.id, { name: e.target.value })}
              placeholder="e.g. Spanish"
              className="rounded-xl flex-1"
            />
            <Select value={lang.proficiency} onValueChange={v => store.updateLanguage(lang.id, { proficiency: v })}>
              <SelectTrigger className="w-40 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {proficiencies.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => store.removeLanguage(lang.id)} className="text-destructive hover:bg-destructive/10 rounded-lg px-2">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button onClick={store.addLanguage} variant="outline" className="w-full rounded-xl border-dashed gap-2 hover:border-primary hover:text-primary">
          <Plus className="w-4 h-4" /> Add Language
        </Button>
      </div>
    </div>
  );
}

function DesignForm({ store, showPreview, setShowPreview }: any) {
  const { design = { font: 'Inter', accentColor: '#0f172a', margins: 'standard' }, sectionOrder } = store.resumeData;

  const fonts = [
    { name: 'Inter', class: 'font-sans' },
    { name: 'Roboto', class: 'font-sans' },
    { name: 'Playfair Display', class: 'font-serif' },
    { name: 'Lora', class: 'font-serif' },
    { name: 'Open Sans', class: 'font-sans' },
  ];

  const margins = [
    { id: 'compact', label: 'Compact' },
    { id: 'standard', label: 'Standard' },
    { id: 'relaxed', label: 'Relaxed' },
  ];

  const colors = [
    '#0f172a', // Slate 900
    '#2563eb', // Blue 600
    '#059669', // Emerald 600
    '#7c3aed', // Violet 600
    '#db2777', // Pink 600
    '#dc2626', // Red 600
    '#d97706', // Amber 600
    '#000000', // Black
  ];

  const update = (key: string, value: any) => {
    store.setResumeData({
      ...store.resumeData,
      design: { ...design, [key]: value }
    });
  };

  const handleReorder = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(sectionOrder || sections.filter(s => s.id !== 'design').map(s => s.id));
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    store.setSectionOrder([...items, 'design']);
  };

  const activeSectionsList = (sectionOrder || sections.map(s => s.id)).filter((id: string) => id !== 'design');

  return (
    <div>
      <SectionHeader title="Design Studio" desc="Customize the look, feel and flow of your resume." />

      <div className="space-y-8">
        {/* Full Screen Preview */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-primary mb-1">Preview Full Page</h3>
            <p className="text-xs text-muted-foreground">See how your resume looks in print format.</p>
          </div>
          <Button onClick={() => setShowPreview(true)} size="sm" className="gap-2 shadow-lg shadow-primary/20 rounded-xl">
            <Eye className="w-4 h-4" /> Open Preview
          </Button>
        </div>

        {/* Section Reordering */}
        <div>
          <Label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 block italic">Section Sequence</Label>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <DragDropContext onDragEnd={handleReorder}>
              <Droppable droppableId="design-sections-reorder">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {activeSectionsList.map((id: string, index: number) => {
                      const section = sections.find(s => s.id === id);
                      if (!section) return null;
                      const Icon = section.icon;
                      return (
                        <Draggable key={id} draggableId={id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center gap-3 p-3 bg-white border rounded-xl transition-all ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary scale-[1.02] z-50' : 'hover:border-primary/30 shadow-sm border-slate-200'}`}
                            >
                              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:text-primary transition-colors">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-bold text-slate-700">{section.label}</span>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-slate-400" />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <p className="text-[10px] text-slate-400 mt-4 text-center italic font-medium">Drag items to change the display order in your resume</p>
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <Label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 block italic">Color Palette</Label>
          <div className="flex flex-wrap gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => update('accentColor', c)}
                className={`w-10 h-10 rounded-xl border-4 transition-all duration-300 ${design.accentColor === c ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-lg' : 'border-transparent hover:scale-110 opacity-80 hover:opacity-100'}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-100 hover:border-primary/30 transition-all shadow-sm group">
              <input
                type="color"
                value={design.accentColor}
                onChange={(e) => update('accentColor', e.target.value)}
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
              />
              <div
                className="w-full h-full flex items-center justify-center bg-slate-50 group-hover:bg-slate-100"
                style={{ backgroundColor: design.accentColor }}
              >
                <Plus className="w-5 h-5 text-white mix-blend-difference" />
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <Label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 block italic">Typography</Label>
          <div className="grid grid-cols-2 gap-3">
            {fonts.map((f) => (
              <div
                key={f.name}
                onClick={() => update('font', f.name)}
                className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${design.font === f.name ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'hover:border-primary/20 bg-white border-slate-100'}`}
              >
                <div className={`text-sm font-bold ${f.class}`}>{f.name}</div>
                <p className={`text-[10px] text-muted-foreground mt-1 ${f.class}`}>Build your professional future</p>
              </div>
            ))}
          </div>
        </div>

        {/* Margins */}
        <div>
          <Label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 block italic">Layout Density</Label>
          <div className="grid grid-cols-3 gap-3 p-2 bg-slate-100 rounded-2xl">
            {margins.map((m) => (
              <button
                key={m.id}
                onClick={() => update('margins', m.id)}
                className={`py-3 px-1 text-[11px] font-black uppercase tracking-tighter rounded-xl transition-all duration-300 ${design.margins === m.id
                  ? 'bg-white text-primary shadow-sm scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

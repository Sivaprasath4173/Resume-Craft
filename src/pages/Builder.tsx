import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Briefcase, GraduationCap, Code, FolderOpen, Award, Languages,
  ChevronLeft, ChevronRight, Download, Eye, Sparkles, Save, FileText,
  Plus, Trash2, CheckCircle2, Loader2, ArrowLeft, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useResumeStore } from '@/hooks/useResumeStore';
import { ModernTemplate, MinimalTemplate, ProfessionalTemplate } from '@/components/resume/ResumeTemplates';
import { TemplateId } from '@/types/resume';

const sections = [
  { id: 'personalInfo', label: 'Personal Info', icon: User, desc: 'Basic details' },
  { id: 'experience', label: 'Experience', icon: Briefcase, desc: 'Work history' },
  { id: 'education', label: 'Education', icon: GraduationCap, desc: 'Academic background' },
  { id: 'skills', label: 'Skills', icon: Code, desc: 'Technical & soft skills' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, desc: 'Personal & professional' },
  { id: 'certifications', label: 'Certifications', icon: Award, desc: 'Credentials & courses' },
  { id: 'languages', label: 'Languages', icon: Languages, desc: 'Spoken languages' },
] as const;

const templates: { id: TemplateId; name: string; color: string }[] = [
  { id: 'modern', name: 'Modern', color: 'bg-slate-800' },
  { id: 'minimal', name: 'Minimal', color: 'bg-slate-400' },
  { id: 'professional', name: 'Professional', color: 'bg-emerald-600' },
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

  const store = useResumeStore();
  const { resumeData, completionScore, lastSaved } = store;

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            <span className="text-xs text-muted-foreground hidden md:flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Saved
            </span>
          )}
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex rounded-lg" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4" /> {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary rounded-lg gap-2" onClick={handleDownload}>
            <Download className="w-4 h-4" /> <span className="hidden sm:block">Download PDF</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - section nav */}
        <aside className={`w-52 border-r border-border bg-card flex-shrink-0 overflow-y-auto no-print ${showPreview ? 'hidden md:block' : 'block'}`}>
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
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border-2 transition-all ${
                    resumeData.template === t.id
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

          {/* Section nav */}
          <nav className="p-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 pt-1">Sections</p>
            {sections.map((section, idx) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => { setActiveSection(section.id); setShowPreview(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-primary'
                      : 'hover:bg-secondary text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium leading-none">{section.label}</div>
                    <div className={`text-xs mt-0.5 truncate ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {section.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main form area */}
        <main className={`flex-1 overflow-y-auto ${showPreview ? 'hidden md:block' : 'block'}`}>
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
        <aside className={`w-[420px] flex-shrink-0 border-l border-border bg-secondary/30 overflow-y-auto ${showPreview ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-2.5 flex items-center justify-between no-print">
            <span className="text-sm font-semibold text-foreground">Live Preview</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Auto-updating</span>
            </div>
          </div>
          <div className="p-4" id="resume-preview" ref={previewRef}>
            <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border" style={{ minHeight: '600px' }}>
              {resumeData.template === 'modern' && <ModernTemplate data={resumeData} />}
              {resumeData.template === 'minimal' && <MinimalTemplate data={resumeData} />}
              {resumeData.template === 'professional' && <ProfessionalTemplate data={resumeData} />}
            </div>
            {/* Watermark for free */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Free version</span>
              <Badge variant="secondary" className="text-xs">Upgrade to remove watermark</Badge>
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
              onClose={() => {}}
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

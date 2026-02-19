import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '@/hooks/useResumeStore';
import { ModernTemplate, MinimalTemplate, ProfessionalTemplate } from '@/components/resume/ResumeTemplates';
import { TemplateId, defaultResumeData } from '@/types/resume';

const templateInfo = [
  {
    id: 'modern' as TemplateId,
    name: 'Modern',
    desc: 'Bold two-column design with dark header. Perfect for tech and creative roles.',
    tags: ['Tech', 'Creative', 'Startup'],
    accent: 'bg-slate-800',
  },
  {
    id: 'minimal' as TemplateId,
    name: 'Minimal',
    desc: 'Clean, elegant, and timeless. Let your experience speak for itself.',
    tags: ['Finance', 'Consulting', 'Any Role'],
    accent: 'bg-slate-500',
  },
  {
    id: 'professional' as TemplateId,
    name: 'Professional',
    desc: 'Classic layout with a distinguished green accent. Great for experienced professionals.',
    tags: ['Management', 'Medical', 'Legal'],
    accent: 'bg-emerald-600',
  },
];

const sampleData = {
  ...defaultResumeData,
  personalInfo: {
    fullName: 'Alex Johnson',
    jobTitle: 'Senior Software Engineer',
    email: 'alex@example.com',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    website: 'alexjohnson.dev',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
    summary: 'Passionate software engineer with 5+ years building scalable web applications. Expert in React, Node.js and cloud architecture.',
  },
  experience: [
    { id: '1', company: 'Google', position: 'Senior SWE', location: 'SF', startDate: 'Jan 2021', endDate: '', current: true, description: 'Built core features for Google Search serving 1B+ daily users.' },
    { id: '2', company: 'Stripe', position: 'Software Engineer', location: 'SF', startDate: 'Mar 2019', endDate: 'Dec 2020', current: false, description: 'Developed payment processing APIs with 99.99% uptime.' },
  ],
  education: [{ id: '1', institution: 'Stanford University', degree: 'B.S.', field: 'Computer Science', startDate: '2015', endDate: '2019', gpa: '3.9', description: '' }],
  skills: [
    { id: '1', name: 'React', level: 'Expert' as const, category: '' },
    { id: '2', name: 'TypeScript', level: 'Expert' as const, category: '' },
    { id: '3', name: 'Node.js', level: 'Advanced' as const, category: '' },
    { id: '4', name: 'AWS', level: 'Intermediate' as const, category: '' },
  ],
  languages: [{ id: '1', name: 'English', proficiency: 'Native' as const }, { id: '2', name: 'Spanish', proficiency: 'Intermediate' as const }],
  certifications: [{ id: '1', name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023', link: '' }],
  projects: [{ id: '1', name: 'OpenCV Dashboard', description: 'Real-time analytics platform used by 10K+ developers.', technologies: 'React, Python, D3.js', link: 'github.com/alex/project', startDate: '2022', endDate: '2023' }],
};

export default function Templates() {
  const navigate = useNavigate();
  const { resumeData, setTemplate } = useResumeStore();

  const handleSelect = (id: TemplateId) => {
    setTemplate(id);
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm">ResumeCraft</span>
          </div>
        </div>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary rounded-lg gap-2" onClick={() => navigate('/builder')}>
          Continue to Builder <ArrowRight className="w-4 h-4" />
        </Button>
      </header>

      <div className="container max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">Choose Your Template</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            All templates are ATS-friendly and built by professional designers. 
            You can switch anytime without losing your data.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {templateInfo.map((tmpl) => (
            <div
              key={tmpl.id}
              className={`group rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                resumeData.template === tmpl.id
                  ? 'border-primary shadow-primary'
                  : 'border-border shadow-card hover:shadow-card-hover hover:border-primary/40'
              }`}
              onClick={() => handleSelect(tmpl.id)}
            >
              {/* Selected badge */}
              {resumeData.template === tmpl.id && (
                <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                </div>
              )}

              {/* Preview */}
              <div className="relative bg-secondary/30 h-80 overflow-hidden">
                <div className="absolute inset-0 scale-[0.58] origin-top-left" style={{ width: '172%', height: '172%' }}>
                  {tmpl.id === 'modern' && <ModernTemplate data={{ ...sampleData, template: 'modern' }} />}
                  {tmpl.id === 'minimal' && <MinimalTemplate data={{ ...sampleData, template: 'minimal' }} />}
                  {tmpl.id === 'professional' && <ProfessionalTemplate data={{ ...sampleData, template: 'professional' }} />}
                </div>
              </div>

              {/* Info */}
              <div className="bg-card p-5 border-t border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded-sm ${tmpl.accent}`}></div>
                  <h3 className="font-display font-bold text-lg">{tmpl.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{tmpl.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tmpl.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-secondary text-muted-foreground text-xs rounded-lg font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  className="w-full mt-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary font-medium"
                  onClick={() => handleSelect(tmpl.id)}
                >
                  Use {tmpl.name} Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

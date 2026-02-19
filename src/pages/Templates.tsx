import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ArrowRight, FileText, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResume } from '@/hooks/ResumeContext';
import {
  ModernTemplate, MinimalTemplate, ProfessionalTemplate, CreativeTemplate, ExecutiveTemplate, TechTemplate,
  ElegantTemplate, TechnicalTemplate, AcademicTemplate, StartupTemplate, CorporateTemplate,
  DesignerTemplate, SimpleTemplate, VintageTemplate, ModernistTemplate, CompactTemplate
} from '@/components/resume/ResumeTemplates';
import { TemplateId, defaultResumeData } from '@/types/resume';
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
  {
    id: 'creative' as TemplateId,
    name: 'Creative',
    desc: 'Vibrant, sidebar-focused design with modern flair. Stands out in creative industries.',
    tags: ['Design', 'Marketing', 'Media'],
    accent: 'bg-violet-600',
  },
  {
    id: 'executive' as TemplateId,
    name: 'Executive',
    desc: 'Sophisticated serif fonts and a refined cream palette. Designed for leadership roles.',
    tags: ['C-Suite', 'Legal', 'Consulting'],
    accent: 'bg-[#b8860b]',
  },
  {
    id: 'tech' as TemplateId,
    name: 'Tech',
    desc: 'Developer-first monospace design with terminal aesthetic. Perfect for engineers.',
    tags: ['Software', 'Data Science', 'IT'],
    accent: 'bg-slate-950 border border-emerald-500',
  },
  {
    id: 'elegant' as TemplateId,
    name: 'Elegant',
    desc: 'Graceful serif typography with soft spacing. Ideal for fashion and luxury sectors.',
    tags: ['Fashion', 'Arts', 'Luxury'],
    accent: 'bg-rose-100',
  },
  {
    id: 'technical' as TemplateId,
    name: 'Dev Terminal',
    desc: 'Brutalista monospace layout for technical purists and backend engineers.',
    tags: ['Engineering', 'Security', 'DevOps'],
    accent: 'bg-blue-900',
  },
  {
    id: 'academic' as TemplateId,
    name: 'Academic',
    desc: 'Traditional scholarly format focusing on publications and research history.',
    tags: ['PhD', 'Research', 'University'],
    accent: 'bg-stone-800',
  },
  {
    id: 'startup' as TemplateId,
    name: 'Startup',
    desc: 'Impact-focused design with bold primary colors and rounded aesthetics.',
    tags: ['Unicorn', 'Growth', 'Series A'],
    accent: 'bg-indigo-600',
  },
  {
    id: 'corporate' as TemplateId,
    name: 'Corporate',
    desc: 'Navy blue accents and rigid structure. Perfect for banking and insurance.',
    tags: ['Finance', 'Banking', 'Insurance'],
    accent: 'bg-sky-950',
  },
  {
    id: 'designer' as TemplateId,
    name: 'Aura',
    desc: 'High-contrast black theme for portfolio-heavy resumes. Maximum visual impact.',
    tags: ['UI/UX', 'Photography', 'Art'],
    accent: 'bg-black',
  },
  {
    id: 'simple' as TemplateId,
    name: 'Pure',
    desc: 'Distraction-free layout with beautiful typography. Less is definitely more.',
    tags: ['Writer', 'Admin', 'Clean'],
    accent: 'bg-slate-200',
  },
  {
    id: 'vintage' as TemplateId,
    name: 'Retro',
    desc: 'Classical sepia tones and historical framing. Distinctive and memorable.',
    tags: ['Distinguished', 'History', 'Media'],
    accent: 'bg-[#2c1810]',
  },
  {
    id: 'modernist' as TemplateId,
    name: 'Bauhaus',
    desc: 'Geometric shapes and high-impact functional design. Swiss style at its best.',
    tags: ['Architecture', 'Functional', 'Bold'],
    accent: 'bg-red-600',
  },
  {
    id: 'compact' as TemplateId,
    name: 'Dense',
    desc: 'Optimized for high information density without sacrificing readability.',
    tags: ['Multi-page', 'Detailed', 'Efficiency'],
    accent: 'bg-teal-900',
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
  const { resumeData, setTemplate } = useResume();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

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

        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden border border-border shadow-sm">
                  <Avatar className="h-9 w-9">
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
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          )}
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary rounded-lg gap-2 h-9 text-xs" onClick={() => navigate('/builder')}>
            Continue to Builder <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
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
              className={`group rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${resumeData.template === tmpl.id
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
                  {tmpl.id === 'creative' && <CreativeTemplate data={{ ...sampleData, template: 'creative' }} />}
                  {tmpl.id === 'executive' && <ExecutiveTemplate data={{ ...sampleData, template: 'executive' }} />}
                  {tmpl.id === 'tech' && <TechTemplate data={{ ...sampleData, template: 'tech' }} />}
                  {tmpl.id === 'elegant' && <ElegantTemplate data={{ ...sampleData, template: 'elegant' }} />}
                  {tmpl.id === 'technical' && <TechnicalTemplate data={{ ...sampleData, template: 'technical' }} />}
                  {tmpl.id === 'academic' && <AcademicTemplate data={{ ...sampleData, template: 'academic' }} />}
                  {tmpl.id === 'startup' && <StartupTemplate data={{ ...sampleData, template: 'startup' }} />}
                  {tmpl.id === 'corporate' && <CorporateTemplate data={{ ...sampleData, template: 'corporate' }} />}
                  {tmpl.id === 'designer' && <DesignerTemplate data={{ ...sampleData, template: 'designer' }} />}
                  {tmpl.id === 'simple' && <SimpleTemplate data={{ ...sampleData, template: 'simple' }} />}
                  {tmpl.id === 'vintage' && <VintageTemplate data={{ ...sampleData, template: 'vintage' }} />}
                  {tmpl.id === 'modernist' && <ModernistTemplate data={{ ...sampleData, template: 'modernist' }} />}
                  {tmpl.id === 'compact' && <CompactTemplate data={{ ...sampleData, template: 'compact' }} />}
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

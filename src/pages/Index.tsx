import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, FileText, Download, Star, CheckCircle2, Users, Trophy, Palette, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Suggestions',
    description: 'Get smart content recommendations for your summary, job descriptions, and skills tailored to your role.',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    icon: Zap,
    title: 'Live Preview',
    description: 'See your resume update in real-time as you type. No more guessing what the final result will look like.',
    color: 'text-primary',
    bg: 'bg-primary-light',
  },
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: 'Choose from professionally designed templates — Modern, Minimal, and Professional — all ATS-friendly.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: Download,
    title: 'One-Click PDF Export',
    description: 'Download your resume as a pixel-perfect PDF, ready to send to recruiters and hiring managers.',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
];

const templates = [
  { name: 'Modern', desc: 'Bold & contemporary', color: 'from-blue-500 to-blue-600' },
  { name: 'Minimal', desc: 'Clean & elegant', color: 'from-slate-600 to-slate-700' },
  { name: 'Professional', desc: 'Classic & trusted', color: 'from-emerald-500 to-emerald-600' },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">ResumeCraft</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Templates</a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-border shadow-sm">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground italic truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/builder')} className="gap-2 cursor-pointer">
                    <FileText className="w-4 h-4" /> My Resumes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            )}
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary font-medium" onClick={() => navigate(user ? '/builder' : '/auth', { state: { from: { pathname: '/builder' } } })}>
              {user ? 'Go to Builder' : 'Build My Resume'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-hero-gradient">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            AI-Powered Resume Builder
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-up">
            Create Professional{' '}
            <span className="text-gradient">Resumes</span>{' '}
            in Minutes
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
            Build ATS-friendly resumes with AI assistance, live preview, and beautiful templates.
            Land your dream job faster — no design skills needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
            <button
              className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary font-semibold px-8 h-14 text-base rounded-xl gap-2 group flex items-center justify-center transition-all"
              onClick={() => navigate(user ? '/builder' : '/auth', { state: { from: { pathname: '/builder' } } })}
            >
              Build My Resume
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-xl font-medium border-border hover:bg-secondary"
              onClick={() => navigate('/templates')}
            >
              View Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Everything You Need to Stand Out</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Built for job seekers who want results, not complexity.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-secondary/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready in 3 Simple Steps</h2>
          <p className="text-muted-foreground text-lg mb-16">From blank page to perfect resume in minutes.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Fill Your Details', desc: 'Enter your experience, skills, and education with helpful AI prompts.' },
              { step: '02', title: 'Choose a Template', desc: 'Pick from our professionally designed templates that match your style.' },
              { step: '03', title: 'Download & Apply', desc: 'Export your polished resume as PDF and start applying with confidence.' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="font-display text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Professional Templates</h2>
            <p className="text-muted-foreground text-lg">ATS-friendly, recruiter-approved designs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.name}
                className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group cursor-pointer"
                onClick={() => navigate('/builder')}
              >
                <div className={`h-48 bg-gradient-to-br ${template.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-2 bg-white mt-4 mx-4 rounded-full" style={{ width: '60%', marginLeft: '10%' }}></div>
                  </div>
                  <div className="bg-card/95 rounded-lg p-4 w-36 shadow-lg">
                    <div className="h-2 bg-primary rounded mb-2"></div>
                    <div className="h-1.5 bg-muted rounded mb-1.5 w-3/4"></div>
                    <div className="h-1.5 bg-muted rounded mb-3 w-1/2"></div>
                    <div className="h-px bg-border mb-2"></div>
                    <div className="space-y-1">
                      <div className="h-1 bg-muted rounded w-full"></div>
                      <div className="h-1 bg-muted rounded w-5/6"></div>
                      <div className="h-1 bg-muted rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">{template.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => navigate(user ? '/builder' : '/auth', { state: { from: { pathname: '/builder' } } })} variant="outline" className="rounded-xl border-border">
              Browse All Templates <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-hero-gradient">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Your Dream Job is{' '}
            <span className="text-gradient">One Resume Away</span>
          </h2>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary font-semibold px-10 h-14 text-base rounded-xl gap-2 group"
            onClick={() => navigate(user ? '/builder' : '/auth', { state: { from: { pathname: '/builder' } } })}
          >
            Start Building for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">ResumeCraft</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 ResumeCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

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

const stats = [
  { value: '50K+', label: 'Resumes Created' },
  { value: '95%', label: 'Success Rate' },
  { value: '3 min', label: 'Avg. Build Time' },
  { value: '4.9★', label: 'User Rating' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    content: 'ResumeCraft helped me land my dream job! The AI suggestions made my experience descriptions so much more impactful.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Designer at Figma',
    content: 'The live preview is a game-changer. I could see exactly how my resume looked while editing. Got 3 interviews in a week!',
    avatar: 'MJ',
  },
  {
    name: 'Priya Patel',
    role: 'Fresh Graduate',
    content: 'As a recent grad, I had no idea how to format a resume. ResumeCraft guided me through every step perfectly.',
    avatar: 'PP',
  },
];

const templates = [
  { name: 'Modern', desc: 'Bold & contemporary', color: 'from-blue-500 to-blue-600' },
  { name: 'Minimal', desc: 'Clean & elegant', color: 'from-slate-600 to-slate-700' },
  { name: 'Professional', desc: 'Classic & trusted', color: 'from-emerald-500 to-emerald-600' },
  { name: 'Creative', desc: 'Bold & artistic', color: 'from-violet-500 to-violet-600' },
  { name: 'Executive', desc: 'Premium & elite', color: 'from-amber-600 to-amber-700' },
  { name: 'Tech', desc: 'Modern & technical', color: 'from-slate-800 to-slate-900' },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: ['1 Resume', '3 Templates', 'PDF Download', 'Basic AI Suggestions'],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/mo',
    description: 'For serious job seekers',
    features: ['Unlimited Resumes', 'All Templates', 'Priority AI Suggestions', 'No Watermark', 'Custom Colors', 'Cover Letter Builder'],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$19',
    period: '/mo',
    description: 'For career coaches & teams',
    features: ['Everything in Pro', 'Team Dashboard', 'Bulk Export', 'Analytics', 'Priority Support'],
    cta: 'Contact Sales',
    highlight: false,
  },
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
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl p-4 shadow-card text-center">
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
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

      {/* Testimonials */}
      <section className="py-24 px-6 bg-secondary/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Loved by Job Seekers</h2>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <span className="ml-2 text-muted-foreground text-sm">4.9/5 from 2,400+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card rounded-2xl p-6 shadow-card border border-border">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border transition-all ${plan.highlight
                  ? 'bg-primary border-primary/20 shadow-primary'
                  : 'bg-card border-border shadow-card'
                  }`}
              >
                {plan.highlight && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-semibold mb-4">
                    <Trophy className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <h3 className={`font-display font-bold text-xl mb-1 ${plan.highlight ? 'text-primary-foreground' : ''}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{plan.description}</p>
                <div className={`font-display text-4xl font-bold mb-6 ${plan.highlight ? 'text-primary-foreground' : ''}`}>
                  {plan.price}<span className={`text-lg font-normal ${plan.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-primary-foreground' : ''}`}>
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-primary-foreground/80' : 'text-primary'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-xl ${plan.highlight
                    ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold'
                    : 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary'
                    }`}
                  onClick={() => navigate(user ? '/builder' : '/auth', { state: { from: { pathname: '/builder' } } })}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
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
          <p className="text-muted-foreground text-xl mb-10">Join 50,000+ professionals who built their career with ResumeCraft.</p>
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

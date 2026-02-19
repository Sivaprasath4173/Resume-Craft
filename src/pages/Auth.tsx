import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Github, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();

    const handleEmailAuth = async (type: 'login' | 'signup') => {
        setLoading(true);
        try {
            if (type === 'signup') {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: fullName });
                toast.success('Account created successfully!');
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success('Signed in successfully!');
            }
            navigate('/');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast.success('Signed in with Google!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-hero-gradient">
            <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-primary">
                    <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight">ResumeCraft</span>
            </div>

            <Card className="w-full max-w-md shadow-2xl border-none bg-card/80 backdrop-blur-xl animate-fade-up">
                <Tabs defaultValue="login" className="w-full">
                    <CardHeader>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="login" className="rounded-lg">Login</TabsTrigger>
                            <TabsTrigger value="signup" className="rounded-lg">Sign Up</TabsTrigger>
                        </TabsList>
                        <CardTitle className="text-2xl font-display font-bold text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-center">
                            Build your professional future with AI assistance.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <TabsContent value="login" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                            <Button
                                className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary font-semibold"
                                onClick={() => handleEmailAuth('login')}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                            </Button>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <Label htmlFor="signup-name">Full Name</Label>
                                <Input
                                    id="signup-name"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input
                                    id="signup-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                            <Button
                                className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary font-semibold"
                                onClick={() => handleEmailAuth('signup')}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                            </Button>
                        </TabsContent>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl border-border hover:bg-secondary flex items-center gap-3 font-medium"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign in with Google
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <p className="text-xs text-center text-muted-foreground px-8 leading-relaxed">
                            By clicking continue, you agree to our{' '}
                            <a href="#" className="underline hover:text-primary transition-colors">Terms of Service</a> and{' '}
                            <a href="#" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
                        </p>
                    </CardFooter>
                </Tabs>
            </Card>

            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                AI-Powered Resume Guidance included
            </div>
        </div>
    );
};

export default Auth;

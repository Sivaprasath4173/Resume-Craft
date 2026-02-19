import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ResumeData, defaultResumeData, ResumeSection, TemplateId } from '@/types/resume';
import { useAuth } from './useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { toast } from 'sonner';

interface ResumeContextType {
    resumeData: ResumeData;
    lastSaved: Date | null;
    completionScore: number;
    updatePersonalInfo: (updates: Partial<ResumeData['personalInfo']>) => void;
    addEducation: () => string;
    updateEducation: (id: string, updates: Partial<ResumeData['education'][0]>) => void;
    removeEducation: (id: string) => void;
    addExperience: () => string;
    updateExperience: (id: string, updates: Partial<ResumeData['experience'][0]>) => void;
    removeExperience: (id: string) => void;
    addProject: () => string;
    updateProject: (id: string, updates: Partial<ResumeData['projects'][0]>) => void;
    removeProject: (id: string) => void;
    addCertification: () => string;
    updateCertification: (id: string, updates: Partial<ResumeData['certifications'][0]>) => void;
    removeCertification: (id: string) => void;
    addLanguage: () => string;
    updateLanguage: (id: string, updates: Partial<ResumeData['languages'][0]>) => void;
    removeLanguage: (id: string) => void;
    addSkill: () => string;
    updateSkill: (id: string, updates: Partial<ResumeData['skills'][0]>) => void;
    removeSkill: (id: string) => void;
    setTemplate: (template: TemplateId) => void;
    setSectionOrder: (order: ResumeSection[]) => void;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
    clearData: () => void;
    loading: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const STORAGE_KEY = 'resume_craft_data';

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // 1. Initial Load: LocalStorage first, then Cloud if logged in
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // Load from LocalStorage first for instant results
            const stored = localStorage.getItem(STORAGE_KEY);
            let initialData = defaultResumeData;
            if (stored) {
                try {
                    initialData = { ...defaultResumeData, ...JSON.parse(stored) };
                    setResumeData(initialData);
                } catch (e) {
                    console.error('Failed to parse local storage', e);
                }
            }

            // If user is logged in, try to fetch from Firestore
            if (user) {
                try {
                    const docRef = doc(db, 'resumes', user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const cloudData = docSnap.data() as ResumeData;
                        setResumeData(cloudData);
                        // Sync local storage with cloud
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
                    } else {
                        // If no cloud data but local data exists, prep for upload
                        if (stored) {
                            await setDoc(docRef, initialData);
                        }
                    }
                } catch (err) {
                    console.error('Error fetching from firestore:', err);
                }
            }

            setLoading(false);
        };

        loadData();
    }, [user]);

    // 2. Auto-save Effect: Debounced saving to LocalStorage and Firestore
    useEffect(() => {
        const timer = setTimeout(async () => {
            // Always save to LocalStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
            setLastSaved(new Date());

            // Save to Cloud if logged in
            if (user) {
                try {
                    await setDoc(doc(db, 'resumes', user.uid), resumeData, { merge: true });
                } catch (err) {
                    console.error('Failed to sync to cloud:', err);
                }
            }
        }, 1000); // 1 second debounce

        return () => clearTimeout(timer);
    }, [resumeData, user]);

    const updatePersonalInfo = useCallback((updates: Partial<ResumeData['personalInfo']>) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, ...updates },
        }));
    }, []);

    const addEducation = useCallback(() => {
        const id = crypto.randomUUID();
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, {
                id, institution: '', degree: '', field: '',
                startDate: '', endDate: '', gpa: '', description: '',
            }],
        }));
        return id;
    }, []);

    const updateEducation = useCallback((id: string, updates: Partial<ResumeData['education'][0]>) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.map(e => e.id === id ? { ...e, ...updates } : e),
        }));
    }, []);

    const removeEducation = useCallback((id: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter(e => e.id !== id),
        }));
    }, []);

    const addExperience = useCallback(() => {
        const id = crypto.randomUUID();
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                id, company: '', position: '', location: '',
                startDate: '', endDate: '', current: false, description: '',
            }],
        }));
        return id;
    }, []);

    const updateExperience = useCallback((id: string, updates: Partial<ResumeData['experience'][0]>) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(e => e.id === id ? { ...e, ...updates } : e),
        }));
    }, []);

    const removeExperience = useCallback((id: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter(e => e.id !== id),
        }));
    }, []);

    const addProject = useCallback(() => {
        const id = crypto.randomUUID();
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, {
                id, name: '', description: '', technologies: '',
                link: '', startDate: '', endDate: '',
            }],
        }));
        return id;
    }, []);

    const updateProject = useCallback((id: string, updates: Partial<ResumeData['projects'][0]>) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p),
        }));
    }, []);

    const removeProject = useCallback((id: string) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.filter(p => p.id !== id),
        }));
    }, []);

    const addCertification = useCallback(() => {
        const id = crypto.randomUUID();
        setResumeData(prev => ({
            ...prev,
            certifications: [...prev.certifications, {
                id, name: '', issuer: '', date: '', link: '',
            }],
        }));
        return id;
    }, []);

    const updateCertification = useCallback((id: string, updates: Partial<ResumeData['certifications'][0]>) => {
        setResumeData(prev => ({
            ...prev,
            certifications: prev.certifications.map(c => c.id === id ? { ...c, ...updates } : c),
        }));
    }, []);

    const removeCertification = useCallback((id: string) => {
        setResumeData(prev => ({
            ...prev,
            certifications: prev.certifications.filter(c => c.id !== id),
        }));
    }, []);

    const addLanguage = useCallback(() => {
        const id = crypto.randomUUID();
        setResumeData(prev => ({
            ...prev,
            languages: [...prev.languages, { id, name: '', proficiency: 'Intermediate' as const }],
        }));
        return id;
    }, []);

    const updateLanguage = useCallback((id: string, updates: Partial<ResumeData['languages'][0]>) => {
        setResumeData(prev => ({
            ...prev,
            languages: prev.languages.map(l => l.id === id ? { ...l, ...updates } : l),
        }));
    }, []);

    const removeLanguage = useCallback((id: string) => {
        setResumeData(prev => ({
            ...prev,
            languages: prev.languages.filter(l => l.id !== id),
        }));
    }, []);

    const addSkill = useCallback(() => {
        const id = crypto.randomUUID();
        setResumeData(prev => ({
            ...prev,
            skills: [...prev.skills, { id, name: '', level: 'Intermediate' as const, category: '' }],
        }));
        return id;
    }, []);

    const updateSkill = useCallback((id: string, updates: Partial<ResumeData['skills'][0]>) => {
        setResumeData(prev => ({
            ...prev,
            skills: prev.skills.map(s => s.id === id ? { ...s, ...updates } : s),
        }));
    }, []);

    const removeSkill = useCallback((id: string) => {
        setResumeData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s.id !== id),
        }));
    }, []);

    const setTemplate = useCallback((template: TemplateId) => {
        setResumeData(prev => ({ ...prev, template }));
    }, []);

    const setSectionOrder = useCallback((order: ResumeSection[]) => {
        setResumeData(prev => ({ ...prev, sectionOrder: order }));
    }, []);

    const clearData = useCallback(() => {
        setResumeData(defaultResumeData);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const completionScore = (() => {
        let score = 0;
        const p = resumeData.personalInfo;
        if (p.fullName) score += 10;
        if (p.email) score += 10;
        if (p.jobTitle) score += 10;
        if (p.summary) score += 10;
        if (resumeData.experience.length > 0) score += 20;
        if (resumeData.education.length > 0) score += 15;
        if (resumeData.skills.length > 0) score += 15;
        if (resumeData.projects.length > 0) score += 10;
        return Math.min(score, 100);
    })();

    return (
        <ResumeContext.Provider value={{
            resumeData, lastSaved, completionScore, loading,
            updatePersonalInfo,
            addEducation, updateEducation, removeEducation,
            addExperience, updateExperience, removeExperience,
            addProject, updateProject, removeProject,
            addCertification, updateCertification, removeCertification,
            addLanguage, updateLanguage, removeLanguage,
            addSkill, updateSkill, removeSkill,
            setTemplate, setSectionOrder, clearData, setResumeData
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
};

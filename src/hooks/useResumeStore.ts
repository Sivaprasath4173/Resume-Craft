import { useState, useEffect, useCallback } from 'react';
import { ResumeData, defaultResumeData, ResumeSection, TemplateId } from '@/types/resume';

const STORAGE_KEY = 'resume_craft_data';

export function useResumeStore() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultResumeData, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load resume data:', e);
    }
    return defaultResumeData;
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
        setLastSaved(new Date());
      } catch (e) {
        console.error('Failed to save resume data:', e);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [resumeData]);

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

  return {
    resumeData,
    lastSaved,
    completionScore,
    updatePersonalInfo,
    addEducation, updateEducation, removeEducation,
    addExperience, updateExperience, removeExperience,
    addProject, updateProject, removeProject,
    addCertification, updateCertification, removeCertification,
    addLanguage, updateLanguage, removeLanguage,
    addSkill, updateSkill, removeSkill,
    setTemplate,
    setSectionOrder,
    clearData,
  };
}

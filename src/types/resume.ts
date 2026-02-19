export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
}

export interface Skill {
  id: string;
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate' | 'Beginner';
  category: string;
}

export type TemplateId =
  | 'modern' | 'minimal' | 'professional' | 'creative' | 'executive' | 'tech'
  | 'elegant' | 'technical' | 'academic' | 'startup' | 'corporate'
  | 'designer' | 'simple' | 'vintage' | 'modernist' | 'compact';

export interface ResumeDesign {
  font: string;
  accentColor: string;
  margins: 'compact' | 'standard' | 'relaxed';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  skills: Skill[];
  template: TemplateId;
  sectionOrder: ResumeSection[];
  design?: ResumeDesign;
}

export type ResumeSection =
  | 'personalInfo'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'design';

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  languages: [],
  skills: [],
  template: 'modern',
  sectionOrder: ['personalInfo', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
  design: {
    font: 'Inter',
    accentColor: '#0f172a',
    margins: 'standard',
  },
};

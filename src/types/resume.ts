export type RoleTag = 'SDE' | 'AI/GenAI' | 'Full-stack' | 'Data' | 'DevOps' | 'Design' | 'PM' | 'Quant' | 'Embedded' | 'Mobile';

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
  roleTags?: RoleTag[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string;
  roleTags?: RoleTag[];
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
  roleTags?: RoleTag[];
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

/** Represents a saved role-specific variant of the master resume */
export interface ResumeVariant {
  id: string;
  name: string;
  targetRole: RoleTag | string;
  createdAt: string; // ISO string
  /** Map of item id -> visible (true) or hidden (false) */
  visibleItems: Record<string, boolean>;
  /** Ordered item IDs per section, for custom ordering within a variant */
  sectionItemOrder: Record<string, string[]>;
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
  variants?: ResumeVariant[];
  activeVariantId?: string | null;
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
  variants: [],
  activeVariantId: null,
};

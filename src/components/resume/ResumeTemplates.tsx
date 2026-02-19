import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'skills':
        return skills.length > 0 && (
          <div key="skills" className="mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Skills</h3>
            <div className="space-y-1.5">
              {skills.map((s) => (
                <div key={s.id} className="text-xs text-slate-700 font-medium">{s.name || 'Skill'}</div>
              ))}
            </div>
          </div>
        );
      case 'languages':
        return languages.length > 0 && (
          <div key="languages" className="mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Languages</h3>
            <div className="space-y-2">
              {languages.map((l) => (
                <div key={l.id}>
                  <div className="text-xs font-medium text-slate-700">{l.name || 'Language'}</div>
                  <div className="text-xs text-slate-400">{l.proficiency}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        return certifications.length > 0 && (
          <div key="certifications">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Certifications</h3>
            <div className="space-y-2">
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="text-xs font-semibold text-slate-700">{c.name || 'Certification'}</div>
                  <div className="text-xs text-slate-400">{c.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'personalInfo':
        return p.summary && (
          <div key="personalInfo" className="mb-5">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-blue-600 block"></span>Profile
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{p.summary}</p>
          </div>
        );
      case 'experience':
        return experience.length > 0 && (
          <div key="experience" className="mb-5">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-blue-600 block"></span>Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-sm">{exp.position || 'Position'}</div>
                      <div className="text-blue-600 text-xs font-medium">{exp.company || 'Company'}</div>
                    </div>
                    <div className="text-xs text-slate-400 text-right">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        return education.length > 0 && (
          <div key="education" className="mb-5">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-blue-600 block"></span>Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                    <div className="text-xs text-slate-500">{edu.institution || 'Institution'}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
                  </div>
                  <div className="text-xs text-slate-400">{edu.startDate} — {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return projects.length > 0 && (
          <div key="projects">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-blue-600 block"></span>Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{proj.name || 'Project Name'}</span>
                    {proj.link && <ExternalLink size={11} className="text-blue-400" />}
                  </div>
                  {proj.technologies && <div className="text-xs text-blue-500 font-medium mb-1">{proj.technologies}</div>}
                  {proj.description && <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const sidebarOrder = ['skills', 'languages', 'certifications'];
  const mainOrder = ['personalInfo', 'experience', 'education', 'projects'];

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'];

  return (
    <div className="bg-white font-sans text-slate-800 min-h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-slate-900 text-white px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {p.fullName || 'Your Name'}
        </h1>
        <p className="text-blue-300 font-medium text-lg mb-4">{p.jobTitle || 'Job Title'}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {p.email && <span className="flex items-center gap-1.5 text-sm text-slate-300"><Mail size={13} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1.5 text-sm text-slate-300"><Phone size={13} />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1.5 text-sm text-slate-300"><MapPin size={13} />{p.location}</span>}
          {p.website && <span className="flex items-center gap-1.5 text-sm text-slate-300"><Globe size={13} />{p.website}</span>}
          {p.linkedin && <span className="flex items-center gap-1.5 text-sm text-slate-300"><Linkedin size={13} />{p.linkedin}</span>}
          {p.github && <span className="flex items-center gap-1.5 text-sm text-slate-300"><Github size={13} />{p.github}</span>}
        </div>
      </div>

      <div className="flex gap-0">
        {/* Left sidebar */}
        <div className="w-36 bg-slate-50 border-r border-slate-100 px-4 py-6 flex-shrink-0">
          {order.filter(id => sidebarOrder.includes(id)).map(id => renderSection(id))}
        </div>

        {/* Main content */}
        <div className="flex-1 px-6 py-6">
          {order.filter(id => mainOrder.includes(id)).map(id => renderSection(id))}
        </div>
      </div>
    </div>
  );
}

export function MinimalTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'personalInfo':
        return p.summary && (
          <div key="personalInfo" className="mb-6">
            <p className="text-sm text-slate-600 leading-relaxed">{p.summary}</p>
          </div>
        );
      case 'experience':
        return experience.length > 0 && (
          <div key="experience" className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-4 gap-4">
                  <div className="text-xs text-slate-400 pt-0.5">
                    {exp.startDate}<br />{exp.current ? 'Present' : exp.endDate}
                  </div>
                  <div className="col-span-3">
                    <div className="font-semibold text-sm">{exp.position || 'Position'}</div>
                    <div className="text-slate-500 text-xs mb-1.5">{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                    {exp.description && <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        return education.length > 0 && (
          <div key="education" className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-4 gap-4">
                  <div className="text-xs text-slate-400">{edu.startDate}<br />{edu.endDate}</div>
                  <div className="col-span-3">
                    <div className="font-semibold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                    <div className="text-xs text-slate-500">{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        return skills.length > 0 && (
          <div key="skills" className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                  {s.name || 'Skill'}
                </span>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return projects.length > 0 && (
          <div key="projects" className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Projects</h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{proj.name || 'Project'}</span>
                    {proj.technologies && <span className="text-xs text-slate-400">· {proj.technologies}</span>}
                  </div>
                  {proj.description && <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        return certifications.length > 0 && (
          <div key="certifications" className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Certifications</h2>
            {certifications.map((c) => (
              <div key={c.id} className="mb-2">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-slate-400">{c.issuer} · {c.date}</div>
              </div>
            ))}
          </div>
        );
      case 'languages':
        return languages.length > 0 && (
          <div key="languages" className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Languages</h2>
            {languages.map((l) => (
              <div key={l.id} className="mb-2 flex justify-between text-sm">
                <span>{l.name || 'Language'}</span>
                <span className="text-xs text-slate-400">{l.proficiency}</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'];

  return (
    <div className="bg-white font-sans text-slate-800 min-h-full px-10 py-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-light text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {p.fullName || 'Your Name'}
        </h1>
        <p className="text-slate-500 font-medium mt-1">{p.jobTitle || 'Job Title'}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
          {p.email && <span className="flex items-center gap-1.5 text-xs text-slate-500"><Mail size={11} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1.5 text-xs text-slate-500"><Phone size={11} />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={11} />{p.location}</span>}
          {p.linkedin && <span className="flex items-center gap-1.5 text-xs text-slate-500"><Linkedin size={11} />{p.linkedin}</span>}
          {p.github && <span className="flex items-center gap-1.5 text-xs text-slate-500"><Github size={11} />{p.github}</span>}
        </div>
      </div>
      <div className="border-b-2 border-slate-900 mb-6"></div>

      {order.map(id => renderSection(id))}
    </div>
  );
}

export function ProfessionalTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'personalInfo':
        return p.summary && (
          <div key="personalInfo" className="mb-5">
            <h2 className="text-sm font-bold text-emerald-700 border-b-2 border-emerald-700 pb-1 mb-2 uppercase tracking-wider">
              Professional Summary
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{p.summary}</p>
          </div>
        );
      case 'experience':
        return experience.length > 0 && (
          <div key="experience" className="mb-5">
            <h2 className="text-sm font-bold text-emerald-700 border-b-2 border-emerald-700 pb-1 mb-3 uppercase tracking-wider">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm">{exp.position || 'Position'}</div>
                      <div className="text-emerald-600 text-xs font-semibold">{exp.company}</div>
                    </div>
                    <div className="text-xs text-slate-400">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return projects.length > 0 && (
          <div key="projects" className="mb-5">
            <h2 className="text-sm font-bold text-emerald-700 border-b-2 border-emerald-700 pb-1 mb-3 uppercase tracking-wider">
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="font-bold text-sm">{proj.name || 'Project'}</div>
                  {proj.technologies && <div className="text-xs text-emerald-600 font-medium">{proj.technologies}</div>}
                  {proj.description && <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        return education.length > 0 && (
          <div key="education" className="mb-5">
            <h2 className="text-sm font-bold text-emerald-700 border-b-2 border-emerald-700 pb-1 mb-3 uppercase tracking-wider">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-xs">{edu.degree}</div>
                  {edu.field && <div className="text-xs text-slate-500">{edu.field}</div>}
                  <div className="text-xs text-emerald-600">{edu.institution}</div>
                  <div className="text-xs text-slate-400">{edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        return skills.length > 0 && (
          <div key="skills" className="mb-5">
            <h2 className="text-sm font-bold text-emerald-700 border-b-2 border-emerald-700 pb-1 mb-3 uppercase tracking-wider">
              Skills
            </h2>
            <div className="space-y-1.5">
              {skills.map((s) => (
                <div key={s.id} className="flex items-center gap-1.5 text-xs">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></div>
                  {s.name || 'Skill'}
                </div>
              ))}
            </div>
          </div>
        );
      case 'languages':
        return languages.length > 0 && (
          <div key="languages" className="mb-5">
            <h2 className="text-sm font-bold text-emerald-700 border-b-2 border-emerald-700 pb-1 mb-3 uppercase tracking-wider">
              Languages
            </h2>
            <div className="space-y-1.5">
              {languages.map((l) => (
                <div key={l.id} className="text-xs">
                  <div className="font-medium">{l.name || 'Language'}</div>
                  <div className="text-slate-400">{l.proficiency}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        return certifications.length > 0 && (
          <div key="certifications">
            <h2 className="text-sm font-bold text-emerald-700 border-b-2 border-emerald-700 pb-1 mb-3 uppercase tracking-wider">
              Certs
            </h2>
            <div className="space-y-2">
              {certifications.map((c) => (
                <div key={c.id} className="text-xs">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-slate-400">{c.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const leftOrder = ['personalInfo', 'experience', 'projects'];
  const rightOrder = ['education', 'skills', 'languages', 'certifications'];

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'];

  return (
    <div className="bg-white font-sans text-slate-800 min-h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-emerald-700 text-white px-8 py-7">
        <h1 className="text-2xl font-bold mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {p.fullName || 'Your Name'}
        </h1>
        <p className="text-emerald-200 text-sm font-medium mb-4">{p.jobTitle || 'Job Title'}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {p.email && <span className="flex items-center gap-1.5 text-xs text-emerald-100"><Mail size={11} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1.5 text-xs text-emerald-100"><Phone size={11} />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1.5 text-xs text-emerald-100"><MapPin size={11} />{p.location}</span>}
          {p.linkedin && <span className="flex items-center gap-1.5 text-xs text-emerald-100"><Linkedin size={11} />{p.linkedin}</span>}
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="flex gap-8">
          <div className="flex-1">
            {order.filter(id => leftOrder.includes(id)).map(id => renderSection(id))}
          </div>

          <div className="w-44 flex-shrink-0">
            {order.filter(id => rightOrder.includes(id)).map(id => renderSection(id))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreativeTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'skills':
        return skills.length > 0 && (
          <div key="skills" className="mb-8">
            <h3 className="text-[10px] font-bold text-violet-300 uppercase tracking-[0.2em] mb-3">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-medium">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        );
      case 'languages':
        return languages.length > 0 && (
          <div key="languages">
            <h3 className="text-[10px] font-bold text-violet-300 uppercase tracking-[0.2em] mb-3">Languages</h3>
            <div className="space-y-2">
              {languages.map((l) => (
                <div key={l.id}>
                  <div className="text-[10px] font-medium">{l.name}</div>
                  <div className="text-[9px] text-violet-300">{l.proficiency}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'personalInfo':
        return p.summary && (
          <div key="personalInfo" className="mb-8">
            <h2 className="text-xs font-bold text-violet-600 uppercase tracking-[0.2em] mb-3">About Me</h2>
            <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-violet-100 pl-4">{p.summary}</p>
          </div>
        );
      case 'experience':
        return experience.length > 0 && (
          <div key="experience" className="mb-8">
            <h2 className="text-xs font-bold text-violet-600 uppercase tracking-[0.2em] mb-4">Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-violet-400 before:rounded-full after:absolute after:left-[3px] after:top-4 after:bottom-[-20px] after:w-[1px] after:bg-violet-100 last:after:hidden">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-800 text-sm">{exp.position}</h3>
                    <span className="text-[10px] text-violet-400 font-bold bg-violet-50 px-2 py-0.5 rounded-full">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-violet-600 text-xs font-semibold mb-2">{exp.company}</div>
                  {exp.description && <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        return education.length > 0 && (
          <div key="education" className="mb-8">
            <h2 className="text-xs font-bold text-violet-600 uppercase tracking-[0.2em] mb-4">Education</h2>
            <div className="grid grid-cols-2 gap-4">
              {education.map((edu) => (
                <div key={edu.id} className="p-3 bg-slate-50 rounded-xl">
                  <div className="font-bold text-xs text-slate-800">{edu.degree}</div>
                  <div className="text-[10px] text-violet-500 font-medium">{edu.institution}</div>
                  <div className="text-[9px] text-slate-400 mt-1">{edu.startDate} – {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return projects.length > 0 && (
          <div key="projects">
            <h2 className="text-xs font-bold text-violet-600 uppercase tracking-[0.2em] mb-4">Top Projects</h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-violet-600 transition-colors uppercase tracking-tight">{proj.name}</h3>
                    {proj.link && <ExternalLink size={10} className="text-violet-400" />}
                  </div>
                  {proj.technologies && <div className="text-[10px] text-violet-500 font-medium mb-1.5">{proj.technologies}</div>}
                  {proj.description && <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const sidebarOrder = ['skills', 'languages'];
  const mainOrder = ['personalInfo', 'experience', 'education', 'projects'];

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'];

  return (
    <div className="bg-white font-sans text-slate-800 min-h-full flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <div className="w-48 bg-violet-600 text-white p-6 flex-shrink-0">
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl mb-4 flex items-center justify-center text-2xl font-bold">
            {p.fullName?.[0] || 'Y'}
          </div>
          <h1 className="text-xl font-bold leading-tight mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {p.fullName || 'Your Name'}
          </h1>
          <p className="text-violet-200 text-xs font-medium uppercase tracking-wider">{p.jobTitle || 'Job Title'}</p>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-[10px] font-bold text-violet-300 uppercase tracking-[0.2em]">Contact</h3>
          <div className="space-y-2">
            {p.email && <div className="flex items-center gap-2 text-[10px] text-violet-100"><Mail size={10} />{p.email}</div>}
            {p.phone && <div className="flex items-center gap-2 text-[10px] text-violet-100"><Phone size={10} />{p.phone}</div>}
            {p.location && <div className="flex items-center gap-2 text-[10px] text-violet-100"><MapPin size={10} />{p.location}</div>}
            {p.linkedin && <div className="flex items-center gap-2 text-[10px] text-violet-100"><Linkedin size={10} />LinkedIn</div>}
          </div>
        </div>

        {order.filter(id => sidebarOrder.includes(id)).map(id => renderSection(id))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {order.filter(id => mainOrder.includes(id)).map(id => renderSection(id))}
      </div>
    </div>
  );
}

export function ExecutiveTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'personalInfo':
        return p.summary && (
          <div key="personalInfo" className="mb-10 text-center max-w-2xl mx-auto">
            <p className="text-[13px] leading-relaxed text-[#444] leading-[1.8]">{p.summary}</p>
          </div>
        );
      case 'experience':
        return experience.length > 0 && (
          <div key="experience">
            <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-[0.3em] mb-6 flex items-center gap-4 after:content-[''] after:h-[1px] after:bg-[#e0e0e0] after:flex-1">
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-sm uppercase tracking-wider">{exp.position}</h3>
                    <span className="text-[10px] text-[#888] italic tracking-widest">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[#b8860b] text-[11px] font-bold uppercase tracking-widest mb-3">{exp.company} | {exp.location}</div>
                  {exp.description && <p className="text-[12px] text-[#555] leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return projects.length > 0 && (
          <div key="projects" className="">
            <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-[0.3em] mb-6 flex items-center gap-4 after:content-[''] after:h-[1px] after:bg-[#e0e0e0] after:flex-1">
              Strategic Initiatives
            </h2>
            <div className="space-y-6">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-bold text-sm uppercase tracking-wide mb-1">{proj.name}</h3>
                  {proj.description && <p className="text-[12px] text-[#555] leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        return education.length > 0 && (
          <div key="education">
            <h2 className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] mb-4 border-b border-[#e0e0e0] pb-2">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-[11px] uppercase tracking-wide">{edu.degree}</div>
                  <div className="text-[11px] text-[#b8860b] font-medium">{edu.institution}</div>
                  <div className="text-[10px] text-[#888] italic">{edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        return skills.length > 0 && (
          <div key="skills">
            <h2 className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] mb-4 border-b border-[#e0e0e0] pb-2">
              Core Competencies
            </h2>
            <div className="space-y-2">
              {skills.map((s) => (
                <div key={s.id} className="text-[11px] tracking-wide text-[#555] border-l-2 border-[#b8860b] pl-3 py-1">
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        return certifications.length > 0 && (
          <div key="certifications">
            <h2 className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] mb-4 border-b border-[#e0e0e0] pb-2">
              Credentials
            </h2>
            <div className="space-y-3">
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="text-[11px] font-bold text-[#555] leading-tight">{c.name}</div>
                  <div className="text-[10px] text-[#b8860b]">{c.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const mainSections = ['personalInfo', 'experience', 'projects'];
  const sideSections = ['education', 'skills', 'certifications'];

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'];

  return (
    <div className="bg-[#fcf8f3] font-serif text-[#2c2c2c] min-h-full px-12 py-10" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Centered Header */}
      <div className="text-center mb-10 border-b-2 border-[#b8860b] pb-8">
        <h1 className="text-4xl font-normal tracking-[0.1em] text-[#1a1a1a] mb-2 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
          {p.fullName || 'Your Name'}
        </h1>
        <p className="text-[#b8860b] font-medium tracking-[0.2em] text-xs uppercase mb-4">{p.jobTitle || 'Job Title'}</p>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-[10px] text-[#666] tracking-wider uppercase">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2 space-y-10">
          {order.filter(id => mainSections.includes(id)).map(id => renderSection(id))}
        </div>

        <div className="space-y-10">
          {order.filter(id => sideSections.includes(id)).map(id => renderSection(id))}
        </div>
      </div>
    </div>
  );
}

export function TechTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'personalInfo':
        return p.summary && (
          <div key="personalInfo" className="border border-emerald-900/30 p-4 mb-6">
            <h2 className="text-sm font-bold bg-emerald-900 text-slate-950 px-2 py-1 mb-4 inline-block">00. PROFILE</h2>
            <p className="text-slate-400 leading-relaxed text-[11px] italic">{p.summary}</p>
          </div>
        );
      case 'experience':
        return experience.length > 0 && (
          <div key="experience" className="border border-emerald-900/30 p-4 mb-6">
            <h2 className="text-sm font-bold bg-emerald-900 text-slate-950 px-2 py-1 mb-4 inline-block">01. LOG_HISTORY</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="group">
                  <div className="flex justify-between items-baseline mb-1 border-b border-emerald-900/10 group-hover:border-emerald-500/30 transition-colors pb-1">
                    <h3 className="text-xs font-bold text-emerald-400">{exp.position} @ {exp.company}</h3>
                    <span className="text-[9px] text-slate-500 font-bold uppercase"> [{exp.startDate} - {exp.current ? 'CUR' : exp.endDate}] </span>
                  </div>
                  {exp.description && <p className="text-[11px] text-slate-400 mt-2 leading-relaxed pl-2 border-l border-emerald-900/30">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return projects.length > 0 && (
          <div key="projects" className="border border-emerald-900/30 p-4">
            <h2 className="text-sm font-bold bg-emerald-900 text-slate-950 px-2 py-1 mb-4 inline-block">02. REPOSITORIES</h2>
            <div className="grid grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-900/30 p-3 border border-emerald-900/10 hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[11px] font-bold text-emerald-400 truncate">{proj.name}</h3>
                  </div>
                  {proj.technologies && <div className="text-[9px] text-emerald-900 mb-2 truncate">[{proj.technologies}]</div>}
                  <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        return skills.length > 0 && (
          <div key="skills" className="border border-emerald-900/30 p-4">
            <h3 className="text-[10px] font-bold text-emerald-800 uppercase tracking-[0.2em] mb-4">{'['} SKILLS.SYS {']'}</h3>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
              {skills.map(s => (
                <span key={s.id} className="text-emerald-500/70">{s.name};</span>
              ))}
            </div>
          </div>
        );
      case 'education':
        return education.length > 0 && (
          <div key="education" className="border border-emerald-900/30 p-4 mt-6">
            <h3 className="text-[10px] font-bold text-emerald-800 uppercase tracking-[0.2em] mb-4">{'['} EDU.SYS {']'}</h3>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="text-[10px] font-bold text-emerald-500/80">{edu.degree}</div>
                  <div className="text-[9px] text-slate-500">{edu.institution}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const mainSections = ['personalInfo', 'experience', 'projects'];
  const sideSections = ['skills', 'education'];

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills', 'projects'];

  return (
    <div className="bg-slate-950 font-mono text-emerald-500 min-h-full p-8" style={{ fontFamily: '"Fira Code", monospace, "Courier New"' }}>
      {/* Tech Header */}
      <div className="border border-emerald-900 bg-slate-900/50 p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1 tracking-tighter">
              {'>'} {p.fullName || 'User'}
              <span className="animate-pulse">_</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium mb-4">Level: {p.jobTitle || 'Admin'}</p>
          </div>
          <div className="text-right text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest hidden md:block">
            Status: Active<br />
            Uptime: 24h 59m<br />
            Location: {p.location || 'Unknown'}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px]">
          {p.email && <div className="flex items-center gap-1.5"><span className="text-emerald-900">#</span> {p.email}</div>}
          {p.github && <div className="flex items-center gap-1.5"><span className="text-emerald-900">#</span> github/{p.github.split('/').pop()}</div>}
          {p.linkedin && <div className="flex items-center gap-1.5"><span className="text-emerald-900">#</span> linkedin/{p.linkedin.split('/').pop()}</div>}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 space-y-6">
          {order.filter(id => mainSections.includes(id)).map(id => renderSection(id))}
        </div>
        <div className="col-span-1">
          {order.filter(id => sideSections.includes(id)).map(id => renderSection(id))}
        </div>
      </div>
    </div>
  );
}

export function ElegantTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'personalInfo':
        return p.summary && (
          <section key="personalInfo" className="mb-10 text-center italic text-slate-600 max-w-2xl mx-auto">
            <p className="text-lg leading-relaxed">{p.summary}</p>
          </section>
        );
      case 'experience':
        return experience.length > 0 && (
          <section key="experience">
            <h2 className="text-xs tracking-[0.3em] uppercase text-slate-400 font-sans mb-6 border-b pb-2">Experience</h2>
            <div className="space-y-8">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-medium text-slate-800">{exp.position}</h3>
                    <span className="text-xs font-sans text-slate-400 uppercase">{exp.startDate} — {exp.endDate || 'Present'}</span>
                  </div>
                  <div className="text-sm font-sans uppercase tracking-wider text-slate-500 mb-2">{exp.company}</div>
                  <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return education.length > 0 && (
          <section key="education">
            <h2 className="text-xs tracking-[0.2em] uppercase text-slate-400 font-sans mb-6 border-b pb-2">Education</h2>
            <div className="space-y-6">
              {education.map(edu => (
                <div key={edu.id}>
                  <h3 className="text-lg font-medium text-slate-800">{edu.degree}</h3>
                  <div className="text-sm text-slate-500 font-sans italic">{edu.institution}</div>
                  <div className="text-xs text-slate-400 font-sans mt-1">{edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return skills.length > 0 && (
          <section key="skills">
            <h2 className="text-xs tracking-[0.2em] uppercase text-slate-400 font-sans mb-6 border-b pb-2">Skills</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {skills.map(skill => (
                <div key={skill.id} className="text-sm text-slate-700 italic">{skill.name}</div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills'];

  return (
    <div className="bg-[#fffcf9] font-serif text-slate-900 min-h-full p-12 leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
      <header className="border-b-2 border-slate-200 pb-8 mb-10 text-center">
        <h1 className="text-4xl font-light tracking-widest uppercase mb-3 text-slate-800">{p.fullName || 'YOUR NAME'}</h1>
        <div className="flex justify-center gap-6 text-xs tracking-widest uppercase text-slate-500 font-sans">
          <span>{p.email}</span>
          <span>{p.phone}</span>
          <span>{p.location}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {order.map(id => renderSection(id))}
      </div>
    </div>
  );
}

export function TechnicalTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'personalInfo':
        return p.summary && (
          <section key="personalInfo">
            <h2 className="text-xs font-black bg-slate-900 text-white px-2 py-0.5 inline-block mb-3"># TECHNICAL_SUMMARY</h2>
            <p className="text-slate-600 leading-relaxed italic">{p.summary}</p>
          </section>
        );
      case 'experience':
        return experience.length > 0 && (
          <section key="experience">
            <h2 className="text-xs font-black bg-slate-900 text-white px-2 py-0.5 inline-block mb-3"># EXPERIENCE_LOG</h2>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id} className="border-l-2 border-slate-200 pl-4">
                  <div className="flex justify-between font-bold">
                    <span className="text-sm uppercase">{exp.position} // {exp.company}</span>
                    <span className="text-slate-500">[{exp.startDate} - {exp.endDate || 'INF'}]</span>
                  </div>
                  <p className="mt-1 text-slate-600 whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return skills.length > 0 && (
          <section key="skills">
            <h2 className="text-xs font-black bg-slate-900 text-white px-2 py-0.5 inline-block mb-3"># STACK_ANALYSIS</h2>
            <div className="space-y-3">
              {skills.map(s => (
                <div key={s.id}>
                  <div className="flex justify-between mb-1">
                    <span>{s.name}</span>
                    <span className="opacity-50">{s.level}</span>
                  </div>
                  <div className="h-1 bg-slate-100 overflow-hidden">
                    <div className="h-full bg-slate-400" style={{ width: s.level === 'Expert' ? '100%' : s.level === 'Advanced' ? '75%' : s.level === 'Intermediate' ? '50%' : '25%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return education.length > 0 && (
          <section key="education">
            <h2 className="text-xs font-black bg-slate-900 text-white px-2 py-0.5 inline-block mb-3"># ACADEMIC_RECORDS</h2>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="font-bold uppercase mb-0.5">{edu.degree}</div>
                  <div className="text-slate-600 italic mb-1">{edu.institution}</div>
                  <div className="text-[10px] text-slate-400">CLASS_OF: {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'projects':
        return projects.length > 0 && (
          <section key="projects">
            <h2 className="text-xs font-black bg-slate-900 text-white px-2 py-0.5 inline-block mb-3"># PROJECTS_DONE</h2>
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="font-bold uppercase mb-0.5">{proj.name}</div>
                  {proj.technologies && <div className="text-[9px] opacity-70 mb-1">{proj.technologies}</div>}
                  {proj.description && <p className="text-slate-600 leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const leftOrder = ['personalInfo', 'experience', 'projects'];
  const rightOrder = ['skills', 'education'];

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills', 'projects'];

  return (
    <div className="bg-white font-mono text-slate-900 min-h-full p-8 text-[11px] leading-normal" style={{ fontFamily: 'Roboto Mono, monospace' }}>
      <header className="mb-6 grid grid-cols-2 items-end border-b-4 border-slate-900 pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">{p.fullName || 'NAME_UNDEFINED'}</h1>
          <p className="text-lg font-bold text-slate-500">{p.jobTitle || 'ROLE_CORE'}</p>
        </div>
        <div className="text-right space-y-1">
          <div>{p.email} | {p.phone}</div>
          <div>{p.location}</div>
          <div>{p.linkedin} | {p.github}</div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-6">
          {order.filter(id => leftOrder.includes(id)).map(id => renderSection(id))}
        </div>

        <div className="col-span-4 space-y-6">
          {order.filter(id => rightOrder.includes(id)).map(id => renderSection(id))}
        </div>
      </div>
    </div>
  );
}

export function AcademicTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, certifications, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'education':
        return education.length > 0 && (
          <section key="education">
            <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1">Education</h2>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between font-bold italic">
                    <span>{edu.institution}</span>
                    <span>{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{edu.degree} in {edu.field}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}/4.00</span>}
                  </div>
                  {edu.description && <p className="mt-1 text-slate-700 leading-relaxed font-sans text-xs">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      case 'experience':
        return experience.length > 0 && (
          <section key="experience">
            <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1">Academic & Professional Experience</h2>
            <div className="space-y-5">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between font-bold">
                    <span>{exp.company}, {exp.location}</span>
                    <span>{exp.startDate} — {exp.endDate || 'Present'}</span>
                  </div>
                  <div className="italic mb-1">{exp.position}</div>
                  <p className="text-slate-700 leading-relaxed font-sans text-[12px]">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'certifications':
        return certifications.length > 0 && (
          <section key="certifications">
            <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1">Honors & Certifications</h2>
            <ul className="list-disc pl-5 space-y-1 font-sans text-[12px]">
              {certifications.map(c => (
                <li key={c.id}><strong>{c.name}</strong>, {c.issuer} ({c.date})</li>
              ))}
            </ul>
          </section>
        );
      case 'projects':
        return projects.length > 0 && (
          <section key="projects">
            <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1">Research & Projects</h2>
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="font-bold italic">{proj.name}</div>
                  {proj.description && <p className="mt-1 text-slate-700 leading-relaxed font-sans text-xs">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return skills.length > 0 && (
          <section key="skills">
            <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3 pb-1">Skills & Competencies</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2 font-sans text-xs">
              {skills.map(s => (
                <span key={s.id}>&bull; {s.name}</span>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const order = sectionOrder || ['education', 'experience', 'certifications', 'projects', 'skills'];

  return (
    <div className="bg-white font-serif text-slate-950 min-h-full p-14 leading-normal" style={{ fontFamily: 'Georgia, serif' }}>
      <header className="border-b border-black pb-4 mb-8 text-center">
        <h1 className="text-2xl font-bold uppercase mb-2 tracking-tight">{p.fullName}</h1>
        <div className="text-sm space-x-2">
          <span>{p.email}</span>
          <span>&bull;</span>
          <span>{p.phone}</span>
          <span>&bull;</span>
          <span>{p.location}</span>
        </div>
      </header>

      <div className="space-y-8 max-w-3xl mx-auto text-[13px]">
        {order.map(id => renderSection(id))}
      </div>
    </div>
  );
}

export function StartupTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'skills':
        return skills.length > 0 && (
          <div key="skills" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xs font-bold uppercase text-primary mb-4 tracking-widest">Skill Stack</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s.id} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{s.name}</span>
              ))}
            </div>
          </div>
        );
      case 'personalInfo':
        return p.summary && (
          <section key="personalInfo" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span> Impact
            </h2>
            <p className="text-slate-600 leading-relaxed">{p.summary}</p>
          </section>
        );
      case 'experience':
        return experience.length > 0 && (
          <div key="experience" className="space-y-4">
            {experience.map(exp => (
              <section key={exp.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-2 text-slate-400 text-xs font-bold">
                  <span>{exp.startDate} - {exp.endDate || 'Active'}</span>
                  <span>{exp.location}</span>
                </div>
                <h3 className="text-lg font-black text-slate-800">{exp.position}</h3>
                <p className="text-primary font-bold text-sm mb-3">{exp.company}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
              </section>
            ))}
          </div>
        );
      case 'projects':
        return projects.length > 0 && (
          <div key="projects" className="space-y-4">
            {projects.map(proj => (
              <section key={proj.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-black text-slate-800">{proj.name}</h3>
                {proj.technologies && <p className="text-primary font-bold text-xs mb-2">{proj.technologies}</p>}
                <p className="text-slate-600 text-sm leading-relaxed">{proj.description}</p>
              </section>
            ))}
          </div>
        );
      case 'education':
        return education.length > 0 && (
          <div key="education" className="space-y-4">
            {education.map(edu => (
              <section key={edu.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-black text-slate-800">{edu.degree}</h3>
                <p className="text-primary font-bold text-sm">{edu.institution}</p>
                <p className="text-slate-400 text-xs mt-1">{edu.startDate} - {edu.endDate}</p>
              </section>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const asideSections = ['skills'];
  const mainSections = ['personalInfo', 'experience', 'projects', 'education'];

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills', 'projects'];

  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-full p-10 flex flex-col gap-8">
      <header className="bg-primary rounded-3xl p-8 text-white shadow-xl shadow-primary/20 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black mb-1">{p.fullName || 'Startup Builder'}</h1>
          <p className="text-primary-foreground/80 font-medium">{p.jobTitle || 'Disrupting the space'}</p>
        </div>
        <div className="text-right text-sm opacity-90">
          <p>{p.email}</p>
          <p>{p.location}</p>
        </div>
      </header>

      <div className="flex gap-8 flex-1">
        <aside className="w-64 space-y-8">
          {order.filter(id => asideSections.includes(id)).map(id => renderSection(id))}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xs font-bold uppercase text-primary mb-4 tracking-widest">Connect</h2>
            <div className="space-y-3 text-sm text-slate-600">
              {p.linkedin && <div className="truncate">IN: {p.linkedin}</div>}
              {p.github && <div className="truncate">GH: {p.github}</div>}
              {p.website && <div className="truncate">W: {p.website}</div>}
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-8">
          {order.filter(id => mainSections.includes(id)).map(id => renderSection(id))}
        </main>
      </div>
    </div>
  );
}

export function CorporateTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'personalInfo':
        return p.summary && (
          <div key="personalInfo" className="col-span-12 border-b-2 border-slate-100 pb-8 mb-4">
            <h2 className="text-blue-900 font-black text-xs uppercase mb-4 tracking-widest">Professional Profile</h2>
            <p className="text-slate-600 leading-relaxed text-lg">{p.summary}</p>
          </div>
        );
      case 'experience':
        return experience.length > 0 && (
          <section key="experience">
            <h2 className="text-blue-900 font-black text-xs uppercase mb-6 tracking-widest">Core Experience</h2>
            <div className="space-y-10">
              {experience.map(exp => (
                <div key={exp.id} className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors uppercase italic tracking-tight">{exp.position}</h3>
                    <span className="text-sm font-bold text-slate-400">{exp.startDate} — {exp.endDate || 'Present'}</span>
                  </div>
                  <p className="text-blue-600 font-black text-xs uppercase mb-3 tracking-widest">{exp.company} &bull; {exp.location}</p>
                  <p className="text-slate-600 leading-relaxed text-sm antialiased">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return education.length > 0 && (
          <section key="education">
            <h2 className="text-blue-900 font-black text-xs uppercase mb-6 tracking-widest">Academic Credentials</h2>
            <div className="space-y-6">
              {education.map(edu => (
                <div key={edu.id}>
                  <h3 className="text-lg font-bold text-slate-800">{edu.degree}</h3>
                  <p className="text-blue-600 text-xs font-bold uppercase">{edu.institution}</p>
                  <p className="text-slate-400 text-xs">{edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const mainSections = ['personalInfo', 'experience', 'education'];

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills'];

  return (
    <div className="bg-white font-sans text-slate-800 min-h-full min-w-full">
      <div className="bg-[#0f172a] text-white p-12">
        <div className="max-w-4xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">{p.fullName || 'Executive Candidate'}</h1>
            <p className="text-xl text-blue-400 font-medium uppercase tracking-wider">{p.jobTitle || 'Industry Leader'}</p>
          </div>
          <div className="text-right text-sm text-slate-300 space-y-1">
            <p>{p.phone}</p>
            <p>{p.email}</p>
            <p>{p.location}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12">
        <div className="grid grid-cols-12 gap-12">
          {order.filter(id => mainSections.includes(id)).map(id => renderSection(id))}
        </div>
      </div>
    </div>
  );
}

export function DesignerTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'skills':
        return skills.length > 0 && (
          <section key="skills">
            <h2 className="text-[10px] uppercase tracking-[0.4em] mb-8 opacity-30">Disciplines</h2>
            <ul className="space-y-4 text-2xl font-bold tracking-tight">
              {skills.map(s => (
                <li key={s.id} className="hover:pl-4 transition-all duration-300">/ {s.name}</li>
              ))}
            </ul>
          </section>
        );
      case 'education':
        return education.length > 0 && (
          <section key="education">
            <h2 className="text-[10px] uppercase tracking-[0.4em] mb-8 opacity-30">Education</h2>
            <div className="space-y-8">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="text-lg font-bold">{edu.institution}</p>
                  <p className="text-sm opacity-50">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'personalInfo':
        return p.summary && (
          <section key="personalInfo" className="max-w-xl">
            <p className="text-3xl font-light leading-snug tracking-tight text-white/90">{p.summary}</p>
          </section>
        );
      case 'experience':
        return experience.length > 0 && (
          <section key="experience" className="space-y-16">
            <h2 className="text-[10px] uppercase tracking-[0.4em] opacity-30">Work History</h2>
            <div className="space-y-12">
              {experience.map(exp => (
                <div key={exp.id} className="group relative">
                  <span className="absolute -left-8 top-1.5 w-4 h-[1px] bg-white opacity-0 group-hover:opacity-100 transition-all" />
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-3xl font-bold">{exp.position}</h3>
                    <span className="text-xs opacity-40 font-mono italic">{exp.startDate}—{exp.endDate || 'NOW'}</span>
                  </div>
                  <p className="text-lg text-white/60 mb-4">{exp.company}</p>
                  <p className="text-sm text-white/40 max-w-lg leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const asideOrder = ['skills', 'education'];
  const mainOrder = ['personalInfo', 'experience'];

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills', 'projects'];

  return (
    <div className="bg-black text-white min-h-full font-sans selection:bg-white selection:text-black">
      <header className="p-16 border-b border-white/10 flex justify-between items-baseline">
        <h1 className="text-6xl font-black tracking-tighter hover:italic transition-all cursor-default">{p.fullName || 'DESIGNER'}</h1>
        <div className="text-right text-xs tracking-widest uppercase space-y-1 opacity-50">
          <p>{p.location}</p>
          <p>{p.email}</p>
        </div>
      </header>

      <div className="grid grid-cols-12 min-h-[600px]">
        <aside className="col-span-4 border-r border-white/10 p-16 space-y-16">
          {order.filter(id => asideOrder.includes(id)).map(id => renderSection(id))}
        </aside>

        <main className="col-span-8 p-16 space-y-24">
          {order.filter(id => mainOrder.includes(id)).map(id => renderSection(id))}
        </main>
      </div>
    </div>
  );
}

export function SimpleTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'personalInfo':
        return p.summary && (
          <section key="personalInfo">
            <p className="text-slate-600 leading-relaxed italic">{p.summary}</p>
          </section>
        );
      case 'experience':
        return experience.length > 0 && (
          <section key="experience">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b mb-4 pb-1">Experience</h2>
            <div className="space-y-6">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-sans">
                    <h3 className="font-bold text-slate-900">{exp.company}</h3>
                    <span className="text-sm text-slate-500">{exp.startDate} &ndash; {exp.endDate || 'Present'}</span>
                  </div>
                  <div className="text-sm text-slate-700 italic mb-2">{exp.position}</div>
                  <p className="text-sm leading-relaxed text-slate-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return education.length > 0 && (
          <section key="education">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b mb-4 pb-1">Education</h2>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="font-bold text-slate-800 text-sm">{edu.institution}</div>
                  <div className="text-xs text-slate-600 uppercase tracking-tighter">{edu.degree}</div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return skills.length > 0 && (
          <section key="skills">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b mb-4 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map(s => (
                <span key={s.id} className="text-xs text-slate-00 bg-slate-100 px-2 py-0.5 rounded">{s.name}</span>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills'];

  return (
    <div className="bg-white text-slate-800 p-12 max-w-3xl mx-auto min-h-full font-serif" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{p.fullName}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 font-sans">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span className="text-blue-600">{p.website}</span>}
        </div>
      </header>

      <div className="space-y-8">
        {order.map(id => renderSection(id))}
      </div>
    </div>
  );
}

export function VintageTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'personalInfo':
        return p.summary && (
          <section key="personalInfo">
            <h2 className="text-sm font-black uppercase border-b-2 border-[#2c1810] mb-6 pb-1 flex justify-between items-center">
              <span>Biographical Summary</span>
              <span className="text-[10px] italic font-normal">Est. {new Date().getFullYear()}</span>
            </h2>
            <p className="text-lg leading-relaxed italic pr-8 opacity-90">{p.summary}</p>
          </section>
        );
      case 'experience':
        return experience.length > 0 && (
          <section key="experience">
            <h2 className="text-sm font-black uppercase border-b-2 border-[#2c1810] mb-8 pb-1">Professional History</h2>
            <div className="space-y-10">
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-[#2c1810] before:rounded-full">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-xl font-bold">{exp.position}</h3>
                    <span className="text-xs uppercase font-black">{exp.startDate} - {exp.endDate || 'Active'}</span>
                  </div>
                  <div className="text-sm uppercase tracking-widest font-bold mb-3 opacity-60 underline underline-offset-4">{exp.company}</div>
                  <p className="text-[13px] leading-relaxed opacity-80 antialiased">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return skills.length > 0 && (
          <section key="skills">
            <h2 className="text-sm font-black uppercase border-b-2 border-[#2c1810] mb-6 pb-1">Proficiencies</h2>
            <div className="space-y-4">
              {skills.map(s => (
                <div key={s.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold italic">{s.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(dot => (
                      <div key={dot} className={`w-2 h-2 border border-[#2c1810] rounded-full ${dot <= (s.level === 'Expert' ? 5 : 3) ? 'bg-[#2c1810]' : ''}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return education.length > 0 && (
          <section key="education" className="bg-white/30 p-6 border-l-2 border-[#2c1810]">
            <h2 className="text-sm font-black uppercase mb-4 tracking-widest">Education</h2>
            <div className="space-y-6">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="text-sm font-bold uppercase underline underline-offset-2 mb-1">{edu.degree}</div>
                  <div className="text-xs italic opacity-80">{edu.institution}</div>
                  <div className="text-[10px] font-black mt-2">ANNO {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const mainSections = ['personalInfo', 'experience'];
  const sideSections = ['skills', 'education'];

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills'];

  return (
    <div className="bg-[#f4f1ea] text-[#2c1810] min-h-full p-16 selection:bg-[#2c1810] selection:text-[#f4f1ea]" style={{ fontFamily: '"PT Serif", serif' }}>
      <div className="border-4 border-[#2c1810] p-1 shadow-[8px_8px_0_rgba(44,24,16,0.1)] mb-12">
        <header className="border border-[#2c1810] p-8 text-center bg-white/40">
          <h1 className="text-5xl font-black uppercase mb-4 tracking-tighter">{p.fullName}</h1>
          <div className="inline-block border-y border-[#2c1810] py-1 px-4 text-sm font-bold tracking-widest italic">
            {p.jobTitle || 'CANDIDATE EXTRAORDINAIRE'}
          </div>
          <div className="mt-6 flex justify-center gap-8 text-[11px] uppercase font-bold tracking-[0.2em] opacity-80">
            <span>{p.location}</span>
            <span>/</span>
            <span>{p.phone}</span>
            <span>/</span>
            <span>{p.email}</span>
          </div>
        </header>
      </div>

      <div className="grid grid-cols-12 gap-16">
        <main className="col-span-8 space-y-12">
          {order.filter(id => mainSections.includes(id)).map(id => renderSection(id))}
        </main>
        <aside className="col-span-4 space-y-12">
          {order.filter(id => sideSections.includes(id)).map(id => renderSection(id))}
        </aside>
      </div>
    </div>
  );
}

export function ModernistTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'skills':
        return skills.length > 0 && (
          <section key="skills">
            <div className="w-12 h-1 bg-red-600 mb-6" />
            <h2 className="text-xs font-black uppercase tracking-widest mb-8">Capabilities</h2>
            <div className="space-y-6">
              {skills.map(s => (
                <div key={s.id} className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-lg font-bold uppercase tracking-tighter group-hover:text-red-600 transition-colors">{s.name}</span>
                  </div>
                  <div className="h-1 lg:h-2 bg-[#1a1a1a]" style={{ width: s.level === 'Expert' ? '100%' : '50%' }} />
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return education.length > 0 && (
          <section key="education">
            <div className="w-12 h-1 bg-red-600 mb-6" />
            <h2 className="text-xs font-black uppercase tracking-widest mb-8">Academics</h2>
            <div className="space-y-8">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="font-bold text-xl uppercase tracking-tighter leading-tight mb-1">{edu.degree}</p>
                  <p className="text-sm font-bold opacity-60 italic">{edu.institution} // {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'personalInfo':
        return p.summary && (
          <section key="personalInfo" className="p-12 border-b border-[#1a1a1a]">
            <p className="text-3xl font-bold leading-tight tracking-tighter uppercase">{p.summary}</p>
          </section>
        );
      case 'experience':
        return experience.length > 0 && (
          <section key="experience" className="p-12 space-y-12">
            <h2 className="text-xs font-black uppercase tracking-widest mb-8">Professional Chronology</h2>
            <div className="space-y-16">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="col-span-1 text-sm font-bold uppercase tracking-widest text-red-600">{exp.startDate} - {exp.endDate || 'INF'}</div>
                    <div className="col-span-3">
                      <h3 className="text-3xl font-bold uppercase tracking-tight mb-1 leading-none">{exp.position}</h3>
                      <p className="text-xl font-bold opacity-50 uppercase tracking-tighter">{exp.company}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1" />
                    <div className="col-span-3">
                      <p className="text-sm leading-relaxed text-[#555] font-medium">{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const asideSections = ['skills', 'education'];
  const mainSections = ['personalInfo', 'experience'];

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills'];

  return (
    <div className="bg-[#f0f0f0] text-[#1a1a1a] min-h-full font-sans selection:bg-red-600 selection:text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <header className="grid grid-cols-12 gap-0 border-b-8 border-[#1a1a1a]">
        <div className="col-span-8 p-12 bg-white">
          <h1 className="text-7xl font-bold tracking-tight uppercase leading-[0.85] mb-4">{p.fullName || 'RESUME'}</h1>
          <p className="text-2xl font-bold text-red-600 tracking-tighter uppercase">{p.jobTitle || 'CANDIDATE'}</p>
        </div>
        <div className="col-span-4 p-12 flex flex-col justify-end text-sm space-y-0.5 font-bold uppercase tracking-tight">
          <p>{p.email}</p>
          <p>{p.phone}</p>
          <p>{p.location}</p>
          <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
            {p.linkedin && <p>LI: {p.linkedin}</p>}
            {p.github && <p>GH: {p.github}</p>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 min-h-[600px]">
        <aside className="col-span-4 p-12 space-y-16 border-r border-[#1a1a1a]">
          {order.filter(id => asideSections.includes(id)).map(id => renderSection(id))}
        </aside>
        <main className="col-span-8 bg-white">
          {order.filter(id => mainSections.includes(id)).map(id => renderSection(id))}
        </main>
      </div>
    </div>
  );
}

export function CompactTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, sectionOrder } = data;

  const renderSection = (id: string) => {
    switch (id) {
      case 'personalInfo':
        return p.summary && (
          <section key="personalInfo">
            <p className="leading-normal">{p.summary}</p>
          </section>
        );
      case 'experience':
        return experience.length > 0 && (
          <section key="experience">
            <h2 className="text-[10px] font-black uppercase bg-slate-100 px-2 py-0.5 mb-2 tracking-widest">Experience</h2>
            <div className="space-y-3">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="font-bold flex gap-2">
                      <span>{exp.position}</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-600">{exp.company}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 italic">{exp.startDate} — {exp.endDate || 'Now'}</span>
                  </div>
                  <p className="text-slate-700 leading-normal pl-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return skills.length > 0 && (
          <section key="skills">
            <h2 className="text-[10px] font-black uppercase bg-slate-100 px-2 py-0.5 mb-2 tracking-widest">Skills</h2>
            <p className="leading-snug font-medium text-slate-700">
              {skills.map(s => s.name).join(' \u2022 ')}
            </p>
          </section>
        );
      case 'education':
        return education.length > 0 && (
          <section key="education">
            <h2 className="text-[10px] font-black uppercase bg-slate-100 px-2 py-0.5 mb-2 tracking-widest">Education</h2>
            <div className="space-y-2">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="font-bold flex justify-between">
                    <span>{edu.institution.split(',')[0]}</span>
                    <span className="text-[9px] text-slate-400">{edu.endDate}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 italic">{edu.degree}</div>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const order = sectionOrder || ['personalInfo', 'experience', 'education', 'skills'];

  return (
    <div className="bg-white text-slate-900 min-h-full p-8 font-sans leading-tight text-[11px]">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-0.5">{p.fullName}</h1>
          <p className="text-sm font-bold text-slate-500 uppercase">{p.jobTitle || ''}</p>
        </div>
        <div className="text-right space-y-0.5 text-[10px] font-medium">
          <p>{p.location} &bull; {p.phone}</p>
          <p>{p.email}</p>
          {p.linkedin && <p className="underline italic">{p.linkedin}</p>}
        </div>
      </div>

      <div className="space-y-4">
        {order.map(id => renderSection(id))}
      </div>
    </div>
  );
}

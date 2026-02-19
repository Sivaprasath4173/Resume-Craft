import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, certifications, languages } = data;

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
          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Skills</h3>
              <div className="space-y-1.5">
                {skills.map((s) => (
                  <div key={s.id} className="text-xs text-slate-700 font-medium">{s.name || 'Skill'}</div>
                ))}
              </div>
            </div>
          )}
          {languages.length > 0 && (
            <div className="mb-6">
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
          )}
          {certifications.length > 0 && (
            <div>
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
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 px-6 py-6">
          {p.summary && (
            <div className="mb-5">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-blue-600 block"></span>Profile
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{p.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="mb-5">
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
          )}

          {education.length > 0 && (
            <div className="mb-5">
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
          )}

          {projects.length > 0 && (
            <div>
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
          )}
        </div>
      </div>
    </div>
  );
}

export function MinimalTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, certifications, languages } = data;

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

      {p.summary && (
        <div className="mb-6">
          <p className="text-sm text-slate-600 leading-relaxed">{p.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-4 gap-4">
                <div className="text-xs text-slate-400 pt-0.5">
                  {exp.startDate}<br/>{exp.current ? 'Present' : exp.endDate}
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
      )}

      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-4 gap-4">
                <div className="text-xs text-slate-400">{edu.startDate}<br/>{edu.endDate}</div>
                <div className="col-span-3">
                  <div className="font-semibold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                  <div className="text-xs text-slate-500">{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                {s.name || 'Skill'}
              </span>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-6">
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
      )}

      <div className="grid grid-cols-2 gap-6">
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Certifications</h2>
            {certifications.map((c) => (
              <div key={c.id} className="mb-2">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-slate-400">{c.issuer} · {c.date}</div>
              </div>
            ))}
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Languages</h2>
            {languages.map((l) => (
              <div key={l.id} className="mb-2 flex justify-between text-sm">
                <span>{l.name || 'Language'}</span>
                <span className="text-xs text-slate-400">{l.proficiency}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfessionalTemplate({ data }: TemplateProps) {
  const { personalInfo: p, experience, education, skills, projects, certifications, languages } = data;

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
        {p.summary && (
          <div className="mb-5">
            <h2 className="text-sm font-bold text-emerald-700 border-b-2 border-emerald-700 pb-1 mb-2 uppercase tracking-wider">
              Professional Summary
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{p.summary}</p>
          </div>
        )}

        <div className="flex gap-8">
          <div className="flex-1">
            {experience.length > 0 && (
              <div className="mb-5">
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
            )}

            {projects.length > 0 && (
              <div className="mb-5">
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
            )}
          </div>

          <div className="w-44 flex-shrink-0">
            {education.length > 0 && (
              <div className="mb-5">
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
            )}

            {skills.length > 0 && (
              <div className="mb-5">
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
            )}

            {languages.length > 0 && (
              <div className="mb-5">
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
            )}

            {certifications.length > 0 && (
              <div>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

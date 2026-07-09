import React from 'react';
import { RoleTag } from '@/types/resume';
import { X } from 'lucide-react';

const ALL_TAGS: RoleTag[] = ['SDE', 'AI/GenAI', 'Full-stack', 'Data', 'DevOps', 'Design', 'PM', 'Quant', 'Embedded', 'Mobile'];

const TAG_COLORS: Record<RoleTag, string> = {
  'SDE':        'bg-blue-100 text-blue-700 border-blue-200',
  'AI/GenAI':   'bg-violet-100 text-violet-700 border-violet-200',
  'Full-stack': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Data':       'bg-cyan-100 text-cyan-700 border-cyan-200',
  'DevOps':     'bg-orange-100 text-orange-700 border-orange-200',
  'Design':     'bg-pink-100 text-pink-700 border-pink-200',
  'PM':         'bg-amber-100 text-amber-700 border-amber-200',
  'Quant':      'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Embedded':   'bg-slate-100 text-slate-700 border-slate-200',
  'Mobile':     'bg-teal-100 text-teal-700 border-teal-200',
};

interface RoleTagSelectorProps {
  selected: RoleTag[];
  onChange: (tags: RoleTag[]) => void;
}

export function RoleTagSelector({ selected, onChange }: RoleTagSelectorProps) {
  const toggle = (tag: RoleTag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Role Tags <span className="font-normal normal-case">(used to generate variants)</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ALL_TAGS.map(tag => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold transition-all duration-150 ${
                active
                  ? TAG_COLORS[tag] + ' shadow-sm scale-105'
                  : 'bg-secondary text-muted-foreground border-transparent hover:border-border'
              }`}
            >
              {tag}
              {active && <X className="w-2.5 h-2.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Read-only tag display (for variant preview) */
export function RoleTagBadges({ tags }: { tags?: RoleTag[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {tags.map(tag => (
        <span
          key={tag}
          className={`inline-block px-1.5 py-0 rounded-full border text-[10px] font-semibold ${TAG_COLORS[tag]}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

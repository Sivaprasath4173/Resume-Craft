import React, { useState } from 'react';
import { ResumeData, RoleTag, ResumeVariant } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  GitBranch, Plus, Trash2, Eye, ToggleLeft, ToggleRight,
  Sparkles, Save, ChevronDown, ChevronUp, Copy
} from 'lucide-react';
import { toast } from 'sonner';

const ROLE_OPTIONS: RoleTag[] = ['SDE', 'AI/GenAI', 'Full-stack', 'Data', 'DevOps', 'Design', 'PM', 'Quant', 'Embedded', 'Mobile'];

interface VariantPanelProps {
  resumeData: ResumeData;
  onSaveVariant: (variant: ResumeVariant) => void;
  onDeleteVariant: (id: string) => void;
  onSetActiveVariant: (id: string | null) => void;
}

function generateVariant(resume: ResumeData, targetRole: string, name: string): ResumeVariant {
  const visibleItems: Record<string, boolean> = {};

  // Include experience items tagged with the role (or untagged = always include)
  resume.experience.forEach(e => {
    const hasTag = e.roleTags && e.roleTags.length > 0;
    visibleItems[e.id] = !hasTag || (e.roleTags?.includes(targetRole as RoleTag) ?? false);
  });

  resume.projects.forEach(p => {
    const hasTag = p.roleTags && p.roleTags.length > 0;
    visibleItems[p.id] = !hasTag || (p.roleTags?.includes(targetRole as RoleTag) ?? false);
  });

  resume.skills.forEach(s => {
    const hasTag = s.roleTags && s.roleTags.length > 0;
    visibleItems[s.id] = !hasTag || (s.roleTags?.includes(targetRole as RoleTag) ?? false);
  });

  // Default item order = master order
  const sectionItemOrder: Record<string, string[]> = {
    experience: resume.experience.map(e => e.id),
    projects: resume.projects.map(p => p.id),
    skills: resume.skills.map(s => s.id),
  };

  return {
    id: crypto.randomUUID(),
    name,
    targetRole,
    createdAt: new Date().toISOString(),
    visibleItems,
    sectionItemOrder,
  };
}

function VariantItemList({
  title,
  items,
  variant,
  onToggle,
}: {
  title: string;
  items: { id: string; label: string }[];
  variant: ResumeVariant;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const visibleCount = items.filter(i => variant.visibleItems[i.id] !== false).length;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-secondary/40 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-xs font-semibold">{title}</span>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] h-4 px-1.5">
            {visibleCount}/{items.length} visible
          </Badge>
          {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3 pt-1 border-t border-border space-y-1.5">
          {items.length === 0 && (
            <p className="text-xs text-muted-foreground italic py-1">No items yet</p>
          )}
          {items.map(item => {
            const visible = variant.visibleItems[item.id] !== false;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  visible ? 'bg-secondary/40' : 'opacity-40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onToggle(item.id)}
                  className="text-primary flex-shrink-0"
                  title={visible ? 'Hide in variant' : 'Show in variant'}
                >
                  {visible
                    ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                    : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                </button>
                <span className="text-xs text-foreground leading-tight truncate">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function VariantPanel({ resumeData, onSaveVariant, onDeleteVariant, onSetActiveVariant }: VariantPanelProps) {
  const [targetRole, setTargetRole] = useState<string>('SDE');
  const [variantName, setVariantName] = useState('');
  const [draftVariant, setDraftVariant] = useState<ResumeVariant | null>(null);

  const variants = resumeData.variants ?? [];
  const activeVariantId = resumeData.activeVariantId;

  const handleGenerate = () => {
    const name = variantName.trim() || `${targetRole} Variant`;
    const v = generateVariant(resumeData, targetRole, name);
    setDraftVariant(v);
    setVariantName(name);
  };

  const handleToggleItem = (id: string) => {
    if (!draftVariant) return;
    setDraftVariant(prev => prev ? {
      ...prev,
      visibleItems: { ...prev.visibleItems, [id]: !prev.visibleItems[id] },
    } : null);
  };

  const handleSave = () => {
    if (!draftVariant) return;
    onSaveVariant({ ...draftVariant, name: variantName.trim() || draftVariant.name });
    toast.success(`Variant "${draftVariant.name}" saved!`);
    setDraftVariant(null);
    setVariantName('');
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Variant ID copied');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" /> Resume Variants
        </h2>
        <p className="text-sm text-muted-foreground">
          Generate role-specific tailored versions without touching your master resume.
        </p>
      </div>

      {/* Generator */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 space-y-4">
        <p className="text-sm font-semibold text-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Generate a Variant
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Target Role</Label>
            <Select value={targetRole} onValueChange={setTargetRole}>
              <SelectTrigger className="rounded-xl h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Variant Name</Label>
            <Input
              value={variantName}
              onChange={e => setVariantName(e.target.value)}
              placeholder={`${targetRole} Variant`}
              className="rounded-xl h-9 text-xs"
            />
          </div>
        </div>
        <Button onClick={handleGenerate} size="sm" className="w-full rounded-xl gap-2">
          <Sparkles className="w-3.5 h-3.5" /> Generate Variant
        </Button>
      </div>

      {/* Draft variant editor */}
      {draftVariant && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> Adjust "{draftVariant.name}"
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-xl gap-1.5 text-xs h-8"
                onClick={() => setDraftVariant(null)}>
                Discard
              </Button>
              <Button size="sm" className="rounded-xl gap-1.5 text-xs h-8" onClick={handleSave}>
                <Save className="w-3.5 h-3.5" /> Save
              </Button>
            </div>
          </div>

          <VariantItemList
            title="Experience"
            items={resumeData.experience.map(e => ({ id: e.id, label: `${e.position} @ ${e.company || '—'}` }))}
            variant={draftVariant}
            onToggle={handleToggleItem}
          />
          <VariantItemList
            title="Projects"
            items={resumeData.projects.map(p => ({ id: p.id, label: p.name || 'Unnamed project' }))}
            variant={draftVariant}
            onToggle={handleToggleItem}
          />
          <VariantItemList
            title="Skills"
            items={resumeData.skills.map(s => ({ id: s.id, label: s.name || 'Unnamed skill' }))}
            variant={draftVariant}
            onToggle={handleToggleItem}
          />
        </div>
      )}

      {/* Saved variants */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Saved Variants</p>
          {variants.map(v => (
            <div
              key={v.id}
              className={`bg-card border rounded-2xl p-4 transition-all ${
                activeVariantId === v.id ? 'border-primary shadow-sm' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{v.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Target: <span className="text-primary font-medium">{v.targetRole}</span> ·{' '}
                    {Object.values(v.visibleItems).filter(Boolean).length} items visible
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Created {new Date(v.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    variant="ghost" size="icon"
                    className="w-7 h-7 text-muted-foreground hover:text-foreground"
                    title="Copy variant ID"
                    onClick={() => handleCopyId(v.id)}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="w-7 h-7 text-destructive hover:bg-destructive/10"
                    onClick={() => { onDeleteVariant(v.id); if (activeVariantId === v.id) onSetActiveVariant(null); }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {activeVariantId === v.id ? (
                  <Button size="sm" variant="outline" className="rounded-xl h-7 text-xs gap-1.5"
                    onClick={() => onSetActiveVariant(null)}>
                    Back to Master
                  </Button>
                ) : (
                  <Button size="sm" className="rounded-xl h-7 text-xs gap-1.5"
                    onClick={() => onSetActiveVariant(v.id)}>
                    <Eye className="w-3 h-3" /> Preview Variant
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {variants.length === 0 && !draftVariant && (
        <div className="text-center py-8 text-muted-foreground">
          <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No variants yet.</p>
          <p className="text-xs mt-1">First, tag your experience/project/skill entries with role labels, then generate a variant above.</p>
        </div>
      )}
    </div>
  );
}

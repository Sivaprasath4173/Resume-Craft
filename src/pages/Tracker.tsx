import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useTracker } from '@/hooks/useTracker';
import { useResume } from '@/hooks/ResumeContext';
import { useNavigate } from 'react-router-dom';
import { ApplicationCard, KanbanColumn, KANBAN_COLUMNS } from '@/types/tracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  ArrowLeft, Plus, Trash2, ExternalLink, Calendar,
  Briefcase, FileText, Loader2, LayoutGrid
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

// ── Card Form ──────────────────────────────────────────────────────────────

const EMPTY_CARD = {
  company: '',
  role: '',
  column: 'applied' as KanbanColumn,
  dateApplied: new Date().toISOString().split('T')[0],
  notes: '',
  jobUrl: '',
  salary: '',
  resumeVariantId: '',
  resumeVariantName: '',
};

function CardForm({
  initial,
  variants,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<ApplicationCard>;
  variants: { id: string; name: string }[];
  onSubmit: (data: typeof EMPTY_CARD) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_CARD, ...initial });

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">Company *</Label>
          <Input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Google" className="rounded-xl" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Role *</Label>
          <Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="Software Engineer" className="rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">Stage</Label>
          <Select value={form.column} onValueChange={v => set('column', v)}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {KANBAN_COLUMNS.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Date Applied</Label>
          <Input type="date" value={form.dateApplied} onChange={e => set('dateApplied', e.target.value)} className="rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">Job URL</Label>
          <Input value={form.jobUrl} onChange={e => set('jobUrl', e.target.value)} placeholder="https://..." className="rounded-xl" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Salary / Range</Label>
          <Input value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="$120k–$150k" className="rounded-xl" />
        </div>
      </div>
      {variants.length > 0 && (
        <div>
          <Label className="text-xs mb-1.5 block">Resume Variant Used</Label>
          <Select
            value={form.resumeVariantId || 'none'}
            onValueChange={v => {
              const variant = variants.find(x => x.id === v);
              set('resumeVariantId', v === 'none' ? '' : v);
              set('resumeVariantName', variant?.name ?? '');
            }}
          >
            <SelectTrigger className="rounded-xl"><SelectValue placeholder="Master Resume" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Master Resume</SelectItem>
              {variants.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Label className="text-xs mb-1.5 block">Notes</Label>
        <Textarea
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Recruiter contact, next steps, interview prep notes…"
          rows={3}
          className="rounded-xl resize-none text-xs"
        />
      </div>
      <DialogFooter className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} className="rounded-xl">Cancel</Button>
        <Button
          onClick={() => {
            if (!form.company || !form.role) { toast.error('Company and role are required'); return; }
            onSubmit(form);
          }}
          className="rounded-xl"
        >
          Save Application
        </Button>
      </DialogFooter>
    </div>
  );
}

// ── Kanban Card ────────────────────────────────────────────────────────────

function KanbanCard({
  card,
  index,
  onEdit,
  onDelete,
}: {
  card: ApplicationCard;
  index: number;
  onEdit: (card: ApplicationCard) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white border rounded-2xl p-3.5 mb-2.5 cursor-grab active:cursor-grabbing transition-all select-none ${
            snapshot.isDragging
              ? 'shadow-2xl ring-2 ring-primary/20 rotate-1 scale-[1.02]'
              : 'border-border shadow-sm hover:shadow-md hover:border-primary/20'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{card.company}</p>
              <p className="text-xs text-muted-foreground truncate">{card.role}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={e => { e.stopPropagation(); onEdit(card); }}
                className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); onDelete(card.id); }}
                className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-2.5 space-y-1.5">
            {card.dateApplied && (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {card.dateApplied}
              </div>
            )}
            {card.resumeVariantName && (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <FileText className="w-3 h-3" />
                {card.resumeVariantName}
              </div>
            )}
            {card.salary && (
              <Badge variant="outline" className="text-[10px] h-4 px-1.5">{card.salary}</Badge>
            )}
            {card.jobUrl && (
              <a
                href={card.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-[10px] text-primary hover:underline"
              >
                <ExternalLink className="w-2.5 h-2.5" /> View Posting
              </a>
            )}
            {card.notes && (
              <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 mt-1 border-t border-border pt-1">
                {card.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

// ── Column ─────────────────────────────────────────────────────────────────

function KanbanColumnView({
  col,
  cards,
  onAdd,
  onEdit,
  onDelete,
}: {
  col: typeof KANBAN_COLUMNS[0];
  cards: ApplicationCard[];
  onAdd: () => void;
  onEdit: (card: ApplicationCard) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={`flex-1 min-w-[220px] max-w-[300px] border rounded-2xl flex flex-col ${col.bgColor}`}>
      <div className="px-4 py-3 border-b border-inherit">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${col.color}`}>{col.label}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/70 ${col.color}`}>
              {cards.length}
            </span>
          </div>
          <button
            onClick={onAdd}
            className={`w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/80 transition-colors ${col.color}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 min-h-[200px] transition-colors rounded-b-2xl ${
              snapshot.isDraggingOver ? 'bg-white/50' : ''
            }`}
          >
            {cards.map((card, i) => (
              <KanbanCard key={card.id} card={card} index={i} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {provided.placeholder}
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <p className={`text-xs text-center py-8 ${col.color} opacity-40 italic`}>No applications yet</p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function Tracker() {
  const navigate = useNavigate();
  const { cards, loading, addCard, updateCard, removeCard, moveCard } = useTracker();
  const { resumeData } = useResume();
  const variants = resumeData.variants ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ApplicationCard | null>(null);
  const [defaultColumn, setDefaultColumn] = useState<KanbanColumn>('applied');

  const openAdd = (col: KanbanColumn = 'applied') => {
    setEditingCard(null);
    setDefaultColumn(col);
    setDialogOpen(true);
  };

  const openEdit = (card: ApplicationCard) => {
    setEditingCard(card);
    setDialogOpen(true);
  };

  const handleSubmit = async (form: typeof EMPTY_CARD) => {
    try {
      if (editingCard) {
        await updateCard(editingCard.id, form);
        toast.success('Application updated');
      } else {
        await addCard(form);
        toast.success('Application added!');
      }
      setDialogOpen(false);
      setEditingCard(null);
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    await removeCard(id);
    toast.success('Application removed');
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    await moveCard(draggableId, destination.droppableId as KanbanColumn);
  };

  const cardsByColumn = (col: KanbanColumn) =>
    cards.filter(c => c.column === col);

  const totalCards = cards.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/builder')} className="gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Builder
          </Button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm hidden sm:block">Application Tracker</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {totalCards} application{totalCards !== 1 ? 's' : ''} tracked
          </span>
          <Button size="sm" onClick={() => openAdd()} className="gap-2 rounded-xl h-8 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add Application
          </Button>
        </div>
      </header>

      {/* Board */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto">
          <div className="p-6">
            {/* Stats row */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {KANBAN_COLUMNS.map(col => (
                <div key={col.id} className={`px-4 py-2.5 rounded-xl border flex items-center gap-2.5 ${col.bgColor}`}>
                  <span className={`text-lg font-black ${col.color}`}>{cardsByColumn(col.id).length}</span>
                  <span className={`text-xs font-medium ${col.color}`}>{col.label}</span>
                </div>
              ))}
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-4 items-start min-w-max">
                {KANBAN_COLUMNS.map(col => (
                  <KanbanColumnView
                    key={col.id}
                    col={col}
                    cards={cardsByColumn(col.id)}
                    onAdd={() => openAdd(col.id)}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              {editingCard ? 'Edit Application' : 'Track New Application'}
            </DialogTitle>
          </DialogHeader>
          <CardForm
            initial={editingCard ?? { column: defaultColumn }}
            variants={variants}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export type KanbanColumn = 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';

export interface ApplicationCard {
  id: string;
  company: string;
  role: string;
  column: KanbanColumn;
  dateApplied: string;
  notes: string;
  resumeVariantId?: string;
  resumeVariantName?: string;
  jobUrl?: string;
  salary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackerData {
  cards: ApplicationCard[];
}

export const KANBAN_COLUMNS: { id: KanbanColumn; label: string; color: string; bgColor: string }[] = [
  { id: 'applied',    label: 'Applied',       color: 'text-blue-600',   bgColor: 'bg-blue-50 border-blue-200' },
  { id: 'screening',  label: 'OA / Screening', color: 'text-amber-600',  bgColor: 'bg-amber-50 border-amber-200' },
  { id: 'interview',  label: 'Interview',      color: 'text-violet-600', bgColor: 'bg-violet-50 border-violet-200' },
  { id: 'offer',      label: 'Offer',          color: 'text-emerald-600',bgColor: 'bg-emerald-50 border-emerald-200' },
  { id: 'rejected',   label: 'Rejected',       color: 'text-rose-500',   bgColor: 'bg-rose-50 border-rose-200' },
];

import { cn, STATUS_COLORS } from '@/lib/utils';

const DOT_COLORS: Record<string, string> = {
  DRAFT:          'bg-graphite-400',
  PENDING:        'bg-yellow-400',
  VERIFIED:       'bg-emerald-400',
  UNDER_CONTRACT: 'bg-blue-400',
  REJECTED:       'bg-red-400',
};

interface BadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: BadgeProps) {
  return (
    <span className={cn('badge-status', STATUS_COLORS[status] ?? 'bg-muted text-muted-foreground', className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', DOT_COLORS[status] ?? 'bg-muted-foreground')} />
      {status.replace('_', ' ')}
    </span>
  );
}

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span className={cn('badge-status bg-gold-500/10 text-gold-400 border border-gold-500/20', className)}>
      {category}
    </span>
  );
}

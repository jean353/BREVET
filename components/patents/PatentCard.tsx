import Link from 'next/link';
import Image from 'next/image';
import { Eye, MapPin, Calendar } from 'lucide-react';
import { StatusBadge, CategoryBadge } from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';

interface PatentCardProps {
  patent: {
    id:          string;
    title:       string;
    description: string;
    category:    string;
    status:      string;
    price:       number;
    currency:    string;
    country:     string;
    imageUrl:    string | null;
    views:       number;
    createdAt:   string | Date;
    inventor:    { name: string | null; country: string | null };
  };
  showStatus?: boolean;
}

export function PatentCard({ patent, showStatus = false }: PatentCardProps) {
  return (
    <div className="patent-card group flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-graphite-800 to-midnight-800 overflow-hidden">
        {patent.imageUrl ? (
          <Image src={patent.imageUrl} alt={patent.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-10">⚗️</div>
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <CategoryBadge category={patent.category} />
          {showStatus && <StatusBadge status={patent.status} />}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-muted-foreground bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
          <Eye className="w-3 h-3" />
          {patent.views}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-gold-400 transition-colors">
            {patent.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{patent.description}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{patent.country}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(patent.createdAt)}</span>
        </div>

        <div className="divider-gold" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Listed at</p>
            <p className="text-gold-gradient font-bold text-lg">{formatPrice(patent.price, patent.currency)}</p>
          </div>
          <Link
            href={`/patents/${patent.id}`}
            className="btn-gold text-xs px-4 py-2"
            id={`view-patent-${patent.id}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

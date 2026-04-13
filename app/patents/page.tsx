import type { Metadata } from 'next';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { PatentCard } from '@/components/patents/PatentCard';
import { PatentListSkeleton } from '@/components/ui/Skeleton';
import { MarketplaceFilters } from '@/components/patents/MarketplaceFilters';
import { Search, SlidersHorizontal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Patent Marketplace',
  description: 'Browse thousands of verified patents available for sale or licensing across all technology sectors.',
};

interface SearchParams {
  page?:     string;
  category?: string;
  search?:   string;
  minPrice?: string;
  maxPrice?: string;
  sort?:     string;
}

async function PatentGrid({ searchParams }: { searchParams: SearchParams }) {
  const page     = parseInt(searchParams.page     ?? '1');
  const limit    = 12;
  const category = searchParams.category ?? undefined;
  const search   = searchParams.search   ?? '';
  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;
  const sort     = searchParams.sort ?? 'newest';

  const orderBy =
    sort === 'price_asc'  ? { price: 'asc'  as const } :
    sort === 'price_desc' ? { price: 'desc' as const } :
    sort === 'views'      ? { views: 'desc' as const } :
                            { createdAt: 'desc' as const };

  const where: any = {
    status: 'VERIFIED',
    ...(category && { category }),
    ...(search   && { OR: [
      { title:       { contains: search } },
      { description: { contains: search } },
    ]}),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  };

  const [patentsRaw, total] = await Promise.all([
    prisma.patent.findMany({
      where, skip: (page - 1) * limit, take: limit, orderBy,
      include: { inventor: { select: { name: true, country: true, image: true } } },
    }),
    prisma.patent.count({ where }),
  ]);

  const patents = patentsRaw.map((p: any) => ({
    ...p,
    tags: p.tags ? JSON.parse(p.tags) : [],
    documents: p.documents ? JSON.parse(p.documents) : [],
  }));

  const pages = Math.ceil(total / limit);

  if (patents.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No patents found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Showing <span className="text-foreground font-medium">{(page - 1) * limit + 1}–{Math.min(page * limit, total)}</span> of <span className="text-foreground font-medium">{total}</span> patents
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {patents.map((p: any) => (
          <PatentCard key={p.id} patent={p} />
        ))}
      </div>
      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <a
              key={n}
              href={`?page=${n}&category=${category ?? ''}&search=${search}&sort=${sort}`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                n === page ? 'bg-gold-500 text-midnight-900' : 'glass hover:border-gold-500/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              {n}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PatentsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-display">
          Patent <span className="text-gold-gradient">Marketplace</span>
        </h1>
        <p className="text-muted-foreground">Discover and acquire verified intellectual property from global innovators.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <Suspense fallback={<div className="p-5 glass rounded-2xl">Loading filters...</div>}>
            <MarketplaceFilters />
          </Suspense>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<PatentListSkeleton count={12} />}>
            <PatentGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PATENT_CATEGORIES } from '@/lib/utils';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'views',      label: 'Most Viewed' },
];

export function MarketplaceFilters() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search,   setSearch]   = useState(searchParams.get('search')   ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [sort,     setSort]     = useState(searchParams.get('sort')     ?? 'newest');

  const apply = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams({
      ...(search   && { search }),
      ...(category && { category }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      sort,
      page: '1',
      ...overrides,
    });
    startTransition(() => router.push(`/patents?${params.toString()}`));
  };

  const clear = () => {
    setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setSort('newest');
    startTransition(() => router.push('/patents'));
  };

  return (
    <div className="glass rounded-2xl p-5 space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-gold-400" /> Filters
        </div>
        <button onClick={clear} className="text-xs text-muted-foreground hover:text-gold-400 flex items-center gap-1 transition-colors">
          <X className="w-3 h-3" /> Clear all
        </button>
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="filter-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && apply({ search })}
            className="input-dark pl-9 text-sm"
            placeholder="Keywords…"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          {['', ...PATENT_CATEGORIES].map((cat) => (
            <button
              key={cat || 'ALL'}
              id={`cat-${cat || 'all'}`}
              onClick={() => { setCategory(cat); apply({ category: cat }); }}
              className={cn(
                'w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors',
                category === cat ? 'bg-gold-500/15 text-gold-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              {cat || 'All Categories'}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price Range (USD)</label>
        <div className="flex gap-2">
          <input id="filter-min-price" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="input-dark text-sm" placeholder="Min" type="number" min="0" />
          <input id="filter-max-price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-dark text-sm" placeholder="Max" type="number" min="0" />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sort By</label>
        <select
          id="filter-sort"
          value={sort}
          onChange={e => { setSort(e.target.value); apply({ sort: e.target.value }); }}
          className="input-dark text-sm"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <button
        id="filter-apply"
        onClick={() => apply()}
        disabled={isPending}
        className="btn-gold w-full text-sm py-2.5"
      >
        {isPending ? 'Applying…' : 'Apply Filters'}
      </button>
    </div>
  );
}

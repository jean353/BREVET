import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { StatusBadge, CategoryBadge } from '@/components/ui/Badge';
import { ContactInventorButton } from '@/components/patents/ContactInventorButton';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  MapPin, Calendar, Eye, FileText, Tag,
  User, Building2, Globe, Award,
} from 'lucide-react';

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const patent = await prisma.patent.findUnique({
    where:   { id: params.id },
    select:  { title: true, description: true },
  });
  if (!patent) return { title: 'Patent Not Found' };
  return {
    title:       patent.title,
    description: patent.description.slice(0, 160),
  };
}

export default async function PatentDetailPage({ params }: Props) {
  const patentRaw = await prisma.patent.findUnique({
    where:   { id: params.id },
    include: {
      inventor: {
        select: { id: true, name: true, email: true, company: true, country: true, image: true, createdAt: true },
      },
    },
  });

  if (!patentRaw) notFound();

  const patent = {
    ...patentRaw,
    tags: patentRaw.tags ? JSON.parse(patentRaw.tags) : [],
    documents: patentRaw.documents ? JSON.parse(patentRaw.documents) : [],
  };

  // Increment views
  await prisma.patent.update({ where: { id: params.id }, data: { views: { increment: 1 } } });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 min-w-0 space-y-8 animate-fade-in">

          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/patents" className="hover:text-gold-400 transition-colors">Marketplace</Link>
            <span>/</span>
            <span className="text-foreground truncate">{patent.title}</span>
          </nav>

          {/* Hero image */}
          <div className="relative h-72 sm:h-96 glass rounded-2xl overflow-hidden">
            {patent.imageUrl ? (
              <Image src={patent.imageUrl} alt={patent.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-graphite-800 to-midnight-800">
                <span className="text-8xl opacity-10">⚗️</span>
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <CategoryBadge category={patent.category} />
              <StatusBadge status={patent.status} />
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-sm text-muted-foreground bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Eye className="w-4 h-4" /> {patent.views + 1} views
            </div>
          </div>

          {/* Title & meta */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-display mb-4">{patent.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gold-400" />{patent.country}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gold-400" />{formatDate(patent.createdAt)}</span>
              {patent.patentNumber && (
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-gold-400" />#{patent.patentNumber}</span>
              )}
            </div>
          </div>

          {/* Tags */}
          {patent.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {patent.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full glass border border-white/10 text-muted-foreground">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          )}

          <div className="divider-gold" />

          {/* Description */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold-400" /> Description
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{patent.description}</p>
          </section>

          {/* Technical Details */}
          {patent.techDetails && (
            <section className="glass rounded-xl p-6 space-y-3">
              <h2 className="text-lg font-semibold">Technical Specifications</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{patent.techDetails}</p>
            </section>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6 animate-fade-in delay-100">

          {/* Price card */}
          <div className="glass rounded-2xl p-6 border-gold-glow space-y-5">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Asking Price</p>
              <p className="text-4xl font-bold text-gold-gradient">{formatPrice(patent.price, patent.currency)}</p>
              {patent.licenseType && (
                <p className="text-sm text-muted-foreground mt-1">
                  Available for: <span className="text-foreground font-medium">{patent.licenseType}</span>
                </p>
              )}
            </div>
            <div className="divider-gold" />
            <ContactInventorButton
              inventorId={patent.inventor.id}
              patentId={patent.id}
              patentTitle={patent.title}
            />
          </div>

          {/* Inventor card */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <User className="w-4 h-4 text-gold-400" /> Inventor
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-lg font-bold">
                {patent.inventor.name?.[0]?.toUpperCase() ?? 'I'}
              </div>
              <div>
                <p className="font-semibold">{patent.inventor.name}</p>
                {patent.inventor.company && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building2 className="w-3 h-3" />{patent.inventor.company}
                  </p>
                )}
                {patent.inventor.country && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Globe className="w-3 h-3" />{patent.inventor.country}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Member since {formatDate(patent.inventor.createdAt)}
            </p>
          </div>

          {/* Filing info */}
          <div className="glass rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Details</h3>
            {[
              { label: 'Category',     value: patent.category },
              { label: 'Status',       value: patent.status },
              { label: 'Filing Date',  value: patent.filingDate ? formatDate(patent.filingDate) : '—' },
              { label: 'Patent #',     value: patent.patentNumber ?? '—' },
              { label: 'License Type', value: patent.licenseType ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-right max-w-[55%]">{value}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

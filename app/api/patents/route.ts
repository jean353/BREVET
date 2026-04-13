import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page     = parseInt(searchParams.get('page')     ?? '1');
  const limit    = parseInt(searchParams.get('limit')    ?? '12');
  const category = searchParams.get('category') ?? undefined;
  const statusParam = searchParams.get('status');
  const search   = searchParams.get('search')   ?? '';
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
  const inventorOnly = searchParams.get('inventorOnly') === 'true';

  const session = inventorOnly ? await getServerSession(authOptions) : null;

  const where: any = {
    // If status param is empty string, don't filter by status (inventor dashboard shows all)
    ...(statusParam !== '' && statusParam !== null ? { status: statusParam } : statusParam === null ? { status: 'VERIFIED' } : {}),
    ...(category && { category }),
    ...(search   && { OR: [
      { title:       { contains: search } },
      { description: { contains: search } },
    ]}),
    ...(minPrice !== undefined || maxPrice !== undefined ? {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    } : {}),
    ...(inventorOnly && session ? { inventorId: (session.user as any).id } : {}),
  };

  const [patents, total] = await Promise.all([
    prisma.patent.findMany({
      where,
      skip:    (page - 1) * limit,
      take:    limit,
      orderBy: { createdAt: 'desc' },
      include: { inventor: { select: { name: true, country: true, image: true } } },
    }),
    prisma.patent.count({ where }),
  ]);

  // Parse JSON tags for each patent
  const parsedPatents = patents.map((p: any) => ({
    ...p,
    tags: p.tags ? JSON.parse(p.tags) : [],
    documents: p.documents ? JSON.parse(p.documents) : [],
  }));

  return NextResponse.json({ patents: parsedPatents, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'INVENTOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  // Serialize arrays to JSON strings for MySQL storage
  const data = {
    ...body,
    tags:       Array.isArray(body.tags) ? JSON.stringify(body.tags) : body.tags ?? null,
    documents:  Array.isArray(body.documents) ? JSON.stringify(body.documents) : body.documents ?? null,
    inventorId: (session.user as any).id,
    status:     'DRAFT',
  };

  const patent = await prisma.patent.create({ data });
  return NextResponse.json(patent, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const patents = await prisma.patent.findMany({
    orderBy: { createdAt: 'desc' },
    include: { inventor: { select: { email: true, name: true } } },
  });
  return NextResponse.json(patents);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const patent = await prisma.patent.update({
    where: { id: body.id },
    data: { status: body.status, title: body.title, price: body.price ? parseFloat(body.price) : undefined },
  });

  await prisma.activityLog.create({
    data: { userId: (session.user as any).id, action: 'MODIFIED_PATENT', details: `Updated patent ${patent.title} status to ${patent.status}` }
  });

  return NextResponse.json(patent);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const patent = await prisma.patent.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { userId: (session.user as any).id, action: 'DELETED_PATENT', details: `Deleted patent ${patent.title}` }
  });

  return NextResponse.json({ success: true });
}

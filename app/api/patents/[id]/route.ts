import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const patent = await prisma.patent.findUnique({
    where:   { id: params.id },
    include: { inventor: { select: { id: true, name: true, email: true, company: true, country: true, image: true, createdAt: true } } },
  });
  if (!patent) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // increment views
  await prisma.patent.update({ where: { id: params.id }, data: { views: { increment: 1 } } });
  return NextResponse.json(patent);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as any;
  const patent = await prisma.patent.findUnique({ where: { id: params.id } });
  if (!patent) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const isOwner = patent.inventorId === user.id;
  const isAdmin = user.role === 'ADMIN';
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const updated = await prisma.patent.update({ where: { id: params.id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as any;
  const patent = await prisma.patent.findUnique({ where: { id: params.id } });
  if (!patent) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (patent.inventorId !== user.id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.patent.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

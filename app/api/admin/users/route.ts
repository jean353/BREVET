import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, company: true, country: true, createdAt: true },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const hashedPassword = await bcrypt.hash(body.password || 'TempPassword123!', 10);
  
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role || 'BUYER',
    },
  });

  await prisma.activityLog.create({
    data: { userId: (session.user as any).id, action: 'CREATED_USER', details: `Created user ${user.email} with role ${user.role}` }
  });

  return NextResponse.json(user, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const user = await prisma.user.update({
    where: { id: body.id },
    data: { role: body.role, name: body.name },
  });

  await prisma.activityLog.create({
    data: { userId: (session.user as any).id, action: 'MODIFIED_USER', details: `Updated user ${user.email} to role ${user.role}` }
  });

  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const user = await prisma.user.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { userId: (session.user as any).id, action: 'DELETED_USER', details: `Deleted user ${user.email}` }
  });

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { url, type, size } = await req.json();
    if (!url || !type || !size) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const file = await prisma.file.create({
        data: {
            userId: user.id,
            url,
            type,
            size,
        },
    });
    return NextResponse.json(file);
} 
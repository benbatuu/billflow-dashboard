import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { brand, last4, expMonth, expYear, token: cardToken } = await req.json();
    if (!brand || !last4 || !expMonth || !expYear || !cardToken) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const card = await prisma.card.create({
        data: {
            userId: user.id,
            brand,
            last4,
            expMonth,
            expYear,
            token: cardToken,
        },
    });
    return NextResponse.json(card);
} 
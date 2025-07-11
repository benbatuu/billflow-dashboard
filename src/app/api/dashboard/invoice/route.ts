import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { customerId, amount, currency, dueDate } = await req.json();
    if (!customerId || !amount || !currency || !dueDate) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const invoice = await prisma.invoice.create({
        data: {
            userId: user.id,
            customerId,
            amount,
            currency,
            dueDate: new Date(dueDate),
            status: 'unpaid',
        },
    });
    return NextResponse.json(invoice);
} 
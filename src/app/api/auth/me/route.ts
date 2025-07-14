import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
    // Kullanıcıyı request'ten bul (JWT veya session cookie ile)
    const user = await getUserFromRequest(req);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Role her zaman string olarak dön
    let roleName = null;
    if (user.role) {
        if (typeof user.role === 'string') {
            roleName = user.role;
        } else if (typeof user.role === 'object' && user.role.name) {
            roleName = user.role.name;
        }
    }

    return NextResponse.json({
        id: user.id,
        email: user.email,
        role: roleName,
        name: user.name,
        companyId: user.companyId || null,
    });
} 
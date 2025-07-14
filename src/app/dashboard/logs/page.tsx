import { getUserFromRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<any>[] = [
    { accessorKey: 'date', header: 'Tarih' },
    { accessorKey: 'user', header: 'Kullanıcı' },
    { accessorKey: 'action', header: 'Aksiyon' },
    { accessorKey: 'detail', header: 'Detay' },
];

const data = [
    { date: '2024-07-15 10:12', user: 'Super Admin', action: 'Login', detail: 'Sisteme giriş yaptı.' },
    { date: '2024-07-15 10:15', user: 'Admin User', action: 'Fatura Oluşturma', detail: 'Yeni fatura oluşturdu.' },
    { date: '2024-07-15 10:20', user: 'Owner User', action: 'Kullanıcı Ekleme', detail: 'Yeni kullanıcı davet etti.' },
    { date: '2024-07-15 10:25', user: 'Staff User', action: 'Çıkış', detail: 'Sistemden çıkış yaptı.' },
];

export default async function LogsPage() {
    const user = await getUserFromRequest(cookies());
    if (!user || !user.role || user.role.name !== 'superadmin') {
        redirect('/dashboard/not-authorized');
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Logs</h1>
            <p className="text-muted-foreground mb-6">System logs and audit trails will be shown here.</p>
            <DataTable data={data} columns={columns} />
        </div>
    );
} 
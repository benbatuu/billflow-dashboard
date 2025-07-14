import { getUserFromRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<any>[] = [
    { accessorKey: 'name', header: 'Plan Adı' },
    { accessorKey: 'users', header: 'Kullanıcı Limiti' },
    { accessorKey: 'customers', header: 'Müşteri Limiti' },
    { accessorKey: 'price', header: 'Aylık Ücret' },
];

const data = [
    { name: 'Free', users: 1, customers: 5, price: '₺0' },
    { name: 'Starter', users: 3, customers: 50, price: '₺99' },
    { name: 'Pro', users: 10, customers: 'Sınırsız', price: '₺299' },
    { name: 'Business', users: 25, customers: 'Sınırsız', price: '₺799' },
];

export default async function PlansPage() {
    const user = await getUserFromRequest(cookies());
    if (!user || !user.role || user.role.name !== 'superadmin') {
        redirect('/dashboard/not-authorized');
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Plans</h1>
            <p className="text-muted-foreground mb-6">Manage all subscription plans here.</p>
            <DataTable data={data} columns={columns} />
        </div>
    );
} 
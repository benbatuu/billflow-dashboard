import { getUserFromRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { InvoicesTable } from '@/components/InvoicesTable';
import rawData from '@/app/dashboard/data.json';

function getArray(data: any): any[] {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.default)) return data.default;
    return [];
}

const arr = getArray(rawData);
const data = arr.map((item: any, i: number) => ({
    number: item.id,
    customer: item.reviewer,
    amount: item.target,
    status: item.status,
    group: item.type,
    date: new Date(2024, 0, 1 + i).toISOString().slice(0, 10),
}));

export default async function InvoicesPage() {
    const user = await getUserFromRequest(cookies());
    if (!user || !user.role || !['admin', 'owner', 'accountant'].includes(user.role.name)) {
        redirect('/dashboard/not-authorized');
    }
    return (
        <div className="w-full mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Invoices (Demo)</h1>
            <InvoicesTable data={data} />
        </div>
    );
} 
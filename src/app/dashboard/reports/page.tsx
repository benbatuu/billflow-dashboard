import { getUserFromRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function ReportsPage() {
  const user = await getUserFromRequest(cookies());
  if (!user || !user.role || !['admin', 'owner', 'accountant'].includes(user.role.name)) {
    redirect('/dashboard/not-authorized');
  }
  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Raporlar (Demo)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded shadow">
          <div className="font-medium">Toplam Gelir</div>
          <div className="text-2xl font-bold">₺12.500</div>
        </div>
        <div className="p-4 bg-card rounded shadow">
          <div className="font-medium">Toplam Fatura</div>
          <div className="text-2xl font-bold">32</div>
        </div>
        <div className="p-4 bg-card rounded shadow">
          <div className="font-medium">Aktif Abonelik</div>
          <div className="text-2xl font-bold">7</div>
        </div>
      </div>
    </div>
  )
} 
import { getUserFromRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function SubscriptionsPage() {
  const user = await getUserFromRequest(cookies());
  if (!user || !user.role || !['admin', 'owner'].includes(user.role.name)) {
    redirect('/dashboard/not-authorized');
  }
  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Abonelikler (Demo)</h1>
      <ul className="space-y-2">
        <li className="p-4 bg-card rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-medium">Acme Corp - Pro Plan</span>
          <span className="text-muted-foreground">Aktif</span>
        </li>
        <li className="p-4 bg-card rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-medium">Beta Ltd - Starter Plan</span>
          <span className="text-muted-foreground">İptal Edildi</span>
        </li>
      </ul>
    </div>
  )
} 
import { getUserFromRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<any>[] = [
  { accessorKey: 'setting', header: 'Ayar' },
  { accessorKey: 'value', header: 'Değer' },
  { accessorKey: 'description', header: 'Açıklama' },
];

const data = [
  { setting: 'Platform Adı', value: 'Billflow', description: 'Sistemin genel adı.' },
  { setting: 'Destek E-posta', value: 'support@billflow.com', description: 'Destek için iletişim adresi.' },
  { setting: 'Fatura PDF', value: 'Aktif', description: 'Faturalar PDF olarak indirilebilir.' },
  { setting: 'Otomatik Yedekleme', value: 'Günlük', description: 'Veritabanı yedekleme sıklığı.' },
  { setting: 'Bildirimler', value: 'Açık', description: 'Sistem bildirimleri aktif.' },
];

export default async function SystemSettingsPage() {
  const user = await getUserFromRequest(cookies());
  if (!user || !user.role || user.role.name !== 'superadmin') {
    redirect('/dashboard/not-authorized');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">System Settings</h1>
      <p className="text-muted-foreground mb-6">Global platform settings will be managed here.</p>
      <DataTable data={data} columns={columns} />
    </div>
  );
} 
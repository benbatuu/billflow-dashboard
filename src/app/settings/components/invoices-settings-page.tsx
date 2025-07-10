"use client"

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { t } from '@/lib/i18n';
import { IconFileText } from "@tabler/icons-react";

export default function InvoicesSettingsPage() {
    const [autoRenew, setAutoRenew] = useState(true);
    const [taxExempt, setTaxExempt] = useState(false);
    const [translations, setTranslations] = useState<any>({});
    useEffect(() => {
        async function loadTranslations() {
            const keys = [
                'settings.invoices.title',
                'settings.invoices.template',
                'settings.company.name',
                'settings.company.taxNo',
                'settings.company.address',
                'settings.company.email',
                'settings.company.save',
                'settings.billing.paymentMethod',
                'settings.billing.title',
                'settings.integrations.stripeKey',
                'settings.integrations.iyzicoKey',
                'settings.integrations.webhook',
                'settings.integrations.save',
            ];
            const obj: any = {};
            for (const key of keys) {
                obj[key] = await t(key);
            }
            setTranslations(obj);
        }
        loadTranslations();
    }, []);
    // Mock data
    const invoiceHistory = [
        { id: 1, date: "2024-06-01", amount: "$99", status: "Paid", pdf: "/invoices/invoice-20240601.pdf" },
        { id: 2, date: "2024-05-01", amount: "$99", status: "Paid", pdf: "/invoices/invoice-20240501.pdf" },
        { id: 3, date: "2024-04-01", amount: "$99", status: "Pending", pdf: "/invoices/invoice-20240401.pdf" },
    ];
    if (!translations['settings.invoices.title']) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex flex-col gap-6">
            {/* Fatura Bilgileri */}
            <Card>
                <CardHeader>
                    <CardTitle>{translations['settings.invoices.title'] || ''}</CardTitle>
                    <CardDescription>{translations['settings.invoices.template'] || 'Fatura şablonları ve ayarlarını burada yönetebilirsiniz.'}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>{translations['settings.company.name'] || ''}</Label>
                        <Input placeholder={translations['settings.company.name'] || ''} />
                    </div>
                    <div>
                        <Label>{translations['settings.company.taxNo'] || ''}</Label>
                        <Input placeholder={translations['settings.company.taxNo'] || ''} />
                    </div>
                    <div className="md:col-span-2">
                        <Label>{translations['settings.company.address'] || ''}</Label>
                        <Input placeholder={translations['settings.company.address'] || ''} />
                    </div>
                    <div className="md:col-span-2">
                        <Label>{translations['settings.company.email'] || ''}</Label>
                        <Input placeholder={translations['settings.company.email'] || ''} />
                    </div>
                </CardContent>
                <CardFooter className="justify-end">
                    <Button variant="outline">{translations['settings.company.save'] || ''}</Button>
                </CardFooter>
            </Card>

            {/* Ödeme Yöntemleri */}
            <Card>
                <CardHeader>
                    <CardTitle>{translations['settings.billing.paymentMethod'] || ''}</CardTitle>
                    <CardDescription>{(translations['settings.billing.paymentMethod'] || '') + ' - ' + (translations['settings.billing.title'] || '')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div>
                        <Label>Kredi Kartları</Label>
                        <Input placeholder="**** **** **** 4242" />
                    </div>
                    <div>
                        <Label>Banka Hesapları</Label>
                        <Input placeholder="TR00 0000 0000 0000 0000 0000 00" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={true} />
                        <Label>Otomatik Ödeme Talimatı</Label>
                    </div>
                </CardContent>
            </Card>

            {/* Fatura Geçmişi */}
            <Card>
                <CardHeader>
                    <CardTitle>Fatura Geçmişi</CardTitle>
                    <CardDescription>Önceki faturalarınızın arşivi</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-muted text-foreground">
                                    <th className="px-4 py-2 text-left">Tarih</th>
                                    <th className="px-4 py-2 text-left">Tutar</th>
                                    <th className="px-4 py-2 text-left">Durum</th>
                                    <th className="px-4 py-2 text-left">PDF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceHistory.map(row => (
                                    <tr key={row.id} className="border-b last:border-0">
                                        <td className="px-4 py-2 whitespace-nowrap">{row.date}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{row.amount}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{row.status}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {row.pdf ? <a href={row.pdf} target="_blank" rel="noopener noreferrer"><IconFileText className="w-6 h-6 hover:scale-110 transition" /></a> : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Abonelik & Plan Bilgisi */}
            <Card>
                <CardHeader>
                    <CardTitle>Abonelik & Plan Bilgisi</CardTitle>
                    <CardDescription>Mevcut planınız ve fatura dönemi</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <Label>Plan</Label>
                        <Select defaultValue="pro">
                            <SelectTrigger className="w-40">
                                <span>Pro</span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="starter">Starter</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <Label>Başlangıç Tarihi</Label>
                        <Input type="date" />
                        <Label>Bitiş Tarihi</Label>
                        <Input type="date" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <Label>Fatura Dönemi</Label>
                        <Select defaultValue="monthly">
                            <SelectTrigger className="w-40">
                                <span>Aylık</span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Aylık</SelectItem>
                                <SelectItem value="yearly">Yıllık</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Paket Yükselt</Button>
                        <Button variant="outline">Paket Düşür</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Vergi Ayarları */}
            <Card>
                <CardHeader>
                    <CardTitle>Vergi Ayarları</CardTitle>
                    <CardDescription>KDV / GST ve muafiyet belgeleri</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Label>KDV / GST</Label>
                        <Select defaultValue="kdv">
                            <SelectTrigger className="w-32">
                                <span>KDV</span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kdv">KDV</SelectItem>
                                <SelectItem value="gst">GST</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={taxExempt} onCheckedChange={setTaxExempt} />
                        <Label>Vergi Muafiyeti</Label>
                        <Input type="file" className="w-60" />
                    </div>
                </CardContent>
            </Card>

            {/* Otomatik Yenileme Ayarı */}
            <Card>
                <CardHeader>
                    <CardTitle>Otomatik Yenileme</CardTitle>
                    <CardDescription>Abonelik otomatik yenilensin mi?</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
                        <Label>{autoRenew ? "Açık" : "Kapalı"}</Label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 
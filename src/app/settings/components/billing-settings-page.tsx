'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowRightIcon, CodeIcon, LayoutGridIcon, MonitorSmartphoneIcon, FileTextIcon, GitBranchIcon, LifeBuoyIcon, BookIcon, BrushIcon, Settings2Icon, SquareCheckBigIcon, ZapIcon, ServerIcon, PhoneCallIcon, UsersIcon, GitPullRequestIcon, CalendarCheck2Icon, BellIcon, DatabaseIcon, SlackIcon, ClipboardListIcon, ArrowRightIcon as ArrowRightIcon2, X, CreditCardIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { t, getCurrentLang } from '@/lib/i18n';
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { IconFileText, IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { DataTable, DataTableColumn } from "@/components/data-table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const planFeatures = [
    { label: "User Limit", value: "10" },
    { label: "Customer Limit", value: "100" },
    { label: "Support", value: "Email" },
]
// Billing history mock data (randomized)
const pdfOptions = [
    '/invoices/invoice-20240601.pdf',
    '/invoices/invoice-20240501.pdf',
    '/invoices/invoice-20240401.pdf'
];

const plansMock: string[] = ['Pro', 'Business', 'Enterprise'];
const amountsMock: Record<string, string> = { 'Pro': '$29', 'Business': '$99', 'Enterprise': '$199' };
const statuses = ['Paid', 'Pending', 'Failed'];
const customers = ['Acme Inc.', 'Globex Corp.', 'Soylent LLC', 'Initech', 'Umbrella Corp.'];
const paymentMethods = [
    'Visa **** 4242',
    'Mastercard **** 1234',
    'Amex **** 5678',
    'PayPal',
    'Bank Transfer'
];

function getRandomDate() {
    const start = new Date(2023, 0, 1);
    const end = new Date(2024, 6, 1);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().slice(0, 10);
}

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

type BillingHistoryRow = {
    date: string;
    plan: string;
    amount: string;
    status: string;
    invoiceNo: string;
    customer: string;
    paymentMethod: string;
    pdf: string;
};
const billingHistory: BillingHistoryRow[] = [];
const datesUsed: { [date: string]: boolean } = {};

for (let i = 1; i <= 50; i++) {
    let date;
    if (Math.random() < 0.6 && Object.keys(datesUsed).length > 0) {
        // %60 ihtimalle daha önceki bir tarihi tekrar kullan (aynı gün birden fazla fatura için)
        date = getRandomItem(Object.keys(datesUsed));
    } else {
        date = getRandomDate();
    }
    datesUsed[date] = true;

    const plan = getRandomItem(plansMock);
    const amount = amountsMock[plan];
    const status = getRandomItem(statuses);
    const customer = getRandomItem(customers);
    const paymentMethod = getRandomItem(paymentMethods);
    const pdf = getRandomItem(pdfOptions);

    billingHistory.push({
        date,
        plan,
        amount,
        status,
        invoiceNo: `INV-${date.replace(/-/g, '')}-${i}`,
        customer,
        paymentMethod,
        pdf
    });
}

// 1. Update plans array to include both priceMonthly and priceAnnual
const plans = [
    {
        name: "Starter",
        priceMonthly: 9,
        priceAnnual: 90,
        features: [
            "Access to core components",
            "Basic layout blocks",
            "Responsive design templates",
            "Starter documentation",
            "Version history",
            "Community support",
            "UI guidebook PDF"
        ],
    },
    {
        name: "Pro",
        priceMonthly: 29,
        priceAnnual: 290,
        features: [
            "Advanced UI block library",
            "Custom themes support",
            "Design system tools",
            "Component tests included",
            "Performance enhancements",
            "Shared components hosting",
            "Email + chat support"
        ],
    },
    {
        name: "Business",
        priceMonthly: 99,
        priceAnnual: 990,
        features: [
            "Team access control",
            "Merge & review UI blocks",
            "Priority feature roadmap",
            "Update notifications",
            "Component usage analytics",
            "Slack integration",
            "Project templates library"
        ],
    },
    {
        name: "Enterprise",
        priceMonthly: 199,
        priceAnnual: 1990,
        features: ["Full Control & Support"],
    },
    {
        name: "Ultimate",
        priceMonthly: 399,
        priceAnnual: 3990,
        features: ["Full Control & Support"],
    },
]

// 2. Animated price hook
function useAnimatedNumber(target: number, duration = 400) {
    const [value, setValue] = useState<number>(target);
    const raf = useRef<number | null>(null);

    useEffect(() => {
        let start: number | null = null;
        const prev = value;

        function animate(ts: number) {
            if (start === null) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setValue(prev + (target - prev) * progress);
            if (progress < 1) raf.current = requestAnimationFrame(animate);
            else setValue(target);
        }
        if (raf.current) cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(animate);
        return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    }, [target]);
    return Math.round(value);
}

// 3. Update PlanCard to animate price and use planDuration
function PlanCard({ plan, highlight, badge, features, planDuration }: { plan: any, highlight?: boolean, badge?: string, features?: string[], planDuration: 'monthly' | 'annual' }) {
    const price = planDuration === 'annual' ? plan.priceAnnual : plan.priceMonthly;
    const animatedPrice = useAnimatedNumber(price);
    return (
        <div className={`relative w-full h-full flex flex-col rounded-lg border px-6 py-5 ${highlight ? 'border-primary' : 'border-muted-2'} bg-background`}>
            <div className="text-2xl font-semibold mb-2">{plan.name}</div>
            <div className="text-[2.5rem] leading-none font-bold mb-1 transition-all duration-300">${animatedPrice}</div>
            <div className="text-xs text-muted-2-foreground mb-2">per person / month</div>
            <div className="mb-2 text-sm text-muted-foreground">{plan.description}</div>
            <div className="mb-4 text-base font-medium text-foreground">{plan.summary}</div>
            <ul className="flex flex-col gap-2 text-sm mb-4">
                {(features || plan.features).map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-black">{feature}</li>
                ))}
            </ul>
            <Button variant={highlight ? 'default' : 'outline'} className="w-full flex items-center justify-center gap-2 mb-4">Get started <ArrowRightIcon className="size-4" /></Button>
            {badge && <div className="absolute top-0 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">{badge}</div>}
        </div>
    );
}

// In CancelSubscriptionModal, make the DialogContent wider and use neutral design
function CancelSubscriptionModal({ activePlan, onCancel, onClose }: { activePlan: { name: string; priceMonthly: number; features: string[]; renewalDate: string }; onCancel: (data: { reason: string; message: string }) => void; onClose: () => void; }) {
    const [translations, setTranslations] = useState<any>(null);
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    // Animated price for active plan
    const animatedPrice = useAnimatedNumber(activePlan.priceMonthly);

    useEffect(() => {
        async function loadTranslations() {
            setLoading(true);
            const keys = [
                'settings.billing.cancel.title',
                'settings.billing.cancel.active_plan',
                'settings.billing.cancel.per_month',
                'settings.billing.cancel.period',
                'settings.billing.cancel.price',
                'settings.billing.cancel.renewal',
                'settings.billing.cancel.reason_label',
                'settings.billing.cancel.reason_placeholder',
                'settings.billing.cancel.reason_options.too_expensive',
                'settings.billing.cancel.reason_options.missing_features',
                'settings.billing.cancel.reason_options.switching',
                'settings.billing.cancel.reason_options.other',
                'settings.billing.cancel.reason_options.service_issue',
                'settings.billing.cancel.reason_options.no_longer_needed',
                'settings.billing.cancel.message_label',
                'settings.billing.cancel.message_placeholder',
                'settings.billing.cancel.confirm_label',
                'settings.billing.cancel.confirm_placeholder',
                'settings.billing.cancel.confirm_word',
                'settings.billing.cancel.confirm_word_alt',
                'settings.billing.cancel.button',
                'settings.billing.cancel.input_error',
                'settings.billing.cancel.confirm_success',
            ];
            const obj: any = {};
            for (const key of keys) {
                obj[key] = await t(key);
            }
            setTranslations(obj);
            setLoading(false);
        }
        loadTranslations();
    }, []);

    if (loading || !translations) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">Loading...</div>
        );
    }

    const confirmWords = [translations['settings.billing.cancel.confirm_word'], translations['settings.billing.cancel.confirm_word_alt']];

    function handleSubmit() {
        if (!confirmWords.includes(confirm.trim().toUpperCase())) {
            setError(translations['settings.billing.cancel.input_error']);
            return;
        }
        setError('');
        setSuccess(true);
        setTimeout(() => {
            onCancel({ reason, message });
        }, 1200);
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="!max-w-none !w-[50vw] !h-[25vw]">
                <DialogHeader>
                    <DialogTitle>{translations['settings.billing.cancel.title']}</DialogTitle>
                </DialogHeader>
                {success ? (
                    <div className="flex items-center justify-center min-h-[200px] text-center text-lg font-medium text-neutral-700">{translations['settings.billing.cancel.confirm_success']}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left: Active Plan (styled like Change Plan modal) */}
                        <div className="rounded-lg border px-6 py-5 bg-white flex flex-col gap-2 w-full max-w-md mx-auto">
                            <div className="flex items-center justify-between pb-2">
                                <div className="text-[2.5rem] font-bold">{activePlan.name}</div>
                                <div className="flex items-end">
                                    <div className="text-2xl leading-none font-bold transition-all duration-300">${animatedPrice}</div>
                                    <div className="text-sm text-neutral-700">/{translations['settings.billing.cancel.per_month']}</div>
                                </div>
                            </div>
                            <ul className="text-sm mb-2 list-disc list-inside text-neutral-800">
                                {activePlan.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                            </ul>
                            <div className="text-xs text-neutral-500">{translations['settings.billing.cancel.renewal']}: {activePlan.renewalDate}</div>
                        </div>
                        {/* Right: Reason and Confirmation */}
                        <div className="flex flex-col gap-4">
                            <label className="font-medium text-neutral-800">{translations['settings.billing.cancel.reason_label']}</label>
                            <Select value={reason} onValueChange={setReason}>
                                <SelectTrigger className="w-full bg-white border text-neutral-900">{reason ? translations[`settings.billing.cancel.reason_options.${reason}`] : translations['settings.billing.cancel.reason_placeholder']}</SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="too_expensive">{translations['settings.billing.cancel.reason_options.too_expensive']}</SelectItem>
                                    <SelectItem value="missing_features">{translations['settings.billing.cancel.reason_options.missing_features']}</SelectItem>
                                    <SelectItem value="service_issue">{translations['settings.billing.cancel.reason_options.service_issue']}</SelectItem>
                                    <SelectItem value="no_longer_needed">{translations['settings.billing.cancel.reason_options.no_longer_needed']}</SelectItem>
                                    <SelectItem value="switching">{translations['settings.billing.cancel.reason_options.switching']}</SelectItem>
                                    <SelectItem value="other">{translations['settings.billing.cancel.reason_options.other']}</SelectItem>
                                </SelectContent>
                            </Select>
                            <label className="font-medium text-neutral-800">{translations['settings.billing.cancel.message_label']}</label>
                            <Textarea value={message} rows={4} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)} placeholder={translations['settings.billing.cancel.message_placeholder']} className="bg-white border text-neutral-900" />
                            <label className="font-medium text-neutral-800">{translations['settings.billing.cancel.confirm_label']}</label>
                            <Input value={confirm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)} placeholder={translations['settings.billing.cancel.confirm_placeholder']} className="bg-white border text-neutral-900" />
                            {error && <div className="text-destructive text-sm">{error}</div>}
                            <Button
                                variant="outline"
                                className="w-full border text-neutral-900"
                                disabled={!confirmWords.includes(confirm.trim().toUpperCase())}
                                onClick={handleSubmit}
                            >
                                {translations['settings.billing.cancel.button']}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

// SVG icons for card brands
const brandFileMap: Record<string, string> = {
    'visa': 'visa',
    'mastercard': 'mastercard',
    'american express': 'amex',
    'amex': 'amex',
    'discover': 'discover',
    'diners club': 'diners-club',
    'diners-club': 'diners-club',
    'jcb': 'jcb',
    'unionpay': 'unionpay',
};
const CardBrandIcon = ({ brand }: { brand: string }) => {
    if (!brand) return null;
    const key = brand.toLowerCase().replace(/[^a-z0-9- ]/g, '').replace(/ +/g, '-');
    const file = brandFileMap[key] || key;
    return (
        <img
            src={`/images/cardBrands/${file}.png`}
            alt={brand}
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
        />
    );
};

// Mock cards data
const mockCards = [
    { id: '1', brand: 'visa', last4: '4242', exp: '12/26', name: 'John Doe' },
    { id: '2', brand: 'mastercard', last4: '4444', exp: '11/27', name: 'Acme Inc.' },
    { id: '3', brand: 'amex', last4: '3005', exp: '09/28', name: 'Jane Smith' },
];

// Card types array
const cardTypes = [
    { name: 'Visa', fileKey: 'visa', regex: /^4[0-9]{12}(?:[0-9]{3}){0,2}$/, cvvLength: [3] },
    { name: 'MasterCard', fileKey: 'mastercard', regex: /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-6][0-9]{13}|7[01][0-9]{12}|720[0-9]{12}))$/, cvvLength: [3] },
    { name: 'American Express', fileKey: 'amex', regex: /^3[47][0-9]{13}$/, cvvLength: [4] },
    { name: 'Discover', fileKey: 'discover', regex: /^6(?:011|5[0-9]{2})[0-9]{12}$/, cvvLength: [3] },
    { name: 'Diners Club', fileKey: 'diners-club', regex: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, cvvLength: [3] },
    { name: 'JCB', fileKey: 'jcb', regex: /^(?:2131|1800|35\d{3})\d{11}$/, cvvLength: [3] },
    { name: 'UnionPay', fileKey: 'unionpay', regex: /^62[0-9]{14,17}$/, cvvLength: [3] },
];

// Card type detection helper
function getCardType(number: string) {
    const n = number.replace(/\s/g, '');
    for (const type of cardTypes) {
        if (type.regex.test(n)) return type;
    }
    return null;
}

// Billing History DataTable columns
const billingColumns: DataTableColumn[] = [
    { key: "date", header: "Date", width: 120, align: "left" },
    { key: "plan", header: "Plan", width: 100, align: "left" },
    { key: "amount", header: "Amount", width: 80, align: "right" },
    { key: "status", header: "Status", width: 100, align: "center" },
    { key: "invoiceNo", header: "Invoice No", width: 140, align: "left" },
    { key: "customer", header: "Customer", width: 160, align: "left" },
    { key: "paymentMethod", header: "Payment Method", width: 140, align: "left" },
    {
        key: "pdf",
        header: "Invoice PDF",
        width: 80,
        align: "center",
        cell: (row) => row.pdf ? (
            <a href={row.pdf} target="_blank" rel="noopener noreferrer">
                <IconFileText className="w-6 h-6 hover:scale-110 transition" />
            </a>
        ) : "-"
    },
];

export default function BillingSettingsPage() {
    const [form, setForm] = useState({
        billingName: "",
        billingAddress: "",
        taxNumber: "",
        invoiceEmail: ""
    })
    const [open, setOpen] = useState("") // "plan" | "cancel" | "addCard" | "removeCard" | ""
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768
    // TODO: multilanguage labels, real data, role check
    const [planDuration, setPlanDuration] = useState<'monthly' | 'annual'>('annual');
    const [activePlan, setActivePlan] = useState<any>(null); // State to hold the active plan for cancellation modal
    const [cards, setCards] = useState(mockCards);
    const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || '');
    // Add edit modal state
    const [editCardId, setEditCardId] = useState<string | null>(null);
    const [billingSearch, setBillingSearch] = useState("");
    // Fiyat ve tarih filtreleri
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    // Filtrelenmiş fatura geçmişi
    const filteredBillingHistory = billingHistory.filter(row => {
        const q = billingSearch.trim().toLowerCase();
        // Fiyatı sayıya çevir
        const amount = parseFloat(row.amount.replace(/[^\d.]/g, ""));
        // Tarih
        const rowDate = row.date;
        // Search
        let matchesSearch = !q || (
            row.date.toLowerCase().includes(q) ||
            row.plan.toLowerCase().includes(q) ||
            row.amount.toLowerCase().includes(q) ||
            row.status.toLowerCase().includes(q) ||
            row.invoiceNo.toLowerCase().includes(q) ||
            row.customer.toLowerCase().includes(q) ||
            row.paymentMethod.toLowerCase().includes(q)
        );
        // Fiyat aralığı
        let matchesPrice = true;
        if (minPrice && !isNaN(Number(minPrice))) matchesPrice = amount >= Number(minPrice);
        if (maxPrice && !isNaN(Number(maxPrice))) matchesPrice = matchesPrice && amount <= Number(maxPrice);
        // Tarih aralığı
        let matchesDate = true;
        if (startDate) matchesDate = rowDate >= startDate;
        if (endDate) matchesDate = matchesDate && rowDate <= endDate;
        return matchesSearch && matchesPrice && matchesDate;
    });

    useEffect(() => {
        // Set a default active plan for the cancellation modal
        const defaultPlan = plans.find(p => p.name === 'Pro');
        if (defaultPlan) {
            setActivePlan({
                name: defaultPlan.name,
                priceMonthly: defaultPlan.priceMonthly,
                features: defaultPlan.features,
                renewalDate: '2025-06-01' // Placeholder, replace with actual renewal date
            });
        }
    }, []);

    return (
        <>
            {/* Mobile Accordion */}
            <div className="md:hidden flex flex-col">
                <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="plan">
                    {/* Current Subscription Plan */}
                    <AccordionItem value="plan" className="p-0 border-none bg-transparent">
                        <Card className="rounded-xl shadow-md">
                            <CardHeader className="p-0 m-0 h-[20px]">
                                <AccordionTrigger className="px-4 m-0 py-0 text-base font-semibold">
                                    Current Subscription Plan
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent asChild>
                                <CardContent className="grid grid-cols-1 gap-2 px-4 py-3">
                                    <div className="text-lg font-semibold">Pro</div>
                                    <div className="text-sm text-muted-foreground mb-2">Billed yearly • Next renewal: 2025-06-01</div>
                                    <ul className="text-sm mb-2">
                                        {planFeatures.map(f => (
                                            <li key={f.label} className="flex items-center gap-2">
                                                <span className="font-medium">{f.label}:</span> {f.value}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-col gap-2 mt-2">
                                        <Button variant="outline" onClick={() => setOpen("plan")}>Change Plan</Button>
                                        <Button variant="outline" onClick={() => setOpen("cancel")}>Cancel Subscription</Button>
                                    </div>
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    {/* Payment Method */}
                    <AccordionItem value="payment" className="p-0 border-none bg-transparent">
                        <Card className="rounded-xl shadow-md">
                            <CardHeader className="p-0 m-0 h-[20px]">
                                <AccordionTrigger className="px-4 m-0 py-0 text-base font-semibold">
                                    Payment Method
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent asChild>
                                <CardContent className="grid grid-cols-1 gap-2 px-4 py-3">
                                    <div className="flex flex-col gap-3">
                                        {cards.map(card => (
                                            <div key={card.id} className="border rounded-lg px-4 py-2 bg-muted w-full">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <CardBrandIcon brand={card.brand} />
                                                        <div className="font-medium truncate">{card.brand.charAt(0).toUpperCase() + card.brand.slice(1)}</div>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0 md:gap-2 md:mb-0 mb-1">
                                                        <Button size="sm" variant="outline" onClick={() => { setEditCardId(card.id); }} className="hover:cursor-pointer p-1 md:p-2"><IconEdit className="w-8 h-8" /></Button>
                                                        <Button size="sm" variant="outline" onClick={() => { setSelectedCardId(card.id); setOpen("removeCard"); }} className="hover:cursor-pointer p-1 md:p-2"><IconTrash className="w-8 h-8" /></Button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground pl-10 mt-1">
                                                    <span>{card.name}</span>
                                                    <span>• **** {card.last4}</span>
                                                    <span>• Exp: {card.exp}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <Button variant="outline" onClick={() => setOpen("addCard")}>Add New Card</Button>
                                    </div>
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    {/* Billing Details */}
                    <AccordionItem value="details" className="p-0 border-none bg-transparent">
                        <Card className="rounded-xl shadow-md">
                            <CardHeader className="p-0 m-0 h-[20px]">
                                <AccordionTrigger className="px-4 m-0 py-0 text-base font-semibold">
                                    Billing Details
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent asChild>
                                <CardContent className="grid grid-cols-1 gap-4 px-4 py-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Billing Name</label>
                                        <Input value={form.billingName} onChange={e => setForm(f => ({ ...f, billingName: e.target.value }))} placeholder="Company or Person" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Billing Address</label>
                                        <Input value={form.billingAddress} onChange={e => setForm(f => ({ ...f, billingAddress: e.target.value }))} placeholder="Address" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tax Number</label>
                                        <Input value={form.taxNumber} onChange={e => setForm(f => ({ ...f, taxNumber: e.target.value }))} placeholder="Tax Number (optional)" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Invoice Email</label>
                                        <Input value={form.invoiceEmail} onChange={e => setForm(f => ({ ...f, invoiceEmail: e.target.value }))} placeholder="Email for invoices" />
                                    </div>
                                    <div className="flex justify-end w-full mt-2">
                                        <Button variant="outline">Save Billing Details</Button>
                                    </div>
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    {/* Billing History / Invoices */}
                    <AccordionItem value="history" className="p-0 border-none bg-transparent">
                        <Card className="rounded-xl shadow-md">
                            <CardHeader className="p-0 m-0 h-[20px]">
                                <AccordionTrigger className="px-4 m-0 py-0 text-base font-semibold">
                                    Billing History
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent asChild>
                                <CardContent className="px-4 py-3">
                                    <DataTable data={billingHistory} columns={billingColumns} rowHeight={48} headerHeight={48} emptyText="No invoices found." />
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                </Accordion>
            </div>
            {/* Desktop Cards */}
            <div className="hidden md:flex flex-col gap-6">
                {/* Current Subscription Plan */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Subscription Plan</CardTitle>
                        <CardDescription>Your active plan and features</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="text-lg font-semibold">Pro</div>
                                <div className="text-sm text-muted-foreground mb-2">Billed yearly • Next renewal: 2025-06-01</div>
                                <ul className="text-sm mb-2">
                                    {planFeatures.map(f => (
                                        <li key={f.label} className="flex items-center gap-2">
                                            <span className="font-medium">{f.label}:</span> {f.value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col gap-2 md:items-end">
                                <Button variant="outline" onClick={() => setOpen("plan")}>Change Plan</Button>
                                <Button variant="outline" onClick={() => setOpen("cancel")}>Cancel Subscription</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Manage your saved cards</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {cards.map(card => (
                                <div key={card.id} className="flex items-center justify-between border rounded-lg px-4 py-2 bg-muted w-full">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <CardBrandIcon brand={card.brand} />
                                        <div className="font-medium truncate">{card.brand.charAt(0).toUpperCase() + card.brand.slice(1)}</div>
                                        <div className="text-sm text-muted-foreground">{card.name}</div>
                                        <div className="text-sm text-muted-foreground">**** {card.last4}</div>
                                        <div className="text-xs text-muted-foreground ml-2">Exp: {card.exp}</div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Button size="sm" variant="outline" onClick={() => { setEditCardId(card.id); }} className="hover:cursor-pointer"><IconEdit className="w-8 h-8" /></Button>
                                        <Button size="sm" variant="outline" onClick={() => { setSelectedCardId(card.id); setOpen("removeCard"); }} className="hover:cursor-pointer"><IconTrash className="w-8 h-8" /></Button>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4">
                                <Button variant="outline" onClick={() => setOpen("addCard")}>Add New Card</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Billing Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Billing Details</CardTitle>
                        <CardDescription>Invoice and tax information</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Billing Name</label>
                            <Input value={form.billingName} onChange={e => setForm(f => ({ ...f, billingName: e.target.value }))} placeholder="Company or Person" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Billing Address</label>
                            <Input value={form.billingAddress} onChange={e => setForm(f => ({ ...f, billingAddress: e.target.value }))} placeholder="Address" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tax Number</label>
                            <Input value={form.taxNumber} onChange={e => setForm(f => ({ ...f, taxNumber: e.target.value }))} placeholder="Tax Number (optional)" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Invoice Email</label>
                            <Input value={form.invoiceEmail} onChange={e => setForm(f => ({ ...f, invoiceEmail: e.target.value }))} placeholder="Email for invoices" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button variant="outline">Save Billing Details</Button>
                    </CardFooter>
                </Card>
                {/* Billing History / Invoices */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
                            <div>
                                <CardTitle>Billing History</CardTitle>
                                <CardDescription>All your paid invoices</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable data={billingHistory} columns={billingColumns} rowHeight={48} headerHeight={48} emptyText="No invoices found." />
                    </CardContent>
                </Card>
            </div>
            {/* Bottom Sheets & Dialogs */}
            {/* Change Plan */}
            {open === "plan" && (
                isMobile ? (
                    <Drawer open={true} onOpenChange={v => !v && setOpen("")}>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className="text-left text-base text-medium">Change Plan</DrawerTitle>
                            </DrawerHeader>
                            {/* In DrawerContent (mobile), add the planDuration switch and use PlanCard for each plan */}
                            <div className="p-4">
                                <div className="flex flex-col items-center gap-4 mb-4">
                                    <div className="flex items-center justify-center gap-4">
                                        <Label htmlFor="plan-duration" className="text-muted-foreground text-sm">Annual</Label>
                                        <Switch id="plan-duration" checked={planDuration === 'annual'} onCheckedChange={v => setPlanDuration(v ? 'annual' : 'monthly')} />
                                        <Label htmlFor="plan-duration" className="text-foreground text-sm">Monthly</Label>
                                    </div>
                                    <div className="text-center text-green-600">Save as much as 40% with annual billing</div>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                                    {plans.map(plan => (
                                        <div key={plan.name} className="min-w-[260px] max-w-[90vw] flex-shrink-0 snap-center">
                                            <PlanCard plan={plan} features={plan.features} planDuration={planDuration} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <Dialog open={true} onOpenChange={v => !v && setOpen("")}>
                        <DialogContent
                            className="!max-w-none !w-[70vw] !p-0 !m-0"
                            style={{ maxWidth: 'none', width: '70vw', padding: 0, margin: 0 }}
                        >
                            <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center p-4">
                                {/* Plan başlıkları, switch ve grid burada */}
                                <div className="w-full max-w-7xl flex flex-col items-center justify-center gap-10 p-4">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center justify-center gap-4">
                                            <Label htmlFor="plan-duration" className="text-muted-foreground text-sm">Annual</Label>
                                            <Switch id="plan-duration" checked={planDuration === 'annual'} onCheckedChange={v => setPlanDuration(v ? 'annual' : 'monthly')} />
                                            <Label htmlFor="plan-duration" className="text-foreground text-sm">Monthly</Label>
                                        </div>
                                        <div className="text-center text-green-600">Save as much as 40% with annual billing</div>
                                    </div>
                                    {/* Desktop grid */}
                                    <div className="hidden lg:block w-full">
                                        <div className="grid grid-cols-3 gap-5 w-full mb-5">
                                            {plans.slice(0, 3).map((plan) => (
                                                <PlanCard key={plan.name} plan={plan} highlight={plan.name === 'Pro'} badge={plan.name === 'Pro' ? 'Most popular' : undefined} features={plan.features} planDuration={planDuration} />
                                            ))}
                                        </div>
                                        <div className="w-full flex justify-between space-x-5">
                                            {plans.slice(3, 5).map((plan) => (
                                                <PlanCard key={plan.name} plan={plan} features={plan.features} planDuration={planDuration} />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Mobile grid */}
                                    <div className="lg:hidden flex flex-col gap-5 w-full">
                                        {plans.map((plan) => (
                                            <PlanCard key={plan.name} plan={plan} highlight={plan.name === 'Pro'} badge={plan.name === 'Pro' ? 'Most popular' : undefined} features={plan.features} planDuration={planDuration} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            )}
            {/* Cancel Subscription */}
            {open === "cancel" && activePlan && (
                <CancelSubscriptionModal
                    activePlan={activePlan}
                    onCancel={() => setOpen("")}
                    onClose={() => setOpen("")}
                />
            )}
            {/* Add New Card */}
            {open === "addCard" && (
                isMobile ? (
                    <Drawer open={true} onOpenChange={v => !v && setOpen("")}>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className="text-left text-base text-medium">Add New Card</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4 flex flex-col gap-4">
                                <AddCardForm onSuccess={() => setOpen("")} onCancel={() => setOpen("")} />
                            </div>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <Dialog open={true} onOpenChange={v => !v && setOpen("")}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-left text-base text-medium">Add New Card</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                                <AddCardForm onSuccess={() => setOpen("")} onCancel={() => setOpen("")} />
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            )}
            {/* Remove Card */}
            {open === "removeCard" && (
                isMobile ? (
                    <Drawer open={true} onOpenChange={v => !v && setOpen("")}>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className="text-left text-base text-medium">Remove Card</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4 flex flex-col gap-4">
                                <RemoveCardConfirm
                                    card={cards.find(c => c.id === selectedCardId)}
                                    onSuccess={() => { setCards(cards.filter(c => c.id !== selectedCardId)); setOpen(""); }}
                                    onCancel={() => setOpen("")}
                                />
                            </div>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <Dialog open={true} onOpenChange={v => !v && setOpen("")}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-left text-base text-medium">Remove Card</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                                <RemoveCardConfirm
                                    card={cards.find(c => c.id === selectedCardId)}
                                    onSuccess={() => { setCards(cards.filter(c => c.id !== selectedCardId)); setOpen(""); }}
                                    onCancel={() => setOpen("")}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            )}
            {/* Edit Card */}
            {editCardId && (
                isMobile ? (
                    <Drawer open={true} onOpenChange={v => !v && setEditCardId(null)}>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className="text-left text-base text-medium">Edit Card</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4 flex flex-col gap-4">
                                <EditCardForm
                                    card={cards.find(c => c.id === editCardId)}
                                    onSave={(updated: any) => {
                                        setCards(cards.map(c => c.id === updated.id ? updated : c));
                                        setEditCardId(null);
                                    }}
                                    onCancel={() => setEditCardId(null)}
                                />
                            </div>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <Dialog open={true} onOpenChange={v => !v && setEditCardId(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-left text-base text-medium">Edit Card</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                                <EditCardForm
                                    card={cards.find(c => c.id === editCardId)}
                                    onSave={(updated: any) => {
                                        setCards(cards.map(c => c.id === updated.id ? updated : c));
                                        setEditCardId(null);
                                    }}
                                    onCancel={() => setEditCardId(null)}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            )}
        </>
    )
}

// AddCardForm component
function AddCardForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
    const [form, setForm] = useState({
        cardNumber: '',
        expiry: '',
        cvc: '',
        name: ''
    });
    const cardTypeObj = getCardType(form.cardNumber);
    const cardType = cardTypeObj ? cardTypeObj.name : '';
    const cardBrandFile = cardTypeObj ? cardTypeObj.fileKey : '';
    const cvvMaxLength = cardTypeObj ? cardTypeObj.cvvLength[0] : 4;
    const [isCvvFocused, setIsCvvFocused] = useState(false);
    const [cvvError, setCvvError] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { t } = require('@/lib/i18n');
    const [expiryError, setExpiryError] = useState('');
    function validate() {
        if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, ''))) return 'Card number must be 16 digits';
        if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return 'Expiry must be MM/YY';
        if (!/^\d{3,4}$/.test(form.cvc)) return 'CVC must be 3 or 4 digits';
        if (!form.name.trim()) return 'Cardholder name required';
        return '';
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setLoading(true);
        setError('');
        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 1200);
    }
    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label>Cardholder Name</Label>
                <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Name on card"
                    autoComplete="cc-name"
                />
            </div>
            <div className="space-y-2">
                <Label>Card Number</Label>
                <div className="relative">
                    <Input
                        value={form.cardNumber}
                        onChange={e => {
                            let val = e.target.value.replace(/[^\d]/g, '');
                            if (val.length > 16) val = val.slice(0, 16);
                            // Add space every 4 digits
                            let formatted = val.replace(/(.{4})/g, '$1 ').trim();
                            setForm(f => ({ ...f, cardNumber: formatted }));
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        inputMode="numeric"
                        autoComplete="cc-number"
                        className="pr-16"
                    />
                    {cardBrandFile && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-xs text-muted-foreground">
                            <CardBrandIcon brand={cardBrandFile} />
                        </span>
                    )}
                </div>
            </div>
            <div className="flex w-full gap-3 justify-between">
                <div className="space-y-2 w-full">
                    <Label>Expiry</Label>
                    <Input
                        value={form.expiry}
                        onChange={e => {
                            let val = e.target.value.replace(/[^\d]/g, '');
                            if (val.length > 4) val = val.slice(0, 4);
                            if (val.length >= 1) {
                                if (val[0] !== '0' && val[0] !== '1') val = '';
                            }
                            if (val.length >= 2) {
                                let month = parseInt(val.slice(0, 2), 10);
                                if (month < 1) month = 1;
                                if (month > 12) month = 12;
                                val = month.toString().padStart(2, '0') + val.slice(2);
                            }
                            // Yıl kontrolü
                            let expiryErr = '';
                            if (val.length >= 4) {
                                const now = new Date();
                                const currentYear = now.getFullYear() % 100;
                                let year = parseInt(val.slice(2, 4), 10);
                                if (year < currentYear) {
                                    expiryErr = t('settings.billing.card.expiry_year_error');
                                }
                            }
                            setExpiryError(expiryErr);
                            let formatted = val;
                            if (val.length > 2) formatted = val.slice(0, 2) + '/' + val.slice(2);
                            else formatted = val;
                            setForm(f => ({ ...f, expiry: formatted }));
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        autoComplete="cc-exp"
                        className={expiryError ? 'border-red-500 w-full' : 'w-full'}
                    />
                    {expiryError && <div className="text-destructive text-xs">{expiryError}</div>}
                </div>
                <div className="space-y-2 w-full">
                    <Label>CVV</Label>
                    <Input
                        value={isCvvFocused ? form.cvc : (form.cvc ? '*'.repeat(form.cvc.length) : '')}
                        onFocus={() => setIsCvvFocused(true)}
                        onBlur={() => setIsCvvFocused(false)}
                        onChange={e => {
                            let val = e.target.value.replace(/[^\d]/g, '');
                            if (val.length > cvvMaxLength) val = val.slice(0, cvvMaxLength);
                            setForm(f => ({ ...f, cvc: val }));
                            if (val.length > 0 && cardTypeObj && !cardTypeObj.cvvLength.includes(val.length)) {
                                setCvvError('CVV length is not valid for this card type');
                            } else {
                                setCvvError('');
                            }
                        }}
                        placeholder="CVC"
                        maxLength={cvvMaxLength}
                        autoComplete="cc-csc"
                        className={cvvError ? 'border-red-500' : ''}
                    />
                    {cvvError && <div className="text-destructive text-xs">{cvvError}</div>}
                </div>
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <div className="flex w-full gap-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="w-1/2">Cancel</Button>
                <Button type="submit" disabled={loading || !!expiryError || !!cvvError} className="w-1/2">{loading ? 'Saving...' : 'Save Card'}</Button>
            </div>
        </form>
    );
}

// RemoveCardConfirm component
function RemoveCardConfirm({ card, onSuccess, onCancel }: { card: any, onSuccess: () => void, onCancel: () => void }) {
    const [loading, setLoading] = useState(false);
    if (!card) return <></>;
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <CardBrandIcon brand={card.brand} />
                <div className="font-medium">{card.brand.charAt(0).toUpperCase() + card.brand.slice(1)}</div>
                <div className="text-sm text-muted-foreground">**** {card.last4}</div>
                <div className="text-xs text-muted-foreground ml-2">Exp: {card.exp}</div>
            </div>
            <div className="text-base text-neutral-800">Are you sure you want to remove this card? This action cannot be undone.</div>
            <div className="flex w-full gap-2">
                <Button variant="outline" className="w-1/2" onClick={onCancel} disabled={loading}>Cancel</Button>
                <Button variant="default" className="w-1/2" onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onSuccess(); }, 1200); }} disabled={loading}>
                    {loading ? 'Removing...' : 'Remove Card'}
                </Button>
            </div>
        </div>
    );
}

// EditCardForm component
function EditCardForm({ card, onSave, onCancel }: { card: any, onSave: (updated: any) => void, onCancel: () => void }) {
    const [form, setForm] = useState({
        name: card?.name || '',
        number: card?.number || '',
        exp: card?.exp || '',
        cvv: card?.cvv || ''
    });
    const cardTypeObj = getCardType(form.number);
    const cardType = cardTypeObj ? cardTypeObj.name : '';
    const cardBrandFile = cardTypeObj ? cardTypeObj.fileKey : '';
    const cvvMaxLength = cardTypeObj ? cardTypeObj.cvvLength[0] : 4;
    const [isCvvFocused, setIsCvvFocused] = useState(false);
    const [cvvError, setCvvError] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { t } = require('@/lib/i18n');
    const [expiryError, setExpiryError] = useState('');
    if (!card) return <></>;
    function validate() {
        if (!form.name.trim()) return 'Cardholder name required';
        if (!/^\d{2}\/\d{2}$/.test(form.exp)) return 'Expiry must be MM/YY';
        return '';
    }
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onSave({ ...card, name: form.name, exp: form.exp });
        }, 1000);
    }
    return (
        <form className="flex flex-col gap-4 p-0" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label>Cardholder Name</Label>
                <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Name on card"
                    autoComplete="cc-name"
                />
            </div>
            <div className="space-y-2">
                <Label>Card Number</Label>
                <div className="relative">
                    <Input
                        value={form.number}
                        onChange={e => {
                            let val = e.target.value.replace(/[^\d]/g, '');
                            if (val.length > 16) val = val.slice(0, 16);
                            let formatted = val.replace(/(.{4})/g, '$1 ').trim();
                            setForm(f => ({ ...f, number: formatted }));
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        inputMode="numeric"
                        autoComplete="cc-number"
                        className="pr-16"
                    />
                    {cardBrandFile && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-xs text-muted-foreground">
                            <CardBrandIcon brand={cardBrandFile} />
                        </span>
                    )}
                </div>
            </div>
            <div className="flex w-full gap-3 justify-between">
                <div className="space-y-2 w-full">
                    <Label>Expiry</Label>
                    <Input
                        className={expiryError ? 'w-full border-red-500' : 'w-full'}
                        value={form.exp}
                        onChange={e => {
                            let val = e.target.value.replace(/[^\d]/g, '');
                            if (val.length > 4) val = val.slice(0, 4);
                            // Ay kısmı
                            if (val.length >= 1) {
                                if (val[0] !== '0' && val[0] !== '1') val = '';
                            }
                            if (val.length >= 2) {
                                let month = parseInt(val.slice(0, 2), 10);
                                if (month < 1) month = 1;
                                if (month > 12) month = 12;
                                val = month.toString().padStart(2, '0') + val.slice(2);
                            }
                            // Yıl kontrolü
                            let expiryErr = '';
                            if (val.length >= 4) {
                                const now = new Date();
                                const currentYear = now.getFullYear() % 100;
                                let year = parseInt(val.slice(2, 4), 10);
                                if (year < currentYear) {
                                    expiryErr = t('settings.billing.card.expiry_year_error');
                                }
                            }
                            setExpiryError(expiryErr);
                            // Otomatik / ekle
                            let formatted = val;
                            if (val.length > 2) formatted = val.slice(0, 2) + '/' + val.slice(2);
                            else formatted = val;
                            setForm(f => ({ ...f, exp: formatted }));
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        autoComplete="cc-exp"
                    />
                    {expiryError && <div className="text-destructive text-xs">{expiryError}</div>}
                </div>
                <div className="space-y-2 w-full">
                    <Label>CVV</Label>
                    <Input
                        className={cvvError ? 'w-full border-red-500' : 'w-full'}
                        value={isCvvFocused ? form.cvv : (form.cvv ? '*'.repeat(form.cvv.length) : '')}
                        onFocus={() => setIsCvvFocused(true)}
                        onBlur={() => setIsCvvFocused(false)}
                        onChange={e => {
                            let val = e.target.value.replace(/[^\d]/g, '');
                            if (val.length > cvvMaxLength) val = val.slice(0, cvvMaxLength);
                            setForm(f => ({ ...f, cvv: val }));
                            if (val.length > 0 && cardTypeObj && !cardTypeObj.cvvLength.includes(val.length)) {
                                setCvvError('CVV length is not valid for this card type');
                            } else {
                                setCvvError('');
                            }
                        }}
                        placeholder="CVV"
                        maxLength={cvvMaxLength}
                        autoComplete="cc-csc"
                    />
                    {cvvError && <div className="text-destructive text-xs">{cvvError}</div>}
                </div>
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <div className="flex w-full gap-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="w-1/2">Cancel</Button>
                <Button type="submit" disabled={loading || !!expiryError || !!cvvError} className="w-1/2">{loading ? 'Saving...' : 'Save Changes'}</Button>
            </div>
        </form>
    );
}
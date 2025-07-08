'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowRightIcon, CodeIcon, LayoutGridIcon, MonitorSmartphoneIcon, FileTextIcon, GitBranchIcon, LifeBuoyIcon, BookIcon, BrushIcon, Settings2Icon, SquareCheckBigIcon, ZapIcon, ServerIcon, PhoneCallIcon, UsersIcon, GitPullRequestIcon, CalendarCheck2Icon, BellIcon, DatabaseIcon, SlackIcon, ClipboardListIcon, ArrowRightIcon as ArrowRightIcon2, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { t, getCurrentLang } from '@/lib/i18n';

const planFeatures = [
    { label: "User Limit", value: "10" },
    { label: "Customer Limit", value: "100" },
    { label: "Support", value: "Email" },
]
const billingHistory = [
    { date: "2024-06-01", plan: "Pro", amount: "$29", status: "Paid", pdf: true },
    { date: "2024-05-01", plan: "Pro", amount: "$29", status: "Paid", pdf: true },
    { date: "2024-04-01", plan: "Pro", amount: "$29", status: "Paid", pdf: true },
]

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
function CancelSubscriptionModal({ activePlan, onCancel, onClose }: {
    activePlan: { name: string; priceMonthly: number; features: string[]; renewalDate: string };
    onCancel: (data: { reason: string; message: string }) => void;
    onClose: () => void;
}) {
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
            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4">
                {/* Current Subscription Plan */}
                <Card className="rounded-xl shadow-md">
                    <CardHeader>
                        <CardTitle>Current Subscription Plan</CardTitle>
                        <CardDescription>Your active plan and features</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                </Card>
                {/* Payment Method */}
                <Card className="rounded-xl shadow-md">
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Manage your saved cards</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-base font-medium">Visa **** 4242</div>
                        <div className="text-sm text-muted-foreground">Exp: 12/26</div>
                        <div className="flex flex-col gap-2 mt-2">
                            <Button variant="outline" onClick={() => setOpen("addCard")}>Add New Card</Button>
                            <Button variant="outline" onClick={() => setOpen("removeCard")}>Remove Card</Button>
                        </div>
                    </CardContent>
                </Card>
                {/* Billing Details */}
                <Card className="rounded-xl shadow-md">
                    <CardHeader>
                        <CardTitle>Billing Details</CardTitle>
                        <CardDescription>Invoice and tax information</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
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
                </Card>
                {/* Billing History / Invoices */}
                <Card className="rounded-xl shadow-md">
                    <CardHeader>
                        <CardTitle>Billing History</CardTitle>
                        <CardDescription>All your paid invoices</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-muted text-foreground">
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-left">Plan</th>
                                        <th className="px-4 py-2 text-left">Amount</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Invoice PDF</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billingHistory.map((row, i) => (
                                        <tr key={i} className="border-b last:border-0">
                                            <td className="px-4 py-2 whitespace-nowrap">{row.date}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">{row.plan}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">{row.amount}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">{row.status}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                {row.pdf ? <Button size="sm" variant="outline">PDF</Button> : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="text-base font-medium">Visa **** 4242</div>
                                <div className="text-sm text-muted-foreground">Exp: 12/26</div>
                            </div>
                            <div className="flex flex-col gap-2 md:items-end">
                                <Button variant="outline" onClick={() => setOpen("addCard")}>Add New Card</Button>
                                <Button variant="outline" onClick={() => setOpen("removeCard")}>Remove Card</Button>
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
                        <CardTitle>Billing History</CardTitle>
                        <CardDescription>All your paid invoices</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-muted text-foreground">
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-left">Plan</th>
                                        <th className="px-4 py-2 text-left">Amount</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Invoice PDF</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billingHistory.map((row, i) => (
                                        <tr key={i} className="border-b last:border-0">
                                            <td className="px-4 py-2 whitespace-nowrap">{row.date}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">{row.plan}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">{row.amount}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">{row.status}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                {row.pdf ? <Button size="sm" variant="outline">PDF</Button> : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                                <DrawerTitle>Change Plan</DrawerTitle>
                                <DrawerClose asChild>
                                    <Button variant="outline" className="absolute right-4 top-4">Close</Button>
                                </DrawerClose>
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
                                <DrawerTitle>Add New Card</DrawerTitle>
                                <DrawerClose asChild>
                                    <Button variant="outline" className="absolute right-4 top-4">Close</Button>
                                </DrawerClose>
                            </DrawerHeader>
                            <div className="p-4">Add card form (placeholder)</div>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <Dialog open={true} onOpenChange={v => !v && setOpen("")}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Card</DialogTitle>
                                <DialogClose asChild>
                                    <Button variant="outline" className="absolute right-4 top-4">Close</Button>
                                </DialogClose>
                            </DialogHeader>
                            <div className="p-4">Add card form (placeholder)</div>
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
                                <DrawerTitle>Remove Card</DrawerTitle>
                                <DrawerClose asChild>
                                    <Button variant="outline" className="absolute right-4 top-4">Close</Button>
                                </DrawerClose>
                            </DrawerHeader>
                            <div className="p-4">Remove card confirmation (placeholder)</div>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <Dialog open={true} onOpenChange={v => !v && setOpen("")}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Remove Card</DialogTitle>
                                <DialogClose asChild>
                                    <Button variant="outline" className="absolute right-4 top-4">Close</Button>
                                </DialogClose>
                            </DialogHeader>
                            <div className="p-4">Remove card confirmation (placeholder)</div>
                        </DialogContent>
                    </Dialog>
                )
            )}
        </>
    )
} 
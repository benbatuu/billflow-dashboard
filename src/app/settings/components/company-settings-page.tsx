"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"
import { t, getCurrentLang, type Locale } from '@/lib/i18n'

const industries = [
    "Technology", "Finance", "Healthcare", "Retail", "Education", "Other"
]
const countries = [
    "Turkey", "United States", "Germany", "United Kingdom", "France", "Other"
]
const currencies = [
    { value: "TRY", label: "TRY" },
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" }
]
const fiscalMonths = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]
const legalTypes = [
    "A.Ş.", "Ltd.", "Şahıs", "Other"
]

export default function CompanySettingsPage() {
    const [form, setForm] = useState({
        companyName: "",
        logo: "",
        industry: "",
        website: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        taxNumber: "",
        vatId: "",
        legalType: "",
        currency: "TRY",
        fiscalYear: "January"
    })
    // TODO: multilanguage labels
    return (
        <>
            {/* Mobile Accordion */}
            <div className="md:hidden flex flex-col">
                <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="profile">
                    <AccordionItem value="profile" className="p-0 border-none bg-transparent">
                        <Card className="rounded-xl shadow-md">
                            <CardHeader className="p-0 m-0 h-[20px]">
                                <AccordionTrigger className="px-4 m-0 py-0 text-base font-semibold">
                                    Company Profile
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent asChild>
                                <CardContent className="grid grid-cols-1 gap-2 px-4 py-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Company Name *</label>
                                        <Input value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} placeholder="Enter company name" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Company Logo</label>
                                        <Input type="file" accept="image/*" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 w-full">Industry</label>
                                        <div className="w-full">
                                            <Select value={form.industry} onValueChange={val => setForm(f => ({ ...f, industry: val }))}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Website URL</label>
                                        <Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://" />
                                    </div>
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="address" className="border-none bg-transparent mb-3">
                        <Card className="rounded-xl shadow-md">
                            <CardHeader className="p-0 m-0 h-[20px]">
                                <AccordionTrigger className="px-4 m-0 py-0 text-base font-semibold">
                                    Company Address
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent asChild>
                                <CardContent className="grid grid-cols-1 gap-2 px-4 py-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Address Line 1</label>
                                        <Input value={form.address1} onChange={e => setForm(f => ({ ...f, address1: e.target.value }))} placeholder="Address line 1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Address Line 2</label>
                                        <Input value={form.address2} onChange={e => setForm(f => ({ ...f, address2: e.target.value }))} placeholder="Address line 2 (optional)" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">City</label>
                                        <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">State / Province</label>
                                        <Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="State or province" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">ZIP / Postal Code</label>
                                        <Input value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} placeholder="ZIP / Postal code" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Country</label>
                                        <Select value={form.country} onValueChange={val => setForm(f => ({ ...f, country: val }))}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="tax" className="border-none bg-transparent mb-3">
                        <Card className="rounded-xl shadow-md">
                            <CardHeader className="p-0 m-0 h-[20px]">
                                <AccordionTrigger className="px-4 m-0 py-0 text-base font-semibold">
                                    Tax & Legal Info
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent asChild>
                                <CardContent className="grid grid-cols-1 gap-2 px-4 py-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tax Number</label>
                                        <Input value={form.taxNumber} onChange={e => setForm(f => ({ ...f, taxNumber: e.target.value }))} placeholder="Tax number" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">VAT ID</label>
                                        <Input value={form.vatId} onChange={e => setForm(f => ({ ...f, vatId: e.target.value }))} placeholder="VAT ID (optional)" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Legal Entity Type</label>
                                        <Select value={form.legalType} onValueChange={val => setForm(f => ({ ...f, legalType: val }))}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {legalTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="other" className="border-none bg-transparent mb-3">
                        <Card className="rounded-xl shadow-md">
                            <CardHeader className="p-0 m-0 h-[20px]">
                                <AccordionTrigger className="px-4 m-0 py-0 text-base font-semibold">
                                    Other Preferences
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent asChild>
                                <CardContent className="grid grid-cols-1 gap-2 px-4 py-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Default Currency</label>
                                        <Select value={form.currency} onValueChange={val => setForm(f => ({ ...f, currency: val }))}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currencies.map(cur => <SelectItem key={cur.value} value={cur.value}>{cur.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Fiscal Year Start</label>
                                        <Select value={form.fiscalYear} onValueChange={val => setForm(f => ({ ...f, fiscalYear: val }))}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select month" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {fiscalMonths.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                </Accordion>
                <div className="flex justify-end w-full mt-4">
                    <Button type="submit" className="w-full">Save Changes</Button>
                </div>
            </div>
            {/* Desktop Cards */}
            <div className="hidden md:flex flex-col gap-6">
                {/* Company Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle>Company Profile</CardTitle>
                        <CardDescription>Basic company information</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Company Name *</label>
                            <Input value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} placeholder="Enter company name" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Company Logo</label>
                            <Input type="file" accept="image/*" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 w-full">Industry</label>
                            <div className="w-full">
                                <Select value={form.industry} onValueChange={val => setForm(f => ({ ...f, industry: val }))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Website URL</label>
                            <Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://" />
                        </div>
                    </CardContent>
                </Card>
                {/* Company Address */}
                <Card>
                    <CardHeader>
                        <CardTitle>Company Address</CardTitle>
                        <CardDescription>Physical address details</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Address Line 1</label>
                            <Input value={form.address1} onChange={e => setForm(f => ({ ...f, address1: e.target.value }))} placeholder="Address line 1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address Line 2</label>
                            <Input value={form.address2} onChange={e => setForm(f => ({ ...f, address2: e.target.value }))} placeholder="Address line 2 (optional)" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">City</label>
                            <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">State / Province</label>
                            <Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="State or province" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">ZIP / Postal Code</label>
                            <Input value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} placeholder="ZIP / Postal code" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Country</label>
                            <Select value={form.country} onValueChange={val => setForm(f => ({ ...f, country: val }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                {/* Tax & Legal Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tax & Legal Info</CardTitle>
                        <CardDescription>Tax and legal entity details</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tax Number</label>
                            <Input value={form.taxNumber} onChange={e => setForm(f => ({ ...f, taxNumber: e.target.value }))} placeholder="Tax number" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">VAT ID</label>
                            <Input value={form.vatId} onChange={e => setForm(f => ({ ...f, vatId: e.target.value }))} placeholder="VAT ID (optional)" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Legal Entity Type</label>
                            <Select value={form.legalType} onValueChange={val => setForm(f => ({ ...f, legalType: val }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {legalTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                {/* Other Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Other Preferences</CardTitle>
                        <CardDescription>Optional company settings</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Default Currency</label>
                            <Select value={form.currency} onValueChange={val => setForm(f => ({ ...f, currency: val }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map(cur => <SelectItem key={cur.value} value={cur.value}>{cur.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Fiscal Year Start</label>
                            <Select value={form.fiscalYear} onValueChange={val => setForm(f => ({ ...f, fiscalYear: val }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fiscalMonths.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end w-full">
                    <Button type="submit" className="mt-2 w-full">Save Changes</Button>
                </div>
            </div>
        </>
    )
} 
"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRef, useState, useEffect, ReactNode } from "react"
import { Camera, Edit3, Shield, Trash2, Settings, Check, X, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { t, getCurrentLang, type Locale } from '@/lib/i18n'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const initialLabels = {
    change_picture: '',
    change_picture_title: '',
    select_picture: '',
    remove_picture: '',
    active: '',
    personal_info: '',
    manage_personal_info: '',
    edit: '',
    name: '',
    email: '',
    phone: '',
    language: '',
    bio: '',
    edit_personal_info: '',
    name_placeholder: '',
    email_placeholder: '',
    phone_placeholder: '',
    bio_placeholder: '',
    save: '',
    cancel: '',
    password_security: '',
    manage_security: '',
    change_password: '',
    last_login: '',
    sessions: '',
    manage: '',
    change_password_title: '',
    current_password: '',
    current_password_placeholder: '',
    new_password: '',
    new_password_placeholder: '',
    new_password_repeat: '',
    new_password_repeat_placeholder: '',
    toggle_password_visibility: '',
    password_requirements: '',
    password_min_length: '',
    password_uppercase: '',
    password_number: '',
    password_special: '',
    change_password_btn: '',
    danger_zone: '',
    danger_zone_desc: '',
    delete_account: '',
    delete_account_desc: '',
    delete_account_warning: '',
    danger_zone_warning: '',
    delete_account_confirm: '',
    delete_account_permanently: '',
    change_password_short: '',
}

function useProfileLabels() {
    const [labels, setLabels] = useState(initialLabels)
    const lang = getCurrentLang()
    useEffect(() => {
        (async () => {
            setLabels({
                change_picture: await t('settings.profile.change_picture'),
                change_picture_title: await t('settings.profile.change_picture_title'),
                select_picture: await t('settings.profile.select_picture'),
                remove_picture: await t('settings.profile.remove_picture'),
                active: await t('settings.profile.active'),
                personal_info: await t('settings.profile.personal_info'),
                manage_personal_info: await t('settings.profile.manage_personal_info'),
                edit: await t('settings.profile.edit'),
                name: await t('settings.profile.name'),
                email: await t('settings.profile.email'),
                phone: await t('settings.profile.phone'),
                language: await t('settings.profile.language'),
                bio: await t('settings.profile.bio'),
                edit_personal_info: await t('settings.profile.edit_personal_info'),
                name_placeholder: await t('settings.profile.name_placeholder'),
                email_placeholder: await t('settings.profile.email_placeholder'),
                phone_placeholder: await t('settings.profile.phone_placeholder'),
                bio_placeholder: await t('settings.profile.bio_placeholder'),
                save: await t('settings.profile.save'),
                cancel: await t('settings.profile.cancel'),
                password_security: await t('settings.profile.password_security'),
                manage_security: await t('settings.profile.manage_security'),
                change_password: await t('settings.profile.change_password'),
                change_password_short: await t('settings.profile.change_password_short'),
                last_login: await t('settings.profile.last_login'),
                sessions: await t('settings.profile.sessions'),
                manage: await t('settings.profile.manage'),
                change_password_title: await t('settings.profile.change_password_title'),
                current_password: await t('settings.profile.current_password'),
                current_password_placeholder: await t('settings.profile.current_password_placeholder'),
                new_password: await t('settings.profile.new_password'),
                new_password_placeholder: await t('settings.profile.new_password_placeholder'),
                new_password_repeat: await t('settings.profile.new_password_repeat'),
                new_password_repeat_placeholder: await t('settings.profile.new_password_repeat_placeholder'),
                toggle_password_visibility: await t('settings.profile.toggle_password_visibility'),
                password_requirements: await t('settings.profile.password_requirements'),
                password_min_length: await t('settings.profile.password_min_length'),
                password_uppercase: await t('settings.profile.password_uppercase'),
                password_number: await t('settings.profile.password_number'),
                password_special: await t('settings.profile.password_special'),
                change_password_btn: await t('settings.profile.change_password_btn'),
                danger_zone: await t('settings.profile.danger_zone'),
                danger_zone_desc: await t('settings.profile.danger_zone_desc'),
                delete_account: await t('settings.profile.delete_account'),
                delete_account_desc: await t('settings.profile.delete_account_desc'),
                delete_account_warning: await t('settings.profile.delete_account_warning'),
                danger_zone_warning: await t('settings.profile.danger_zone_warning'),
                delete_account_confirm: await t('settings.profile.delete_account_confirm'),
                delete_account_permanently: await t('settings.profile.delete_account_permanently'),
            })
        })()
    }, [lang])
    return labels
}

// Modal Props Type
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title: string;
}

// Apple tarzı bottom sheet modal
interface BottomSheetModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title: string;
}

function BottomSheetModal({ isOpen, onClose, children, title }: BottomSheetModalProps) {
    // Masaüstünde dialog, mobilde drawer gibi açılır
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    // SSR için fallback
    const [mobile, setMobile] = useState(false)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setMobile(window.innerWidth < 768)
        }
        const handleResize = () => setMobile(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    if (mobile) {
        return (
            <Drawer open={isOpen} onOpenChange={open => { if (!open) onClose() }} direction="bottom">
                <DrawerContent className="p-0 rounded-t-[36px] max-h-[90vh] border bg-background shadow-none">
                    <DrawerHeader className="flex flex-col items-center gap-2">
                        <div className="flex items-center justify-between w-full px-2">
                            <DrawerTitle className="text-base font-semibold">{title}</DrawerTitle>
                        </div>
                    </DrawerHeader>
                    <div className="px-6 overflow-y-auto" style={{ maxHeight: '62vh' }}>{children}</div>
                </DrawerContent>
            </Drawer>
        )
    }
    // Masaüstü: ortada klasik dialog gibi
    return (
        <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose() }}>
            <DialogContent className="w-full p-0 rounded-xl border bg-background">
                <DialogHeader className="border-b px-6 py-4 flex flex-row items-center justify-between">
                    <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-4">{children}</div>
            </DialogContent>
        </Dialog>
    )
}

function ProfileAvatarCard({ labels }: { labels: typeof initialLabels }) {
    const fileInput = useRef<HTMLInputElement>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    return (
        <>
            <div className="p-6 flex items-center gap-6">
                <div className="relative group">
                    <Avatar className="w-20 h-20 border">
                        <AvatarImage src="/avatars/shadcn.jpg" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 border"
                        onClick={() => setIsModalOpen(true)}
                        aria-label={labels.change_picture}
                    >
                        <Camera className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex-1">
                    <h2 className="font-bold text-xl text-foreground">Demo User</h2>
                    <p className="text-muted-foreground mb-2">demo@company.com</p>
                    <span className="inline-block text-xs text-muted-foreground border rounded px-2 py-0.5">{labels.active}</span>
                </div>
            </div>
            <BottomSheetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={labels.change_picture_title}>
                <div className="flex flex-col items-center gap-6">
                    <Avatar className="w-24 h-24 border">
                        <AvatarImage src="/avatars/shadcn.jpg" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInput.current?.click()}
                    >
                        <Camera className="h-4 w-4 mr-2" />{labels.select_picture}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full text-destructive border-destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />{labels.remove_picture}
                    </Button>
                    <input type="file" ref={fileInput} className="hidden" accept="image/*" />
                </div>
            </BottomSheetModal>
        </>
    )
}

function ProfileInfoForm({ labels }: { labels: typeof initialLabels }) {
    const [form, setForm] = useState<{
        name: string;
        email: string;
        phone: string;
        bio: string;
        lang: Locale;
    }>({
        name: "Demo User",
        email: "demo@company.com",
        phone: "+90 555 555 55 55",
        bio: "SaaS founder, product lover.",
        lang: getCurrentLang()
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    return (
        <>
            <div className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-lg font-semibold">{labels.personal_info}</span>
                        <span className="block text-muted-foreground text-sm">{labels.manage_personal_info}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                        <Edit3 className="h-4 w-4 mr-2" />{labels.edit}
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-muted-foreground">{labels.name}</label>
                    <p className="text-foreground mt-1">{form.name}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-muted-foreground">{labels.email}</label>
                    <p className="text-foreground mt-1">{form.email}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-muted-foreground">{labels.phone}</label>
                    <p className="text-foreground mt-1">{form.phone}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-muted-foreground">{labels.language}</label>
                    <p className="text-foreground mt-1">{form.lang === 'tr' ? 'Türkçe' : 'English'}</p>
                </div>
                <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">{labels.bio}</label>
                    <p className="text-foreground mt-1">{form.bio}</p>
                </div>
            </div>
            <BottomSheetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={labels.edit_personal_info}>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">{labels.name}</label>
                        <Input
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder={labels.name_placeholder}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">{labels.email}</label>
                        <Input
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            type="email"
                            placeholder={labels.email_placeholder}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">{labels.phone}</label>
                        <Input
                            value={form.phone}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder={labels.phone_placeholder}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">{labels.language}</label>
                        <select
                            value={form.lang}
                            onChange={e => setForm(f => ({ ...f, lang: e.target.value as Locale }))}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="tr">Türkçe</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">{labels.bio}</label>
                        <textarea
                            value={form.bio}
                            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                            className="w-full border rounded px-3 py-2 min-h-[80px]"
                            placeholder={labels.bio_placeholder}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={() => setIsModalOpen(false)} className="flex-1">
                            <Check className="h-4 w-4 mr-2" />{labels.save}
                        </Button>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            {labels.cancel}
                        </Button>
                    </div>
                </form>
            </BottomSheetModal>
        </>
    )
}

function ProfilePasswordForm({ labels }: { labels: typeof initialLabels }) {
    const [form, setForm] = useState({
        current: "",
        new: "",
        confirm: ""
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })
    return (
        <>
            <div className="pb-4">
                <div className="flex flex-row items-center justify-between gap-x-4">
                    <div className="flex-1 min-w-0">
                        <span className="text-lg font-semibold">{labels.password_security}</span>
                        <span className="block text-muted-foreground text-sm">{labels.manage_security}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                        <Shield className="h-4 w-4 mr-2" />{labels.change_password}
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-sm font-medium text-muted-foreground">{labels.last_login}</label>
                    <p className="text-foreground mt-1">2024-06-01 12:34</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-muted-foreground">2FA</label>
                    <span className="inline-block text-xs text-muted-foreground border rounded px-2 py-0.5 mt-1">{labels.active}</span>
                </div>
                <div>
                    <div className="flex items-center justify-between gap-x-2">
                        <label className="text-sm font-medium text-muted-foreground">{labels.sessions}</label>
                        <Button variant="outline" size="sm" className="mt-1">
                            <Settings className="h-4 w-4 mr-2" />{labels.manage}
                        </Button>
                    </div>
                </div>
            </div>
            <BottomSheetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={labels.change_password_title}>
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); setIsModalOpen(false) }}>
                    <div>
                        <label className="block text-sm font-medium mb-2">{labels.current_password}</label>
                        <div className="relative">
                            <Input
                                value={form.current}
                                onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
                                type={showPasswords.current ? "text" : "password"}
                                autoComplete="current-password"
                                className="pr-10"
                                placeholder={labels.current_password_placeholder}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPasswords(s => ({ ...s, current: !s.current }))}
                                aria-label={labels.toggle_password_visibility}
                            >
                                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">{labels.new_password}</label>
                        <div className="relative">
                            <Input
                                value={form.new}
                                onChange={e => setForm(f => ({ ...f, new: e.target.value }))}
                                type={showPasswords.new ? "text" : "password"}
                                autoComplete="new-password"
                                className="pr-10"
                                placeholder={labels.new_password_placeholder}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPasswords(s => ({ ...s, new: !s.new }))}
                                aria-label={labels.toggle_password_visibility}
                            >
                                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">{labels.new_password_repeat}</label>
                        <div className="relative">
                            <Input
                                value={form.confirm}
                                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                                type={showPasswords.confirm ? "text" : "password"}
                                autoComplete="new-password"
                                className="pr-10"
                                placeholder={labels.new_password_repeat_placeholder}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPasswords(s => ({ ...s, confirm: !s.confirm }))}
                                aria-label={labels.toggle_password_visibility}
                            >
                                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="bg-muted border rounded-lg p-3 text-sm text-muted-foreground">
                        <p className="font-medium mb-1">{labels.password_requirements}</p>
                        <ul className="text-xs space-y-1">
                            <li>{labels.password_min_length}</li>
                            <li>{labels.password_uppercase}</li>
                            <li>{labels.password_number}</li>
                            <li>{labels.password_special}</li>
                        </ul>
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" className="flex-1">
                            <Check className="h-4 w-4 mr-2" />{labels.change_password_btn}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            {labels.cancel}
                        </Button>
                    </div>
                </form>
            </BottomSheetModal>
        </>
    )
}

function ProfileDangerZone({ labels }: { labels: typeof initialLabels }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [confirmText, setConfirmText] = useState("")
    return (
        <>
            <div>
                <div className="text-lg text-destructive flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />{labels.danger_zone}
                </div>
                <div className="text-muted-foreground">
                    {labels.danger_zone_desc}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 className="font-medium text-destructive">{labels.delete_account}</h3>
                    <p className="text-sm text-muted-foreground">{labels.delete_account_desc}</p>
                </div>
                <Button
                    variant="destructive"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Trash2 className="h-4 w-4 mr-2" />{labels.delete_account}
                </Button>
            </div>
            <BottomSheetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={labels.delete_account}>
                <div className="space-y-4">
                    <div className="bg-muted border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                                <Trash2 className="h-3 w-3 text-destructive" />
                            </div>
                            <h3 className="font-semibold text-destructive">{labels.danger_zone_warning}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {labels.delete_account_warning}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm font-medium">{labels.delete_account_confirm}</p>
                        <Input
                            value={confirmText}
                            onChange={e => setConfirmText(e.target.value)}
                            placeholder="HESABI SIL"
                            className="font-mono"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="destructive"
                            className="flex-1"
                            disabled={confirmText !== "HESABI SIL"}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />{labels.delete_account_permanently}
                        </Button>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            {labels.cancel}
                        </Button>
                    </div>
                </div>
            </BottomSheetModal>
        </>
    )
}

export default function ProfileSettingsPage() {
    const labels = useProfileLabels();

    // Eğer çeviriler henüz yüklenmediyse, loading göster
    const isLoading = Object.values(labels).every(v => v === "");

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Yükleniyor...</div>;
    }

    return (
        <div className="w-full mx-auto">
            {/* Mobil Accordion */}
            <div className="md:hidden flex flex-col">
                <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="avatar">
                    <AccordionItem value="avatar" className="p-0 border-none bg-transparent">
                        <Card className="rounded-xl shadow-md">
                            <CardHeader className="p-0 m-0 h-[20px]">
                                <AccordionTrigger className="px-4 m-0 py-0 text-base font-semibold">
                                    {labels.change_picture_title}
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent asChild>
                                <CardContent className="grid grid-cols-1 gap-2 px-4 py-3">
                                    <ProfileAvatarCard labels={labels} />
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="info" className="p-0 border-none bg-transparent">
                        <Card className="rounded-xl shadow-md">
                            <CardHeader className="p-0 m-0 h-[20px]">
                                <AccordionTrigger className="px-4 m-0 py-0 text-base font-semibold">
                                    {labels.personal_info}
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent asChild>
                                <CardContent className="grid grid-cols-1 gap-2 px-4 py-3">
                                    <ProfileInfoForm labels={labels} />
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="password" className="p-0 border-none bg-transparent">
                        <Card className="rounded-xl shadow-md">
                            <CardHeader className="p-0 m-0 h-[20px]">
                                <AccordionTrigger className="px-4 m-0 py-0 text-base font-semibold">
                                    {labels.password_security || "Şifre & Güvenlik"}
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent asChild>
                                <CardContent className="grid grid-cols-1 gap-2 px-4 py-3">
                                    <ProfilePasswordForm labels={labels} />
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                </Accordion>
            </div>
            {/* Masaüstü Kartlar */}
            <div className="hidden md:block">
                <Card className="mb-6 border bg-background dark:bg-background">
                    <ProfileAvatarCard labels={labels} />
                </Card>
                <Card className="mb-6 px-4 border bg-background dark:bg-background">
                    <ProfileInfoForm labels={labels} />
                </Card>
                <Card className="mb-6 px-4 border bg-background dark:bg-background">
                    <ProfilePasswordForm labels={labels} />
                </Card>
            </div>
        </div>
    );
}
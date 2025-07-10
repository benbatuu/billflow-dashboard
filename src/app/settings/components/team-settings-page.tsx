"use client"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Info, Mail, MoreVertical, ShieldCheck, Trash2, RefreshCw, UserPlus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/data-table"

const mockMembers = [
    { id: 1, name: "Batu Yılmaz", email: "batu@company.com", phone: "+905551112233", city: "İstanbul", department: "Management", role: "Owner", status: "Active", joinedAt: "2023-01-15", salary: 95000, birthday: "1985-04-12", avatar: "/avatars/shadcn.jpg", address: "İstanbul, Türkiye" },
    { id: 2, name: "Ayşe Demir", email: "ayse@company.com", phone: "+905551112244", city: "Ankara", department: "HR", role: "Admin", status: "Active", joinedAt: "2023-02-20", salary: 65000, birthday: "1990-06-21", avatar: "", address: "Ankara, Türkiye" },
    { id: 3, name: "Mehmet Kaya", email: "mehmet@company.com", phone: "+905551112255", city: "İzmir", department: "Finance", role: "Accountant", status: "Pending", joinedAt: "2023-03-10", salary: 72000, birthday: "1988-02-10", avatar: "", address: "İzmir, Türkiye" },
    { id: 4, name: "Zeynep Çelik", email: "zeynep@company.com", phone: "+905551112266", city: "Bursa", department: "Operations", role: "Viewer", status: "Suspended", joinedAt: "2023-04-05", salary: 58000, birthday: "1992-09-19", avatar: "", address: "Bursa, Türkiye" },
    { id: 5, name: "Ahmet Şahin", email: "ahmet@company.com", phone: "+905551112277", city: "Adana", department: "IT", role: "Admin", status: "Active", joinedAt: "2023-05-12", salary: 80000, birthday: "1986-11-03", avatar: "", address: "Adana, Türkiye" },
    { id: 6, name: "Elif Aksoy", email: "elif@company.com", phone: "+905551112288", city: "Antalya", department: "Marketing", role: "Viewer", status: "Pending", joinedAt: "2023-06-18", salary: 55000, birthday: "1995-12-25", avatar: "", address: "Antalya, Türkiye" },
    { id: 7, name: "Mustafa Koç", email: "mustafa@company.com", phone: "+905551112299", city: "Gaziantep", department: "Finance", role: "Accountant", status: "Active", joinedAt: "2023-07-03", salary: 70000, birthday: "1987-03-30", avatar: "", address: "Gaziantep, Türkiye" },
    { id: 8, name: "Fatma Kılıç", email: "fatma@company.com", phone: "+905551112200", city: "Konya", department: "HR", role: "Admin", status: "Suspended", joinedAt: "2023-08-22", salary: 63000, birthday: "1991-07-11", avatar: "", address: "Konya, Türkiye" },
    { id: 9, name: "Hüseyin Öz", email: "huseyin@company.com", phone: "+905551112211", city: "Mersin", department: "Operations", role: "Viewer", status: "Active", joinedAt: "2023-09-17", salary: 60000, birthday: "1989-01-05", avatar: "", address: "Mersin, Türkiye" },
    { id: 10, name: "Nazlı Er", email: "nazli@company.com", phone: "+905551112222", city: "Trabzon", department: "Sales", role: "Admin", status: "Pending", joinedAt: "2023-10-11", salary: 67000, birthday: "1993-08-16", avatar: "", address: "Trabzon, Türkiye" },
    { id: 11, name: "Ali Aslan", email: "ali@company.com", phone: "+905551112233", city: "Samsun", department: "IT", role: "Developer", status: "Active", joinedAt: "2023-01-15", salary: 75000, birthday: "1984-04-20", avatar: "", address: "Samsun, Türkiye" },
    { id: 12, name: "Burcu Yıldız", email: "burcu@company.com", phone: "+905551112244", city: "Malatya", department: "Marketing", role: "Designer", status: "Active", joinedAt: "2023-02-20", salary: 58000, birthday: "1996-05-13", avatar: "", address: "Malatya, Türkiye" },
    { id: 13, name: "Kemal Kurt", email: "kemal@company.com", phone: "+905551112255", city: "Kayseri", department: "Sales", role: "Sales Rep", status: "Pending", joinedAt: "2023-03-10", salary: 62000, birthday: "1990-11-28", avatar: "", address: "Kayseri, Türkiye" },
    { id: 14, name: "Gül Aydın", email: "gul@company.com", phone: "+905551112266", city: "Eskişehir", department: "Finance", role: "Accountant", status: "Active", joinedAt: "2023-04-05", salary: 71000, birthday: "1992-02-14", avatar: "", address: "Eskişehir, Türkiye" },
    { id: 15, name: "Okan Eren", email: "okan@company.com", phone: "+905551112277", city: "Çanakkale", department: "HR", role: "Recruiter", status: "Active", joinedAt: "2023-05-12", salary: 60000, birthday: "1988-09-27", avatar: "", address: "Çanakkale, Türkiye" },
    { id: 16, name: "Selin Polat", email: "selin@company.com", phone: "+905551112288", city: "Denizli", department: "Operations", role: "Operator", status: "Suspended", joinedAt: "2023-06-18", salary: 56000, birthday: "1995-12-01", avatar: "", address: "Denizli, Türkiye" },
    { id: 17, name: "Yusuf Güneş", email: "yusuf@company.com", phone: "+905551112299", city: "Edirne", department: "IT", role: "Developer", status: "Active", joinedAt: "2023-07-03", salary: 77000, birthday: "1987-07-04", avatar: "", address: "Edirne, Türkiye" },
    { id: 18, name: "Melis Tan", email: "melis@company.com", phone: "+905551112200", city: "Rize", department: "Marketing", role: "Content Creator", status: "Pending", joinedAt: "2023-08-22", salary: 59000, birthday: "1991-03-09", avatar: "", address: "Rize, Türkiye" },
    { id: 19, name: "Enes Baran", email: "enes@company.com", phone: "+905551112211", city: "Manisa", department: "Sales", role: "Sales Rep", status: "Active", joinedAt: "2023-09-17", salary: 64000, birthday: "1989-05-25", avatar: "", address: "Manisa, Türkiye" },
    { id: 20, name: "Derya Sarı", email: "derya@company.com", phone: "+905551112222", city: "Aydın", department: "Finance", role: "Accountant", status: "Suspended", joinedAt: "2023-10-11", salary: 71000, birthday: "1993-12-31", avatar: "", address: "Aydın, Türkiye" }
];

const rolePermissions = [
    { role: "Owner", permissions: "Tüm yetkiler, ödeme & plan yönetimi" },
    { role: "Admin", permissions: "Fatura oluşturma, müşteri yönetimi, ayarlar" },
    { role: "Accountant", permissions: "Sadece fatura ve ödeme görüntüleme" },
    { role: "Viewer", permissions: "Sadece görüntüleme, işlem yapamaz" },
]
const statusColors: { [key: string]: string } = {
    "Active": "text-green-600 bg-green-100",
    "Pending": "text-yellow-600 bg-yellow-100",
    "Suspended": "text-red-600 bg-red-100"
}

// Define MemberType
interface MemberType {
    id: number;
    name: string;
    email: string;
    phone: string;
    city: string;
    department: string;
    role: string;
    status: string;
    joinedAt: string;
    salary: number;
    birthday: string;
    avatar: string;
    address: string;
}

export default function TeamSettingsPage() {
    const [filter, setFilter] = useState("All")
    const [inviteModal, setInviteModal] = useState(false)
    const [infoModal, setInfoModal] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteRole, setInviteRole] = useState("admin")
    const [members, setMembers] = useState(mockMembers)
    const [inviteLimit] = useState(5) // örnek limit
    const [showInviteWarning] = useState(false) // limiti aştıysa true yap
    const [selectedMember, setSelectedMember] = useState<MemberType | null>(null)
    const [editMode, setEditMode] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [memberToDelete, setMemberToDelete] = useState<MemberType | null>(null)
    const [editDesktopMember, setEditDesktopMember] = useState<MemberType | null>(null)
    const [editDesktopMode, setEditDesktopMode] = useState(false)

    const filteredMembers = filter === "All" ? members : members.filter(m => m.status === filter)

    // mockRoles dizisini dinamik oluştur
    const uniqueRoles = Array.from(new Set(mockMembers.map(m => m.role)));
    const mockRoles = uniqueRoles.map(role => ({ value: role.toLowerCase().replace(/ /g, "-"), label: role }));

    const allKeys = Object.keys(mockMembers[0]).filter(k => k !== "id" && k !== "avatar");

    // Kolon başlıkları
    const columnLabels: Record<string, string> = {
        name: "Üye",
        email: "E-posta",
        role: "Rol",
        status: "Durum",
        phone: "Telefon",
        city: "Şehir",
        department: "Departman",
        joinedAt: "Katılım",
        salary: "Maaş",
        birthday: "Doğum Tarihi",
        address: "Adres"
    };

    // Masaüstü DataTable için aksiyonlar
    const columns: DataTableColumn[] = allKeys.map(key => {
        if (key === "name") {
            return {
                key,
                header: columnLabels[key] || key,
                cell: (row) => {
                    try {
                        return (
                            <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={row.avatar || ""} alt={row.name || ""} />
                                    <AvatarFallback>{row.name ? row.name[0] : "?"}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{row.name}</span>
                                    <span className="text-xs text-muted-foreground">{row.email}</span>
                                </div>
                            </div>
                        );
                    } catch (e) {
                        console.error("Name cell render error:", e, row);
                        return "Hata";
                    }
                },
                width: 200,
            }
        }
        if (key === "role" || key === "email") {
            return {
                key,
                header: columnLabels[key] || key,
                width: 120,
                cell: (row) => {
                    try {
                        return row[key] ?? "";
                    } catch (e) {
                        console.error(`${key} cell render error:`, e, row);
                        return "Hata";
                    }
                },
            }
        }
        if (key === "status") {
            return {
                key,
                header: columnLabels[key] || key,
                cell: (row) => {
                    try {
                        return (
                            <span className={`text-xs px-2 py-1 rounded ${statusColors[row.status] || ""}`}>{row.status}</span>
                        );
                    } catch (e) {
                        console.error("Status cell render error:", e, row);
                        return "Hata";
                    }
                },
                width: 100,
            }
        }
        // Diğer kolonlar için default cell
        return {
            key,
            header: columnLabels[key] || key,
            width: 120,
            cell: (row) => {
                try {
                    return row[key] ?? "";
                } catch (e) {
                    console.error(`${key} cell render error:`, e, row);
                    return "Hata";
                }
            },
        }
    });
    // Actions kolonu ekle
    columns.push({
        key: "actions",
        header: "",
        cell: (row: MemberType) => {
            try {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {row.status === "Pending" && <DropdownMenuItem><RefreshCw className="w-4 h-4 mr-2" />Davet Yeniden Gönder</DropdownMenuItem>}
                            <DropdownMenuItem onClick={() => { setEditDesktopMember(row); setEditDesktopMode(true); }}><ShieldCheck className="w-4 h-4 mr-2" />Düzenle</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setMemberToDelete(row); setShowDeleteDialog(true); }} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Üyeyi Kaldır</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            } catch (e) {
                console.error("Actions cell render error:", e, row);
                return "Hata";
            }
        },
        width: 60,
        align: "center"
    });

    console.log("columns", columns);
    console.log("filteredMembers", filteredMembers);

    // --- COMPONENTS ---
    function InviteModal() {
        return (
            <Dialog open={inviteModal} onOpenChange={setInviteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yeni Üye Davet Et</DialogTitle>
                    </DialogHeader>
                    <form className="flex flex-col gap-3 py-2" onSubmit={e => { e.preventDefault(); setInviteModal(false); }}>
                        <Input
                            type="email"
                            placeholder="E-posta adresi"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            required
                        />
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                            <SelectTrigger className="w-full">
                                {mockRoles.find(r => r.value === inviteRole)?.label}
                            </SelectTrigger>
                            <SelectContent>
                                {mockRoles.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <DialogFooter className="flex flex-row gap-x-2 mt-2">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setInviteModal(false)}>Vazgeç</Button>
                            <Button type="submit" className="flex-1">Kaydet</Button>
                        </DialogFooter>
                        {showInviteWarning && <div className="text-xs text-destructive mt-1">You can add up to {inviteLimit} members on your current plan.</div>}
                    </form>
                </DialogContent>
            </Dialog>
        )
    }

    function InfoModal() {
        return (
            <Dialog open={infoModal} onOpenChange={setInfoModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rol Yetki Tablosu</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-muted text-foreground">
                                    <th className="px-4 py-2 text-left">Rol</th>
                                    <th className="px-4 py-2 text-left">Yetkiler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rolePermissions.map(r => (
                                    <tr key={r.role} className="border-b last:border-0">
                                        <td className="px-4 py-2 whitespace-nowrap font-medium">{r.role}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{r.permissions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    // Masaüstü için düzenleme modalı
    function EditDesktopModal() {
        return (
            <Dialog open={!!editDesktopMember && editDesktopMode} onOpenChange={open => { if (!open) { setEditDesktopMember(null); setEditDesktopMode(false); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Üye Bilgilerini Düzenle</DialogTitle>
                    </DialogHeader>
                    {editDesktopMember && (
                        <form className="space-y-3">
                            <div>
                                <label className="block text-xs mb-1">Ad Soyad</label>
                                <Input defaultValue={editDesktopMember.name} />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">E-posta</label>
                                <Input defaultValue={editDesktopMember.email} />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">Telefon</label>
                                <Input defaultValue={editDesktopMember.phone} />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">Şehir</label>
                                <Input defaultValue={editDesktopMember.city} />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">Departman</label>
                                <Input defaultValue={editDesktopMember.department} />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">Rol</label>
                                <Select defaultValue={editDesktopMember.role}>
                                    <SelectTrigger className="w-full">
                                        {editDesktopMember.role}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockRoles.map(r => <SelectItem key={r.value} value={r.label}>{r.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-xs mb-1">Maaş</label>
                                <Input defaultValue={editDesktopMember.salary} type="number" />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">Doğum Tarihi</label>
                                <Input defaultValue={editDesktopMember.birthday} type="date" />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">Adres</label>
                                <Input defaultValue={editDesktopMember.address} />
                            </div>
                            <DialogFooter className="flex flex-row gap-x-2 mt-4">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditDesktopMode(false)}>Vazgeç</Button>
                                <Button type="submit" className="flex-1">Kaydet</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        )
    }
    // Silme işlemi için onay modalı
    function DeleteDialog() {
        return (
            <Dialog open={showDeleteDialog} onOpenChange={open => { if (!open) { setShowDeleteDialog(false); setMemberToDelete(null); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Üyeyi Sil</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">Bu üyeyi silmek istediğinize emin misiniz?</div>
                    <DialogFooter className="flex flex-row gap-x-2 mt-4">
                        <Button variant="outline" className="flex-1" onClick={() => { setShowDeleteDialog(false); setMemberToDelete(null); }}>Vazgeç</Button>
                        <Button variant="destructive" className="flex-1"  onClick={() => {
                            if (memberToDelete) {
                                setMembers(members => members.filter(m => m.id !== memberToDelete.id));
                            }
                            setShowDeleteDialog(false); setMemberToDelete(null);
                        }}>Evet, Sil</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    // --- RENDER ---
    return (
        <Card className="w-full max-w-full mx-auto">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 px-2 md:px-6 py-3 md:py-6 w-full max-w-full">
                <div className="w-full">
                    <CardTitle className="text-lg md:text-2xl">Ekip Üyeleri</CardTitle>
                    <CardDescription className="text-xs md:text-base">Ekip üyelerinizi burada yönetebilir, yeni üye davet edebilirsiniz.</CardDescription>
                </div>
                {/* Butonlar: Desktop sağda yanyana, mobilde yanyana ve full width */}
                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <Button size="sm" className="w-1/2 md:w-auto" variant="outline" onClick={() => setInfoModal(true)} ><Info className="w-4 h-4 mr-1" />Rol Yetkileri</Button>
                    <Button size="sm" className="w-1/2 md:w-auto" onClick={() => setInviteModal(true)}><UserPlus className="w-4 h-4 mr-1" />Yeni Üye Davet Et</Button>
                </div>
            </CardHeader>
            <CardContent className="w-full max-w-full px-1 md:px-6 py-3 md:py-6">
                {/* Mobilde üstte sekme menü */}
                <div className="flex md:hidden gap-2 mb-3 overflow-x-auto">
                    {['All', 'Active', 'Pending', 'Suspended'].map(s => (
                        <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="flex-1 whitespace-nowrap">{s}</Button>
                    ))}
                </div>
                {/* Masaüstü için eski filtre butonları */}
                <div className="hidden md:flex gap-2 mb-3">
                    {['All', 'Active', 'Pending', 'Suspended'].map(s => (
                        <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>{s}</Button>
                    ))}
                </div>
                {/* DataTable responsive */}
                <div className="w-full">
                  <DataTable
                    data={filteredMembers}
                    columns={columns}
                    rowHeight={56}
                    headerHeight={48}
                    emptyText="Üye bulunamadı."
                  />
                </div>
            </CardContent>
            <InviteModal />
            <InfoModal />
            <EditDesktopModal />
            <DeleteDialog />
            {/* Mobil Bottom Sheet: Kişi Detayları */}
            <Sheet open={!!selectedMember} onOpenChange={open => { if (!open) { setSelectedMember(null); setEditMode(false); } }}>
                <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl p-0">
                    {selectedMember && (
                        <>
                            <SheetHeader className="p-4 border-b">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={selectedMember.avatar || ""} alt={selectedMember.name || ""} />
                                        <AvatarFallback>{selectedMember.name ? selectedMember.name[0] : "?"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <SheetTitle className="text-lg">{selectedMember.name}</SheetTitle>
                                        <SheetDescription className="text-xs text-muted-foreground">{selectedMember.email}</SheetDescription>
                                    </div>
                                    <span className={`ml-auto text-xs px-2 py-1 rounded ${statusColors[selectedMember.status] || ""}`}>{selectedMember.status}</span>
                                </div>
                            </SheetHeader>
                            <div className="p-4 space-y-2">
                                {editMode ? (
                                    <form className="space-y-3">
                                        <div>
                                            <label className="block text-xs mb-1">Ad Soyad</label>
                                            <Input defaultValue={selectedMember.name} />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1">E-posta</label>
                                            <Input defaultValue={selectedMember.email} />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1">Telefon</label>
                                            <Input defaultValue={selectedMember.phone} />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1">Şehir</label>
                                            <Input defaultValue={selectedMember.city} />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1">Departman</label>
                                            <Input defaultValue={selectedMember.department} />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1">Rol</label>
                                            <Select defaultValue={selectedMember.role}>
                                                <SelectTrigger className="w-full">
                                                    {selectedMember.role}
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {mockRoles.map(r => <SelectItem key={r.value} value={r.label}>{r.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1">Maaş</label>
                                            <Input defaultValue={selectedMember.salary} type="number" />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1">Doğum Tarihi</label>
                                            <Input defaultValue={selectedMember.birthday} type="date" />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1">Adres</label>
                                            <Input defaultValue={selectedMember.address} />
                                        </div>
                                        <SheetFooter className="flex flex-col gap-2 mt-4">
                                            <Button type="submit" className="w-full">Kaydet</Button>
                                            <Button type="button" variant="outline" className="w-full" onClick={() => setEditMode(false)}>Vazgeç</Button>
                                        </SheetFooter>
                                    </form>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="font-medium">Telefon:</span> {selectedMember.phone}
                                            </div>
                                            <div>
                                                <span className="font-medium">Şehir:</span> {selectedMember.city}
                                            </div>
                                            <div>
                                                <span className="font-medium">Departman:</span> {selectedMember.department}
                                            </div>
                                            <div>
                                                <span className="font-medium">Rol:</span> {selectedMember.role}
                                            </div>
                                            <div>
                                                <span className="font-medium">Maaş:</span> {selectedMember.salary}
                                            </div>
                                            <div>
                                                <span className="font-medium">Doğum Tarihi:</span> {selectedMember.birthday}
                                            </div>
                                            <div className="col-span-2">
                                                <span className="font-medium">Adres:</span> {selectedMember.address}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Button size="sm" className="flex-1" variant="outline" onClick={() => setEditMode(true)}><ShieldCheck className="w-4 h-4 mr-1" />Düzenle</Button>
                                            <Button size="sm" className="flex-1" variant="outline"><ShieldCheck className="w-4 h-4 mr-1" />Rolü Değiştir</Button>
                                            <Button size="sm" className="flex-1" variant="outline" color="destructive" onClick={() => { setMemberToDelete(selectedMember); setShowDeleteDialog(true); }}><Trash2 className="w-4 h-4 mr-1" />Kaldır</Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </Card>
    )
} 
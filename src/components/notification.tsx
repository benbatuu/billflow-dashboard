import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CreditCard, Users, Settings, AlertCircle, CheckCircle, Clock, X } from "lucide-react";

const notifications = [
    {
        id: 1,
        title: "Yeni fatura oluşturuldu",
        message: "Müşteri XYZ için 1,250₺ tutarında fatura oluşturuldu",
        time: "2 dakika önce",
        type: "billing",
        read: false,
        priority: "normal"
    },
    {
        id: 2,
        title: "Ödeme alındı",
        message: "ABC Ltd. şirketinden 2,500₺ ödeme alındı",
        time: "5 dakika önce",
        type: "billing",
        read: false,
        priority: "high"
    },
    {
        id: 3,
        title: "Abonelik yenilendi",
        message: "Pro plan aboneliğiniz otomatik olarak yenilendi",
        time: "1 saat önce",
        type: "system",
        read: true,
        priority: "normal"
    },
    {
        id: 4,
        title: "Kullanıcı davet edildi",
        message: "Ahmet Yılmaz takıma davet edildi",
        time: "2 saat önce",
        type: "team",
        read: false,
        priority: "normal"
    },
    {
        id: 5,
        title: "Fatura hatırlatıcısı",
        message: "3 fatura için ödeme hatırlatıcısı gönderildi",
        time: "3 saat önce",
        type: "billing",
        read: true,
        priority: "low"
    },
    {
        id: 6,
        title: "Profil güncellendi",
        message: "Hesap bilgileriniz başarıyla güncellendi",
        time: "1 gün önce",
        type: "system",
        read: true,
        priority: "normal"
    },
    {
        id: 7,
        title: "Yeni takım üyesi",
        message: "Zeynep Kaya takıma katıldı",
        time: "1 gün önce",
        type: "team",
        read: false,
        priority: "normal"
    },
    {
        id: 8,
        title: "Sistem bakımı",
        message: "Planlanan bakım 23:00-01:00 arasında gerçekleşecek",
        time: "2 gün önce",
        type: "system",
        read: true,
        priority: "high"
    },
];

const notificationGroups = {
    billing: {
        label: "Faturalama",
        icon: CreditCard,
    },
    team: {
        label: "Takım",
        icon: Users,
    },
    system: {
        label: "Sistem",
        icon: Settings,
    }
};

const priorityIcons = {
    high: AlertCircle,
    normal: CheckCircle,
    low: Clock
};

const priorityColors = {
    high: "text-red-500",
    normal: "text-green-500",
    low: "text-yellow-500"
};

function NotificationItem({ notification, compact = false }: {
    notification: typeof notifications[0],
    compact?: boolean
}) {
    const group = notificationGroups[notification.type as keyof typeof notificationGroups];
    const IconComponent = group.icon;
    const PriorityIcon = priorityIcons[notification.priority as keyof typeof priorityIcons];

    return (
        <div className={`group relative p-3 rounded-lg border transition-all duration-200 hover:shadow-sm bg-background border-border ${!notification.read ? 'ring-1 ring-primary/30' : ''} ${compact ? 'p-2' : ''}`}>
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                    <IconComponent className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</p>
                        <div className="flex items-center space-x-2">
                            <PriorityIcon className="w-4 h-4 text-muted-foreground" />
                            {!notification.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                    </div>
                    {!compact && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        <Badge variant="outline" className="text-xs border-border text-muted-foreground bg-background">{group.label}</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}

type Notification = {
    id: string;
    type: string;
    title: string;
    message: string;
    priority: 'high' | 'normal' | 'low';
    read: boolean;
    time: string;
    // Diğer gerekli alanlar eklenebilir
};

interface NotificationDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    notifications: Notification[];
}

function NotificationDrawer({ open, onOpenChange, notifications }: NotificationDrawerProps) {
    const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
    const groupedNotifications = React.useMemo(() => {
        const grouped = notifications.reduce((acc, notification) => {
            const group = notification.type;
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(notification);
            return acc;
        }, {} as Record<string, typeof notifications>);
        return grouped;
    }, [notifications]);
    const filteredNotifications = selectedGroup
        ? groupedNotifications[selectedGroup] || []
        : notifications;
    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="w-96 max-w-full ml-auto h-full p-0 border-l bg-background">
                <DrawerHeader className="flex flex-row items-center justify-between px-6 py-4 border-b bg-background">
                    <div>
                        <DrawerTitle className="text-lg font-semibold text-foreground">Bildirimler</DrawerTitle>
                        <p className="text-sm text-muted-foreground mt-1">{notifications.filter(n => !n.read).length} okunmamış bildirim</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                        <X className="w-5 h-5 text-foreground" />
                    </Button>
                </DrawerHeader>
                <div className="p-4 border-b bg-background">
                    <div className="flex space-x-2 mb-4 overflow-x-auto flex-nowrap scrollbar-none">
                        <Button
                            variant={selectedGroup === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedGroup(null)}
                            className={`text-xs ${selectedGroup === null ? 'bg-foreground text-background' : 'bg-background text-foreground border-border'}`}
                        >
                            Tümü ({notifications.length})
                        </Button>
                        {Object.entries(notificationGroups).map(([key, group]) => {
                            const count = groupedNotifications[key]?.length || 0;
                            const IconComponent = group.icon;
                            const selected = selectedGroup === key;
                            return (
                                <Button
                                    key={key}
                                    variant={selected ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedGroup(key)}
                                    className={`text-xs flex items-center space-x-1 ${selected ? 'bg-foreground text-background' : 'bg-background text-foreground border-border'}`}
                                >
                                    <IconComponent className="w-3 h-3" />
                                    <span>{group.label} ({count})</span>
                                </Button>
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            {selectedGroup
                                ? `${notificationGroups[selectedGroup as keyof typeof notificationGroups].label} bildirimleri`
                                : 'Tüm bildirimler'}
                        </span>
                        <Button variant="ghost" size="sm" className="text-xs text-foreground hover:text-primary">
                            Tümünü okundu işaretle
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-background">
                    <div className="space-y-3">
                        {filteredNotifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={{
                                    ...notification,
                                    id: typeof notification.id === "string" ? parseInt(notification.id, 10) : notification.id,
                                }}
                            />
                        ))}
                    </div>
                    {filteredNotifications.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                            <p>Henüz bildirim yok</p>
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default function Notification() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative hover:bg-muted transition-colors">
                        <Bell className="w-5 h-5 text-foreground" />
                        {unreadCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-5 h-5 flex items-center justify-center animate-pulse" variant="destructive">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 bg-background border border-border">
                    <div className="p-4 border-b bg-background">
                        <DropdownMenuLabel className="text-base font-semibold p-0 text-foreground">Bildirimler</DropdownMenuLabel>
                        <p className="text-sm text-muted-foreground mt-1">{unreadCount} okunmamış</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto bg-background">
                        {notifications.slice(0, 4).map((notification) => (
                            <div key={notification.id} className="p-2 border-b last:border-b-0 border-border bg-background">
                                <NotificationItem notification={notification} compact={true} />
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t bg-muted">
                        <Button
                            variant="ghost"
                            className="w-full justify-center text-sm font-medium text-foreground hover:text-primary hover:bg-muted"
                            onClick={() => setDrawerOpen(true)}
                        >
                            Tümünü Görüntüle ({notifications.length})
                        </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <NotificationDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                notifications={notifications.map(n => ({
                    ...n,
                    id: String(n.id),
                    priority: n.priority as "normal" | "high" | "low"
                }))}
            />
        </>
    );
}
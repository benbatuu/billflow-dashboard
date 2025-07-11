"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Key, Lock, Activity, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react"

const securitySettings = {
    account: [
        {
            key: "password_change",
            name: "Password Management",
            icon: "🔐",
            description: "Update your account password and security settings",
            category: "Account Security",
            status: "active",
            lastUpdated: "2 months ago",
            fields: [
                { key: "current_password", label: "Current Password", type: "password", placeholder: "Enter current password" },
                { key: "new_password", label: "New Password", type: "password", placeholder: "Enter new password" },
                { key: "confirm_password", label: "Confirm New Password", type: "password", placeholder: "Confirm new password" }
            ]
        },
        {
            key: "email_security",
            name: "Email Security",
            icon: "📧",
            description: "Manage email verification and security notifications",
            category: "Account Security",
            status: "active",
            lastUpdated: "1 week ago",
            fields: [
                { key: "primary_email", label: "Primary Email", type: "email", placeholder: "your@email.com" },
                { key: "backup_email", label: "Backup Email", type: "email", placeholder: "backup@email.com" },
                { key: "security_notifications", label: "Security Notifications", type: "switch", default: true }
            ]
        },
        {
            key: "account_deletion",
            name: "Account Deletion",
            icon: "🗑️",
            description: "Permanently delete your account and all associated data",
            category: "Account Security",
            status: "inactive",
            lastUpdated: "Never",
            dangerous: true,
            fields: [
                { key: "confirm_deletion", label: "Type 'DELETE' to confirm", type: "text", placeholder: "DELETE" }
            ]
        }
    ],
    authentication: [
        {
            key: "two_factor",
            name: "Two-Factor Authentication",
            icon: "🔒",
            description: "Add an extra layer of security to your account",
            category: "Multi-Factor Auth",
            status: "inactive",
            lastUpdated: "Not configured",
            fields: [
                { key: "auth_method", label: "Authentication Method", type: "select", options: ["SMS", "Authenticator App", "Email"] },
                { key: "phone_number", label: "Phone Number", type: "tel", placeholder: "+90 555 123 4567" },
                { key: "backup_codes", label: "Backup Codes", type: "textarea", placeholder: "Generated backup codes will appear here" }
            ]
        },
        {
            key: "biometric_auth",
            name: "Biometric Authentication",
            icon: "👆",
            description: "Use fingerprint or face recognition for quick access",
            category: "Biometric",
            status: "inactive",
            lastUpdated: "Not configured",
            fields: [
                { key: "fingerprint", label: "Fingerprint", type: "switch", default: false },
                { key: "face_recognition", label: "Face Recognition", type: "switch", default: false },
                { key: "device_trust", label: "Trust This Device", type: "switch", default: false }
            ]
        },
        {
            key: "api_keys",
            name: "API Keys",
            icon: "🔑",
            description: "Manage API keys for third-party integrations",
            category: "API Security",
            status: "active",
            lastUpdated: "3 days ago",
            fields: [
                { key: "api_key_name", label: "Key Name", type: "text", placeholder: "Production API Key" },
                { key: "api_permissions", label: "Permissions", type: "select", options: ["Read Only", "Read & Write", "Full Access"] },
                { key: "expiry_date", label: "Expiry Date", type: "date" }
            ]
        }
    ],
    privacy: [
        {
            key: "data_collection",
            name: "Data Collection",
            icon: "📊",
            description: "Control what data we collect and how it's used",
            category: "Privacy Control",
            status: "active",
            lastUpdated: "1 month ago",
            fields: [
                { key: "analytics", label: "Analytics Data", type: "switch", default: true },
                { key: "marketing", label: "Marketing Communications", type: "switch", default: false },
                { key: "personalization", label: "Personalization", type: "switch", default: true },
                { key: "third_party_sharing", label: "Third-party Sharing", type: "switch", default: false }
            ]
        },
        {
            key: "data_export",
            name: "Data Export",
            icon: "📥",
            description: "Download a copy of your personal data",
            category: "Data Rights",
            status: "active",
            lastUpdated: "Available",
            fields: [
                { key: "export_format", label: "Export Format", type: "select", options: ["JSON", "CSV", "PDF"] },
                { key: "data_types", label: "Data Types", type: "multiselect", options: ["Profile", "Messages", "Files", "Settings"] }
            ]
        },
        {
            key: "gdpr_compliance",
            name: "GDPR Compliance",
            icon: "🇪🇺",
            description: "European data protection regulation compliance",
            category: "Legal Compliance",
            status: "active",
            lastUpdated: "Up to date",
            fields: [
                { key: "consent_marketing", label: "Marketing Consent", type: "switch", default: false },
                { key: "consent_analytics", label: "Analytics Consent", type: "switch", default: true },
                { key: "right_to_forget", label: "Right to be Forgotten", type: "button", text: "Request Data Deletion" }
            ]
        }
    ],
    monitoring: [
        {
            key: "login_activity",
            name: "Login Activity",
            icon: "🔍",
            description: "Monitor and review your account login history",
            category: "Activity Monitoring",
            status: "active",
            lastUpdated: "Real-time",
            fields: [
                { key: "login_notifications", label: "Login Notifications", type: "switch", default: true },
                { key: "suspicious_activity", label: "Suspicious Activity Alerts", type: "switch", default: true },
                { key: "location_tracking", label: "Location Tracking", type: "switch", default: false }
            ]
        },
        {
            key: "device_management",
            name: "Device Management",
            icon: "📱",
            description: "Manage devices that have access to your account",
            category: "Device Security",
            status: "active",
            lastUpdated: "2 devices active",
            fields: [
                { key: "device_limit", label: "Maximum Devices", type: "number", placeholder: "5" },
                { key: "auto_logout", label: "Auto Logout (minutes)", type: "number", placeholder: "30" },
                { key: "device_notifications", label: "New Device Notifications", type: "switch", default: true }
            ]
        },
        {
            key: "security_logs",
            name: "Security Logs",
            icon: "📋",
            description: "View detailed security and access logs",
            category: "Audit Trail",
            status: "active",
            lastUpdated: "Real-time",
            fields: [
                { key: "log_retention", label: "Log Retention (days)", type: "number", placeholder: "90" },
                { key: "log_level", label: "Log Level", type: "select", options: ["Basic", "Detailed", "Verbose"] },
                { key: "export_logs", label: "Export Logs", type: "button", text: "Download Security Logs" }
            ]
        }
    ]
}

const categories = [
    { key: "account", label: "Account", icon: <UserCheck className="w-4 h-4" /> },
    { key: "authentication", label: "Authentication", icon: <Key className="w-4 h-4" /> },
    { key: "privacy", label: "Privacy", icon: <Lock className="w-4 h-4" /> },
    { key: "monitoring", label: "Monitoring", icon: <Activity className="w-4 h-4" /> },
]

function SecurityCard({ setting, onToggle, onSave }: { setting: any, onToggle: (key: string, checked: boolean) => void, onSave: (key: string, data: any) => void }) {
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})

    const handleInputChange = (fieldKey: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldKey]: value }))
    }

    const togglePasswordVisibility = (fieldKey: string) => {
        setShowPassword(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }))
    }

    const handleSave = () => {
        onSave(setting.key, formData)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-black'
            case 'inactive': return 'text-gray-500'
            case 'warning': return 'text-gray-700'
            case 'danger': return 'text-gray-700'
            default: return 'text-gray-500'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle className="w-4 h-4" />
            case 'inactive': return <XCircle className="w-4 h-4" />
            case 'warning': return <AlertTriangle className="w-4 h-4" />
            case 'danger': return <AlertTriangle className="w-4 h-4" />
            default: return <XCircle className="w-4 h-4" />
        }
    }

    return (
        <Card className={`group border border-gray-200 bg-white shadow-none hover:shadow-md transition-all duration-200 ${setting.dangerous ? 'border border-gray-300' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold ${setting.dangerous ? 'bg-gray-900' : 'bg-gray-900'}`}>{setting.icon}</div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">{setting.name}</CardTitle>
                            <CardDescription className="text-sm text-gray-500 mt-1">{setting.description}</CardDescription>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs px-2 py-1 border-gray-300 text-gray-700 bg-white">{setting.category}</Badge>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {setting.lastUpdated}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${getStatusColor(setting.status)}`}>{getStatusIcon(setting.status)}<span className="text-xs font-medium capitalize">{setting.status}</span></div>
                        {!setting.dangerous && (
                            <Switch
                                checked={setting.status === "active"}
                                onCheckedChange={(checked) => onToggle(setting.key, checked)}
                                className="data-[state=checked]:bg-black border-gray-300"
                            />
                        )}
                    </div>
                </div>
            </CardHeader>
            {(setting.status === "active" || setting.dangerous) && (
                <CardContent className="pt-0">
                    <div className={`space-y-4 p-4 rounded-lg border ${setting.dangerous ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                        {setting.dangerous && (
                            <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="font-medium">Warning</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">This action is permanent and cannot be undone. All your data will be deleted.</p>
                            </div>
                        )}
                        <div className="grid gap-4">
                            {setting.fields.map((field: any) => (
                                <div key={field.key} className="space-y-2">
                                    <Label htmlFor={field.key} className="text-sm font-medium text-gray-700">{field.label}</Label>
                                    {field.type === "switch" ? (
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id={field.key}
                                                checked={formData[field.key] ?? field.default ?? false}
                                                onCheckedChange={(checked) => handleInputChange(field.key, checked)}
                                                className="data-[state=checked]:bg-black border-gray-300"
                                            />
                                            <span className="text-sm text-gray-600">{formData[field.key] ?? field.default ? "Enabled" : "Disabled"}</span>
                                        </div>
                                    ) : field.type === "select" ? (
                                        <select
                                            id={field.key}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900"
                                            value={formData[field.key] || ""}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            {field.options?.map((option: string) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : field.type === "textarea" ? (
                                        <textarea
                                            id={field.key}
                                            placeholder={field.placeholder}
                                            value={formData[field.key] || ""}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-24 resize-none bg-white text-gray-900"
                                        />
                                    ) : field.type === "password" ? (
                                        <div className="relative">
                                            <Input
                                                id={field.key}
                                                type={showPassword[field.key] ? "text" : "password"}
                                                placeholder={field.placeholder}
                                                value={formData[field.key] || ""}
                                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                className="border-gray-200 focus:border-black focus:ring-black pr-10 bg-white text-gray-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility(field.key)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword[field.key] ? <span>🙈</span> : <span>👁️</span>}
                                            </button>
                                        </div>
                                    ) : field.type === "button" ? (
                                        <Button
                                            variant={setting.dangerous ? "destructive" : "outline"}
                                            size="sm"
                                            className="w-full border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                                        >
                                            {field.text}
                                        </Button>
                                    ) : (
                                        <Input
                                            id={field.key}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            value={formData[field.key] || ""}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                            className="border-gray-200 focus:border-black focus:ring-black bg-white text-gray-900"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100">Cancel</Button>
                            <Button size="sm" onClick={handleSave} variant={setting.dangerous ? "destructive" : "default"} className={setting.dangerous ? "" : "bg-black text-white hover:bg-gray-900"}>{setting.dangerous ? "Confirm Deletion" : "Save Changes"}</Button>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

export default function SecuritySettingsPage() {
    const [settingStatuses, setSettingStatuses] = useState(() => {
        const statuses: Record<string, string> = {}
        Object.values(securitySettings).flat().forEach((setting: any) => {
            statuses[setting.key] = setting.status
        })
        return statuses
    })
    const [selectedCategory, setSelectedCategory] = useState<string>("account")

    const handleToggle = (key: string, checked: boolean) => {
        setSettingStatuses(prev => ({
            ...prev,
            [key]: checked ? "active" : "inactive"
        }))
    }

    const handleSave = (key: string, data: any) => {
        // Save logic
    }

    const getUpdatedSettings = (categorySettings: any[]) => {
        return categorySettings.map((setting: any) => ({
            ...setting,
            status: settingStatuses[setting.key] || setting.status
        }))
    }

    const activeCount = Object.values(settingStatuses).filter(status => status === "active").length
    const totalCount = Object.values(securitySettings).flat().length

    return (
        <div className="w-full mx-auto flex flex-col md:flex-row gap-0 md:gap-8">
            {/* Mobilde üstte yatay sekme menü */}
            <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200">
                <nav className="flex flex-row gap-2 overflow-x-auto px-2 py-2">
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === cat.key ? "bg-black text-white" : "bg-gray-100 text-gray-900"}`}
                            onClick={() => setSelectedCategory(cat.key)}
                        >
                            <span className="mr-1">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </nav>
            </div>
            {/* Dikey Tab Menüsü (sadece md+) */}
            <aside className="hidden md:block w-56 flex-shrink-0 border-r border-gray-200 bg-white py-8">
                <nav className="flex flex-col gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-left font-medium transition-colors text-gray-900 hover:bg-gray-100 ${selectedCategory === cat.key ? "bg-black text-white hover:bg-black" : ""}`}
                            onClick={() => setSelectedCategory(cat.key)}
                        >
                            <span className="mr-2">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </nav>
            </aside>
            {/* İçerik */}
            <main className="flex-1 py-4 md:py-8">
                <div className="mb-4 md:mb-8">
                    <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Security Settings</h1>
                    <p className="text-xs md:text-gray-600 md:mb-2">Protect your account with advanced security features</p>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                        <div className="border border-gray-200 rounded-lg px-3 py-2 bg-white">
                            <span className="text-xs md:text-sm text-gray-700">
                                <strong>{activeCount}</strong> of <strong>{totalCount}</strong> security features active
                            </span>
                        </div>
                        <div className="border border-gray-200 rounded-lg px-3 py-2 bg-white">
                            <span className="text-xs md:text-sm text-gray-700">
                                Security Score: <strong className="text-black">85%</strong>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {getUpdatedSettings((securitySettings as any)[selectedCategory]).map((setting: any) => (
                        <SecurityCard key={setting.key} setting={setting} onToggle={handleToggle} onSave={handleSave} />
                    ))}
                </div>
            </main>
        </div>
    )
}
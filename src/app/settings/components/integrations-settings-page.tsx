"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Settings, CreditCard, Calculator, Bell, Zap, ExternalLink, Check, X } from "lucide-react"

const integrations = {
    payment: [
        {
            key: "stripe",
            name: "Stripe",
            icon: "💳",
            description: "Global online payment processing with advanced features",
            category: "Payment Gateway",
            status: "connected",
            docs: "https://stripe.com/docs",
            fields: [
                { key: "publishable_key", label: "Publishable Key", type: "text", placeholder: "pk_test_..." },
                { key: "secret_key", label: "Secret Key", type: "password", placeholder: "sk_test_..." },
                { key: "webhook_secret", label: "Webhook Secret", type: "password", placeholder: "whsec_..." }
            ]
        },
        {
            key: "iyzico",
            name: "iyzico",
            icon: "🇹🇷",
            description: "Leading payment infrastructure for Turkish market",
            category: "Payment Gateway",
            status: "not_connected",
            docs: "https://dev.iyzipay.com/tr",
            fields: [
                { key: "api_key", label: "API Key", type: "text", placeholder: "sandbox-..." },
                { key: "secret_key", label: "Secret Key", type: "password", placeholder: "sandbox-..." },
                { key: "base_url", label: "Base URL", type: "text", placeholder: "https://sandbox-api.iyzipay.com" }
            ]
        },
        {
            key: "paypal",
            name: "PayPal",
            icon: "💰",
            description: "Worldwide payment system with buyer protection",
            category: "Payment Gateway",
            status: "not_connected",
            docs: "https://developer.paypal.com/",
            fields: [
                { key: "client_id", label: "Client ID", type: "text", placeholder: "AYjcyDnhEixyz..." },
                { key: "client_secret", label: "Client Secret", type: "password", placeholder: "EK8Z7qRtNEGz..." },
                { key: "mode", label: "Mode", type: "select", options: ["sandbox", "live"] }
            ]
        }
    ],
    accounting: [
        {
            key: "quickbooks",
            name: "QuickBooks",
            icon: "📊",
            description: "Comprehensive accounting and financial management",
            category: "Accounting Software",
            status: "not_connected",
            docs: "https://developer.intuit.com/",
            fields: [
                { key: "company_id", label: "Company ID", type: "text", placeholder: "123456789..." },
                { key: "access_token", label: "Access Token", type: "password", placeholder: "eyJlbmMiOiJBMTI4Q0JDLUhTMjU2..." },
                { key: "refresh_token", label: "Refresh Token", type: "password", placeholder: "L011546037639..." }
            ]
        },
        {
            key: "xero",
            name: "Xero",
            icon: "☁️",
            description: "Cloud-based accounting software for small businesses",
            category: "Accounting Software",
            status: "not_connected",
            docs: "https://developer.xero.com/",
            fields: [
                { key: "client_id", label: "Client ID", type: "text", placeholder: "D4F8E99A-..." },
                { key: "client_secret", label: "Client Secret", type: "password", placeholder: "hQcXXvXvXv..." },
                { key: "tenant_id", label: "Tenant ID", type: "text", placeholder: "12345678-..." }
            ]
        },
        {
            key: "parasut",
            name: "Paraşüt",
            icon: "🪂",
            description: "Online pre-accounting solution for Turkey",
            category: "Accounting Software",
            status: "not_connected",
            docs: "https://api.parasut.com/",
            fields: [
                { key: "client_id", label: "Client ID", type: "text", placeholder: "12345..." },
                { key: "client_secret", label: "Client Secret", type: "password", placeholder: "abcdefgh..." },
                { key: "company_id", label: "Company ID", type: "text", placeholder: "123456" }
            ]
        }
    ],
    notifications: [
        {
            key: "mailgun",
            name: "Mailgun",
            icon: "📧",
            description: "Reliable email delivery service for developers",
            category: "Email Service",
            status: "not_connected",
            docs: "https://documentation.mailgun.com/",
            fields: [
                { key: "api_key", label: "API Key", type: "password", placeholder: "key-..." },
                { key: "domain", label: "Domain", type: "text", placeholder: "mg.yourdomain.com" },
                { key: "region", label: "Region", type: "select", options: ["US", "EU"] }
            ]
        },
        {
            key: "sendgrid",
            name: "SendGrid",
            icon: "✉️",
            description: "Email API and marketing platform",
            category: "Email Service",
            status: "not_connected",
            docs: "https://docs.sendgrid.com/",
            fields: [
                { key: "api_key", label: "API Key", type: "password", placeholder: "SG...." },
                { key: "from_email", label: "From Email", type: "email", placeholder: "noreply@yourapp.com" },
                { key: "from_name", label: "From Name", type: "text", placeholder: "Your App Name" }
            ]
        },
        {
            key: "twilio",
            name: "Twilio",
            icon: "📱",
            description: "SMS and communication APIs",
            category: "Communication",
            status: "not_connected",
            docs: "https://www.twilio.com/docs",
            fields: [
                { key: "account_sid", label: "Account SID", type: "text", placeholder: "AC..." },
                { key: "auth_token", label: "Auth Token", type: "password", placeholder: "..." },
                { key: "phone_number", label: "Phone Number", type: "text", placeholder: "+1234567890" }
            ]
        },
        {
            key: "slack",
            name: "Slack",
            icon: "💬",
            description: "Team communication and collaboration",
            category: "Communication",
            status: "not_connected",
            docs: "https://api.slack.com/",
            fields: [
                { key: "bot_token", label: "Bot Token", type: "password", placeholder: "xoxb-..." },
                { key: "webhook_url", label: "Webhook URL", type: "text", placeholder: "https://hooks.slack.com/..." },
                { key: "channel", label: "Default Channel", type: "text", placeholder: "#general" }
            ]
        }
    ],
    automation: [
        {
            key: "zapier",
            name: "Zapier",
            icon: "⚡",
            description: "Automation platform connecting thousands of apps",
            category: "Automation",
            status: "not_connected",
            docs: "https://platform.zapier.com/",
            fields: [
                { key: "webhook_url", label: "Webhook URL", type: "text", placeholder: "https://hooks.zapier.com/..." },
                { key: "api_key", label: "API Key", type: "password", placeholder: "..." }
            ]
        },
        {
            key: "webhook",
            name: "Custom Webhook",
            icon: "🔗",
            description: "Custom API connections and integrations",
            category: "Custom",
            status: "not_connected",
            docs: "",
            fields: [
                { key: "url", label: "Webhook URL", type: "text", placeholder: "https://your-api.com/webhook" },
                { key: "secret", label: "Secret", type: "password", placeholder: "webhook_secret" },
                { key: "method", label: "Method", type: "select", options: ["POST", "PUT", "PATCH"] }
            ]
        }
    ]
}

const categories = [
    { key: "payment", label: "Payments", icon: <CreditCard className="w-4 h-4" /> },
    { key: "accounting", label: "Accounting", icon: <Calculator className="w-4 h-4" /> },
    { key: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { key: "automation", label: "Automation", icon: <Zap className="w-4 h-4" /> },
]

function IntegrationCard({ integration, onToggle }: { integration: any, onToggle: (key: string, checked: boolean) => void }) {
    const [formData, setFormData] = useState<Record<string, string>>({})

    const handleInputChange = (fieldKey: string, value: string) => {
        setFormData(prev => ({ ...prev, [fieldKey]: value }))
    }

    const handleSave = () => {
        // Save logic
    }

    return (
        <Card className="group border border-gray-200 bg-white shadow-none hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                            {integration.icon}
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">{integration.name}</CardTitle>
                            <CardDescription className="text-sm text-gray-500 mt-1">
                                {integration.description}
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs px-2 py-1 border-gray-300 text-gray-700 bg-white">
                                    {integration.category}
                                </Badge>
                                {integration.docs && (
                                    <a
                                        href={integration.docs}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-gray-700 underline flex items-center gap-1 hover:text-black"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Docs
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {integration.status === "connected" ? (
                                <Check className="w-4 h-4 text-black" />
                            ) : (
                                <X className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={`text-xs font-medium ${integration.status === "connected" ? "text-black" : "text-gray-500"}`}>
                                {integration.status === "connected" ? "Connected" : "Not Connected"}
                            </span>
                        </div>
                        <Switch
                            checked={integration.status === "connected"}
                            onCheckedChange={(checked) => {
                                onToggle(integration.key, checked)
                            }}
                            className="data-[state=checked]:bg-black border-gray-300"
                        />
                    </div>
                </div>
            </CardHeader>

            {integration.status === "connected" && (
                <CardContent className="pt-0">
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-4">Configuration</h4>
                        <div className="grid gap-4">
                            {integration.fields.map((field: any) => (
                                <div key={field.key} className="space-y-2">
                                    <Label htmlFor={field.key} className="text-sm font-medium text-gray-700">
                                        {field.label}
                                    </Label>
                                    {field.type === "select" ? (
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
                            <Button variant="outline" size="sm" onClick={() => { }} className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100">
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleSave} className="bg-black text-white hover:bg-gray-900">
                                Save Configuration
                            </Button>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

export default function IntegrationsSettingsPage() {
    const [integrationStatuses, setIntegrationStatuses] = useState(() => {
        const statuses: Record<string, string> = {}
        Object.values(integrations).flat().forEach((integration: any) => {
            statuses[integration.key] = integration.status
        })
        return statuses
    })
    const [selectedCategory, setSelectedCategory] = useState<string>("payment")

    const handleToggle = (key: string, checked: boolean) => {
        setIntegrationStatuses(prev => ({
            ...prev,
            [key]: checked ? "connected" : "not_connected"
        }))
    }

    const getUpdatedIntegrations = (categoryIntegrations: any[]) => {
        return categoryIntegrations.map((integration: any) => ({
            ...integration,
            status: integrationStatuses[integration.key] || integration.status
        }))
    }

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {getUpdatedIntegrations((integrations as any)[selectedCategory]).map((integration: any) => (
                        <IntegrationCard key={integration.key} integration={integration} onToggle={handleToggle} />
                    ))}
                </div>
            </main>
        </div>
    )
} 
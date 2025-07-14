"use client"

import React, { useEffect, useState } from 'react';
import {
    Building2,
    Users,
    FileText,
    CreditCard,
    Activity,
    DollarSign,
    BarChart3,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { t, getCurrentLang } from '@/lib/i18n';

// Çeviri anahtarları
const translationKeys = {
    title: 'system-stats.title',
    subtitle: 'system-stats.subtitle',
    summary: 'system-stats.summary',
    recent_activities: 'system-stats.recent_activities',
    system_status: 'system-stats.system_status',
    uptime: 'system-stats.uptime',
    avg_response: 'system-stats.avg_response',
    active_users: 'system-stats.active_users',
    metric: {
        total_companies: 'system-stats.metric.total_companies',
        total_users: 'system-stats.metric.total_users',
        total_invoices: 'system-stats.metric.total_invoices',
        total_subscriptions: 'system-stats.metric.total_subscriptions',
        monthly_revenue: 'system-stats.metric.monthly_revenue',
        active_users: 'system-stats.metric.active_users',
    },
    trend: {
        this_month: 'system-stats.trend.this_month',
        this_week: 'system-stats.trend.this_week',
        vs_last_month: 'system-stats.trend.vs_last_month',
        last_24h: 'system-stats.trend.last_24h',
    },
    activity: {
        new_company: 'system-stats.activity.new_company',
        subscription_renewed: 'system-stats.activity.subscription_renewed',
        invoice_paid: 'system-stats.activity.invoice_paid',
        user_added: 'system-stats.activity.user_added',
        subscription_cancelled: 'system-stats.activity.subscription_cancelled',
    },
    time: {
        '2h_ago': 'system-stats.time.2h_ago',
        '5h_ago': 'system-stats.time.5h_ago',
        '1d_ago': 'system-stats.time.1d_ago',
        '2d_ago': 'system-stats.time.2d_ago',
        '3d_ago': 'system-stats.time.3d_ago',
    },
};

const statsDataRaw = [
    {
        id: 1,
        metric: 'total_companies',
        value: 3,
        icon: Building2,
        trend: { value: '+1', direction: 'up', period: 'this_month' },
        color: 'blue'
    },
    {
        id: 2,
        metric: 'total_users',
        value: 5,
        icon: Users,
        trend: { value: '+2', direction: 'up', period: 'this_week' },
        color: 'green'
    },
    {
        id: 3,
        metric: 'total_invoices',
        value: 32,
        icon: FileText,
        trend: { value: '+8', direction: 'up', period: 'this_month' },
        color: 'purple'
    },
    {
        id: 4,
        metric: 'total_subscriptions',
        value: 7,
        icon: CreditCard,
        trend: { value: '+1', direction: 'up', period: 'this_month' },
        color: 'orange'
    },
    {
        id: 5,
        metric: 'monthly_revenue',
        value: '₺12.500',
        icon: DollarSign,
        trend: { value: '+12%', direction: 'up', period: 'vs_last_month' },
        color: 'emerald'
    },
    {
        id: 6,
        metric: 'active_users',
        value: 4,
        icon: Activity,
        trend: { value: '0', direction: 'stable', period: 'last_24h' },
        color: 'blue'
    }
];

const recentActivitiesRaw = [
    { id: 1, action: 'new_company', company: 'ABC Ltd.', time: '2h_ago', type: 'company' },
    { id: 2, action: 'subscription_renewed', company: 'XYZ Corp.', time: '5h_ago', type: 'subscription' },
    { id: 3, action: 'invoice_paid', company: 'Tech Inc.', time: '1d_ago', type: 'payment' },
    { id: 4, action: 'user_added', company: 'Start Ltd.', time: '2d_ago', type: 'user' },
    { id: 5, action: 'subscription_cancelled', company: 'Old Corp.', time: '3d_ago', type: 'cancellation' }
];

function StatCard({ metric, value, icon: Icon, trend, color, tDict }: { metric: string, value: any, icon: any, trend: any, color: string, tDict: any }) {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
        green: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800',
        purple: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800',
        orange: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
    };

    const getTrendIcon = () => {
        if (trend.direction === 'up') return <ArrowUpRight className="w-3 h-3" />;
        if (trend.direction === 'down') return <ArrowDownRight className="w-3 h-3" />;
        return null;
    };

    const getTrendColor = () => {
        if (trend.direction === 'up') return 'text-green-600 dark:text-green-400';
        if (trend.direction === 'down') return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    return (
        <div className="bg-card rounded-lg border p-6 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg border ${colorClasses[color]}`}> <Icon className="w-5 h-5" /> </div>
                {trend && (
                    <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}> {getTrendIcon()} <span>{trend.value}</span> </div>
                )}
            </div>
            <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">{tDict.metric[metric]}</h3>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                {trend && (
                    <p className="text-xs text-muted-foreground">{tDict.trend[trend.period]}</p>
                )}
            </div>
        </div>
    );
}

function ActivityItem({ activity, tDict }: { activity: any, tDict: any }) {
    const getActivityColor = () => {
        switch (activity.type) {
            case 'company': return 'bg-blue-500 dark:bg-blue-400';
            case 'subscription': return 'bg-green-500 dark:bg-green-400';
            case 'payment': return 'bg-purple-500 dark:bg-purple-400';
            case 'user': return 'bg-orange-500 dark:bg-orange-400';
            case 'cancellation': return 'bg-red-500 dark:bg-red-400';
            default: return 'bg-gray-500 dark:bg-gray-400';
        }
    };
    return (
        <div className="flex items-center space-x-3 p-3 hover:bg-accent rounded-lg transition-colors">
            <div className={`w-2 h-2 rounded-full ${getActivityColor()}`}></div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{tDict.activity[activity.action]}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.company}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{tDict.time[activity.time]}</span>
        </div>
    );
}

export default function SystemStatsPage() {
    const [tDict, setTDict] = useState<any | null>(null);
    const [lang, setLang] = useState(getCurrentLang());

    // Çevirileri yükle
    useEffect(() => {
        async function loadTranslations() {
            const [title, subtitle, summary, recent_activities, system_status, uptime, avg_response, active_users,
                total_companies, total_users, total_invoices, total_subscriptions, monthly_revenue, metric_active_users,
                trend_this_month, trend_this_week, trend_vs_last_month, trend_last_24h,
                activity_new_company, activity_subscription_renewed, activity_invoice_paid, activity_user_added, activity_subscription_cancelled,
                time_2h_ago, time_5h_ago, time_1d_ago, time_2d_ago, time_3d_ago
            ] = await Promise.all([
                t(translationKeys.title),
                t(translationKeys.subtitle),
                t(translationKeys.summary),
                t(translationKeys.recent_activities),
                t(translationKeys.system_status),
                t(translationKeys.uptime),
                t(translationKeys.avg_response),
                t(translationKeys.active_users),
                t(translationKeys.metric.total_companies),
                t(translationKeys.metric.total_users),
                t(translationKeys.metric.total_invoices),
                t(translationKeys.metric.total_subscriptions),
                t(translationKeys.metric.monthly_revenue),
                t(translationKeys.metric.active_users),
                t(translationKeys.trend.this_month),
                t(translationKeys.trend.this_week),
                t(translationKeys.trend.vs_last_month),
                t(translationKeys.trend.last_24h),
                t(translationKeys.activity.new_company),
                t(translationKeys.activity.subscription_renewed),
                t(translationKeys.activity.invoice_paid),
                t(translationKeys.activity.user_added),
                t(translationKeys.activity.subscription_cancelled),
                t(translationKeys.time['2h_ago']),
                t(translationKeys.time['5h_ago']),
                t(translationKeys.time['1d_ago']),
                t(translationKeys.time['2d_ago']),
                t(translationKeys.time['3d_ago'])
            ]);
            setTDict({
                title, subtitle, summary, recent_activities, system_status, uptime, avg_response, active_users,
                metric: {
                    total_companies, total_users, total_invoices, total_subscriptions, monthly_revenue, active_users: metric_active_users
                },
                trend: {
                    this_month: trend_this_month, this_week: trend_this_week, vs_last_month: trend_vs_last_month, last_24h: trend_last_24h
                },
                activity: {
                    new_company: activity_new_company,
                    subscription_renewed: activity_subscription_renewed,
                    invoice_paid: activity_invoice_paid,
                    user_added: activity_user_added,
                    subscription_cancelled: activity_subscription_cancelled
                },
                time: {
                    '2h_ago': time_2h_ago,
                    '5h_ago': time_5h_ago,
                    '1d_ago': time_1d_ago,
                    '2d_ago': time_2d_ago,
                    '3d_ago': time_3d_ago
                }
            });
        }
        loadTranslations();
        // Dil değişimini dinle
        const onStorage = () => setLang(getCurrentLang());
        window.addEventListener('storage', onStorage);
        window.addEventListener('langchange', onStorage);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('langchange', onStorage);
        };
    }, [lang]);

    if (!tDict) {
        return <div className="p-8 text-muted-foreground">Loading...</div>;
    }

    return (
        <div className="p-4 space-y-4">
            {/* Ana İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                {statsDataRaw.map((stat) => (
                    <StatCard
                        key={stat.id}
                        metric={stat.metric}
                        value={stat.value}
                        icon={stat.icon}
                        trend={stat.trend}
                        color={stat.color}
                        tDict={tDict}
                    />
                ))}
            </div>

            {/* Detay Panelleri */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Özet Tablo */}
                <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground">{tDict.summary}</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-sm text-muted-foreground">{tDict.metric.total_companies}</span>
                            <span className="text-sm font-medium text-foreground">3</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-sm text-muted-foreground">{tDict.metric.total_users}</span>
                            <span className="text-sm font-medium text-foreground">5</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-sm text-muted-foreground">{tDict.metric.total_invoices}</span>
                            <span className="text-sm font-medium text-foreground">32</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-sm text-muted-foreground">{tDict.metric.total_subscriptions}</span>
                            <span className="text-sm font-medium text-foreground">7</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-muted-foreground">{tDict.metric.monthly_revenue}</span>
                            <span className="text-sm font-medium text-foreground">₺12.500</span>
                        </div>
                    </div>
                </div>

                {/* Son Aktiviteler */}
                <div className="bg-card rounded-lg border p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground">{tDict.recent_activities}</h3>
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                        {recentActivitiesRaw.map((activity) => (
                            <ActivityItem key={activity.id} activity={activity} tDict={tDict} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Sistem Durumu */}
            <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Activity className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">{tDict.system_status}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.9%</div>
                        <div className="text-sm text-green-700 dark:text-green-300">{tDict.uptime}</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24ms</div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">{tDict.avg_response}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4</div>
                        <div className="text-sm text-purple-700 dark:text-purple-300">{tDict.active_users}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
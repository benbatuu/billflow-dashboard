'use client';

import React, { useState, useEffect } from 'react';
import {
    Building2,
    Users,
    DollarSign,
    Calendar,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Plus,
    Moon,
    Sun,
    Globe,
    TrendingUp,
    TrendingDown,
    Activity,
    CreditCard,
    Mail,
    Phone,
    MapPin,
    User,
    X
} from 'lucide-react';
import { t, getCurrentLang } from '@/lib/i18n';

// Mock data - gerçek uygulamada API'den gelecek
const mockCompanies = [
    {
        id: 1,
        name: "Acme Corporation",
        email: "contact@acme.com",
        phone: "+1 (555) 123-4567",
        address: "123 Business St, New York, NY 10001",
        plan: "Enterprise",
        status: "active",
        registrationDate: "2024-01-15",
        lastLogin: "2024-07-14",
        monthlyRevenue: 4500,
        userCount: 25,
        storageUsed: 15.5,
        storageLimit: 100,
        contactPerson: "John Smith",
        industry: "Technology"
    },
    {
        id: 2,
        name: "Global Tech Solutions",
        email: "info@globaltech.com",
        phone: "+1 (555) 987-6543",
        address: "456 Innovation Ave, San Francisco, CA 94105",
        plan: "Professional",
        status: "active",
        registrationDate: "2024-02-20",
        lastLogin: "2024-07-13",
        monthlyRevenue: 2800,
        userCount: 12,
        storageUsed: 8.2,
        storageLimit: 50,
        contactPerson: "Sarah Johnson",
        industry: "Consulting"
    },
    {
        id: 3,
        name: "StartUp Innovations",
        email: "hello@startup.com",
        phone: "+1 (555) 456-7890",
        address: "789 Startup Blvd, Austin, TX 73301",
        plan: "Basic",
        status: "trial",
        registrationDate: "2024-06-10",
        lastLogin: "2024-07-12",
        monthlyRevenue: 99,
        userCount: 3,
        storageUsed: 2.1,
        storageLimit: 10,
        contactPerson: "Mike Davis",
        industry: "Software"
    },
    {
        id: 4,
        name: "Enterprise Solutions Ltd",
        email: "sales@enterprise.com",
        phone: "+1 (555) 321-0987",
        address: "321 Corporate Dr, Chicago, IL 60601",
        plan: "Enterprise",
        status: "suspended",
        registrationDate: "2023-11-05",
        lastLogin: "2024-07-01",
        monthlyRevenue: 6200,
        userCount: 45,
        storageUsed: 35.8,
        storageLimit: 100,
        contactPerson: "Lisa Brown",
        industry: "Manufacturing"
    }
];

const CompaniesPage = () => {
    const [isDark, setIsDark] = useState(false);
    const [language, setLanguage] = useState(getCurrentLang());
    const [companies, setCompanies] = useState(mockCompanies);
    const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPlan, setFilterPlan] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [translations, setTranslations] = useState<any | null>(null);

    // Translation keys to load
    const translationKeys = [
        'companies.title', 
        'companies.dashboard',
        'companies.stats.totalCompanies', 'companies.stats.activeCompanies', 'companies.stats.totalRevenue', 'companies.stats.averageUsers',
        'companies.filters.search', 'companies.filters.filterByStatus', 'companies.filters.filterByPlan', 'companies.filters.all', 'companies.filters.active', 'companies.filters.trial', 'companies.filters.suspended', 'companies.filters.basic', 'companies.filters.professional', 'companies.filters.enterprise',
        'companies.table.company', 'companies.table.plan', 'companies.table.status', 'companies.table.revenue', 'companies.table.users', 'companies.table.lastLogin', 'companies.table.actions',
        'companies.actions.view', 'companies.actions.edit', 'companies.actions.delete',
        'companies.details.companyDetails', 'companies.details.contactInformation', 'companies.details.subscriptionDetails', 'companies.details.usageStatistics',
        'companies.fields.name', 'companies.fields.email', 'companies.fields.phone', 'companies.fields.address', 'companies.fields.contactPerson', 'companies.fields.industry', 'companies.fields.registrationDate', 'companies.fields.monthlyRevenue', 'companies.fields.userCount', 'companies.fields.storageUsed', 'companies.fields.storageLimit',
        'companies.buttons.close', 'companies.buttons.save', 'companies.buttons.cancel',
        'companies.status.active', 'companies.status.trial', 'companies.status.suspended'
    ];

    useEffect(() => {
        async function loadTranslations() {
            const values = await Promise.all(translationKeys.map(key => t(key)));
            const dict: any = {};
            translationKeys.forEach((key, i) => { dict[key] = values[i]; });
            setTranslations(dict);
        }
        loadTranslations();
        const onLangChange = () => setLanguage(getCurrentLang());
        window.addEventListener('storage', onLangChange);
        window.addEventListener('langchange', onLangChange);
        return () => {
            window.removeEventListener('storage', onLangChange);
            window.removeEventListener('langchange', onLangChange);
        };
    }, [language]);

    if (!translations) {
        return <div className="p-8 text-muted-foreground">Loading...</div>;
    }

    // Helper to get translation
    const tt = (key: string) => translations[key] || key;

    // Filtrelenmiş şirketler
    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || company.status === filterStatus;
        const matchesPlan = filterPlan === 'all' || company.plan.toLowerCase() === filterPlan;

        return matchesSearch && matchesStatus && matchesPlan;
    });

    // İstatistikler
    const stats = {
        totalCompanies: companies.length,
        activeCompanies: companies.filter(c => c.status === 'active').length,
        totalRevenue: companies.reduce((sum, c) => sum + c.monthlyRevenue, 0),
        averageUsers: Math.round(companies.reduce((sum, c) => sum + c.userCount, 0) / companies.length)
    };

    // Status badge rengi
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'trial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    // Plan badge rengi
    const getPlanColor = (plan: string) => {
        switch (plan.toLowerCase()) {
            case 'basic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'professional': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'enterprise': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
            }`}>
            <div className="p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className={`p-6 rounded-lg transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        } border`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {tt('companies.stats.totalCompanies')}
                                </p>
                                <p className="text-2xl font-bold">{stats.totalCompanies}</p>
                            </div>
                            <Building2 className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className={`p-6 rounded-lg transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        } border`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {tt('companies.stats.activeCompanies')}
                                </p>
                                <p className="text-2xl font-bold text-green-600">{stats.activeCompanies}</p>
                            </div>
                            <Activity className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className={`p-6 rounded-lg transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        } border`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {tt('companies.stats.totalRevenue')}
                                </p>
                                <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className={`p-6 rounded-lg transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        } border`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {tt('companies.stats.averageUsers')}
                                </p>
                                <p className="text-2xl font-bold">{stats.averageUsers}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className={`p-6 rounded-lg mb-6 transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } border`}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={tt('companies.filters.search')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${isDark
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                            >
                                <option value="all">{tt('companies.filters.all')}</option>
                                <option value="active">{tt('companies.filters.active')}</option>
                                <option value="trial">{tt('companies.filters.trial')}</option>
                                <option value="suspended">{tt('companies.filters.suspended')}</option>
                            </select>

                            <select
                                value={filterPlan}
                                onChange={(e) => setFilterPlan(e.target.value)}
                                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                            >
                                <option value="all">{tt('companies.filters.all')}</option>
                                <option value="basic">{tt('companies.filters.basic')}</option>
                                <option value="professional">{tt('companies.filters.professional')}</option>
                                <option value="enterprise">{tt('companies.filters.enterprise')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Companies Table */}
                <div className={`rounded-lg border transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`border-b transition-colors duration-200 ${isDark ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                <tr>
                                    <th className={`text-left p-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {tt('companies.table.company')}
                                    </th>
                                    <th className={`text-left p-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {tt('companies.table.plan')}
                                    </th>
                                    <th className={`text-left p-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {tt('companies.table.status')}
                                    </th>
                                    <th className={`text-left p-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {tt('companies.table.revenue')}
                                    </th>
                                    <th className={`text-left p-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {tt('companies.table.users')}
                                    </th>
                                    <th className={`text-left p-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {tt('companies.table.lastLogin')}
                                    </th>
                                    <th className={`text-left p-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {tt('companies.table.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCompanies.map((company, index) => (
                                    <tr key={company.id} className={`border-b transition-colors duration-200 ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                                        }`}>
                                        <td className="p-4">
                                            <div>
                                                <div className="font-medium">{company.name}</div>
                                                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {company.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(company.plan)}`}>
                                                {tt(company.plan.toLowerCase())}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(company.status)}`}>
                                                {tt(`status${company.status.charAt(0).toUpperCase() + company.status.slice(1)}`)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium">${company.monthlyRevenue.toLocaleString()}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium">{company.userCount}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {new Date(company.lastLogin).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCompany(company);
                                                        setShowModal(true);
                                                    }}
                                                    className={`p-2 rounded-lg transition-colors duration-200 ${isDark
                                                        ? 'text-blue-400 hover:bg-gray-700'
                                                        : 'text-blue-600 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className={`p-2 rounded-lg transition-colors duration-200 ${isDark
                                                    ? 'text-gray-400 hover:bg-gray-700'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                    }`}>
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className={`p-2 rounded-lg transition-colors duration-200 ${isDark
                                                    ? 'text-red-400 hover:bg-gray-700'
                                                    : 'text-red-600 hover:bg-red-50'
                                                    }`}>
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Company Detail Modal */}
            {showModal && selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg transition-colors duration-200 ${isDark ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <div className={`p-6 border-b transition-colors duration-200 ${isDark ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">{tt('companies.details.companyDetails')}</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className={`p-2 rounded-lg transition-colors duration-200 ${isDark
                                        ? 'text-gray-400 hover:bg-gray-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <Mail className="h-5 w-5 mr-2" />
                                        {tt('companies.details.contactInformation')}
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.name')}
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {selectedCompany.name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.email')}
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {selectedCompany.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.phone')}
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {selectedCompany.phone}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.address')}
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {selectedCompany.address}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.contactPerson')}
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {selectedCompany.contactPerson}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.industry')}
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {selectedCompany.industry}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subscription Details */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <CreditCard className="h-5 w-5 mr-2" />
                                        {tt('companies.details.subscriptionDetails')}
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.plan')}
                                            </label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(selectedCompany.plan)}`}>
                                                {tt(selectedCompany.plan.toLowerCase())}
                                            </span>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.status')}
                                            </label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCompany.status)}`}>
                                                {tt(`status${selectedCompany.status.charAt(0).toUpperCase() + selectedCompany.status.slice(1)}`)}
                                            </span>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.registrationDate')}
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {new Date(selectedCompany.registrationDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.monthlyRevenue')}
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                ${selectedCompany.monthlyRevenue.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.userCount')}
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {selectedCompany.userCount}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.storageUsed')}
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {selectedCompany.storageUsed} GB
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {tt('companies.fields.storageLimit')}
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {selectedCompany.storageLimit} GB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompaniesPage;
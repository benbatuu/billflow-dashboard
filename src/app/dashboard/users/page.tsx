"use client";

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { t, getCurrentLang } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo } from 'react';
import { Pencil, Ban, CheckCircle, Trash2, UserPlus, BadgeDollarSign } from 'lucide-react';

const demoData = [
    { name: 'Super Admin', email: 'superadmin@billflow.com', role: 'superadmin', status: 'active' },
    { name: 'Owner User', email: 'owner@billflow.com', role: 'owner', status: 'active' },
    { name: 'Admin User', email: 'admin@billflow.com', role: 'admin', status: 'active' },
    { name: 'Staff User', email: 'staff@billflow.com', role: 'staff', status: 'inactive' },
    { name: 'Viewer User', email: 'viewer@billflow.com', role: 'viewer', status: 'active' },
];

const translationKeys = [
    'users.title',
    'users.subtitle',
    'users.table.name',
    'users.table.email',
    'users.table.role',
    'users.table.status',
    'users.status.active',
    'users.status.inactive',
    'users.role.superadmin',
    'users.role.owner',
    'users.role.admin',
    'users.role.staff',
    'users.role.viewer',
];

const roles = [
    'superadmin', 'owner', 'admin', 'staff', 'viewer'
];
const plans = [
    { value: 'free', label: 'Free' },
    { value: 'starter', label: 'Starter' },
    { value: 'pro', label: 'Pro' },
    { value: 'business', label: 'Business' }
];

export default function UsersPage() {
    const [translations, setTranslations] = useState<any | null>(null);
    const [lang, setLang] = useState(getCurrentLang());
    const [users, setUsers] = useState(demoData);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [modal, setModal] = useState<{ type: string, user?: any } | null>(null);
    const [form, setForm] = useState<any>({});

    useEffect(() => {
        async function loadTranslations() {
            const keys = [
                ...translationKeys,
                'users.actions',
                'users.edit',
                'users.block',
                'users.unblock',
                'users.delete',
                'users.assign_plan',
                'users.add_user',
                'users.save',
                'users.cancel',
                'users.name',
                'users.email',
                'users.role',
                'users.status',
                'users.plan',
                'users.confirm_delete',
                'users.confirm_block',
                'users.confirm_unblock',
                'users.confirm',
                'users.search_placeholder',
                'users.filter_role',
                'users.filter_status',
                'users.blocked',
                'users.active',
                'users.inactive',
                'users.success',
                'users.error',
                'users.required',
                'users.create',
                'users.update',
                'users.password',
                'users.plan_select',
            ];
            const values = await Promise.all(keys.map(key => t(key)));
            const dict: any = {};
            keys.forEach((key, i) => { dict[key] = values[i]; });
            setTranslations(dict);
        }
        loadTranslations();
        const onLangChange = () => setLang(getCurrentLang());
        window.addEventListener('storage', onLangChange);
        window.addEventListener('langchange', onLangChange);
        return () => {
            window.removeEventListener('storage', onLangChange);
            window.removeEventListener('langchange', onLangChange);
        };
    }, [lang]);

    const tt = (key: string) => translations?.[key] || key;

    // Filtered users
    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
            (!roleFilter || u.role === roleFilter) &&
            (!statusFilter || u.status === statusFilter)
        );
    }, [users, search, roleFilter, statusFilter]);

    // Simulate current user role for demo (in real app, get from session)
    const currentUserRole = 'superadmin'; // Change as needed for demo

    // Role-based action visibility helper
    function canEdit(user: any) {
        // All roles can edit themselves or lower roles
        return true;
    }
    function canBlock(user: any) {
        // Only superadmin, owner, admin can block others (not themselves)
        return ['superadmin', 'owner', 'admin'].includes(currentUserRole) && user.role !== 'superadmin';
    }
    function canDelete(user: any) {
        // Only superadmin, owner, admin can delete others (not themselves)
        return ['superadmin', 'owner', 'admin'].includes(currentUserRole) && user.role !== 'superadmin';
    }
    function canAssignPlan(user: any) {
        // Only superadmin, owner, admin can assign plan
        return ['superadmin', 'owner', 'admin'].includes(currentUserRole);
    }

    // Actions column
    const columns: ColumnDef<any>[] = [
        { accessorKey: 'name', header: tt('users.table.name') },
        { accessorKey: 'email', header: tt('users.table.email') },
        {
            accessorKey: 'role', header: tt('users.table.role'),
            cell: ({ getValue }) => tt(`users.role.${getValue()}`)
        },
        {
            accessorKey: 'status', header: tt('users.table.status'),
            cell: ({ getValue }) => {
                const status = getValue();
                const color = status === 'active' ?
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    status === 'blocked' ?
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
                return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${color}`}>{tt(`users.status.${status}`) || status}</span>;
            }
        },
        {
            accessorKey: 'actions',
            header: tt('users.actions'),
            cell: (info) => {
                const user = info.row.original;
                return (
                    <div className="flex gap-2">
                        {/* Edit always visible */}
                        <Button size="icon" variant="ghost" aria-label={tt('users.edit')} onClick={() => { setForm(user); setModal({ type: 'edit', user }); }}><Pencil className="w-4 h-4" /></Button>
                        {/* Block/Unblock only for allowed roles */}
                        {canBlock(user) && (user.status === 'blocked' ? (
                            <Button size="icon" variant="ghost" aria-label={tt('users.unblock')} onClick={() => setModal({ type: 'unblock', user })}><CheckCircle className="w-4 h-4 text-green-500" /></Button>
                        ) : (
                            <Button size="icon" variant="ghost" aria-label={tt('users.block')} onClick={() => setModal({ type: 'block', user })}><Ban className="w-4 h-4 text-yellow-500" /></Button>
                        ))}
                        {/* Delete only for allowed roles */}
                        {canDelete(user) && <Button size="icon" variant="ghost" aria-label={tt('users.delete')} onClick={() => setModal({ type: 'delete', user })}><Trash2 className="w-4 h-4 text-red-500" /></Button>}
                        {/* Assign plan only for allowed roles */}
                        {canAssignPlan(user) && <Button size="icon" variant="ghost" aria-label={tt('users.assign_plan')} onClick={() => { setForm(user); setModal({ type: 'plan', user }); }}><BadgeDollarSign className="w-4 h-4 text-blue-500" /></Button>}
                    </div>
                );
            },
            enableHiding: false, // Always show actions column
        }
    ];

    // Modal content helpers
    function handleSaveEdit() {
        setUsers(users.map(u => u.email === form.email ? { ...u, ...form } : u));
        setModal(null);
    }
    function handleBlock() {
        setUsers(users.map(u => u.email === modal?.user.email ? { ...u, status: 'blocked' } : u));
        setModal(null);
    }
    function handleUnblock() {
        setUsers(users.map(u => u.email === modal?.user.email ? { ...u, status: 'active' } : u));
        setModal(null);
    }
    function handleDelete() {
        setUsers(users.filter(u => u.email !== modal?.user.email));
        setModal(null);
    }
    function handlePlanAssign() {
        setUsers(users.map(u => u.email === form.email ? { ...u, plan: form.plan } : u));
        setModal(null);
    }
    function handleAddUser() {
        setUsers([{ ...form, status: 'active' }, ...users]);
        setModal(null);
    }

    if (!translations) {
        return <div className="p-8 text-muted-foreground">Loading...</div>;
    }

    return (
        <div className="min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 border-b">
                <div>
                    <h1 className="text-2xl font-bold">{tt('users.title')}</h1>
                    <p className="text-muted-foreground mt-2">{tt('users.subtitle')}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={tt('users.search_placeholder')}
                        className="w-48"
                    />
                    <Select value={roleFilter || 'all'} onValueChange={val => setRoleFilter(val === 'all' ? '' : val)}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder={tt('users.filter_role')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{tt('users.filter_role')}</SelectItem>
                            {roles.map(r => <SelectItem key={r} value={r}>{tt(`users.role.${r}`)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter || 'all'} onValueChange={val => setStatusFilter(val === 'all' ? '' : val)}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder={tt('users.filter_status')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{tt('users.filter_status')}</SelectItem>
                            <SelectItem value="active">{tt('users.status.active')}</SelectItem>
                            <SelectItem value="inactive">{tt('users.status.inactive')}</SelectItem>
                            <SelectItem value="blocked">{tt('users.blocked')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="default" onClick={() => { setForm({ name: '', email: '', role: 'viewer', plan: 'free', password: '' }); setModal({ type: 'add' }); }} className="ml-2"><UserPlus className="w-4 h-4 mr-1" />{tt('users.add_user')}</Button>
                </div>
            </div>
            <div className="p-8">
                <DataTable data={filteredUsers} columns={columns} />
            </div>
            {/* Modals */}
            {modal?.type === 'edit' && (
                <Dialog open onOpenChange={v => !v && setModal(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{tt('users.edit')}</DialogTitle></DialogHeader>
                        <div className="flex flex-col gap-3">
                            <Input value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} placeholder={tt('users.name')} />
                            <Input value={form.email} onChange={e => setForm((f: any) => ({ ...f, email: e.target.value }))} placeholder={tt('users.email')} />
                            <Select value={form.role} onValueChange={val => setForm((f: any) => ({ ...f, role: val }))}>
                                <SelectTrigger><SelectValue placeholder={tt('users.role')} /></SelectTrigger>
                                <SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{tt(`users.role.${r}`)}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button variant="outline" onClick={() => setModal(null)}>{tt('users.cancel')}</Button>
                            <Button variant="default" onClick={handleSaveEdit}>{tt('users.save')}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {modal?.type === 'block' && (
                <Dialog open onOpenChange={v => !v && setModal(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{tt('users.block')}</DialogTitle></DialogHeader>
                        <div>{tt('users.confirm_block')}</div>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button variant="outline" onClick={() => setModal(null)}>{tt('users.cancel')}</Button>
                            <Button variant="destructive" onClick={handleBlock}>{tt('users.block')}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {modal?.type === 'unblock' && (
                <Dialog open onOpenChange={v => !v && setModal(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{tt('users.unblock')}</DialogTitle></DialogHeader>
                        <div>{tt('users.confirm_unblock')}</div>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button variant="outline" onClick={() => setModal(null)}>{tt('users.cancel')}</Button>
                            <Button variant="default" onClick={handleUnblock}>{tt('users.unblock')}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {modal?.type === 'delete' && (
                <Dialog open onOpenChange={v => !v && setModal(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{tt('users.delete')}</DialogTitle></DialogHeader>
                        <div>{tt('users.confirm_delete')}</div>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button variant="outline" onClick={() => setModal(null)}>{tt('users.cancel')}</Button>
                            <Button variant="destructive" onClick={handleDelete}>{tt('users.delete')}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {modal?.type === 'plan' && (
                <Dialog open onOpenChange={v => !v && setModal(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{tt('users.assign_plan')}</DialogTitle></DialogHeader>
                        <Select value={form.plan} onValueChange={val => setForm((f: any) => ({ ...f, plan: val }))}>
                            <SelectTrigger><SelectValue placeholder={tt('users.plan_select')} /></SelectTrigger>
                            <SelectContent>{plans.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button variant="outline" onClick={() => setModal(null)}>{tt('users.cancel')}</Button>
                            <Button variant="default" onClick={handlePlanAssign}>{tt('users.save')}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {modal?.type === 'add' && (
                <Dialog open onOpenChange={v => !v && setModal(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{tt('users.add_user')}</DialogTitle></DialogHeader>
                        <div className="flex flex-col gap-3">
                            <Input value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} placeholder={tt('users.name')} />
                            <Input value={form.email} onChange={e => setForm((f: any) => ({ ...f, email: e.target.value }))} placeholder={tt('users.email')} />
                            <Input value={form.password} onChange={e => setForm((f: any) => ({ ...f, password: e.target.value }))} placeholder={tt('users.password')} type="password" />
                            <Select value={form.role} onValueChange={val => setForm((f: any) => ({ ...f, role: val }))}>
                                <SelectTrigger><SelectValue placeholder={tt('users.role')} /></SelectTrigger>
                                <SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{tt(`users.role.${r}`)}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={form.plan} onValueChange={val => setForm((f: any) => ({ ...f, plan: val }))}>
                                <SelectTrigger><SelectValue placeholder={tt('users.plan_select')} /></SelectTrigger>
                                <SelectContent>{plans.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button variant="outline" onClick={() => setModal(null)}>{tt('users.cancel')}</Button>
                            <Button variant="default" onClick={handleAddUser}>{tt('users.create')}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
} 
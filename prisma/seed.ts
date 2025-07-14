// Tüm kodu JavaScript (CommonJS) olarak dönüştür
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    // Permissions
    const permissions = [
        { name: "dashboard:view", description: "Dashboard görüntüleme" },
        { name: "invoices:manage", description: "Fatura işlemleri" },
        { name: "customers:manage", description: "Müşteri işlemleri" },
        { name: "subscriptions:manage", description: "Abonelik işlemleri" },
        { name: "payments:manage", description: "Ödeme işlemleri" },
        { name: "reports:view", description: "Rapor görüntüleme" },
        { name: "notifications:manage", description: "Bildirim işlemleri" },
        { name: "team:manage", description: "Ekip yönetimi" },
        { name: "settings:manage", description: "Ayarlar yönetimi" },
        { name: "integrations:manage", description: "Entegrasyon yönetimi" },
        { name: "support:view", description: "Destek görüntüleme" },
    ];

    const permissionRecords = [];
    for (const perm of permissions) {
        const p = await prisma.permission.upsert({
            where: { name: perm.name },
            update: {},
            create: perm,
        });
        permissionRecords.push(p);
    }

    // Roles
    const roles = [
        {
            name: "superadmin",
            description: "Sistemin sahibi, tüm şirketleri ve kullanıcıları yönetebilir.",
            permissions: permissions.map((p) => ({ name: p.name })),
        },
        {
            name: "owner",
            description: "Kendi şirketinin sahibi, şirket ayarlarını ve aboneliğini yönetir.",
            permissions: permissions.filter((p) => p.name !== "team:manage" && p.name !== "integrations:manage").map((p) => ({ name: p.name })),
        },
        {
            name: "admin",
            description: "Şirket içi yönetici, owner tarafından davet edilir.",
            permissions: permissions.filter((p) => [
                "dashboard:view",
                "invoices:manage",
                "customers:manage",
                "subscriptions:manage",
                "payments:manage",
                "reports:view",
                "team:manage",
                "support:view",
            ].includes(p.name)).map((p) => ({ name: p.name })),
        },
        {
            name: "staff",
            description: "Owner veya admin tarafından davet edilen ekip üyesi.",
            permissions: permissions.filter((p) => [
                "dashboard:view",
                "invoices:manage",
                "customers:manage",
                "payments:manage",
                "reports:view",
                "support:view",
            ].includes(p.name)).map((p) => ({ name: p.name })),
        },
        {
            name: "viewer",
            description: "Sadece rapor ve dashboard görüntüler, işlem yapamaz.",
            permissions: permissions.filter((p) => [
                "dashboard:view",
                "reports:view",
                "support:view",
            ].includes(p.name)).map((p) => ({ name: p.name })),
        },
    ];

    const roleRecords = [];
    for (const role of roles) {
        const perms = await prisma.permission.findMany({
            where: { name: { in: role.permissions.map((p) => p.name) } },
        });
        const r = await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: {
                name: role.name,
                description: role.description,
                permissions: {
                    connect: perms.map((p: { id: string; }) => ({ id: p.id })),
                },
            },
        });
        roleRecords.push(r);
    }

    // Users
    const users = [
        {
            email: "superadmin@billflow.com",
            password: "superadmin123",
            name: "Super Admin",
            role: "superadmin",
        },
        {
            email: "owner@billflow.com",
            password: "owner123",
            name: "Owner User",
            role: "owner",
        },
        {
            email: "admin@billflow.com",
            password: "admin123",
            name: "Admin User",
            role: "admin",
        },
        {
            email: "staff@billflow.com",
            password: "staff123",
            name: "Staff User",
            role: "staff",
        },
        {
            email: "viewer@billflow.com",
            password: "viewer123",
            name: "Viewer User",
            role: "viewer",
        },
    ];

    for (const user of users) {
        const role = await prisma.role.findUnique({ where: { name: user.role } });
        if (!role) continue;
        const passwordHash = await bcrypt.hash(user.password, 10);
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                passwordHash,
                name: user.name,
                role: { connect: { id: role.id } },
            },
        });
    }

    console.log("Seed completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 
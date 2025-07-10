"use client"

import ProfileSettingsPage from "../components/profile-settings-page"

export default function ProfilePage() {
  return (
    <div className="w-full min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profil Ayarları</h1>
        <p className="text-muted-foreground">Kişisel bilgilerinizi ve hesap ayarlarınızı yönetin</p>
      </div>
      <ProfileSettingsPage />
    </div>
  )
} 
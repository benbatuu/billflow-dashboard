"use client"

import TeamSettingsPage from "../components/team-settings-page"

export default function TeamPage() {
  return (
    <div className="w-full min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ekip Yönetimi</h1>
        <p className="text-muted-foreground">Ekip üyelerinizi davet edin ve rollerini yönetin</p>
      </div>
      <TeamSettingsPage />
    </div>
  )
} 
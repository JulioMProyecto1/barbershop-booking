"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthGuard from "@/components/admin/auth-guard"
import AdminLayout from "@/components/admin/admin-layout"
import BookingTable from "@/components/admin/booking-table"
import ServiceManagement from "@/components/admin/service-management"
import { isAdminLoggedIn } from "@/lib/auth-utils"

export default function AdminDashboard() {
  const router = useRouter()
  const [activePage, setActivePage] = useState("bookings")

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/admin/login")
    }
  }, [router])

  return (
    <AuthGuard>
      <AdminLayout activePage={activePage} onPageChange={setActivePage}>
        {activePage === "bookings" && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Turnos</h1>
              <p className="text-slate-500">Administra todos los turnos del salon</p>
            </div>

            <BookingTable />
          </div>
        )}

        {activePage === "services" && <ServiceManagement />}
      </AdminLayout>
    </AuthGuard>
  )
}


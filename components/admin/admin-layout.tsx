"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { setAdminLoggedIn } from "@/lib/auth-utils"
import { Scissors, Calendar, LogOut, Settings } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
  activePage?: string
  onPageChange?: (page: string) => void
}

export default function AdminLayout({ children, activePage = "bookings", onPageChange }: AdminLayoutProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(activePage)

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    if (onPageChange) {
      onPageChange(page)
    }
  }

  const handleLogout = () => {
    setAdminLoggedIn(false)
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6" />
            <h1 className="text-xl font-bold">Administrador del Salon</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 border-r bg-slate-50 p-4">
          <nav className="space-y-2">
            <Button
              variant={currentPage === "bookings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handlePageChange("bookings")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Turnos
            </Button>
            <Button
              variant={currentPage === "services" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handlePageChange("services")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Servicios
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}


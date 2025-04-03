"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from 'date-fns/locale/es'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreVertical, Edit, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import type { Booking } from "@/lib/types"
import { getAllBookings, updateBookingStatus, deleteBooking, calculateTotalPrice } from "@/lib/booking-utils"
import { formatDuration } from "@/lib/utils"
import EditBookingForm from "./edit-booking-form"

export default function BookingTable() {
  const [bookings, setBookings] = useState<Booking[]>(getAllBookings())
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleStatusChange = (booking: Booking) => {
    const newStatus = booking.status === "confirmed" ? "unconfirmed" : "confirmed"
    const updatedBooking = updateBookingStatus(booking.id, newStatus)

    if (updatedBooking) {
      setBookings(getAllBookings())
    }
  }

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedBooking) {
      deleteBooking(selectedBooking.id)
      setBookings(getAllBookings())
      setIsDeleteDialogOpen(false)
    }
  }

  const refreshBookings = () => {
    setBookings(getAllBookings())
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha y hora</TableHead>
              <TableHead>servicios</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron turnos
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.contact.name}</div>
                    <div className="text-sm text-slate-500">{booking.contact.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div>{format(booking.appointment.date, "MMM d, yyyy")}</div>
                    <div className="text-sm text-slate-500">{booking.appointment.time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      {booking.services.map((service, index) => (
                        <span key={service.id}>
                          {service.name}
                          {index < booking.services.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-slate-500">{formatDuration(booking.appointment.duration)}</div>
                  </TableCell>
                  <TableCell>${calculateTotalPrice(booking.services).toLocaleString('en-US')}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      }
                      onClick={() => handleStatusChange(booking)}
                    >
                      {booking.status === "confirmed" ? (
                        <CheckCircle className="mr-1 h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="mr-1 h-3.5 w-3.5" />
                      )}
                      {booking.status === "confirmed" ? "Confirmado" : "Sin confirmar"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(booking)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(booking)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>Make changes to the booking details below</DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <EditBookingForm
              booking={selectedBooking}
              onSave={() => {
                refreshBookings()
                setIsEditDialogOpen(false)
              }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Estas seguro que quieres eliminar este turno? Esta accion no puede ser deshecha.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="py-4">
              <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">
                    Turno para {selectedBooking.contact.name} en{" "}
                    {format(selectedBooking.appointment.date, "MMMM d, yyyy", {locale: es})}, {selectedBooking.appointment.time}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


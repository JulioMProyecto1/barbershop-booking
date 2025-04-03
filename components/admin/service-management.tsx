"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, MoreVertical, Edit, Trash2, AlertTriangle } from "lucide-react"
import type { Service } from "@/lib/types"
import { getAllServices, addService, updateService, deleteService, isServiceInUse } from "@/lib/service-utils"
import { formatDuration, formatNumberWithCommas } from "@/lib/utils"

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>(getAllServices())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    duration: "",
  })
  const [deleteError, setDeleteError] = useState("")

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      duration: "",
    })
    setErrors({
      name: "",
      price: "",
      duration: "",
    })
  }

  const handleAddClick = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEditClick = (service: Service) => {
    setSelectedService(service)
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service)
    setDeleteError("")
    setIsDeleteDialogOpen(true)
  }

  const validateForm = () => {
    const newErrors = {
      name: "",
      price: "",
      duration: "",
    }
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required"
      isValid = false
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
      isValid = false
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
      isValid = false
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required"
      isValid = false
    } else if (
      isNaN(Number(formData.duration)) ||
      !Number.isInteger(Number(formData.duration)) ||
      Number(formData.duration) <= 0
    ) {
      newErrors.duration = "Duration must be a positive integer"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }
  const handleAddSubmit = () => {
    if (!validateForm()) return

    const newService = addService({
      name: formData.name,
      price: Number(formData.price),
      duration: Number(formData.duration),
    })

    setServices(getAllServices())
    setIsAddDialogOpen(false)
  }

  const handleEditSubmit = () => {
    if (!selectedService || !validateForm()) return

    const updatedService = updateService(selectedService.id, {
      name: formData.name,
      price: Number(formData.price),
      duration: Number(formData.duration),
    })

    if (updatedService) {
      setServices(getAllServices())
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteConfirm = () => {
    if (!selectedService) return

    // Check if service is used in any bookings
    if (isServiceInUse(selectedService.id)) {
      setDeleteError("Cannot delete this service as it is used in existing bookings.")
      return
    }

    const success = deleteService(selectedService.id)

    if (success) {
      setServices(getAllServices())
      setIsDeleteDialogOpen(false)
    } else {
      setDeleteError("Failed to delete service. It may be used in existing bookings.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Servicios</h1>
          <p className="text-slate-500">Administra los servicios del Salon</p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Servicio
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Duracion</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="w-[80px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No se encontraron servicios
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{formatDuration(service.duration)}</TableCell>
                    <TableCell>${service.price}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(service)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(service)}
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
        </CardContent>
      </Card>

      {/* Add Service Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar nuevo servicio</DialogTitle>
            <DialogDescription>Ofrece un nuevo servicio a tus clientes</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del servicio</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej.: Corte de cabello, barba"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio ($): <span className="text-sm">{formatNumberWithCommas(formData.price)}</span></Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Ej.: 25"
                type="number"
                min="0"
                step="0.01"
              />
              
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duracion (minutos)</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Ej.: 30"
                type="number"
                min="1"
                step="1"
              />
              {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubmit}>Agrega servicio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
            <DialogDescription>Actualiza los detalles del servicio</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre del servicio</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                type="number"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duracion (minutos)</Label>
              <Input
                id="edit-duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                type="number"
                min="1"
                step="1"
              />
              {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminara permanentemente el servicio "{selectedService?.name}". Esta accion no puede ser deshecha.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p>{deleteError}</p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


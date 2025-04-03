"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Contact } from "@/lib/types"

interface ContactInfoProps {
  onSubmit: (contact: Contact) => void
  onBack: () => void
}

export default function ContactInfo({ onSubmit, onBack }: ContactInfoProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState({ name: "", phone: "" })

  const validateForm = () => {
    const newErrors = { name: "", phone: "" }
    let isValid = true

    if (!name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ name, phone })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Informacion de contacto</h2>
      <p className="text-slate-500">Por favor confirma tus detalles de contacto</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, name: "" }))
              }
            }}
            placeholder="Ingresa tu nombre"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Numero de telefono <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, phone: "" }))
              }
            }}
            placeholder="Ingresa tu numero telefonico"
            type="tel"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Atras
        </Button>
        <Button onClick={handleSubmit}>Completa el agendamiento</Button>
      </div>
    </div>
  )
}


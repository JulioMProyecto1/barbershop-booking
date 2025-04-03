"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { Service } from "@/lib/types"
import { services } from "@/lib/data"
interface ServiceSelectionProps {
  onSubmit: (services: Service[]) => void
  initialServices?: Service[] // Add this prop to accept initial services
}

export default function ServiceSelection({ onSubmit, initialServices = [] }: ServiceSelectionProps) {
  const [selectedServices, setSelectedServices] = useState<Service[]>(initialServices)
  const [error, setError] = useState("")

  const handleServiceToggle = (service: Service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s.id === service.id)
      if (isSelected) {
        return prev.filter((s) => s.id !== service.id)
      } else {
        return [...prev, service]
      }
    })
    setError("")
  }

  const handleSubmit = () => {
    if (selectedServices.length === 0) {
      setError("Please select at least one service")
      return
    }
    onSubmit(selectedServices)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Selecciona los servicios</h2>
      <p className="text-slate-500">Elije los servicios que quieres agendar</p>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-slate-50">
            <Checkbox
              id={`service-${service.id}`}
              checked={selectedServices.some((s) => s.id === service.id)}
              onCheckedChange={() => handleServiceToggle(service)}
            />
            <div className="grid gap-1.5">
              <label
                htmlFor={`service-${service.id}`}
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {service.name}
              </label>
              <div className="flex">
                <p className="text-sm text-slate-500 mr-2">{service.duration} min</p>
                <p className="text-sm font-medium">${service.price.toLocaleString('en-US')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Continuar</Button>
      </div>
    </div>
  )
}


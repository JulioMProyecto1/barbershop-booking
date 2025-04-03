"use client"

import { useState, useEffect } from "react"
import { addDays } from "date-fns"
import { es } from 'date-fns/locale/es'
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import type { Appointment, TimeSlot } from "@/lib/types"
import { cn } from "@/lib/utils"
import { formatDuration } from "@/lib/utils"
import { getAvailableTimeSlots } from "@/lib/booking-utils"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"

interface AppointmentSchedulingProps {
  onSubmit: (appointment: Appointment) => void
  onBack: () => void
  duration: number
}

export default function AppointmentScheduling({ onSubmit, onBack, duration }: AppointmentSchedulingProps) {
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [time, setTime] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    if (date) {
      // Get available time slots for the selected date
      const slots = getAvailableTimeSlots(date, duration)
      setTimeSlots(slots)

      // Clear selected time if it's no longer available
      if (time) {
        const selectedSlot = slots.find((slot) => slot.time === time)
        if (!selectedSlot || !selectedSlot.isAvailable) {
          setTime(null)
        }
      }
    }
  }, [date, duration, time])

  const handleSubmit = () => {
    if (!date || !time) {
      setError("Please select both a date and time")
      return
    }

    onSubmit({
      date,
      time,
      duration,
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Agenda tu turno</h2>
      <p className="text-slate-500">
        Selecciona una fecha y hora para tu turno
        {duration > 0 && ` (${formatDuration(duration)})`}
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <h3 className="text-sm font-medium mb-2">Elije la fecha</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
            className="rounded-md border"
            locale={es}
          />
        </div>

        <div className="md:w-1/2">
          <h3 className="text-sm font-medium mb-2">Elije la hora</h3>
          {date ? (
            timeSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={time === slot.time ? "default" : "outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      time === slot.time && "text-primary-foreground",
                      !slot.isAvailable && "opacity-50 cursor-not-allowed",
                    )}
                    onClick={() => {
                      if (slot.isAvailable) {
                        setTime(slot.time)
                        setError("")
                      }
                    }}
                    disabled={!slot.isAvailable}
                  >
                    {slot.time}
                    {!slot.isAvailable && (
                      <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-200">
                        Ocupado
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No hay hora disponible para esta fecha.</p>
            )
          ) : (
            <p className="text-slate-500">Por favor selecciona la fecha primero</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-700">
            Los turnos son creados como sin-confirmar. Te contactaremos para confirmar tu turno.
          </p>
          <p className="text-sm text-blue-700 mt-1">Espacios de tiempo que muestran "Ocupado" es porque ya fueron confirmados por otro cliente.</p>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Atras
        </Button>
        <Button onClick={handleSubmit}>Continuar</Button>
      </div>
    </div>
  )
}


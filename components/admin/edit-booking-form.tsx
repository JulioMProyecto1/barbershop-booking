"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { services } from "@/lib/data"
import type { Booking, Service, TimeSlot } from "@/lib/types"
import { getAvailableTimeSlots, updateBooking, calculateTotalDuration, calculateTotalPrice } from "@/lib/booking-utils"
import { formatDuration } from "@/lib/utils"

interface EditBookingFormProps {
  booking: Booking
  onSave: () => void
  onCancel: () => void
}

export default function EditBookingForm({ booking, onSave, onCancel }: EditBookingFormProps) {
  const [selectedServices, setSelectedServices] = useState<Service[]>(booking.services)
  const [date, setDate] = useState<Date>(booking.appointment.date)
  const [time, setTime] = useState<string>(booking.appointment.time)
  const [name, setName] = useState(booking.contact.name)
  const [phone, setPhone] = useState(booking.contact.phone)
  const [status, setStatus] = useState<"confirmed" | "unconfirmed">(booking.status)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [errors, setErrors] = useState({
    services: "",
    date: "",
    time: "",
    name: "",
    phone: "",
  })

  const totalDuration = calculateTotalDuration(selectedServices)
  const totalPrice = calculateTotalPrice(selectedServices)

  useEffect(() => {
    if (date) {
      const slots = getAvailableTimeSlots(date, totalDuration, booking.id)
      setTimeSlots(slots)

      // If the current time is no longer available with the new services/duration
      const currentTimeSlot = slots.find((slot) => slot.time === time)
      if (!currentTimeSlot?.isAvailable && time !== booking.appointment.time) {
        setTime("")
      }
    }
  }, [date, totalDuration, booking.id, time, booking.appointment.time])

  const handleServiceToggle = (service: Service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s.id === service.id)
      if (isSelected) {
        return prev.filter((s) => s.id !== service.id)
      } else {
        return [...prev, service]
      }
    })
    setErrors((prev) => ({ ...prev, services: "" }))
  }

  const validateForm = () => {
    const newErrors = {
      services: "",
      date: "",
      time: "",
      name: "",
      phone: "",
    }
    let isValid = true

    if (selectedServices.length === 0) {
      newErrors.services = "Please select at least one service"
      isValid = false
    }

    if (!date) {
      newErrors.date = "Please select a date"
      isValid = false
    }

    if (!time) {
      newErrors.time = "Please select a time"
      isValid = false
    }

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

  const handleSave = () => {
    if (!validateForm()) return

    const updatedBooking = updateBooking(booking.id, {
      services: selectedServices,
      appointment: {
        date,
        time,
        duration: totalDuration,
      },
      contact: {
        name,
        phone,
      },
      status,
    })

    if (updatedBooking) {
      onSave()
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="services">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="appointment">Appointment</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="flex items-start space-x-3 rounded-md border p-3 hover:bg-slate-50">
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
                  <div className="flex justify-between">
                    <p className="text-sm text-slate-500">{service.duration} min</p>
                    <p className="text-sm font-medium">${service.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.services && <p className="text-sm text-red-500">{errors.services}</p>}

          <div className="rounded-md bg-slate-50 p-4">
            <div className="flex justify-between">
              <span className="font-medium">Total Duration:</span>
              <span>{formatDuration(totalDuration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Price:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointment" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label className="mb-2 block">Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate)
                    setErrors((prev) => ({ ...prev, date: "" }))
                  }
                }}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border"
              />
              {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
            </div>

            <div>
              <Label className="mb-2 block">Time</Label>
              {timeSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      type="button"
                      variant={time === slot.time ? "default" : "outline"}
                      className={`justify-start text-left font-normal ${
                        !slot.isAvailable && slot.time !== booking.appointment.time
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      onClick={() => {
                        if (slot.isAvailable || slot.time === booking.appointment.time) {
                          setTime(slot.time)
                          setErrors((prev) => ({ ...prev, time: "" }))
                        }
                      }}
                      disabled={!slot.isAvailable && slot.time !== booking.appointment.time}
                    >
                      {slot.time}
                      {slot.time === booking.appointment.time && !slot.isAvailable && " (Current)"}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No available time slots for the selected services on this date.</p>
              )}
              {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, name: "" }))
                  }
                }}
                placeholder="Enter client's full name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, phone: "" }))
                  }
                }}
                placeholder="Enter client's phone number"
                type="tel"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label>Booking Status</Label>
              <RadioGroup value={status} onValueChange={(value) => setStatus(value as "confirmed" | "unconfirmed")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="confirmed" id="confirmed" />
                  <Label htmlFor="confirmed" className="cursor-pointer">
                    Confirmed
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unconfirmed" id="unconfirmed" />
                  <Label htmlFor="unconfirmed" className="cursor-pointer">
                    Unconfirmed
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}


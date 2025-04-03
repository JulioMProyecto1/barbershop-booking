"use client"

import { useState } from "react"
import ServiceSelection from "./service-selection"
import AppointmentScheduling from "./appointment-scheduling"
import ContactInfo from "./contact-info"
import ThankYou from "./thank-you"
import type { Service, Appointment, Contact, Booking } from "@/lib/types"
import { createBooking } from "@/lib/booking-utils"

export default function BookingForm() {
  const [step, setStep] = useState(1)
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [contact, setContact] = useState<Contact | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  // Calculate total duration of selected services
  const totalDuration = selectedServices.reduce((total, service) => total + service.duration, 0)

  const handleServiceSubmit = (services: Service[]) => {
    setSelectedServices(services)
    setStep(2)
  }

  const handleAppointmentSubmit = (appointmentData: Appointment) => {
    setAppointment(appointmentData)
    setStep(3)
  }

  const handleContactSubmit = (contactData: Contact) => {
    setContact(contactData)

    // Create the booking
    if (selectedServices.length > 0 && appointment) {
      const newBooking = createBooking({
        services: selectedServices,
        appointment,
        contact: contactData,
      })

      setBooking(newBooking)
    }

    setStep(4)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`w-full h-2 rounded-full mx-1 ${i <= step ? "bg-slate-700" : "bg-slate-200"}`} />
          ))}
        </div>
        <div className="flex justify-between text-sm text-slate-500">
          <span>Servicios</span>
          <span>Agendar</span>
          <span>Contacto</span>
          <span>Confirmacion</span>
        </div>
      </div>

      {step === 1 && <ServiceSelection onSubmit={handleServiceSubmit} initialServices={selectedServices} />}

      {step === 2 && (
        <AppointmentScheduling onSubmit={handleAppointmentSubmit} onBack={handleBack} duration={totalDuration} />
      )}

      {step === 3 && <ContactInfo onSubmit={handleContactSubmit} onBack={handleBack} />}

      {step === 4 && booking && <ThankYou booking={booking} />}
    </div>
  )
}


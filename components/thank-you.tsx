"use client"

import { format } from "date-fns"
import { es } from 'date-fns/locale/es'
import { Button } from "@/components/ui/button"
import type { Booking } from "@/lib/types"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ThankYouProps {
  booking: Booking
}

export default function ThankYou({ booking }: ThankYouProps) {
  const { services, appointment, contact, status } = booking
  const totalPrice = services.reduce((total, service) => total + service.price, 0)

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>

      <h2 className="text-2xl font-bold">Gracias por agendar!</h2>
      <p className="text-slate-500">Hemos recibido tu pedido de turno y te veremos pronto ;).</p>

      <div className="flex justify-center">
        <Badge
          variant="outline"
          className={`text-sm px-3 py-1 ${
            status === "confirmed"
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-amber-100 text-amber-800 border-amber-200"
          }`}
        >
          {status === "confirmed" ? (
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
          ) : (
            <Clock className="h-3.5 w-3.5 mr-1" />
          )}
          {status === "confirmed" ? "Confirmado" : "Esperando confirmacion"}
        </Badge>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg text-left space-y-4">
        <div>
          <h3 className="font-medium text-slate-700">Detalles del turno</h3>
          <p className="text-slate-600">
            {format(appointment.date, "EEEE, MMMM d, yyyy", {locale: es})}, {appointment.time}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-slate-700">Servicios</h3>
          <ul className="space-y-1">
            {services.map((service) => (
              <li key={service.id} className="flex justify-between">
                <span>
                  {service.name} ({service.duration} min)
                </span>
                <span>${service.price}</span>
              </li>
            ))}
          </ul>
          <div className="border-t mt-2 pt-2 font-medium flex justify-between">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-slate-700">Informacion de contacto</h3>
          <p className="text-slate-600">{contact.name}</p>
          <p className="text-slate-600">{contact.phone}</p>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-md flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="text-left">
          <p className="text-sm text-amber-700 font-medium">
            Tu turno esta actualmente {status === "confirmed" ? "confirmado" : "sin confirmar"}
          </p>
          {status === "unconfirmed" && (
            <p className="text-sm text-amber-700 mt-1">
              Te contactaremos en breve para confirmar tu turno. Por favor ten en cuenta que turnos sin confirmar pueden estar sujetos a cambios.
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Una confirmacion ha sido enviada a tu telefono. Si necesitas hacer cambios a tu agendamiento, por favor llamanos.
      </p>

      <Button onClick={() => window.location.reload()}>Agenda otro turno</Button>
    </div>
  )
}


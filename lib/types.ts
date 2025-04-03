export interface Service {
  id: number
  name: string
  price: number
  duration: number
}

export interface Appointment {
  date: Date
  time: string
  duration: number
}

export interface Contact {
  name: string
  phone: string
}

export interface Booking {
  id: string
  services: Service[]
  appointment: Appointment
  contact: Contact
  status: "confirmed" | "unconfirmed"
  createdAt: Date
}

export type TimeSlot = {
  time: string
  isAvailable: boolean
  booking?: Booking
}


import type { Service, Booking } from "./types"
import { addDays } from "date-fns"

// Changed from const to let to allow modifications
export const services: Service[] = [
  {
    id: 1,
    name: "Corte de pelo (Hombre)",
    price: 20000,
    duration: 30,
  },
  {
    id: 2,
    name: "Corte de pelo (Mujer)",
    price: 15000,
    duration: 15,
  },
  {
    id: 3,
    name: "Peinado",
    price: 10000,
    duration: 45,
  },
  {
    id: 4,
    name: "Pies",
    price: 20000,
    duration: 60,
  },
  {
    id: 5,
    name: "Uñas",
    price: 20000,
    duration: 30,
  },
  {
    id: 6,
    name: "Tratamiento facial",
    price: 15000,
    duration: 20,
  },
  {
    id: 7,
    name: "Planchado",
    price: 15000,
    duration: 20,
  },
  {
    id: 8,
    name: "Pestañas",
    price: 8000,
    duration: 20,
  },
]

// Sample existing bookings data
// In a real app, this would come from a database
export const existingBookings: Booking[] = [
  {
    id: "booking-1",
    services: [services[0], services[1]],
    appointment: {
      date: addDays(new Date(), 1),
      time: "10:00 AM",
      duration: 45,
    },
    contact: {
      name: "Diana Delgado",
      phone: "1234567890",
    },
    status: "confirmed",
    createdAt: new Date(),
  },
  {
    id: "booking-2",
    services: [services[3]],
    appointment: {
      date: addDays(new Date(), 1),
      time: "2:00 PM",
      duration: 60,
    },
    contact: {
      name: "Juan Perez",
      phone: "0987654321",
    },
    status: "unconfirmed",
    createdAt: new Date(),
  },
  {
    id: "booking-3",
    services: [services[2]],
    appointment: {
      date: addDays(new Date(), 2),
      time: "11:30 AM",
      duration: 45,
    },
    contact: {
      name: "Javier",
      phone: "5556667777",
    },
    status: "unconfirmed",
    createdAt: new Date(),
  },
]


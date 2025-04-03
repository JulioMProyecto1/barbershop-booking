import { format, parse, isSameDay, addMinutes, areIntervalsOverlapping } from "date-fns"
import type { Booking, TimeSlot, Service } from "./types"
import { existingBookings } from "./data"

// Check if a time slot is available based on existing bookings
export function checkTimeSlotAvailability(
  date: Date,
  timeSlot: string,
  duration: number,
  excludeBookingId?: string,
): { isAvailable: boolean; conflictingBooking?: Booking } {
  // Parse the time slot string to a Date object
  const timeSlotStart = parse(timeSlot, "h:mm a", date)
  const timeSlotEnd = addMinutes(timeSlotStart, duration)

  // Check for conflicts with existing bookings
  for (const booking of existingBookings) {
    // Skip the current booking when checking for conflicts (for editing)
    if (excludeBookingId && booking.id === excludeBookingId) {
      continue
    }

    if (isSameDay(booking.appointment.date, date)) {
      const bookingStart = parse(booking.appointment.time, "h:mm a", booking.appointment.date)
      const bookingEnd = addMinutes(bookingStart, booking.appointment.duration)

      // Check if the intervals overlap
      if (
        areIntervalsOverlapping({ start: timeSlotStart, end: timeSlotEnd }, { start: bookingStart, end: bookingEnd })
      ) {
        return { isAvailable: false, conflictingBooking: booking }
      }
    }
  }

  return { isAvailable: true }
}

// Generate available time slots for a given date
export function getAvailableTimeSlots(date: Date, duration: number, excludeBookingId?: string): TimeSlot[] {
  // This would typically come from your business hours configuration
  const businessHours = {
    start: { hour: 9, minute: 0 }, // 9 AM
    end: { hour: 18, minute: 0 }, // 6 PM
  }

  const slots: TimeSlot[] = []

  // Generate time slots in 30-minute increments
  for (let hour = businessHours.start.hour; hour < businessHours.end.hour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip if we're at the end of the day and don't have enough time for the service
      const slotDate = new Date(date)
      slotDate.setHours(hour, minute)
      const slotEndDate = addMinutes(slotDate, duration)

      if (
        slotEndDate.getHours() >= businessHours.end.hour &&
        (slotEndDate.getHours() > businessHours.end.hour || slotEndDate.getMinutes() > businessHours.end.minute)
      ) {
        continue
      }

      const timeString = format(slotDate, "h:mm a")
      const { isAvailable, conflictingBooking } = checkTimeSlotAvailability(
        date,
        timeString,
        duration,
        excludeBookingId,
      )

      slots.push({
        time: timeString,
        isAvailable,
        booking: conflictingBooking,
      })
    }
  }

  return slots
}

// Create a new booking
export function createBooking(bookingData: Omit<Booking, "id" | "status" | "createdAt">): Booking {
  const newBooking: Booking = {
    ...bookingData,
    id: `booking-${existingBookings.length + 1}-${Date.now()}`,
    status: "unconfirmed", // Default status is unconfirmed
    createdAt: new Date(),
  }

  // In a real app, you would save this to your database
  existingBookings.push(newBooking)

  return newBooking
}

// Get all bookings
export function getAllBookings(): Booking[] {
  return [...existingBookings]
}

// Get a booking by ID
export function getBookingById(id: string): Booking | undefined {
  return existingBookings.find((booking) => booking.id === id)
}

// Update a booking
export function updateBooking(id: string, updatedData: Partial<Booking>): Booking | null {
  const index = existingBookings.findIndex((booking) => booking.id === id)

  if (index === -1) return null

  const updatedBooking = {
    ...existingBookings[index],
    ...updatedData,
  }

  existingBookings[index] = updatedBooking
  return updatedBooking
}

// Delete a booking
export function deleteBooking(id: string): boolean {
  const index = existingBookings.findIndex((booking) => booking.id === id)

  if (index === -1) return false

  existingBookings.splice(index, 1)
  return true
}

// Update booking status
export function updateBookingStatus(id: string, status: "confirmed" | "unconfirmed"): Booking | null {
  return updateBooking(id, { status })
}

// Calculate total duration for services
export function calculateTotalDuration(services: Service[]): number {
  return services.reduce((total, service) => total + service.duration, 0)
}

// Calculate total price for services
export function calculateTotalPrice(services: Service[]): number {
  return services.reduce((total, service) => total + service.price, 0)
}


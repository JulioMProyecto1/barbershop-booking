import { services } from "./data"
import type { Service } from "./types"
import { existingBookings } from "./data"

// Get all services
export function getAllServices(): Service[] {
  return [...services]
}

// Get a service by ID
export function getServiceById(id: number): Service | undefined {
  return services.find((service) => service.id === id)
}

// Add a new service
export function addService(serviceData: Omit<Service, "id">): Service {
  // Generate a new ID (in a real app, this would be handled by the database)
  const newId = services.length > 0 ? Math.max(...services.map((service) => service.id)) + 1 : 1

  const newService: Service = {
    id: newId,
    ...serviceData,
  }

  services.push(newService)
  return newService
}

// Update a service
export function updateService(id: number, updatedData: Partial<Omit<Service, "id">>): Service | null {
  const index = services.findIndex((service) => service.id === id)

  if (index === -1) return null

  const updatedService = {
    ...services[index],
    ...updatedData,
  }

  services[index] = updatedService

  // Update service references in bookings
  existingBookings.forEach((booking) => {
    const serviceIndex = booking.services.findIndex((s) => s.id === id)
    if (serviceIndex !== -1) {
      booking.services[serviceIndex] = updatedService
    }
  })

  return updatedService
}

// Delete a service
export function deleteService(id: number): boolean {
  // Check if service is used in any bookings
  const isUsed = existingBookings.some((booking) => booking.services.some((service) => service.id === id))

  if (isUsed) {
    return false
  }

  const index = services.findIndex((service) => service.id === id)

  if (index === -1) return false

  services.splice(index, 1)
  return true
}

// Check if a service is used in any bookings
export function isServiceInUse(id: number): boolean {
  return existingBookings.some((booking) => booking.services.some((service) => service.id === id))
}


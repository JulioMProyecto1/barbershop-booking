// This is a simplified auth utility for demo purposes
// In a real application, you would use a proper authentication system

// Mock admin credentials
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

export function authenticateAdmin(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

// Client-side function to check if user is logged in
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("adminAuthenticated") === "true"
}

// Client-side function to set admin login state
export function setAdminLoggedIn(value: boolean): void {
  if (typeof window === "undefined") return
  if (value) {
    localStorage.setItem("adminAuthenticated", "true")
  } else {
    localStorage.removeItem("adminAuthenticated")
  }
}


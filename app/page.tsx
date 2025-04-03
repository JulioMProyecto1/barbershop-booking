import BookingForm from "@/components/booking-form"
import Link from "next/link"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Salon de Belleza Los Vega 💈</h1>
        <Link href="/admin" className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-2">
          Administrador
        </Link>
      </div>
      <BookingForm />
    </main>
  )
}


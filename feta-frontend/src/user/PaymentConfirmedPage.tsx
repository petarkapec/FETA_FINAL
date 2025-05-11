"use client"

import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"

export const PaymentConfirmedPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sesija_id, setSesijaId] = useState<string | null>(null)

  useEffect(() => {
    // Get sesija_id from URL query parameters
    const queryParams = new URLSearchParams(location.search)
    const sessionId = queryParams.get("session_id")
    console.log(sessionId)

    if (sessionId) {
      setSesijaId(sessionId)
    }
  }, [location])

  const handleBackToSession = () => {
    if (sesija_id) {
      // Navigate back to the session page with the session ID
      navigate(`/homesearch?sesija_id=${sesija_id}`)
    } else {
      // Fallback to locations page if no session ID is available
      navigate("/locations")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B132B] text-white px-4">
      <div className="bg-[#1C2541] p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#6FFFE9] mb-4">Uplata zaprimljena</h1>
        <p className="text-[#5BC0BE] mb-6">
          Hvala na uplati! Tvoj zahtjev za pjesmu je uspješno zabilježen i čeka obradu DJ-a.
        </p>

        <Button
          className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-semibold w-full"
          onClick={handleBackToSession}
        >
          Natrag na event
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Calendar, Music, User, LogOut } from "lucide-react"
import type { DJ } from "@/types/dj"

const Profil = () => {
  const [dj, setDj] = useState<DJ | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const djData = localStorage.getItem("dj")
    if (djData) {
      const parsedDj = JSON.parse(djData)
      setDj(parsedDj)
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("dj")
    navigate("/login")
  }

  if (!dj) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0B132B]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5BC0BE]"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
      <header className="p-4 flex justify-between items-center border-b border-[#3A506B]">
        <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
        <Button
          onClick={handleLogout}
          className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#6FFFE9]">DJ Profile</h2>

            <div className="bg-[#1C2541] p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={dj.profilna_slika || "/placeholder.svg?height=100&width=100"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#5BC0BE]"
                />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {dj.ime} {dj.prezime}
                  </p>
                  <p className="text-sm text-[#5BC0BE]">{dj.email}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#5BC0BE] text-sm">OIB</p>
                    <p>{dj.oib}</p>
                  </div>
                  <div>
                    <p className="text-[#5BC0BE] text-sm">IBAN</p>
                    <p>{dj.iban}</p>
                  </div>
                  <div>
                    <p className="text-[#5BC0BE] text-sm">Date of Birth</p>
                    <p>{new Date(dj.datum_rodjenja).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[#5BC0BE] text-sm">Instagram</p>
                    <p>{dj.instagram || "Not provided"}</p>
                  </div>
                </div>

                {dj.about_me && (
                  <div>
                    <p className="text-[#5BC0BE] text-sm">About Me</p>
                    <p className="p-3 bg-[#0B132B] rounded-lg mt-1">{dj.about_me}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => navigate("/create-sesija")}
                  className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Create Event
                </Button>

                <Button
                  onClick={() => navigate("/moje-sesije")}
                  className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium flex items-center justify-center gap-2"
                >
                  <Music className="h-4 w-4" />
                  My Sessions
                </Button>
              </div>
            </div>

            <Button
              onClick={() => navigate("/moje-sesije")}
              className="bg-[#3A506B] hover:bg-[#5BC0BE] text-white w-full flex items-center justify-center gap-2"
            >
              <User className="h-4 w-4" />
              Previous Events
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profil

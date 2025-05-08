"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { Sesija } from "@/types/sesija"

const PreviousSesije = () => {
  const [sesije, setSesije] = useState<Sesija[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const djData = localStorage.getItem("dj")
    if (djData) {
      const parsedDj = JSON.parse(djData)
      fetchSesije(parsedDj.dj_id)
    }
  }, [])

  const fetchSesije = async (dj_id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sesije/sesije-dj/${dj_id}`)
      const data: Sesija[] = await response.json()
      setSesije(data)
    } catch (error) {
      console.error("Greška pri dohvaćanju sesija:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
      <header className="p-4 flex justify-between items-center border-b border-[#3A506B]">
        <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
        <Button
          onClick={() => navigate("/profil")}
          className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium"
        >
          Profil
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[#1C2541] p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-[#6FFFE9] mb-6">Prijašnji eventovi</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white">
                <thead>
                  <tr className="border-b border-[#3A506B] text-[#6FFFE9] text-xs tracking-wider uppercase">
                    <th className="py-3 px-4 text-xl text-center">📍</th>
                    <th className="py-3 px-4 text-xl text-center">⏰</th>
                    <th className="py-3 px-4 text-xl text-center">💶</th>
                    <th className="py-3 px-4 text-xl text-center">📝</th>
                    <th className="py-3 px-4 text-xl text-center">🎶</th>
                  </tr>
                </thead>
                <tbody>
                  {sesije.map((request) => (
                    <tr
                      key={request.sesija_id}
                      onClick={() => navigate(`/sesije/${request.sesija_id}`)}
                      className="cursor-pointer hover:bg-[#3A506B] transition-colors duration-200"
                    >
                      <td className="py-3 px-4">{request.lokacija_id}</td>
                      <td className="py-3 px-4">{new Date(request.expiration).toLocaleString()}</td>
                      <td className="py-3 px-4">{request.minimal_price} €</td>
                      <td className="py-3 px-4">{request.comentary}</td>
                      <td className="py-3 px-4">{request.queue_max_song_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PreviousSesije

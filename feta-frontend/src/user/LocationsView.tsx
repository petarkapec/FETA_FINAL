"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Lokacija } from "@/types/lokacija"

const LocationsView = () => {
  const [locations, setLocations] = useState<Lokacija[]>([])
  const [filteredLocations, setFilteredLocations] = useState<Lokacija[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/lokacije/all`)

        if (!response.ok) {
          throw new Error("Failed to fetch locations")
        }

        const data = await response.json()
        setLocations(data)
        setFilteredLocations(data)
      } catch (err) {
        console.error("Error fetching locations:", err)
        setError("Failed to load locations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  useEffect(() => {
    // Filter locations based on search query
    if (searchQuery.trim() === "") {
      setFilteredLocations(locations)
    } else {
      const filtered = locations.filter(
        (location) =>
          (location.naziv_kluba && location.naziv_kluba.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (location.adresa && location.adresa.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredLocations(filtered)
    }
  }, [searchQuery, locations])

  const handleLocationClick = async (locationId: number) => {
    try {
      // Fetch the session for this location
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sesije/sesije-lokacija/${locationId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch session for this location")
      }

      const sessionData = await response.json()

      if (sessionData && sessionData.length > 0) {
        // Navigate to the user search component with the session ID
        navigate(`/homesearch?sesija_id=${sessionData[0].sesija_id}`)
      } else {
        setError("No active session found for this location")
      }
    } catch (err) {
      console.error("Error fetching session:", err)
      setError("Failed to load session. Please try again later.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
      <header className="p-4 flex justify-center border-b border-[#3A506B]">
        <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
      </header>

      <div className="w-full max-w-md mx-auto mt-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1C2541] border-[#3A506B] text-white placeholder:text-[#3A506B] h-12 pr-12"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5BC0BE] h-5 w-5" />
        </div>
      </div>

      <main className="flex-1 p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5BC0BE]"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-400">{error}</div>
        ) : filteredLocations.length === 0 ? (
          <div className="text-center p-8 text-[#5BC0BE]">No locations found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredLocations.map((location) => (
              <div
                key={location.lokacija_id}
                onClick={() => handleLocationClick(location.lokacija_id)}
                className="bg-[#1C2541] rounded-xl overflow-hidden shadow-lg border border-[#3A506B] cursor-pointer hover:border-[#5BC0BE] transition-all"
              >
                <div className="h-48 bg-[#3A506B] relative">
                  <img
                    src={location.profil_slika_link || "/placeholder.svg?height=200&width=400"}
                    alt={location.naziv_kluba || "Club"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0B132B] to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">
                      {location.naziv_kluba || `Club #${location.lokacija_id}`}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-[#5BC0BE] mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{location.adresa || "Address not available"}</span>
                  </div>
                  <Button className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium mt-2">
                    View Events
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="p-4 border-t border-[#3A506B] text-center text-sm text-[#5BC0BE]">
        Find the best music events in your area
      </footer>
    </div>
  )
}

export default LocationsView

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Lokacija } from "@/types/lokacija"
import socket from "../utils/socket"

// Define the Session type
type Session = {
  sesija_id: number
  status: string
  naziv?: string
}

const LocationsView = () => {
  const [locations, setLocations] = useState<Lokacija[]>([])
  const [filteredLocations, setFilteredLocations] = useState<Lokacija[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [activeSessions, setActiveSessions] = useState<Record<number, any>>({})

  // Function to fetch locations
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
      setLoading(false)
    } catch (err) {
      console.error("Error fetching locations:", err)
      setError("Failed to load locations. Please try again later.")
      setLoading(false)
    }
  }

  // Function to fetch active sessions for all locations
  const fetchActiveSessions = async () => {
    try {
      const sessionsMap: Record<number, any> = {}

      // Fetch active sessions for each location
      const promises = locations.map(async (location) => {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/sesije/sesije-lokacija/${location.lokacija_id}`,
        )

        if (response.ok) {
          const sessions = await response.json()
          if (sessions && sessions.length > 0) {
            // Store the first active session for this location
            sessionsMap[location.lokacija_id] = sessions.find((s: Session) => s.status === "active") || null
          }
        }
      })

      await Promise.all(promises)
      setActiveSessions(sessionsMap)
    } catch (error) {
      console.error("Error fetching active sessions:", error)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchLocations()
  }, [])

  // Add a new useEffect to fetch sessions when locations change
  useEffect(() => {
    if (locations.length > 0) {
      fetchActiveSessions()
    }
  }, [locations])

  // Set up WebSocket for real-time updates
  useEffect(() => {
    // Join a general room for location updates
    socket.emit("join_room", "locations")

    // Listen for data refresh events
    socket.on("refresh_data", (data) => {
      console.log("Received refresh data:", data)

      if (data.type === "location_update" || !data.type) {
        fetchLocations()
      }
    })

    return () => {
      // Leave room and remove listeners when component unmounts
      socket.emit("leave_room", "locations")
      socket.off("refresh_data")
    }
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

  // Sort locations to show those with active events first
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    const aHasActiveSession = !!activeSessions[a.lokacija_id]
    const bHasActiveSession = !!activeSessions[b.lokacija_id]

    if (aHasActiveSession && !bHasActiveSession) return -1
    if (!aHasActiveSession && bHasActiveSession) return 1
    return 0
  })

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
            {sortedLocations.map((location) => {
              const hasActiveSession = !!activeSessions[location.lokacija_id]
              const activeSession = activeSessions[location.lokacija_id]

              return (
                <div
                  key={location.lokacija_id}
                  className="bg-[#1C2541] rounded-xl overflow-hidden shadow-lg border border-[#3A506B] hover:border-[#5BC0BE] transition-all"
                >
                  <div className="h-48 bg-[#3A506B] relative">
                    <img
                      src={location.profil_slika_link || "/placeholder.svg?height=200&width=400"}
                      alt={location.naziv_kluba || "Club"}
                      className={`w-full h-full object-cover ${!hasActiveSession ? "grayscale" : ""}`}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {location.naziv_kluba || `Club #${location.lokacija_id}`}
                    </h3>

                    <div className="mb-2">
                      {hasActiveSession ? (
                        <p className="text-[#6FFFE9] font-medium">{activeSession.naziv || "Active Event"}</p>
                      ) : (
                        <p className="text-gray-400 italic">No active events at this time</p>
                      )}
                    </div>

                    <div className="flex items-center text-[#5BC0BE] mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{location.adresa || "Address not available"}</span>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => hasActiveSession && handleLocationClick(location.lokacija_id)}
                        className={`${
                          hasActiveSession
                            ? "bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]"
                            : "bg-gray-500 cursor-not-allowed"
                        } font-medium`}
                        disabled={!hasActiveSession}
                      >
                        Order a song!
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <footer className="p-4 border-t border-[#3A506B] text-center">
        <div className="flex justify-center">
          <Button onClick={() => navigate("/nickform")} className="bg-[#3A506B] hover:bg-[#5BC0BE] text-white">
            Logout
          </Button>
        </div>
        <p className="text-sm text-[#5BC0BE] mt-2">Find the best music events in your area</p>
      </footer>
    </div>
  )
}

export default LocationsView

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Calendar, ArrowUp, ArrowDown, Clock, MapPin, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Sesija } from "@/types/sesija"
import socket from "../utils/socket"

const MojeSesije = () => {
  const [sessions, setSessions] = useState<Sesija[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Sesija[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc") // Default to newest first
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<Sesija | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const navigate = useNavigate()

  // Function to fetch sessions
  const fetchSessions = async () => {
    try {
      setLoading(true)
      const djData = localStorage.getItem("dj")

      if (!djData) {
        navigate("/login")
        return
      }

      const dj = JSON.parse(djData)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sesije/sesije-dj/${dj.dj_id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch sessions")
      }

      const data: Sesija[] = await response.json()
      setSessions(data)
      setFilteredSessions(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching sessions:", err)
      setError("Failed to load sessions. Please try again later.")
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchSessions()
  }, [navigate])

  // Set up WebSocket for real-time updates
  useEffect(() => {
    const djData = localStorage.getItem("dj")
    if (!djData) return

    const dj = JSON.parse(djData)

    // Join room for this specific DJ
    socket.emit("join_room", `dj_${dj.dj_id}`)

    // Listen for data refresh events
    socket.on("refresh_data", (data) => {
      console.log("Received refresh data:", data)
      fetchSessions()
    })

    return () => {
      // Leave room and remove listeners when component unmounts
      socket.emit("leave_room", `dj_${dj.dj_id}`)
      socket.off("refresh_data")
    }
  }, [])

  useEffect(() => {
    // Filter sessions based on search query
    if (searchQuery.trim() === "") {
      setFilteredSessions([...sessions])
    } else {
      const filtered = sessions.filter(
        (session) =>
          (session.naziv && session.naziv.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (session.comentary && session.comentary.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredSessions(filtered)
    }

    // Sort sessions by expiration date
    setFilteredSessions((prev) =>
      [...prev].sort((a, b) => {
        const dateA = new Date(a.expiration).getTime()
        const dateB = new Date(b.expiration).getTime()
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA
      }),
    )
  }, [searchQuery, sessions, sortOrder])

  const handleSessionClick = (session: Sesija) => {
    setSelectedSession(session)
    setIsDialogOpen(true)
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
      <header className="p-4 flex justify-between items-center border-b border-[#3A506B]">
        <Button onClick={() => navigate("/profil")} className="bg-[#3A506B] hover:bg-[#5BC0BE] text-white">
          Back to Profile
        </Button>
        <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
        <div className="w-[100px]"></div> {/* Spacer for centering */}
      </header>

      <div className="max-w-4xl mx-auto w-full mt-8">
        <h2 className="text-2xl font-bold text-[#6FFFE9] mb-6">My Sessions</h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1C2541] border-[#3A506B] text-white placeholder:text-[#3A506B] h-12 pr-12 w-full"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5BC0BE] h-5 w-5" />
          </div>

          <Button
            onClick={toggleSortOrder}
            className="bg-[#1C2541] border border-[#3A506B] hover:bg-[#3A506B] text-white flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Sort by Date
            {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5BC0BE]"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-400">{error}</div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center p-8 text-[#5BC0BE]">No sessions found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session.sesija_id}
                onClick={() => handleSessionClick(session)}
                className="bg-[#1C2541] rounded-xl overflow-hidden shadow-lg border border-[#3A506B] cursor-pointer hover:border-[#5BC0BE] transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#6FFFE9]">
                      {session.naziv || `Session #${session.sesija_id}`}
                    </h3>
                    <Badge className={session.status === "active" ? "bg-green-500" : "bg-red-500"}>
                      {session.status === "active" ? "Active" : "Expired"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-[#5BC0BE]" />
                      <span>{formatDate(session.expiration)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-[#5BC0BE]" />
                      <span>Location ID: {session.lokacija_id}</span>
                    </div>
                    <div className="flex items-center">
                      <Music className="h-4 w-4 mr-2 text-[#5BC0BE]" />
                      <span>Max Songs: {session.queue_max_song_count}</span>
                    </div>
                  </div>

                  {session.comentary && (
                    <div className="mt-4 p-3 bg-[#0B132B] rounded-lg text-sm">{session.comentary}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1C2541] text-white border-[#3A506B] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#6FFFE9]">
              {selectedSession?.naziv || `Session #${selectedSession?.sesija_id}`}
            </DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#5BC0BE] text-sm">Session ID</p>
                  <p>{selectedSession.sesija_id}</p>
                </div>
                <div>
                  <p className="text-[#5BC0BE] text-sm">DJ ID</p>
                  <p>{selectedSession.dj_id}</p>
                </div>
                <div>
                  <p className="text-[#5BC0BE] text-sm">Location ID</p>
                  <p>{selectedSession.lokacija_id}</p>
                </div>
                <div>
                  <p className="text-[#5BC0BE] text-sm">Minimum Price</p>
                  <p>{selectedSession.minimal_price} €</p>
                </div>
                <div>
                  <p className="text-[#5BC0BE] text-sm">Max Queue Size</p>
                  <p>{selectedSession.queue_max_song_count} songs</p>
                </div>
                <div>
                  <p className="text-[#5BC0BE] text-sm">Expiration</p>
                  <p>{formatDate(selectedSession.expiration)}</p>
                </div>
                <div>
                  <p className="text-[#5BC0BE] text-sm">Status</p>
                  <p className={selectedSession.status === "active" ? "text-green-500" : "text-red-500"}>
                    {selectedSession.status === "active" ? "Active" : "Expired"}
                  </p>
                </div>
              </div>

              {selectedSession.comentary && (
                <div>
                  <p className="text-[#5BC0BE] text-sm">Commentary</p>
                  <p className="p-3 bg-[#0B132B] rounded-lg mt-1">{selectedSession.comentary}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  onClick={() => navigate(`/sesijapage/${selectedSession.sesija_id}`)}
                  className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium"
                >
                  View Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MojeSesije

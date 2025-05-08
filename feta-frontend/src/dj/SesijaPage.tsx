"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Clock, DollarSign, CheckCircle, XCircle, Filter, ArrowUpDown, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import socket from "../utils/socket"

// Configuration constants
const SOCKET_REFRESH_DELAY = 4000 // 4 seconds delay after socket message
const AUTO_REFRESH_INTERVAL = 30000 // 30 seconds for auto refresh

interface Order {
  narudzba_id: number
  sesija_id: number
  korisnik: string
  comment: string
  donation: number
  nickname: string
  song_id: string
  song_name: string
  song_artist: string
  song_album_art: string
  status: "pending" | "allowed" | "played" | "rejected"
  created_at: string
}

interface Session {
  sesija_id: number
  dj_id: number
  lokacija_id: number
  expiration: string
  minimal_price: number
  comentary: string
  queue_max_song_count: number
  naziv: string
  status: "active" | "expired"
}

export default function SesijaPage() {
  const { sesija_id } = useParams<{ sesija_id: string }>()
  const [session, setSession] = useState<Session | null>(null)
  const [requests, setRequests] = useState<Order[]>([])
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "allowed" | "played" | "rejected">("all")
  const [sortOrder, setSortOrder] = useState<"time" | "price">("time")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc") // newest first by default
  const [totalEarnings, setTotalEarnings] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()

  // Function to fetch session data
  const fetchSession = async () => {
    try {
      // Check if DJ is logged in
      const token = localStorage.getItem("token")
      const djData = localStorage.getItem("dj")

      if (!token || !djData) {
        navigate("/login")
        return
      }

      // Use the session ID from URL params if available, otherwise check for active session
      const sessionId = sesija_id || "3" // Default fallback
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sesije/${sessionId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch session")
      }

      const data: Session = await response.json()
      setSession(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching session:", error)
      setError("Failed to load session. Please try again later.")
      setLoading(false)
    }
  }

  // Function to fetch orders for the session
  const fetchRequests = async () => {
    if (!session) return

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/narudzbe/posesiji/${session.sesija_id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data: Order[] = await response.json()
      setRequests(data)
      setLastRefresh(new Date())

      // Calculate total earnings from played requests
      const earnings = data.filter((req) => req.status === "played").reduce((sum, req) => sum + req.donation, 0)
      setTotalEarnings(earnings)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  // Function to refresh all data
  const refreshAllData = () => {
    fetchSession()
    fetchRequests()
  }

  // Initial data fetch
  useEffect(() => {
    fetchSession()
  }, [sesija_id, navigate])

  // Fetch orders when session data is available
  useEffect(() => {
    if (session) {
      fetchRequests()
    }
  }, [session])

  // Set up periodic refresh
  useEffect(() => {
    // Only set up the timer if we have a session
    if (session) {
      // Clear any existing timer
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }

      // Set up new timer
      refreshTimerRef.current = setInterval(() => {
        console.log(`Auto refreshing data (last refresh: ${formatTimeAgo(lastRefresh)})`)
        refreshAllData()
      }, AUTO_REFRESH_INTERVAL)
    }

    // Clean up on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
    }
  }, [session, lastRefresh])

  // Set up WebSocket for real-time updates
  useEffect(() => {
    // Join room for this specific session
    if (session) {
      socket.emit("join_room", `session_${session.sesija_id}`)
    }

    // Listen for data refresh events
    socket.on("refresh_data", (data) => {
      console.log("Received refresh data:", data)

      // Specifically refresh orders for certain message types
      if (
        data.type === "stripe_webhook_narudzba" ||
        data.type === "narudzba_status_azuriran" ||
        data.type === "stripe_capture"
      ) {
        console.log(`Refreshing orders due to important change: ${data.type} (with delay of ${SOCKET_REFRESH_DELAY}ms)`)

        // Add timeout to ensure server data is updated
        setTimeout(() => {
          fetchRequests()
        }, SOCKET_REFRESH_DELAY)
      }

      // For all message types, refresh all data with delay
      setTimeout(() => {
        refreshAllData()
      }, SOCKET_REFRESH_DELAY)
    })

    return () => {
      // Leave room and remove listeners when component unmounts
      if (session) {
        socket.emit("leave_room", `session_${session.sesija_id}`)
      }
      socket.off("refresh_data")
    }
  }, [session])

  const filteredRequests = activeFilter === "all" ? requests : requests.filter((req) => req.status === activeFilter)

  const handleStatusChange = async (id: number, newStatus: "allowed" | "played" | "rejected") => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/narudzbe/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Optimistically update UI
        setRequests(requests.map((req) => (req.narudzba_id === id ? { ...req, status: newStatus } : req)))

        // Update total earnings if status changed to/from played/rejected
        if (newStatus === "played" || newStatus === "rejected") {
          const updatedEarnings = requests
            .filter((req) => (req.narudzba_id === id ? newStatus === "played" : req.status === "played"))
            .reduce((sum, req) => sum + req.donation, 0)
          setTotalEarnings(updatedEarnings)
        }

        // Add timeout to refresh data after server processes the change
        setTimeout(() => {
          fetchRequests()
        }, SOCKET_REFRESH_DELAY)
      } else {
        console.error("Error updating status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }

    if (newStatus === "allowed") {
      try {
        const captureResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/narudzbe/${id}/capture`, {
          method: "POST",
        })

        if (!captureResp.ok) {
          alert("Error processing payment.")
        }
      } catch (error) {
        console.error("Error capturing payment:", error)
      }
    }
  }

  // Sort requests based on current sort settings
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortOrder === "time") {
      const timeA = new Date(a.created_at).getTime()
      const timeB = new Date(b.created_at).getTime()
      return sortDirection === "asc" ? timeA - timeB : timeB - timeA
    } else {
      // Sort by price
      return sortDirection === "asc" ? a.donation - b.donation : b.donation - a.donation
    }
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0B132B]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5BC0BE]"></div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
        <header className="p-4 flex justify-between items-center border-b border-[#3A506B]">
          <Button onClick={() => navigate("/user_home")} className="bg-[#3A506B] hover:bg-[#5BC0BE] text-white">
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
          <div className="w-[100px]"></div> {/* Spacer for centering */}
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="p-6 bg-[#1C2541] rounded-lg border border-[#3A506B] max-w-md">
            <h2 className="text-xl text-[#6FFFE9] mb-4">Error</h2>
            <p className="text-red-300">{error || "Session not found"}</p>
            <Button
              onClick={() => navigate("/user_home")}
              className="mt-4 bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]"
            >
              Create New Session
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white">
      <header className="p-4 flex justify-between items-center border-b border-[#3A506B]">
        <Button onClick={() => navigate("/user_home")} className="bg-[#3A506B] hover:bg-[#5BC0BE] text-white">
          Back
        </Button>
        <h1 className="text-2xl font-bold text-[#6FFFE9]">{session.naziv}</h1>
        <div className="flex items-center gap-2">
          <Button className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-2 px-4 rounded-lg">
            Balance: {totalEarnings.toFixed(2)} €
          </Button>
          <Button
            onClick={refreshAllData}
            className="bg-[#3A506B] hover:bg-[#5BC0BE] text-white"
            title={`Last refresh: ${formatTimeAgo(lastRefresh)}`}
          >
            <Clock className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Session details */}
      <div className="p-4 bg-[#1C2541] border-b border-[#3A506B]">
        <div className="max-w-2xl mx-auto space-y-1">
          <p>
            <strong>Expires:</strong> {new Date(session.expiration).toLocaleString()}
          </p>
          <p>
            <strong>Minimum price:</strong> {session.minimal_price} €
          </p>
          <p>
            <strong>Comment:</strong> {session.comentary}
          </p>
          <p>
            <strong>Maximum songs in queue:</strong> {session.queue_max_song_count}
          </p>
          <p className="text-xs text-[#5BC0BE]">
            Last refresh: {formatTimeAgo(lastRefresh)} (auto-refreshes every {AUTO_REFRESH_INTERVAL / 1000} seconds)
          </p>
        </div>
      </div>

      {/* Filters for requests - centered */}
      <div className="p-4 flex justify-center space-x-2 border-b border-[#3A506B]">
        <div className="flex flex-wrap justify-center gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-[#5BC0BE]">Status:</span>
            {(["all", "pending", "allowed", "played", "rejected"] as const).map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? "bg-[#5BC0BE] text-[#0B132B]" : "border-[#3A506B] text-[#5BC0BE]"}
              >
                {filter === "all"
                  ? "All"
                  : filter === "pending"
                    ? "Pending"
                    : filter === "allowed"
                      ? "Allowed"
                      : filter === "played"
                        ? "Played"
                        : "Rejected"}
              </Button>
            ))}
          </div>

          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[#3A506B] text-[#5BC0BE] ml-2">
                <Filter className="h-4 w-4 mr-2" />
                Sort by: {sortOrder === "time" ? "Time" : "Price"}
                <ArrowUpDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1C2541] border-[#3A506B]">
              <DropdownMenuRadioGroup
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as "time" | "price")}
              >
                <DropdownMenuRadioItem value="time" className="text-white hover:bg-[#3A506B]">
                  Time
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price" className="text-white hover:bg-[#3A506B]">
                  Price
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Direction toggle */}
          <Button
            variant="outline"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="border-[#3A506B] text-[#5BC0BE]"
          >
            {sortDirection === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>
      </div>

      {/* Request list */}
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {sortedRequests.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-[#5BC0BE]">No song requests found</p>
            </div>
          ) : (
            sortedRequests.map((request) => (
              <div key={request.narudzba_id} className="bg-[#1C2541] rounded-lg p-4 shadow-lg border border-[#3A506B]">
                <div className="flex items-start gap-3">
                  <img
                    src={request.song_album_art || "/placeholder.svg"}
                    alt={request.song_name}
                    className="w-16 h-16 rounded-md"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{request.song_name}</h3>
                        <p className="text-[#5BC0BE]">{request.song_artist}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            request.status === "pending"
                              ? "bg-yellow-500 text-black"
                              : request.status === "allowed"
                                ? "bg-blue-500"
                                : request.status === "played"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                          }
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm">
                        <Music className="h-4 w-4 mr-1 text-[#5BC0BE]" />
                        <span>{request.nickname}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-1 text-[#5BC0BE]" />
                        <span>{request.donation.toFixed(2)} €</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-[#5BC0BE]" />
                        <span>{formatTimeAgo(new Date(request.created_at))}</span>
                      </div>

                      {request.comment && <p className="text-sm mt-2 p-2 bg-[#0B132B] rounded">{request.comment}</p>}
                    </div>
                  </div>
                </div>

                {/* Actions based on status */}
                <div className="flex justify-end gap-2 mt-3">
                  {request.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(request.narudzba_id, "allowed")}
                        className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(request.narudzba_id, "rejected")}
                        className="border-[#3A506B] text-[#5BC0BE] hover:bg-[#3A506B]"
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {request.status === "allowed" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(request.narudzba_id, "played")}
                      className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]"
                    >
                      Play
                    </Button>
                  )}

                  {request.status === "played" && <CheckCircle className="h-6 w-6 text-green-500" />}

                  {request.status === "rejected" && <XCircle className="h-6 w-6 text-red-500" />}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="p-4 border-t border-[#3A506B]">
        <Button
          onClick={async () => {
            try {
              const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sesije/finish/${session.sesija_id}`, {
                method: "POST",
              })

              if (response.ok) {
                alert("Session successfully ended")
                navigate("/user_home")
              } else {
                alert("Failed to end session. Please try again.")
              }
            } catch (error) {
              console.error("Error ending session:", error)
              alert("Error ending session. Please try again.")
            }
          }}
          className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-bold"
        >
          End Event
        </Button>
      </footer>
    </div>
  )
}

// Helper function for formatting time
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return "Just now"
  if (diffMins === 1) return "1 minute ago"
  if (diffMins < 60) return `${diffMins} minutes ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours === 1) return "1 hour ago"
  if (diffHours < 24) return `${diffHours} hours ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "1 day ago"
  return `${diffDays} days ago`
}

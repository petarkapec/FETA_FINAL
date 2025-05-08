"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import type { Sesija } from "../../types/sesija"
import type { Song } from "../../types/song"
import { Header } from "./Header.tsx"
import { SessionInfo } from "./SessionInfo"
import { SongSearch } from "./SongSearch"
import { SongRequestDialog } from "./SongRequestDialog"
import { Footer } from "./Footer.tsx"
import { fetchToken, searchSongs } from "../../utils/spotifyApi.ts"
import type { DJ } from "../../types/dj"
import type { Lokacija } from "../../types/lokacija"
import { Button } from "@/components/ui/button"
import { Headphones, MapPin, ArrowLeft, AlertCircle, Music, Clock, DollarSign, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import socket from "../../utils/socket"

interface DJProfileProps {
  ime: string
  profilnaSlika?: string
  instagram?: string
}

export const DJProfile = ({ ime, profilnaSlika, instagram }: DJProfileProps) => (
  <div className="flex flex-col items-center bg-[#1B2B4A] p-6 rounded-2xl shadow-md">
    <img
      src={profilnaSlika || "/placeholder.svg"}
      alt="DJ Profile"
      className="w-48 h-48 rounded-full object-cover border-4 border-[#6FFFE9]"
    />
    <h2 className="text-2xl font-bold text-white mt-4">DJ {ime}</h2>
    {instagram && <p className="text-[#6FFFE9] mt-2">@{instagram}</p>}
  </div>
)

interface ClubProfileProps {
  nazivKluba?: string
  profilnaSlika?: string
  instagram?: string
  aboutus?: string
}

export const ClubProfile = ({ nazivKluba, profilnaSlika, instagram, aboutus }: ClubProfileProps) => (
  <div className="flex flex-col items-center bg-[#1B2B4A] p-6 rounded-2xl shadow-md">
    <img
      src={profilnaSlika || "/placeholder.svg"}
      alt="Club Profile"
      className="w-48 h-48 rounded-full object-cover border-4 border-[#6FFFE9]"
    />
    <h2 className="text-2xl font-bold text-white mt-4">{nazivKluba || "Nepoznat klub"}</h2>
    {instagram && <p className="text-[#6FFFE9] mt-2">@{instagram}</p>}
  </div>
)

// Interface for user orders
interface UserOrder {
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

const SpotifySearch = () => {
  const { lokacija_id } = useParams<{ lokacija_id: string }>()
  const [sesija, setSesija] = useState<Sesija | null>(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Song[]>([])
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [nadimak, setNadimak] = useState("")
  const [donacija, setDonacija] = useState("")
  const [komentar, setKomentar] = useState("")
  const [dj, setDj] = useState<DJ | null>(null)
  const [klub, setKlub] = useState<Lokacija | null>(null)
  const [activeView, setActiveView] = useState<"main" | "dj" | "club" | "orders">("main")
  const nickname = localStorage.getItem("nickname")
  const userId = localStorage.getItem("user_id")
  const [playlistTracks, setPlaylistTracks] = useState<string[]>([]) // Track IDs from playlist
  const [playlistLoading, setPlaylistLoading] = useState(false)
  const [playlistError, setPlaylistError] = useState<string | null>(null)
  const [isPlaylistRestricted, setIsPlaylistRestricted] = useState(false)
  const [tokenLoaded, setTokenLoaded] = useState(false)
  const [userOrders, setUserOrders] = useState<UserOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const sesija_id = queryParams.get("sesija_id")

  // Function to fetch session data
  const fetchSesija = async () => {
    try {
      setLoading(true)
      // Use the session ID from URL params if available, otherwise use default
      const sessionEndpoint = sesija_id
        ? `${import.meta.env.VITE_BACKEND_URL}/sesije/${sesija_id}`
        : `${import.meta.env.VITE_BACKEND_URL}/sesije/3`

      const response = await fetch(sessionEndpoint)

      if (!response.ok) {
        throw new Error("Failed to fetch session")
      }

      const data: Sesija = await response.json()

      // Provjera je li sesija istekla
      if (data.status === "expired") {
        console.log("Session is expired:", data)
        setSessionExpired(true)
      } else {
        setSessionExpired(false)
      }

      setSesija(data)

      if (data.dj_id) {
        const djResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/izvodjaci/${data.dj_id}`)
        const djData: DJ = await djResponse.json()
        setDj(djData)
      }

      if (data.lokacija_id) {
        const klubResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/lokacije/${data.lokacija_id}`)
        const klubData: Lokacija = await klubResponse.json()
        setKlub(klubData)
      }

      // Just set the flag if playlist restrictions are set, but don't fetch yet
      if (data.list_link) {
        setIsPlaylistRestricted(true)
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching session:", error)
      setError("Failed to load session. Please try again later.")
      setLoading(false)
    }
  }

  // Function to fetch user orders
  const fetchUserOrders = async () => {
    if (!userId) return

    setOrdersLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/narudzbe/korisnik/${userId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch user orders")
      }

      const data = await response.json()
      setUserOrders(data)
    } catch (error) {
      console.error("Error fetching user orders:", error)
    } finally {
      setOrdersLoading(false)
    }
  }

  // First, load the token
  useEffect(() => {
    const loadToken = async () => {
      try {
        const spotifyToken = await fetchToken()
        setToken(spotifyToken)
        setTokenLoaded(true)
        console.log("Token loaded:", spotifyToken ? "Success" : "Empty")
      } catch (error) {
        console.error("Failed to load token:", error)
        setTokenLoaded(true) // Still mark as loaded even if it failed
      }
    }

    loadToken()
  }, [])

  // Then, fetch session data
  useEffect(() => {
    fetchSesija()
  }, [sesija_id, lokacija_id])

  // Fetch user orders
  useEffect(() => {
    fetchUserOrders()
  }, [userId])

  // Set up WebSocket for real-time updates
  useEffect(() => {
    // Join room for this specific session and user
    if (sesija) {
      socket.emit("join_room", `session_${sesija.sesija_id}`)
    }

    if (userId) {
      socket.emit("join_room", `user_${userId}`)
    }

    // Listen for data refresh events
    socket.on("refresh_data", (data) => {
      console.log("Received refresh data:", data)

      // Osvježi sve podatke bez obzira na tip poruke
      fetchUserOrders()
      fetchSesija()
    })

    return () => {
      // Leave rooms and remove listeners when component unmounts
      if (sesija) {
        socket.emit("leave_room", `session_${sesija.sesija_id}`)
      }

      if (userId) {
        socket.emit("leave_room", `user_${userId}`)
      }

      socket.off("refresh_data")
    }
  }, [sesija, userId])

  // Finally, fetch playlist tracks only when both token and session are loaded
  useEffect(() => {
    if (!tokenLoaded || !sesija || !isPlaylistRestricted || !sesija.list_link) {
      return
    }

    console.log("Both token and session loaded, fetching playlist tracks")

    // Add a delay to ensure everything is properly initialized
    const timeoutId = setTimeout(() => {
      fetchPlaylistTracks(sesija.list_link!, sesija.list_bool || false)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [tokenLoaded, sesija, isPlaylistRestricted])

  // Function to extract playlist ID from Spotify URL
  const extractPlaylistId = (url: string): string | null => {
    // Handle different Spotify URL formats
    const patterns = [
      /spotify:playlist:([a-zA-Z0-9]+)/, // Spotify URI
      /open.spotify.com\/playlist\/([a-zA-Z0-9]+)/, // Web URL
      /^([a-zA-Z0-9]+)$/, // Just the ID
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  // Function to fetch tracks from a Spotify playlist
  const fetchPlaylistTracks = async (playlistUrl: string, isAllowList: boolean) => {
    if (!token) {
      console.error("Spotify token not available")
      return
    }

    setPlaylistLoading(true)
    setPlaylistError(null)

    try {
      const playlistId = extractPlaylistId(playlistUrl)

      if (!playlistId) {
        setPlaylistError("Invalid playlist URL")
        setPlaylistLoading(false)
        return
      }

      console.log(`Fetching playlist ${playlistId} with token available: ${!!token}`)

      // Fetch playlist tracks from Spotify API
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist tracks: ${response.status}`)
      }

      const data = await response.json()

      // Extract track IDs from the playlist
      const trackIds = data.items.filter((item: any) => item.track && item.track.id).map((item: any) => item.track.id)

      setPlaylistTracks(trackIds)
      console.log(`Loaded ${trackIds.length} tracks from playlist (${isAllowList ? "Allow" : "Block"} list)`)
    } catch (error) {
      console.error("Error fetching playlist tracks:", error)
      setPlaylistError("Failed to load playlist. Please try again later.")
    } finally {
      setPlaylistLoading(false)
    }
  }

  const handleQueryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)

    if (!newQuery.trim()) {
      setResults([])
      return
    }

    try {
      let songs = await searchSongs(token, newQuery)

      // Apply playlist restrictions if needed
      if (isPlaylistRestricted && sesija && sesija.list_link && playlistTracks.length > 0) {
        if (sesija.list_bool) {
          // Allow list: only show songs that are in the playlist
          songs = songs.filter((song) => playlistTracks.includes(song.id))
        } else {
          // Block list: exclude songs that are in the playlist
          songs = songs.filter((song) => !playlistTracks.includes(song.id))
        }
      }

      setResults(songs)
    } catch (error) {
      console.error("Error searching songs:", error)
    }
  }

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song)
    setIsDialogOpen(true)
  }

  const handleLogout = () => {
    localStorage.clear()
    setTimeout(() => {
      window.location.reload()
    }, 0)
  }

  const handleBackToLocations = () => {
    navigate("/locations")
  }

  const handleSubmitRequest = async () => {
    if (!selectedSong || !nadimak || !donacija || !sesija) return

    const requestData = {
      sesija_id: sesija.sesija_id,
      korisnik: nadimak,
      comment: komentar,
      donation: Number.parseFloat(donacija),
      nickname: nadimak,
      song_id: selectedSong.id,
      song_name: selectedSong.name,
      song_artist: selectedSong.artist,
      song_album_art: selectedSong.albumArt,
      status: "pending",
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/narudzbe/stvori`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const data = await response.json()
        navigate(`/narudzba/${data.narudzba_id}`)
      } else {
        throw new Error("Error submitting request")
      }
    } catch (error) {
      console.error("Error submitting request:", error)
      alert("Error submitting request. Please try again.")
    }
  }

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
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

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "allowed":
        return "bg-blue-500"
      case "played":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5BC0BE]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
        <div className="flex justify-center items-center h-screen">
          <div className="bg-[#1C2541] p-6 rounded-lg max-w-md text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#6FFFE9] mb-4">Error</h2>
            <p className="mb-4">{error}</p>
            <Button onClick={handleBackToLocations} className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]">
              Back to Locations
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!sesija) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
        <Header dj={dj} club={klub} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#5BC0BE] text-xl text-center">
            Currently, no artists are using FETA. Stay tuned for updates!
          </p>
        </main>
      </div>
    )
  }

  // Prikaži poseban UI ako je sesija istekla
  if (sessionExpired) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
        <div className="flex justify-center items-center h-screen">
          <div className="bg-[#1C2541] p-6 rounded-lg max-w-md text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#6FFFE9] mb-4">Session Expired</h2>
            <p className="mb-4">This session has ended. The DJ is no longer accepting song requests.</p>
            <Button onClick={handleBackToLocations} className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]">
              Find Another Event
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderMainContent = () => (
    <>
      <SessionInfo sesija={sesija} />

      {/* Playlist restriction notice */}
      {isPlaylistRestricted && (
        <div className="max-w-md mx-auto mb-4 p-3 bg-[#1C2541] border border-[#3A506B] rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-[#5BC0BE]" />
          <p className="text-sm">
            {playlistLoading
              ? "Loading playlist restrictions..."
              : playlistError
                ? `Error: ${playlistError}`
                : `This session has a ${sesija.list_bool ? "allow" : "block"} list with ${playlistTracks.length} songs.`}
          </p>
        </div>
      )}

      <SongSearch
        query={query}
        setQuery={setQuery}
        results={results}
        handleQueryChange={handleQueryChange}
        handleSongSelect={handleSongSelect}
      />
      <SongRequestDialog
        sesija_id={sesija.sesija_id}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedSong={selectedSong}
        donacija={donacija}
        setDonacija={setDonacija}
        komentar={komentar}
        setKomentar={setKomentar}
        minCijena={sesija.minimal_price}
      />
    </>
  )

  const renderUserOrdersView = () => (
    <div className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl mx-auto">
      <Button
        onClick={() => setActiveView("main")}
        className="mb-6 bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium"
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        Back to session
      </Button>

      <div className="w-full bg-[#1C2541] rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#6FFFE9] mb-6">My Song Requests</h2>

        {ordersLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5BC0BE]"></div>
          </div>
        ) : userOrders.length === 0 ? (
          <p className="text-center py-8 text-[#5BC0BE]">You haven't made any song requests yet.</p>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div key={order.narudzba_id} className="bg-[#0B132B] rounded-lg p-4 shadow border border-[#3A506B]">
                <div className="flex items-start gap-3">
                  <img
                    src={order.song_album_art || "/placeholder.svg"}
                    alt={order.song_name}
                    className="w-16 h-16 rounded-md"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{order.song_name}</h3>
                        <p className="text-[#5BC0BE]">{order.song_artist}</p>
                      </div>

                      <Badge className={getStatusBadgeColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-1 text-[#5BC0BE]" />
                        <span>{order.donation.toFixed(2)} €</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-[#5BC0BE]" />
                        <span>{formatTimeAgo(order.created_at)}</span>
                      </div>

                      {order.comment && <p className="text-sm mt-2 p-2 bg-[#1C2541] rounded">{order.comment}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderProfileView = () => {
    switch (activeView) {
      case "dj":
        return (
          <div className="flex flex-col items-center justify-center flex-1">
            <Button
              onClick={() => setActiveView("main")}
              className="mb-6 bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              Back to session
            </Button>
            <DJProfile ime={dj?.ime || ""} profilnaSlika={dj?.profilna_slika} instagram={dj?.instagram} />
          </div>
        )
      case "club":
        return (
          <div className="flex flex-col items-center justify-center flex-1">
            <Button
              onClick={() => setActiveView("main")}
              className="mb-6 bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              Back to session
            </Button>
            <ClubProfile
              nazivKluba={klub?.naziv_kluba}
              profilnaSlika={klub?.profil_slika_link}
              instagram={klub?.instagram}
            />
          </div>
        )
      case "orders":
        return renderUserOrdersView()
      default:
        return renderMainContent()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4 relative">
      <div>
        <div className="absolute top-4 left-4 flex items-center space-x-2 text-[#6FFFE9]">
          <Button
            onClick={() => setActiveView("dj")}
            className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium"
          >
            <Headphones className="w-6 h-6" />
            <span className="text-lg font-semibold">{dj?.ime || "DJ"}</span>
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
          <h2 className="mt-2">Pozdrav, {nickname} ovdje možete naručiti pjesmu!</h2>
          <div className="mt-2 flex justify-center gap-4">
            <Button onClick={handleBackToLocations} className="bg-[#3A506B] hover:bg-[#5BC0BE] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Locations
            </Button>
            <Button onClick={() => setActiveView("orders")} className="bg-[#3A506B] hover:bg-[#5BC0BE] text-white">
              <Music className="w-4 h-4 mr-2" />
              My Requests
            </Button>
            <Button onClick={handleLogout} className="bg-[#3A506B] hover:bg-[#5BC0BE] text-white">
              Logout
            </Button>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-2 text-[#6FFFE9]">
          <Button
            onClick={() => setActiveView("club")}
            className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium"
          >
            <MapPin className="w-6 h-6" />
            <span className="text-lg font-semibold">{klub?.naziv_kluba || "Club"}</span>
          </Button>
        </div>
      </div>

      {renderProfileView()}
      <Footer />
    </div>
  )
}

export default SpotifySearch

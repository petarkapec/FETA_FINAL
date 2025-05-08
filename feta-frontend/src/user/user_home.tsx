"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ChevronDown, ChevronUp, Clock, List, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import type { Lokacija } from "@/types/lokacija"
import socket from "../utils/socket"

const UserHome = () => {
  const navigate = useNavigate()
  const [locations, setLocations] = useState<Lokacija[]>([])
  const [filteredLocations, setFilteredLocations] = useState<Lokacija[]>([])
  const [locationSearch, setLocationSearch] = useState("")
  const [showExtended, setShowExtended] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false)

  // Form state
  const [selectedLocation, setSelectedLocation] = useState<Lokacija | null>(null)
  const [minimalPrice, setMinimalPrice] = useState("10")
  const [commentary, setCommentary] = useState("")
  const [naziv, setNaziv] = useState("")
  const [queueMaxSongCount, setQueueMaxSongCount] = useState("1000")
  const [expirationHours, setExpirationHours] = useState("24")
  const [listLink, setListLink] = useState("")
  const [listBool, setListBool] = useState(false)

  // Function to fetch locations
  const fetchLocations = async () => {
    try {
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
    }
  }

  // Function to check active session
  const checkActiveSession = async () => {
    try {
      const djData = localStorage.getItem("dj")
      if (!djData) return

      const dj = JSON.parse(djData)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sesije/active/${dj.dj_id}`)

      if (response.ok) {
        const data = await response.json()
        if (data && data.sesija_id) {
          // Redirect to SesijaPage with the active session ID
          navigate(`/sesijapage/${data.sesija_id}`)
          return
        }
      }
    } catch (error) {
      console.error("Error checking active session:", error)
    }
  }

  useEffect(() => {
    // Check if DJ is logged in
    const token = localStorage.getItem("token")
    const djData = localStorage.getItem("dj")

    if (!token || !djData) {
      navigate("/login")
      return
    }

    // Check for active session
    checkActiveSession()

    // Fetch locations
    fetchLocations()
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

      if (data.type === "session_update") {
        checkActiveSession()
      }

      if (data.type === "location_update") {
        fetchLocations()
      }
    })

    return () => {
      // Leave room and remove listeners when component unmounts
      socket.emit("leave_room", `dj_${dj.dj_id}`)
      socket.off("refresh_data")
    }
  }, [])

  useEffect(() => {
    // Filter locations based on search
    if (locationSearch.trim() === "") {
      setFilteredLocations(locations)
    } else {
      const filtered = locations.filter(
        (location) =>
          (location.naziv_kluba && location.naziv_kluba.toLowerCase().includes(locationSearch.toLowerCase())) ||
          (location.adresa && location.adresa.toLowerCase().includes(locationSearch.toLowerCase())),
      )
      setFilteredLocations(filtered)
    }
  }, [locationSearch, locations])

  const handleLocationSelect = (location: Lokacija) => {
    setSelectedLocation(location)
    setLocationPopoverOpen(false)
  }

  const handleCreateSession = async () => {
    if (!selectedLocation) {
      setError("Please select a location")
      return
    }

    if (!naziv.trim()) {
      setError("Please enter a session name")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const djData = localStorage.getItem("dj")
      if (!djData) {
        navigate("/login")
        return
      }

      const dj = JSON.parse(djData)

      // Calculate expiration date
      const now = new Date()
      const expirationDate = new Date(now.getTime() + Number.parseInt(expirationHours) * 60 * 60 * 1000)

      // Use default values for extended fields if not shown
      const sessionData = {
        dj_id: dj.dj_id,
        lokacija_id: selectedLocation.lokacija_id,
        minimal_price: Number.parseInt(minimalPrice),
        comentary: commentary,
        queue_max_song_count: showExtended ? Number.parseInt(queueMaxSongCount) : 1000,
        expiration: showExtended
          ? expirationDate.toISOString()
          : new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        naziv: naziv,
        status: "active",
        list_link: showExtended ? listLink || null : null,
        list_bool: showExtended ? listBool : false,
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sesije/novasesija`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      })

      if (!response.ok) {
        throw new Error("Failed to create session")
      }

      const data = await response.json()
      navigate(`/sesijapage/${data.sesija_id}`)
    } catch (err) {
      console.error("Error creating session:", err)
      setError("Failed to create session. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
      <header className="p-4 flex justify-between items-center border-b border-[#3A506B]">
        <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
        <Button
          onClick={() => navigate("/profil")}
          className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium flex items-center gap-2"
        >
          <User className="h-5 w-5" />
          Profile
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <Card className="w-full max-w-md bg-[#1C2541] shadow-lg border border-[#3A506B]">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-[#6FFFE9] text-center">Create New Session</h2>

            {error && <div className="p-3 bg-red-500/20 border border-red-500 rounded-md text-red-300">{error}</div>}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-name">Session Name</Label>
                <Input
                  id="session-name"
                  value={naziv}
                  onChange={(e) => setNaziv(e.target.value)}
                  placeholder="Enter session name"
                  className="bg-[#0B132B] border-[#3A506B] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex justify-between bg-[#0B132B] border-[#3A506B] text-white"
                    >
                      {selectedLocation
                        ? selectedLocation.naziv_kluba || `Location #${selectedLocation.lokacija_id}`
                        : "Select location"}
                      <Search className="h-4 w-4 text-[#5BC0BE]" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full bg-[#1C2541] shadow-lg border border-[#3A506B]">
                    <Command>
                      <CommandInput
                        placeholder="Search locations..."
                        value={locationSearch}
                        onValueChange={setLocationSearch}
                        className="text-white bg-[#0B132B]"
                      />
                      <CommandList className="max-h-60 overflow-auto">
                        {filteredLocations.length === 0 ? (
                          <p className="p-2 text-center text-sm text-[#5BC0BE]">No locations found</p>
                        ) : (
                          filteredLocations.map((location) => (
                            <CommandItem
                              key={location.lokacija_id}
                              onSelect={() => handleLocationSelect(location)}
                              className="cursor-pointer hover:bg-[#3A506B] text-white"
                            >
                              <div className="flex flex-col">
                                <span>{location.naziv_kluba || `Location #${location.lokacija_id}`}</span>
                                <span className="text-xs text-[#5BC0BE]">{location.adresa}</span>
                              </div>
                            </CommandItem>
                          ))
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimal-price">Minimal Price (€)</Label>
                <Input
                  id="minimal-price"
                  type="number"
                  value={minimalPrice}
                  onChange={(e) => setMinimalPrice(e.target.value)}
                  min="1"
                  className="bg-[#0B132B] border-[#3A506B] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commentary">Commentary</Label>
                <Textarea
                  id="commentary"
                  value={commentary}
                  onChange={(e) => setCommentary(e.target.value)}
                  placeholder="Add a description for your session"
                  className="bg-[#0B132B] border-[#3A506B] text-white"
                  rows={3}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowExtended(!showExtended)}
                className="w-full flex items-center justify-center gap-2 border-[#3A506B] text-[#5BC0BE]"
              >
                {showExtended ? "Hide Advanced Options" : "Show Advanced Options"}
                {showExtended ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              {showExtended && (
                <div className="space-y-4 pt-2 border-t border-[#3A506B]">
                  <div className="space-y-2">
                    <Label htmlFor="queue-max">Maximum Songs in Queue</Label>
                    <Input
                      id="queue-max"
                      type="number"
                      value={queueMaxSongCount}
                      onChange={(e) => setQueueMaxSongCount(e.target.value)}
                      min="1"
                      className="bg-[#0B132B] border-[#3A506B] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiration">Session Duration (hours)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="expiration"
                        type="number"
                        value={expirationHours}
                        onChange={(e) => setExpirationHours(e.target.value)}
                        min="1"
                        max="72"
                        className="bg-[#0B132B] border-[#3A506B] text-white"
                      />
                      <Clock className="h-5 w-5 text-[#5BC0BE]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="list-link">Playlist Link</Label>
                    <Input
                      id="list-link"
                      value={listLink}
                      onChange={(e) => setListLink(e.target.value)}
                      placeholder="Spotify playlist URL (optional)"
                      className="bg-[#0B132B] border-[#3A506B] text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <List className="h-5 w-5 text-[#5BC0BE]" />
                      <Label htmlFor="list-bool">{listBool ? "Allow List" : "Block List"}</Label>
                    </div>
                    <Switch
                      id="list-bool"
                      checked={listBool}
                      onCheckedChange={setListBool}
                      className="data-[state=checked]:bg-[#5BC0BE]"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleCreateSession}
                disabled={loading}
                className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium h-12 mt-4"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#0B132B]"></div>
                    Creating...
                  </div>
                ) : (
                  "Start Session"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default UserHome

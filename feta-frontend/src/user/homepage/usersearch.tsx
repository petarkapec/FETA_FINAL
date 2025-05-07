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
import { Button } from "@/components/ui/button.tsx"
import { Headphones, MapPin, ArrowLeft } from "lucide-react"

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
  const [activeView, setActiveView] = useState<"main" | "dj" | "club">("main")
  const nickname = localStorage.getItem("nickname")

  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const sesija_id = queryParams.get("sesija_id")

  useEffect(() => {
    const fetchSesija = async () => {
      try {
        // Use the session ID from URL params if available, otherwise use default
        const sessionEndpoint = sesija_id
          ? `${import.meta.env.VITE_BACKEND_URL}/sesije/${sesija_id}`
          : `${import.meta.env.VITE_BACKEND_URL}/sesije/3`

        const response = await fetch(sessionEndpoint)
        const data: Sesija = await response.json()

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
      } catch (error) {
        console.error("Error fetching session:", error)
      }
    }

    fetchSesija()
  }, [sesija_id, lokacija_id])

  useEffect(() => {
    if (token === null) {
      fetchToken().then(setToken)
    }
  }, [token])

  const handleQueryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    const songs = await searchSongs(token, newQuery)
    setResults(songs)
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

  const renderMainContent = () => (
    <>
      <SessionInfo sesija={sesija} />
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

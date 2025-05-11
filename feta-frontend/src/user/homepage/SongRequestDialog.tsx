"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { Song } from "../../types/song"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { RequestConfirmationCard } from "./RequestConfirmationCard"
import { EuroIcon } from "lucide-react"

interface SongRequestDialogProps {
  sesija_id: number
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedSong: Song | null
  donacija: string
  setDonacija: React.Dispatch<React.SetStateAction<string>>
  komentar: string
  setKomentar: React.Dispatch<React.SetStateAction<string>>
  minCijena: number
}

export const SongRequestDialog = ({
  sesija_id,
  isDialogOpen,
  setIsDialogOpen,
  selectedSong,
  donacija,
  setDonacija,
  komentar,
  setKomentar,
  minCijena,
}: SongRequestDialogProps) => {
  const maxCijena = minCijena * 25
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [poslanaNarudzba] = useState<any>(null)

  // Fix missing type for handleInitiatePayment function
  const handleInitiatePayment = async (): Promise<void> => {
    if (!selectedSong || !donacija || Number(donacija) < minCijena) return

    const userId = localStorage.getItem("user_id")

    const payload = {
      sesija_id: sesija_id,
      user_id: userId,
      donation: Number.parseInt(donacija, 10),
      song_id: selectedSong.id,
      song_name: selectedSong.name,
      song_artist: selectedSong.artist,
      song_album_art: selectedSong.albumArt,
      comment: komentar,
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stripe/initiate-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error("Error in server response:", response.status, response.statusText)
        return
      }

      const data = await response.json()

      console.log("Backend response:", data)

      const checkoutUrl = data?.checkoutUrl

      if (!checkoutUrl) {
        console.error("checkoutUrl not found in response:", data)
        return
      }

      // Redirect user to Stripe
      window.location.href = checkoutUrl
    } catch (error) {
      console.error("Failed to generate payment link:", error)
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1C2541] text-white border-[#3A506B] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#6FFFE9]">Submit song request</DialogTitle>
          </DialogHeader>

          {selectedSong && (
            <div className="flex items-center mb-4 p-3 bg-[#0B132B] rounded-md">
              <img
                src={selectedSong.albumArt || "/placeholder.svg"}
                alt={selectedSong.name}
                className="w-12 h-12 mr-3 rounded"
              />
              <div>
                <p className="font-medium">{selectedSong.name}</p>
                <p className="text-sm text-[#5BC0BE]">{selectedSong.artist}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-white">Donation amount </Label>
              <input
                type="range"
                min={minCijena}
                max={maxCijena}
                step={1}
                value={Number(donacija)}
                onChange={(e) => setDonacija(e.target.value)}
                className="w-full h-2 rounded-full appearance-none slider-thumb"
                style={{
                  background: `linear-gradient(to right, #6FFFE9 ${(Number(donacija) - minCijena) / (maxCijena - minCijena) * 100}%, #000000 ${(Number(donacija) - minCijena) / (maxCijena - minCijena) * 100}%)`,
                }}
              />
              <div className="flex items-center">
                <EuroIcon className="h-4 w-4 text-[#5BC0BE] mr-1" />
                <Input
                  type="number"
                  value={donacija}
                  onChange={(e) => setDonacija(e.target.value)}
                  onBlur={() => {
                    const value = Number(donacija)
                    if (isNaN(value) || value < minCijena) {
                      setDonacija(minCijena.toString())
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const value = Number(donacija)
                      if (isNaN(value) || value < minCijena) {
                        setDonacija(minCijena.toString())
                      }
                    }
                  }}
                  className="bg-[#0B132B] border-[#3A506B] text-white"
                />
              </div>
            </div>

            <Label>Additional comment</Label>
            <Textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Any special requests for the DJ?"
              className="bg-[#0B132B] border-[#3A506B] text-white"
            />

            <Button
              onClick={handleInitiatePayment}
              className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium"
            >
              Pay
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showConfirmation && poslanaNarudzba && (
        <div className="mt-4">
          <RequestConfirmationCard
            songName={poslanaNarudzba.song_name}
            songArtist={poslanaNarudzba.song_artist}
            songAlbumArt={poslanaNarudzba.song_album_art}
            nickname={"Anonymous"} // or from localStorage if available
            donation={poslanaNarudzba.donation.toString()}
            comment={poslanaNarudzba.comment}
            onCancel={() => setShowConfirmation(false)}
            onBackToHome={() => {
              setShowConfirmation(false)
              setIsDialogOpen(false)
            }}
          />
        </div>
      )}
    </>
  )
}

"use client"

import { useState } from "react"
import { Menu, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { Switch } from "@/components/ui/switch" // Assuming you use some library for switch

const locations = ["Klub H20", "Best Venue Hall", "Vintage Bar", "Aurora club", "Roko", "Ex club"]

export default function SettingsPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [location, setLocation] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [isLocationDefault, setIsLocationDefault] = useState(false)
  const [isPriceDefault, setIsPriceDefault] = useState(true)
  const [isDescriptionDefault, setIsDescriptionDefault] = useState(true)
  const [maxSongs, setMaxSongs] = useState("∞")
  const [isSpotifyEnabled, setIsSpotifyEnabled] = useState(false)
  const [isAllowList, setIsAllowList] = useState(true)
  const [blockList, setBlockList] = useState(["Lady Gaga - Bad Romance", "Sinan Sakić - trezan"])

  const toggleBlockList = (song: string) => {
    setBlockList((prev) => {
      if (prev.includes(song)) {
        return prev.filter((item) => item !== song)
      }
      return [...prev, song]
    })
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-[#0B132B] text-white">
      <header className="w-full flex items-center justify-between p-4 border-b border-[#3A506B]">
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-6 h-6 text-[#6FFFE9]" />
          </button>
          {menuOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-[#1C2541] shadow-lg rounded-md p-2 border border-[#3A506B]">
              <ul>
                <li className="p-2 cursor-pointer hover:bg-[#5BC প্রেমে] text-white">Profil</li>
                <li className="p-2 cursor-pointer hover:bg-[#5BC0BE] text-white">Moje Sesije</li>
              </ul>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold text-[#6FFFE9]">
          FETA <span className="text-[#5BC0BE] text-xl">DJ View</span>
        </h1>{" "}
        <Settings className="w-6 h-6 text-[#6FFFE9] cursor-pointer" />
      </header>

      <div>
        <Card className="w-full max-w-3xl mt-10 bg-[#1C2541] shadow-lg border border-[#3A506B] rounded-lg">
          <CardContent className="p-6 space-y-6">
            <span className="text-white">Lokacija Eventa</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex justify-between bg-[#3A506B] border border-[#5BC0BE] text-white"
                >
                  {location || "Odaberi mjesto"} <Search className="w-4 h-4 text-[#6FFFE9]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-full bg-[#1C2541] shadow-lg border border-[#3A506B]">
                <Command>
                  <CommandInput placeholder="Pretraži mjesto..." className="text-white bg-[#3A506B]" />
                  <CommandList>
                    {locations.map((loc) => (
                      <CommandItem
                        key={loc}
                        onSelect={() => setLocation(loc)}
                        className="cursor-pointer hover:bg-[#5BC0BE] text-white"
                      >
                        {loc}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="flex flex-col gap-4">
              <span className="text-white">Minimalna cijena narudžbe na eventu</span>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Cijena"
                className="w-full bg-[#3A506B] border border-[#5BC0BE] text-white"
              />

              <span className="text-white">Dodatan komentar gostima na eventu</span>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opis"
                rows={3}
                className="w-full bg-[#3A506B] border border-[#5BC0BE] text-white"
              />

              <span className="text-white">Maksimalni broj pjesama na čekanju</span>
              <Input
                value={maxSongs}
                onChange={(e) => setMaxSongs(e.target.value)}
                placeholder="Max pjesmi u redu"
                className="w-full bg-[#3A506B] border border-[#5BC0BE] text-white"
              />
            </div>

            <div className="mt-4">
              <h2 className="text-[#6FFFE9] text-lg mb-2">Označi za default vrijednost</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-white">Mjesto</span>
                  <Switch
                    checked={isLocationDefault}
                    onCheckedChange={() => setIsLocationDefault(!isLocationDefault)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white">Cijena</span>
                  <Switch checked={isPriceDefault} onCheckedChange={() => setIsPriceDefault(!isPriceDefault)} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white">Opis</span>
                  <Switch
                    checked={isDescriptionDefault}
                    onCheckedChange={() => setIsDescriptionDefault(!isDescriptionDefault)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center justify-between">
                <Switch checked={isSpotifyEnabled} onCheckedChange={() => setIsSpotifyEnabled(!isSpotifyEnabled)} />
                <span className="text-[#6FFFE9]">Spotify playlist ograničenja</span>
              </div>
              {!isSpotifyEnabled && (
                <span className="text-white">
                  Možeš dozvoliti samo određene pjesme na eventu kopirajući svoju spotify playlistu u box ili možeš
                  postaviti listu zabranjenih pjesama tokom svog eventa, izbor je tvoj! Samo označi želiš li block ili
                  allow listu te slobodno uređuj block listu sa našim pretraživačem!
                </span>
              )}

              {isSpotifyEnabled && (
                <>
                  <div className="flex items-center justify-between">
                    <Switch checked={isAllowList} onCheckedChange={() => setIsAllowList(!isAllowList)} />
                    <span className="text-white">{isAllowList ? "Allow List" : "Block List"}</span>
                  </div>
                  <Input
                    placeholder="Spotify Playlist URL"
                    className="w-full bg-[#3A506B] border border-[#5BC0BE] text-white"
                  />
                </>
              )}

              {isSpotifyEnabled && !isAllowList && (
                <div>
                  <h3 className="text-[#6FFFE9]">Block List</h3>
                  <div className="space-y-2">
                    {blockList.map((song, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#1C2541] border border-[#3A506B] p-2 rounded-md"
                      >
                        <span className="text-white">{song}</span>
                        <Button variant="outline" onClick={() => toggleBlockList(song)} className="text-[#5BC0BE]">
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search to add song"
                      className="w-full bg-[#3A506B] border border-[#5BC0BE] text-white"
                    />
                    <Button variant="outline" onClick={() => toggleBlockList("New Song")} className="text-[#5BC0BE]">
                      Add Song
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Button className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium mt-4">
              Spremi Postavke
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6 max-w-95 justify-between">
          <Button variant="outline" className="w-full bg-[#3A506B] border border-[#5BC0BE] text-white">
            Natrag
          </Button>
          <Button className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]">Spremi</Button>
        </div>
      </div>
    </div>
  )
}

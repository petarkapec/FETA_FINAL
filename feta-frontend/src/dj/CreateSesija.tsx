"use client"

import { useState } from "react"
import { Menu, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"

const locations = ["Klub H20", "Best Venue Hall", "Vintage Bar", "Aurora club", "Roko", "Ex club"]

export default function CreateSession() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [location, setLocation] = useState("")
  const [naziv, setNaziv] = useState("");

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
                <li className="p-2 cursor-pointer hover:bg-[#5BC0BE] text-white">Profil</li>
                <li className="p-2 cursor-pointer hover:bg-[#5BC0BE] text-white">Moje Sesije</li>
              </ul>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
        <Settings className="w-6 h-6 text-[#6FFFE9] cursor-pointer" />
      </header>

      <Card className="w-full max-w-md mt-10 bg-[#1C2541] shadow-lg border border-[#3A506B]">
        <span className="text-white">Upiši naziv sesije(Event-a)</span>
        <CardContent className="p-6 space-y-4">
        <Input
          placeholder="Naziv Event-a"
          value={naziv}
          onChange={(e) => setNaziv(e.target.value)}
          className="w-full bg-[#3A506B] border border-[#5BC0BE] text-white"
        />          
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

          <Input placeholder="Cijena (default)" className="w-full bg-[#3A506B] border border-[#5BC0BE] text-white" />
          <Textarea
            placeholder="Opis (default)"
            className="w-full bg-[#3A506B] border border-[#5BC0BE] text-white"
            rows={3}
          />
          <Button className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium">Započni Event!</Button>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Music, User } from "lucide-react"
import type { Song } from "../../types/song"

interface SongSearchProps {
  query: string
  setQuery: React.Dispatch<React.SetStateAction<string>>
  results: Song[]
  handleQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSongSelect: (song: Song) => void
}

export const SongSearch = ({ query, results, handleQueryChange, handleSongSelect }: SongSearchProps) => (
  <main className="flex-1 flex flex-col items-center">
    <div className="w-full max-w-md">
      <form onSubmit={(e) => e.preventDefault()} className="relative mb-8">
        <Input
          type="text"
          placeholder="Search for a song..."
          value={query}
          onChange={handleQueryChange}
          className="bg-[#1C2541] border-[#3A506B] text-white placeholder:text-[#3A506B] h-12 pr-12"
        />
        <Button type="submit" size="icon" className="absolute right-0 top-0 h-12 w-12 bg-[#5BC0BE] hover:bg-[#6FFFE9]">
          <Search className="h-5 w-5" />
        </Button>
      </form>

      {results.length > 0 && (
        <div className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-[#5BC0BE] flex items-center gap-2">
            <Music className="h-5 w-5" />
            Results
          </h2>
          <ul className="space-y-2">
            {results.map((song) => (
              <li
                key={song.id}
                onClick={() => handleSongSelect(song)}
                className="flex items-center p-3 bg-[#1C2541] rounded-md cursor-pointer hover:bg-[#3A506B] transition-colors"
              >
                <img src={song.albumArt || "/placeholder.svg"} alt={song.name} className="w-10 h-10 mr-3 rounded" />
                <div>
                  <p className="font-medium">{song.name}</p>
                  <p className="text-sm text-[#5BC0BE] flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {song.artist}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </main>
)

import { useState } from "react";
import { Menu, Search, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";

const locations = [
  "Klub H20",
  "Best Venue Hall",
  "Vintage Bar",
  "Aurora club",
  "Roko",
  "Ex club",
];

export default function CreateSession() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("");
  
  // Hardkodirane sesije
  const mySessions = [
    { eventName: "Salsa Night", date: "15.03.2023", location: "Aurora Club", earnings: 450 },
    { eventName: "Balkaton Event", date: "22.04.2023", location: "Best Venue Hall", earnings: 1200 },
    { eventName: "Lollipop Party", date: "05.05.2023", location: "h20 club", earnings: 780 },
    { eventName: "Retro Vibes", date: "18.06.2023", location: "Ex club", earnings: 950 },
    { eventName: "Neon Dreams", date: "30.07.2023", location: "Macarana club", earnings: 1350 },
  ];
  
  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-[#0B132B] text-white">
      <header className="w-full flex items-center justify-between p-4 bg-[#1C2541] shadow-md">
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
        
        <h1 className="text-4xl font-bold text-[#6FFFE9]">
          FETA <span className="text-[#5BC0BE] text-xl">DJ View</span>
        </h1>
        <div>
          <Button className="w-10% bg-[#5BC0BE] text-[#0B132B] hover:bg-[#6FFFE9]">Odjava</Button>
        </div>
      </header>

      {/* Sekcija Moje Sesije */}
      <div className="w-full max-w-4xl mt-10">
        <h2 className="text-2xl font-bold text-[#6FFFE9] mb-6">Moje Sesije</h2>
        
        <div className="bg-[#1C2541] shadow-lg border border-[#3A506B] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#3A506B]">
              <tr>
                <th className="p-3 text-left">Naziv Eventa</th>
                <th className="p-3 text-left">Datum</th>
                <th className="p-3 text-left">Lokacija</th>
                <th className="p-3 text-left">Zarađeno (€)</th>
              </tr>
            </thead>
            <tbody>
              {mySessions.map((session, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-[#1C2541]" : "bg-[#2A3A5A]"}>
                  <td className="p-3">{session.eventName}</td>
                  <td className="p-3">{session.date}</td>
                  <td className="p-3">{session.location}</td>
                  <td className="p-3">{session.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
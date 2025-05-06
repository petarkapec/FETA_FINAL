"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock, DollarSign, Music, User, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Narudzba {
  narudzba_id: number;
  sesija_id: number;
  korisnik: string;
  comment: string;
  donation: number;
  nickname: string;
  song_id: string;
  song_name: string;
  song_artist: string;
  song_album_art: string;
  status: "pending" | "allowed" | "played" | "rejected";
  created_at: string;
}

interface Sesija {
  sesija_id: number,
  dj_id: number,
  lokacija_id: number,
  expiration: string,
  minimal_price: number,
  comentary: string,
  queue_max_song_count: number,
  naziv: string,
}

export default function SesijaPage() {
  const { sesija_id } = useParams<{ sesija_id: string }>();
  const [sesija, setSesija] = useState<Sesija | null>(null);
  const [requests, setRequests] = useState<Narudzba[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "allowed" | "played"  | "rejected"
  >("all");
  const [totalEarnings, setTotalEarnings] = useState<number>(0);

  // Dohvati podatke o sesiji
  useEffect(() => {
    const fetchSesija = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sesije/3`);
        const data: Sesija = await response.json();
        setSesija(data);
      } catch (error) {
        console.error("Greška pri dohvaćanju sesije:", error);
      }
    };

    fetchSesija();
  }, [sesija_id]);

  // Dohvati podatke o narudžbama i izračunaj ukupnu zaradu
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/narudzbe/posesiji/3`);
        const data: Narudzba[] = await response.json();
        setRequests(data);
        
        // Calculate total earnings from paid requests
        const earnings = data
          .filter(req => req.status === "played")
          .reduce((sum, req) => sum + req.donation, 0);
        setTotalEarnings(earnings);
      } catch (error) {
        console.error("Greška pri dohvaćanju narudžbi:", error);
      }
    };

    fetchRequests();
  }, [sesija_id]);

  const filteredRequests =
    activeFilter === "all" ? requests : requests.filter((req) => req.status === activeFilter);

  const handleStatusChange = async (id: number, newStatus: "allowed" | "played" | "rejected") => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/narudzbe/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRequests(requests.map((req) => (req.narudzba_id === id ? { ...req, status: newStatus } : req)));
        
        // Update total earnings if status changed to/from paid/played
        if (newStatus === "played" || newStatus === "rejected") {
          const updatedEarnings = requests
            .filter(req => req.status === "played")
            .reduce((sum, req) => sum + req.donation, 0);
          setTotalEarnings(updatedEarnings);
        }
      } else {
        console.error("Greška pri ažuriranju statusa");
      }
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
    }

    if (newStatus === "allowed") {
      const captureResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/narudzbe/${id}/capture`, {
        method: "POST",
      });
    
      if (!captureResp.ok) {
        alert("Greška prilikom naplate korisnika.");
        return;
      }
    }
    
  };

  // Sortiraj zahtjeve po donaciji (najveća prva) i vremenu (najnovije prvo)
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (a.donation !== b.donation) return b.donation - a.donation;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (!sesija) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white">
      <header className="p-4 flex justify-between items-center border-b border-[#3A506B]">
        <h1 className="text-2xl font-bold text-[#6FFFE9]">{sesija.naziv}</h1>
        <Button className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-2 px-4 rounded-lg">
          Balans: {totalEarnings.toFixed(2)} €
        </Button>
      </header>

      {/* Detalji sesije */}
      <div className="p-4 bg-[#1C2541] border-b border-[#3A506B]">
        <div className="max-w-2xl mx-auto space-y-1">
          <p><strong>Istječe:</strong> {new Date(sesija.expiration).toLocaleString()}</p>
          <p><strong>Minimalna cijena:</strong> {sesija.minimal_price} €</p>
          <p><strong>Komentar:</strong> {sesija.comentary}</p>
          <p><strong>Maksimalan broj pjesama u redu:</strong> {sesija.queue_max_song_count}</p>
        </div>
      </div>

      {/* Filteri za zahtjeve - centrirani */}
      <div className="p-4 flex justify-center space-x-2 border-b border-[#3A506B]">
        <div className="flex flex-wrap justify-center gap-2">
          {(["all", "pending", "allowed", "played", "rejected"] as const).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className={
                activeFilter === filter 
                  ? "bg-[#5BC0BE] text-[#0B132B]" 
                  : "border-[#3A506B] text-[#5BC0BE]"
              }
            >
              {filter === "all" ? "Sve" : 
               filter === "pending" ? "Noví pending" :
               filter === "allowed" ? "allowed" :
               filter === "played" ? "played" : 
               filter === "rejected" ? "rejected" : "rejected"}
            </Button>
          ))}
        </div>
      </div>

      {/* Sortiranje */}
      <div className="p-2 bg-[#1C2541] border-b border-[#3A506B]">
        
      </div>

      {/* Lista zahtjeva */}
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
                        
                        <span>{request.nickname}</span>
                      </div>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-1 text-[#5BC0BE]" />
                        <span>{request.donation.toFixed(2)} €</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-[#5BC0BE]" />
                        <span>{formatTimeAgo(new Date(request.created_at))}</span>
                      </div>

                      {request.comment && (
                        <p className="text-sm mt-2 p-2 bg-[#0B132B] rounded">
                          {request.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Akcije ovisno o statusu */}
                <div className="flex justify-end gap-2 mt-3">
                  {request.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(request.narudzba_id, "allowed")}
                        className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]"
                      >
                        Odobri
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(request.narudzba_id, "rejected")}
                        className="border-[#3A506B] text-[#5BC0BE] hover:bg-[#3A506B]"
                      >
                        Odblij
                      </Button>
                    </>
                  )}

                  {request.status === "allowed" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(request.narudzba_id, "played")}
                      className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]"
                    >
                      Pusti
                    </Button>
                  )}

                  {request.status === "played" && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}

                  {request.status === "rejected" && (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="p-4 border-t border-[#3A506B]">
        <Button className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-bold">
          Završi event
        </Button>
      </footer>
    </div>
  );
}

// Pomoćna funkcija za formatiranje vremena
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins === 1) return "1 minute ago";
  if (diffMins < 60) return `${diffMins} minutes ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}
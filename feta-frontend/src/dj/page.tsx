"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock,
  DollarSign,
  Music,
  User,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
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
  status: "pending" | "allowed" | "played" | "paid" | "rejected";
  created_at: string;
}

interface Sesija {
  sesija_id: number;
  dj_id: number;
  lokacija_id: number;
  expiration: string;
  minimal_price: number;
  comentary: string;
  queue_max_song_count: number;
}

export default function SesijaPage() {
  const navigate = useNavigate();
  const { sesija_id } = useParams<{ sesija_id: string }>();
  const [sesija, setSesija] = useState<Sesija | null>(null);
  const [requests, setRequests] = useState<Narudzba[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "allowed" | "played" | "paid" | "rejected"
  >("all");

  // Dohvati podatke o sesiji
  useEffect(() => {
    const fetchSesija = async () => {
      const djData = localStorage.getItem("dj");
      if (!djData) {
        navigate("/login");
        return;
      }

      const dj = JSON.parse(djData);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/sesije/active/${dj.dj_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Sesija = await response.json();
        console.log("Sesija data:", data); // Dodajte ovaj redak za ispisivanje odgovora
        setSesija(data);
      } catch (error) {
        console.error("Greška pri dohvaćanju sesije:", error);
      }
    };

    fetchSesija();
  }, [sesija_id]);

  // Dohvati podatke o narudžbama
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/narudzbe/posesiji/${sesija_id}`
        );
        const data: Narudzba[] = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Greška pri dohvaćanju narudžbi:", error);
      }
    };

    fetchRequests();
  }, [sesija_id]);

  const filteredRequests =
    activeFilter === "all"
      ? requests
      : requests.filter((req) => req.status === activeFilter);

  const handleStatusChange = async (
    id: number,
    newStatus: "allowed" | "played" | "rejected"
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/narudzbe/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setRequests(
          requests.map((req) =>
            req.narudzba_id === id ? { ...req, status: newStatus } : req
          )
        );
      } else {
        console.error("Greška pri ažuriranju statusa");
      }
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
    }
  };

  // Sortiraj zahtjeve po donaciji (najveća prva) i vremenu (najnovije prvo)
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (a.donation !== b.donation) return b.donation - a.donation;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (!sesija) {
    return <p>Loading...</p>; // Prikazujte loading dok se podaci učitavaju
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white">
      <header className="p-4 flex justify-center border-b border-[#3A506B]">
        <h1 className="text-4xl font-bold text-[#6FFFE9]">
          FETA <span className="text-[#5BC0BE] text-xl">DJ View</span>
        </h1>
      </header>

      {/* Detalji sesije */}
      <div className="p-4 bg-[#1C2541] border-b border-[#3A506B]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#6FFFE9]">
            Sesija #{sesija.sesija_id}
          </h2>
          <div className="space-y-2 mt-2">
            <p>
              <strong>Lokacija ID:</strong> {sesija.lokacija_id}
            </p>
            <p>
              <strong>Istječe:</strong>{" "}
              {new Date(sesija.expiration).toLocaleString()}
            </p>
            <p>
              <strong>Minimalna cijena:</strong> {sesija.minimal_price} €
            </p>
            <p>
              <strong>Komentar:</strong> {sesija.comentary}
            </p>
            <p>
              <strong>Maks. pjesama:</strong> {sesija.queue_max_song_count}
            </p>
          </div>
        </div>
      </div>

      {/* Filteri za zahtjeve */}
      <div className="p-4 flex justify-center space-x-2 border-b border-[#3A506B]">
        {(
          ["all", "pending", "allowed", "played", "paid", "rejected"] as const
        ).map((filter) => (
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
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
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
              <div
                key={request.narudzba_id}
                className="bg-[#1C2541] rounded-lg p-4 shadow-lg border border-[#3A506B]"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={request.song_album_art || "/placeholder.svg"}
                    alt={request.song_name}
                    className="w-16 h-16 rounded-md"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">
                          {request.song_name}
                        </h3>
                        <p className="text-[#5BC0BE]">{request.song_artist}</p>
                      </div>

                      <Badge
                        className={
                          request.status === "pending"
                            ? "bg-[#6FFFE9] text-[#0B132B]"
                            : request.status === "played"
                            ? "bg-[#5BC0BE] text-[#0B132B]"
                            : request.status === "paid"
                            ? "bg-green-500 text-[#0B132B]"
                            : request.status === "rejected"
                            ? "bg-red-500 text-white"
                            : "bg-[#3A506B] text-white"
                        }
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-1 text-[#5BC0BE]" />
                        <span>{request.nickname}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-1 text-[#5BC0BE]" />
                        <span>${request.donation.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-[#5BC0BE]" />
                        <span>
                          {formatTimeAgo(new Date(request.created_at))}
                        </span>
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
                {request.status === "pending" && (
                  <div className="flex justify-end gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusChange(request.narudzba_id, "allowed")
                      }
                      className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]"
                    >
                      Allow
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(request.narudzba_id, "rejected")
                      }
                      className="border-[#3A506B] text-[#5BC0BE] hover:bg-[#3A506B]"
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {request.status === "allowed" && (
                  <div className="flex justify-end mt-3">
                    <Loader2 className="h-6 w-6 animate-spin text-[#5BC0BE]" />
                  </div>
                )}

                {request.status === "paid" && (
                  <div className="flex justify-end items-center gap-2 mt-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusChange(request.narudzba_id, "played")
                      }
                      className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]"
                    >
                      Play Now
                    </Button>
                  </div>
                )}

                {request.status === "rejected" && (
                  <div className="flex justify-end mt-3">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
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

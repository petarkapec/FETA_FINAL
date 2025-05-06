import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Song } from "../../types/song";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { RequestConfirmationCard } from "./RequestConfirmationCard"; // importiraj ako treba
import { api } from "../../API.js";
interface SongRequestDialogProps {
  sesija_id: number;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSong: Song | null;
  donacija: string;
  setDonacija: React.Dispatch<React.SetStateAction<string>>;
  komentar: string;
  setKomentar: React.Dispatch<React.SetStateAction<string>>;
  minCijena: number;
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
  const maxCijena = minCijena * 25;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [poslanaNarudzba, setPoslanaNarudzba] = useState<any>(null);

  const handleInitiatePayment = async () => {
    if (!selectedSong || !donacija || Number(donacija) < minCijena) return;
  
    const userId = localStorage.getItem("user_id");
  
    const payload = {
      sesija_id: sesija_id,
      user_id: userId,
      donation: parseInt(donacija, 10),
      song_id: selectedSong.id,
      song_name: selectedSong.name,
      song_artist: selectedSong.artist,
      song_album_art: selectedSong.albumArt,
      comment: komentar,
    };
  
    try {
      const response = await fetch(`http://localhost:3000/stripe/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Dodaj bilo koji drugi header koji ti je potreban, ako je potrebno
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        console.error("Greška u odgovoru sa servera:", response.status, response.statusText);
        return;
      }
      
      const data = await response.json();
      
      console.log("Odgovor sa backenda:", data);
      
      const checkoutUrl = data?.checkoutUrl;
      
      if (!checkoutUrl) {
        console.error("checkoutUrl nije pronađen u odgovoru:", data);
        return;
      }
      
      // Preusmjeri korisnika na Stripe
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error("Neuspješno generiranje linka za plaćanje:", error);
    }
    
  };
  

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1C2541] text-white border-[#3A506B] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#6FFFE9]">
              Submit song request
            </DialogTitle>
          </DialogHeader>

          {selectedSong && (
            <div className="flex items-center mb-4 p-3 bg-[#0B132B] rounded-md">
              <img
                src={selectedSong.albumArt}
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
              <Label className="text-sm text-white">Donation amount (€)</Label>
              <Slider
                min={minCijena}
                max={maxCijena}
                step={1}
                value={[
                  Math.min(Number(donacija) || minCijena, maxCijena),
                ]}
                onValueChange={(value) => setDonacija(value[0].toString())}
                className="mb-1 [&_[role=slider]]:bg-[#6FFFE9] [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:rounded-full [&_[role=range]]:bg-[#5BC0BE]"
              />
              <Input
                type="number"
                value={donacija}
                onChange={(e) => setDonacija(e.target.value)}
                onBlur={() => {
                  const value = Number(donacija);
                  if (isNaN(value) || value < minCijena) {
                    setDonacija(minCijena.toString());
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = Number(donacija);
                    if (isNaN(value) || value < minCijena) {
                      setDonacija(minCijena.toString());
                    }
                  }
                }}
                className="bg-[#0B132B] border-[#3A506B] text-white"
              />
            </div>

            <Label>Additional comment</Label>
            <Textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              className="bg-[#0B132B] border-[#3A506B] text-white"
            />

          <Button
            onClick={handleInitiatePayment}
            className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium"
          >
            Plati
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
          nickname={"Anonymous"} // ili iz localStorage ako imaš
          donation={poslanaNarudzba.donation.toString()}
          comment={poslanaNarudzba.comment}
          onCancel={() => setShowConfirmation(false)}
          onBackToHome={() => {
            setShowConfirmation(false);
            setIsDialogOpen(false);
          }}
          />

        </div>
      )}
    </>
  );
};

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface RequestConfirmationCardProps {
  songName: string;
  songArtist: string;
  songAlbumArt: string;
  nickname: string;
  donation: string;
  comment: string;
  onCancel: () => void;
  onBackToHome: () => void;
}

export const RequestConfirmationCard = ({
  songName,
  songArtist,
  songAlbumArt,
  nickname,
  donation,
  comment,
  onCancel,
  onBackToHome,
}: RequestConfirmationCardProps) => {
  return (
    <Card className="bg-[#0B132B] text-white border-none w-full max-w-md mx-auto mt-10 rounded-xl shadow-lg">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl text-[#6FFFE9] font-bold text-center">Detalji narudžbe</h2>

        <div className="flex items-center gap-3 p-3 bg-[#1C2541] rounded-lg">
          <img src={songAlbumArt} alt={songName} className="w-14 h-14 rounded" />
          <div>
            <p className="font-semibold">{songName}</p>
            <p className="text-sm text-[#5BC0BE]">{songArtist}</p>
          </div>
        </div>

        <div className="text-sm space-y-2">
          <p><strong>Nadimak:</strong> {nickname}</p>
          <p><strong>Donacija:</strong> {donation} €</p>
          <p><strong>Komentar:</strong> {comment}</p>
        </div>

        <div className="text-center text-[#5BC0BE] flex items-center justify-center gap-2">
          <Loader2 className="animate-spin w-4 h-4" />
          Čeka se odgovor DJ-a...
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button variant="outline" onClick={onCancel} className="border-[#5BC0BE] text-[#6FFFE9]">
            Otkaži narudžbu
          </Button>
          <Button onClick={onBackToHome} className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]">
            Povratak na početnu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

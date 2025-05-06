import { Sesija } from "../../types/sesija.tsx"

interface SessionInfoProps {
  sesija: Sesija;
}

export const SessionInfo = ({ sesija }: SessionInfoProps) => (
  <div className="p-4 bg-[#1C2541] border-b border-[#3A506B]">
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-[#6FFFE9]">{sesija.naziv}</h2>
      <div className="space-y-2 mt-2">
        <p><strong>Event:</strong> {sesija.naziv}</p>
        <p><strong>Comment:</strong> {sesija.comentary}</p>
        <p><strong>Minimum donation:</strong> {sesija.minimal_price} €</p>
      </div>
    </div>
  </div>
);

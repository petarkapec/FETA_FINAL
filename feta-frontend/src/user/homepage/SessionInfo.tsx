import type { Sesija } from "../../types/sesija.tsx"
import { Clock, DollarSign, MessageSquare } from "lucide-react"

interface SessionInfoProps {
  sesija: Sesija
}

export const SessionInfo = ({ sesija }: SessionInfoProps) => (
  <div className="p-4 bg-[#1C2541] border-b border-[#3A506B]">
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-[#6FFFE9] mb-3">{sesija.naziv}</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#5BC0BE]" />
          <p>
            <strong>Expires:</strong> {new Date(sesija.expiration).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-[#5BC0BE]" />
          <p>
            <strong>Minimum donation:</strong> {sesija.minimal_price} €
          </p>
        </div>
        {sesija.comentary && (
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-[#5BC0BE] mt-1" />
            <p>
              <strong>Comment:</strong> {sesija.comentary}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
)

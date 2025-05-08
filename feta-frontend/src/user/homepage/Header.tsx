import { Button } from "@/components/ui/button"
import type { DJ } from "@/types/dj"
import type { Lokacija } from "@/types/lokacija"
import { Headphones, MapPin } from "lucide-react"

interface HeaderProps {
  dj: DJ | null
  club: Lokacija | null
}

export const Header = ({ dj, club }: HeaderProps) => (
  <>
    <div className="absolute top-4 left-4 flex items-center space-x-2 text-[#6FFFE9]">
      <Button className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium">
        <Headphones className="w-6 h-6" />
        <span className="text-lg font-semibold">{dj?.ime || "DJ"}</span>
      </Button>
    </div>
    <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
    <div className="absolute top-4 right-4 flex items-center space-x-2 text-[#6FFFE9]">
      <Button className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium">
        <MapPin className="w-6 h-6" />
        <span className="text-lg font-semibold">{club?.naziv_kluba || "Club"}</span>
      </Button>
    </div>
  </>
)

export default Header

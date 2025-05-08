import { MessageSquare } from "lucide-react"

export const Footer = () => (
  <footer className="p-4 bg-[#0A1B2A] text-center text-white mt-8">
    <p className="text-sm flex items-center justify-center gap-2">
      <MessageSquare className="h-4 w-4 text-[#5BC0BE]" />
      Not happy with the artist? The song is paid, but not played? Additional feedback?
      <a href="#" className="text-[#6FFFE9] font-semibold hover:underline ml-1">
        Click here and send your question!
      </a>
    </p>
  </footer>
)

interface DJProfileProps {
    ime: string;
    profilnaSlika?: string;
    instagram?: string;
  }
  
  export const DJProfile = ({ ime, profilnaSlika, instagram }: DJProfileProps) => (
    <div className="flex flex-col items-center bg-[#1B2B4A] p-6 rounded-2xl shadow-md">
      <img
        src={profilnaSlika || "/placeholder.svg"}
        alt="DJ Profile"
        className="w-48 h-48 rounded-full object-cover border-4 border-[#6FFFE9]"
      />
      <h2 className="text-2xl font-bold text-white mt-4">DJ {ime}</h2>
      {instagram && <p className="text-[#6FFFE9] mt-2">@{instagram}</p>}
    </div>
  );
  
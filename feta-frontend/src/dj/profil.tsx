import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DJ } from "@/types/dj";

const Profil = () => {
  const [dj, setDj] = useState<DJ | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const djData = localStorage.getItem("dj");
    if (djData) {
      const parsedDj = JSON.parse(djData);
      setDj(parsedDj);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dj");
    navigate("/login");
  };

  if (!dj) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
      <header className="p-4 flex justify-between items-center border-b border-[#3A506B]">
        <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
        <Button
          onClick={handleLogout}
          className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium"
        >
          Logout
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#6FFFE9]">Profil</h2>

            <div className="bg-[#1C2541] p-6 rounded-lg">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={dj.profilna_slika || "/placeholder.svg"}
                  alt="Profilna slika"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-xl font-bold">
                    {dj.ime} {dj.prezime}
                  </p>
                  <p className="text-sm text-[#5BC0BE]">{dj.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  <strong>OIB:</strong> {dj.oib}
                </p>
                <p>
                  <strong>IBAN:</strong> {dj.iban}
                </p>
                <p>
                  <strong>Datum rođenja:</strong>{" "}
                  {new Date(dj.datum_rodjenja).toLocaleDateString()}
                </p>
                <p>
                  <strong>O meni:</strong> {dj.about_me}
                </p>
                <p>
                  <strong>Instagram:</strong> {dj.instagram}
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate("/create-sesija")}
              className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium w-full"
            >
              Stvori event
            </Button>

            <Button
              onClick={() => navigate("/previous-sesije")}
              className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium w-full"
            >
              Prijašnji eventovi
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profil;

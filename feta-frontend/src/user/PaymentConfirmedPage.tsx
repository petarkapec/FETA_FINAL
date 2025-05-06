import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const PaymentConfirmedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B132B] text-white px-4">
      <div className="bg-[#1C2541] p-6 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#6FFFE9] mb-4">Uplata zaprimljena ✅</h1>
        <p className="text-[#5BC0BE] mb-6">
          Hvala na uplati! Tvoj zahtjev za pjesmu je uspješno zabilježen i čeka obradu DJ-a.
        </p>

        <Button
          className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-semibold w-full"
          onClick={() => navigate("/")}
        >
          Natrag na početnu
        </Button>
      </div>
    </div>
  );
};

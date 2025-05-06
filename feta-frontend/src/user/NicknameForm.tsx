import { useState } from "react";
import { api } from "../API.js";  // Ispod je instanca API klase koju si pripremio
import "./styles/nicknameform.css";

const NicknameForm = () => {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { nickname });
      // Spremanje tokena u localStorage
      localStorage.setItem("tokenuser", response.token);
      localStorage.setItem("nickname", response.nickname);  // opcionalno, spremi nickname ako trebaš
      localStorage.setItem("user_id", response.user_id);
      // Redirektanje na /homesearch nakon uspješnog logina
      window.location.href = "/homesearch";
      console.log(localStorage.getItem('user_id'));
    } catch (err) {
      setError("Greška pri unosu nicka. Pokušaj ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nickname-container">
      <form onSubmit={handleSubmit} className="nickname-form">
        <h2 className="nickname-title">
          Unesi nadimak koji želiš da tvoj izvođač vidi!
        </h2>
        <input
          type="text"
          placeholder="Unesi svoj nadimak..."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="nickname-input"
        />
        <button type="submit" className="nickname-button" disabled={loading}>
          {loading ? "Učitavanje..." : "Potvrdi"}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default NicknameForm;

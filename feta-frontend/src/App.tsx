import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import UserHome from "./user/userhome"
import NicknameForm from "./user/NicknameForm"
import SpotifySearch from "./user/homepage/usersearch"
import PrivateRoute from "./PrivateRoute" // Importaj novu komponentu
import SesijaPage from "./dj/SesijaPage"
import Login from "./dj/Login"
import Profil from "./dj/profil"
import { PaymentConfirmedPage } from "./user/PaymentConfirmedPage"
import LocationsView from "./user/LocationsView" // Import the new component

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta za unos nicka koja nije zaštićena */}
        <Route path="/nickform" element={<NicknameForm />} />

        {/* Zaštićene rute koje zahtijevaju autentifikaciju */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<UserHome />} />
          <Route path="/homesearch" element={<SpotifySearch />} />
          <Route path="/locations" element={<LocationsView />} />
        </Route>

        {/* Ako je korisnik prijavljen, redirectaj na locations page */}
        <Route path="*" element={<Navigate to="/locations" />} />

        <Route path="/sesijapage" element={<SesijaPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/payment-confirmed" element={<PaymentConfirmedPage />} />
      </Routes>
    </Router>
  )
}

export default App

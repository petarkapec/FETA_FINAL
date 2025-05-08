import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import UserHome from "./user/userhome"
import NicknameForm from "./user/NicknameForm"
import SpotifySearch from "./user/homepage/usersearch"
import PrivateRoute from "./PrivateRoute.tsx"
import DjPrivateRoute from "./DjPrivateRoute.tsx"
import SesijaPage from "./dj/SesijaPage"
import Login from "./dj/Login"
import Profil from "./dj/profil"
import MojeSesije from "./dj/MojeSesije"
import { PaymentConfirmedPage } from "./user/PaymentConfirmedPage"
import LocationsView from "./user/LocationsView"
import DjUserHome from "./user/user_home"

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/nickform" element={<NicknameForm />} />
        <Route path="/login" element={<Login />} />

        {/* User protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<UserHome />} />
          <Route path="/homesearch" element={<SpotifySearch />} />
          <Route path="/locations" element={<LocationsView />} />
          <Route path="/payment-confirmed" element={<PaymentConfirmedPage />} />
        </Route>

        {/* DJ protected routes */}
        <Route element={<DjPrivateRoute />}>
          <Route path="/sesijapage" element={<SesijaPage />} />
          <Route path="/sesijapage/:sesija_id" element={<SesijaPage />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/moje-sesije" element={<MojeSesije />} />
          <Route path="/user_home" element={<DjUserHome />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/locations" />} />
        <Route path="*" element={<Navigate to="/locations" />} />
      </Routes>
    </Router>
  )
}

export default App

import Header from "./header.tsx" // <- ovdje uvozimo Header
import "./styles/userhome.css"
const UserHome = () => {
  return (
    <div className="userhome-container">
      <Header />

      <div className="userhome-content">
        <div className="userhome-box">
          <p className="userhome-text">Nema aktivnog FETA eventa. :(</p>
        </div>
      </div>
    </div>
  )
}

export default UserHome

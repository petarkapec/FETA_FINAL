import { Button } from "@/components/ui/button";
import "./styles/header.css"

const Header = () => {
  return (
    <>
      <div className="header-top-left">
        <Button className="header-button">
          <span className="header-button-text">Natrag</span>
        </Button>
      </div>

      <header className="header-main">
        <h1 className="header-title">FETA</h1>
      </header>
    </>
  );
};

export default Header;
import { Link } from 'react-router-dom';
import { logout } from '../api/client';

export default function Navbar() {
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/">Nexoria</Link>
        <span className="muted">React frontend</span>
      </div>
      <div className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/blueprints">Blueprints</Link>
        <Link to="/blueprints/new">Create Blueprint</Link>
        <button className="ghost-button" onClick={handleLogout} type="button">
          Logout
        </button>
      </div>
    </nav>
  );
}

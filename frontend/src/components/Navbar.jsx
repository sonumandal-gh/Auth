import { Link } from 'react-router-dom';
import { LogOut, User, LogIn, UserPlus } from 'lucide-react';

export default function Navbar({ token, onLogout, userName }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Authentication <span>System</span>
      </Link>
      <div className="nav-links">
        {token ? (
          <>
            <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> Hello, {userName || 'User'}
            </span>
            <button onClick={onLogout} className="nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogIn size={18} /> Login
            </Link>
            <Link to="/signup" className="nav-btn primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={18} /> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

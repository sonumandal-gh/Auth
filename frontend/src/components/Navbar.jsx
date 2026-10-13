import { Link } from 'react-router-dom';
import { LogOut, User, LogIn, UserPlus, Shield, Users } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Authentication <span>System</span>
      </Link>

      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={17} /> Users Directory
            </Link>

            {(user?.role === 'admin' || user?.role === 'owner') && (
              <Link to="/admin" className="nav-link admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa' }}>
                <Shield size={17} /> Admin Panel
              </Link>
            )}

            <span className="nav-link user-profile-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={17} />
              <span>{user?.firstName || 'User'}</span>
              <span className={`role-badge role-${user?.role || 'student'}`} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}>
                {user?.role || 'student'}
              </span>
            </span>

            <button onClick={logout} className="nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LogIn size={17} /> Login
            </Link>
            <Link to="/signup" className="nav-btn primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <UserPlus size={17} /> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

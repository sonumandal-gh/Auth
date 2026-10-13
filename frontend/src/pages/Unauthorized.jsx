import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="auth-container">
      <div className="auth-box" style={{ textAlign: 'center', maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--error-color)' }}>
          <ShieldX size={64} />
        </div>
        <h2 style={{ marginBottom: '0.75rem', color: 'var(--error-color)' }}>403 - Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          You do not have permission to view this page. This route requires <strong>Admin</strong> or <strong>Owner</strong> privileges.
        </p>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.75rem', textAlign: 'left', border: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <strong>Your current role:</strong> <span className={`role-badge role-${user?.role || 'student'}`}>{user?.role || 'student'}</span>
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            To access the admin dashboard, login with an account assigned the <strong>admin</strong> or <strong>owner</strong> role.
          </p>
        </div>

        <Link to="/" className="btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <ArrowLeft size={18} /> Return to Home
        </Link>
      </div>
    </div>
  );
}

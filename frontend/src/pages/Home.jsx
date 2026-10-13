import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import { AlertCircle, Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { isAuthenticated, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
          // Axios interceptor automatically attaches Authorization: Bearer <token>
          const response = await api.get('/api/auth/users');
          setUsers(response.data.users);
        } catch (err) {
          const message = err.response?.data?.message || 'Error fetching users';
          setError(message);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="home-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65vh', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Production JWT Authentication
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '620px', lineHeight: '1.7', marginBottom: '2rem' }}>
          A complete stateless authentication flow featuring <strong>AuthContext</strong>, automated <strong>Axios Bearer interceptors</strong>, and <strong>Role-Based Access Control</strong> (Student, Admin, Owner).
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn" style={{ padding: '0.75rem 2rem', textDecoration: 'none' }}>
            Sign In
          </Link>
          <Link to="/signup" className="nav-btn primary" style={{ padding: '0.75rem 2rem', textDecoration: 'none', borderRadius: '0.5rem' }}>
            Register Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>User Directory</h1>
        <p>Protected endpoint (<code style={{ color: '#60a5fa' }}>/api/auth/users</code>) accessed using auto-attached JWT Bearer token</p>
        {(currentUser?.role === 'admin' || currentUser?.role === 'owner') && (
          <div style={{ marginTop: '1rem' }}>
            <Link to="/admin" className="nav-btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <Shield size={16} /> Open Admin Panel
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading users...</p>
      ) : error ? (
        <div className="alert-info" style={{ color: 'var(--error-color)', backgroundColor: 'transparent', borderColor: 'var(--error-color)' }}>
          <AlertCircle style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="alert-info">No users found in database.</div>
      ) : (
        <div className="users-grid">
          {users.map((u) => {
            const isSelf = currentUser?._id === u._id;
            return (
              <div key={u._id} className="user-card" style={isSelf ? { borderColor: 'var(--primary-color)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)' } : {}}>
                <div className="user-card-header">
                  <div className="user-avatar">
                    {u.firstName ? u.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-info">
                    <h3>
                      {u.firstName} {u.lastName} {isSelf && <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 500 }}>(You)</span>}
                    </h3>
                    <span className={`role-badge role-${u.role || 'student'}`}>
                      {u.role || 'student'}
                    </span>
                  </div>
                </div>
                <div className="user-card-body">
                  <p>
                    <User size={15} style={{ verticalAlign: 'middle', color: 'var(--text-secondary)' }} />
                    <strong>Email:</strong> {u.email}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

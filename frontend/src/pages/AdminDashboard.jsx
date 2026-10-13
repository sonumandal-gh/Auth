import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import { ShieldAlert, Users, Award, UserCheck, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Calls the server-side role protected route: /api/auth/admin
        const response = await api.get('/api/auth/admin');
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="home-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading admin statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert /> {error}
        </div>
      </div>
    );
  }

  const { stats, recentUsers } = data || {};

  return (
    <div className="home-container">
      <div className="home-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '1rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600 }}>
          <ShieldCheck size={16} /> Server-Side & Client-Side Role Protected Route
        </div>
        <h1>Admin Control Panel</h1>
        <p>Privileged metrics and user management accessible only to Admins & Owners</p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-number">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div className="stat-number">{stats?.studentsCount || 0}</div>
            <div className="stat-label">Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-number">{stats?.adminsCount || 0}</div>
            <div className="stat-label">Admins</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-number">{stats?.ownersCount || 0}</div>
            <div className="stat-label">Owners</div>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="admin-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Recent Registered Accounts</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Logged in as: <strong>{user?.firstName}</strong> ({user?.role})
          </span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Account ID</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role || 'student'}`}>
                      {u.role || 'student'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {u._id}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No recent users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

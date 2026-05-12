import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, AlertCircle } from 'lucide-react';

export default function Home({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(response.data.users);
        } catch (err) {
          const message = err.response?.data?.message || 'Error fetching users';
          setError(message);
          
          // If token is invalid or expired (401), log out the user
          if (err.response?.status === 401) {
            setTimeout(() => {
              onLogout();
            }, 2000); // Wait 2 seconds so user can see the error message
          }
        } finally {
          setLoading(false);
        }
      };
      
      fetchUsers();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="home-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome to Authentication System
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', textAlign: 'center', maxWidth: '600px' }}>
          Please login or register to view the directory of all registered users in the system. Our platform ensures secure access with JSON Web Tokens.
        </p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>User Directory</h1>
        <p>A complete list of registered users in the system</p>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading users...</p>
      ) : error ? (
        <div className="alert-info" style={{ color: 'var(--error-color)', backgroundColor: 'transparent', borderColor: 'var(--error-color)' }}>
          <AlertCircle style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="alert-info">No users found.</div>
      ) : (
        <div className="users-grid">
          {users.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-card-header">
                <div className="user-avatar">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info">
                  <h3>{user.firstName} {user.lastName}</h3>
                  <span className="user-role">{user.role || 'student'}</span>
                </div>
              </div>
              <div className="user-card-body">
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

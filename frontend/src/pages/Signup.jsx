import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { UserPlus } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic frontend password match check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      // Calls register in AuthContext -> POST /api/auth/register
      await register(formData);
      // Auto-logged in with token & user returned
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        setError(err.response.data.errors[0].msg);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during registration. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="name-row">
            <div className="input-group">
              <label>First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required 
              />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required 
            />
            <small style={{ display: 'block', color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.78rem' }}>
              Min 6 characters (1 uppercase, 1 number, 1 special character: !@#$%^&*)
            </small>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required 
            />
          </div>

          <div className="input-group">
            <label>Account Role</label>
            <div className="radio-group">
              <label>
                <input 
                  type="radio" 
                  name="role" 
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleChange}
                />
                Student
              </label>
              <label>
                <input 
                  type="radio" 
                  name="role" 
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                />
                Admin
              </label>
              <label>
                <input 
                  type="radio" 
                  name="role" 
                  value="owner"
                  checked={formData.role === 'owner'}
                  onChange={handleChange}
                />
                Owner
              </label>
            </div>
          </div>

          <button type="submit" className="btn" disabled={submitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <UserPlus size={18} /> {submitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

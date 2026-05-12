import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic frontend validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData);
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors[0].msg);
      } else if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during sign up.");
      }
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
              required 
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label>User Role</label>
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

          <button type="submit" className="btn">Sign Up</button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

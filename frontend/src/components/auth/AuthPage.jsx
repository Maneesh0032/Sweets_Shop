import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

function AuthPage({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error || 'Registration failed');
        return;
      }

      setAuthError('');
      setAuthMode('login');
      setFormData({ email: formData.email, password: formData.password, confirmPassword: '' });
    } catch (error) {
      setAuthError('Connection error. Make sure backend is running on port 5000.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log('Login response:', data);

      if (!response.ok) {
        setAuthError(data.error || 'Login failed');
        return;
      }

      // Check if response has token and user
      if (!data.token || !data.user) {
        console.error('Invalid response structure:', data);
        setAuthError('Invalid response from server. Token or user missing.');
        return;
      }

      onLoginSuccess(data);
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('Connection error. Make sure backend is running on http://localhost:5000');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🍬 Sweet Shop</h1>
        <p>Delicious treats await you</p>

        <div className="auth-tabs">
          <button
            onClick={() => { 
              setAuthMode('login'); 
              setAuthError(''); 
              setFormData({ email: '', password: '', confirmPassword: '' });
            }}
            className={`auth-tab ${authMode === 'login' ? 'active' : 'inactive'}`}
          >
            Login
          </button>
          <button
            onClick={() => { 
              setAuthMode('register'); 
              setAuthError(''); 
              setFormData({ email: '', password: '', confirmPassword: '' });
            }}
            className={`auth-tab ${authMode === 'register' ? 'active' : 'inactive'}`}
          >
            Register
          </button>
        </div>

        {authError && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <p>{authError}</p>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">
            <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleAuthChange}
            placeholder="your@email.com"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Password
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleAuthChange}
              placeholder="••••••••"
              className="form-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {authMode === 'register' && (
          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Confirm Password
            </label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleAuthChange}
                placeholder="••••••••"
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={authMode === 'login' ? handleLogin : handleRegister}
          disabled={authLoading}
          className="btn-primary"
        >
          {authLoading ? 'Loading...' : (authMode === 'login' ? 'Login' : 'Register')}
        </button>

        <div className="credentials-box">
          <p className="title">📋 Default Credentials:</p>
          <div className="credentials">
            <p><strong>Admin:</strong> admin@gmail.com / admin</p>
            <p><strong>User:</strong> user@gmail.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
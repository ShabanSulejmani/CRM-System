import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffLogin.css';
import { useAuth } from '../AuthContext';

function StaffLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Enkel validering
    if (!username || !password) {
      setError('Vänligen fyll i både användarnamn och lösenord');
      setIsLoading(false);
      return;
    }
    
    try {
      // Anropa vår backend-API för inloggning
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      
      if (!response.ok) {
        throw new Error('Fel användarnamn eller lösenord');
      }
      
      const data = await response.json();
      
      // Spara användarinformation i auth context
      login(data.user);
      
      // Omdirigera till rätt dashboard baserat på användarroll
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/staff/dashboard');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Inloggningen misslyckades. Kontrollera dina uppgifter.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="staff-page-container">
      <div className="staff-login-container">
        <div className="staff-login-header">
          <h1 className="staff-login-title">Staff Portal</h1>
          <p className="staff-login-subtitle">Logga in för att fortsätta</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="staff-login-form">
          <div className="staff-field-group">
            <label className="staff-field-label">Användarnamn</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="staff-field-input"
              required
            />
          </div>
          
          <div className="staff-field-group">
            <label className="staff-field-label">Lösenord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="staff-field-input"
              required
            />
          </div>
          
          <div className="staff-login-options">
            <div className="staff-remember-container">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="staff-remember-checkbox"
              />
              <label htmlFor="rememberMe" className="staff-remember-label">
                Kom ihåg mig
              </label>
            </div>
            <a href="#" className="staff-forgot-password">
              Glömt lösenord?
            </a>
          </div>
          
          <div className="staff-login-button-container">
            <button
              type="submit"
              disabled={isLoading}
              className={`staff-login-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <span className="button-loading-text">
                  <span className="button-spinner"></span>
                  Loggar in...
                </span>
              ) : 'LOGGA IN'}
            </button>
          </div>
          
          <div className="staff-login-footer">
            <p className="staff-login-help">
              Behöver du hjälp? <a href="#">Kontakta support</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffLogin;
import { useState } from 'react';
import './StaffLogin.css';

function StaffLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login request
    setTimeout(() => {
      console.log("Staff login:", { username, password, rememberMe });
      setIsLoading(false);
      // Add actual login logic here
    }, 1500);
  };

  return (
    <div className="staff-page-container">
      <div className="staff-login-container">
        <div className="staff-login-header">
          <h1 className="staff-login-title">Staff Portal</h1>
          <p className="staff-login-subtitle">Välkommen tillbaka! Logga in för att fortsätta</p>
        </div>
        
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
      
      <div className="staff-login-info">
        <div className="staff-info-item">
          <div className="staff-info-icon">🔐</div>
          <div className="staff-info-text">
            <h3>Säker inloggning</h3>
            <p>All information krypteras och skyddas</p>
          </div>
        </div>
        <div className="staff-info-item">
          <div className="staff-info-icon">🔔</div>
          <div className="staff-info-text">
            <h3>Få notiser</h3>
            <p>Se nya händelser i realtid</p>
          </div>
        </div>
        <div className="staff-info-item">
          <div className="staff-info-icon">⚡</div>
          <div className="staff-info-text">
            <h3>Snabb support</h3>
            <p>Vi finns här för att hjälpa dig</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffLogin;
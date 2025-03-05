import { useState } from 'react';
import './AdminLogin.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login request
    setTimeout(() => {
      console.log("Admin login:", { username, password, company });
      setIsLoading(false);
      // Add actual login logic here
    }, 1500);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">Logga in för att komma åt administrationspanelen</p>
        </div>
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-field-group">
            <label className="admin-field-label">Användarnamn</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-field-input"
              required
            />
          </div>
          
          <div className="admin-field-group">
            <label className="admin-field-label">Lösenord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-field-input"
              required
            />
          </div>
          
          <div className="admin-field-group">
            <label className="admin-field-label">Företag</label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="admin-field-select"
              required
            >
              <option value="" disabled>Välj företag</option>
              <option value="Tesla">Tesla</option>
              <option value="Maxi">Maxi</option>
              <option value="något annat">Något annat</option>
            </select>
          </div>
          
          <div className="admin-login-button-container">
            <button
              type="submit"
              disabled={isLoading}
              className={`admin-login-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <span className="button-loading-text">
                  <span className="button-spinner"></span>
                  Loggar in...
                </span>
              ) : 'LOGGA IN'}
            </button>
          </div>
          
          <div className="admin-login-footer">
            <a href="#" className="admin-forgot-password">
              Glömt lösenord?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
// pages/StaffLogin.jsx
import { useState } from 'react';

function StaffLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');

  const handleLogin = () => {
    //e.preventDefault();   om man vill att sidan inte ska laddas om
    console.log("Staff login:", { username, password, department });
  };

  return (
    <div className="login-border">
      <h1 className="admin-login">Staff Login</h1>
      
      <form onSubmit={handleLogin} className="login-container">
        <input 
          type="text"
          placeholder='Ange ditt användarnamn'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-bar"
          required
        />
        
        <input 
          type="password"
          placeholder='Ange ditt lösenord'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-bar"
          required
        />
        
        <select 
          type="avdelning"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="login-bar"
          required
        >
          <option value="" disabled selected>Välj avdelning</option>
          <option value="support">Support</option>
          <option value="sales">Försäljning</option>
          <option value="tech">Teknisk avdelning</option>
        </select>
        
        <div className='login-knapp'>
          <button 
            type='submit'
            className="bla">Logga in</button>
        </div>
      </form>
    </div>
  );
}

export default StaffLogin;
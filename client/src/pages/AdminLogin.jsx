import { useState } from 'react';


function Login() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');




const handleLogin = () => {
  //e.preventDefault();   om man vill att sidan inte ska laddas om
  console.log("Admin login:", { username, password });
};


    return (
      <div className="login-border">

        <form onSubmit={handleLogin} className="login-container">
        <h1 className="admin-login">Logga in</h1>
          



          <input type="text" 
          placeholder='Ange ditt användarnamn'
          value={username}

          onChange={(e) => setUsername(e.target.value)}
          className="login-bar"
          required/>

          <input type="password"
          placeholder='Ange ditt lösenord'
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="login-bar"
          required/>






          <div className='login-knapp'>
          <button 
          type='submit'
          className="bla">Logga in</button>
          </div>


</form>



      </div>
    );
  }

  
  export default Login;
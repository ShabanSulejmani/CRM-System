import { useState } from 'react';

function AdminCreateUser() {
  const [formData, setFormData] = useState({
    firstName: '',
    password: '',
    company: '',
    role: '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Användare skapades framgångsrikt!');
        setFormData({
          firstName: '',
          password: '',
          company: '',
          role: '',
        });
      } else {
        setMessage('Ett fel uppstod när användaren skulle skapas.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Ett fel uppstod vid anslutning till servern.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-border">
      <h1 className="admin-login">Skapa användare</h1>

      <form onSubmit={handleSubmit} className="login-container">
        <input
          type="text"
          name="firstName"
          placeholder="Ange ett användarnamn"
          value={formData.firstName}
          onChange={handleInputChange}
          className="login-bar"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Ange ett lösenord"
          value={formData.password}
          onChange={handleInputChange}
          className="login-bar"
          required
        />

        <select
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          className="login-bar"
          required
        >
          <option value="">Välj företag</option>
          <option value="fordon">Fordonsservice</option>
          <option value="tele">Tele/Bredband</option>
          <option value="forsakring">Försäkringsärenden</option>
        </select>

        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="login-bar"
          required
        >
          <option value="">Välj roll</option>
          <option value="admin">Super-admin</option>
          <option value="user">Företags-admin</option>
          <option value="staff">Kundtjänst</option>
        </select>

        {message && (
          <div className={message.includes('fel') ? 'error-message' : 'success-message'}>
            {message}
          </div>
        )}

        <div className="login-knapp">
          <button
            type="submit"
            className="bla"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Skapar användare...' : 'Skapa användare'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCreateUser;
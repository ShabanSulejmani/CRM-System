import { useState } from 'react';

function UpdateUserInfo() {
  const [formData, setFormData] = useState({
    firstName: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('Lösenorden matchar inte');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          password: formData.password
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Uppgifterna uppdaterades framgångsrikt!');
        setFormData({
          firstName: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setMessage(result.message || 'Ett fel uppstod vid uppdateringen');
      }
    } catch (error) {
      setMessage('Ett fel uppstod vid anslutning till servern');
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
      <form onSubmit={handleSubmit} className="login-container">
        <h1 className="admin-login">Uppdatera användaruppgifter</h1>

        <input
          type="text"
          name="firstName"
          placeholder="Nytt användarnamn"
          value={formData.firstName}
          onChange={handleInputChange}
          className="login-bar"
        />

        <input
          type="password"
          name="password"
          placeholder="Nytt lösenord"
          value={formData.password}
          onChange={handleInputChange}
          className="login-bar"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Bekräfta nytt lösenord"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="login-bar"
        />

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
            {isSubmitting ? 'Uppdaterar...' : 'Uppdatera'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateUserInfo;

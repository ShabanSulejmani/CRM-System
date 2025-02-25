import { useState, useEffect } from 'react';

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');

  // Funktion för att hämta alla användare
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      
      const response = await fetch("/api/users");
      
      if (!response.ok) {
        throw new Error('Något gick fel vid hämtning av användardata');
      }
      
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Fel vid hämtning av användare:', err);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrerar användare baserat på valt företag
  const filteredUsers = selectedCompany 
    ? users.filter(user => user.company === selectedCompany) 
    : users;

  return (
    <div className="user-list-border">
      <h1 className="user-list-title">Användarlista</h1>
      
      <div className="filter-container">
        <select 
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Alla företag</option>
          <option value="Tesla">Tesla</option>
          <option value="Maxi">Maxi</option>
          <option value="något annat">Något annat</option>
        </select>
        <button 
          onClick={fetchUsers} 
          className="refresh-button bla"
        >
          Uppdatera lista
        </button>
      </div>

      {loading ? (
        <p>Laddar användare...</p>
      ) : error ? (
        <p className="error-message">Fel: {error}</p>
      ) : (
        <div className="user-list-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Användarnamn</th>
                <th>Företag</th>
                <th>Email</th>
                <th>Användartyp</th>
                <th>Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.company}</td>
                    <td>{user.email}</td>
                    <td>{user.role || 'Användare'}</td>
                    <td>
                      <button className="edit-button">Redigera</button>
                      <button className="delete-button">Ta bort</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Inga användare hittades</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserListPage;
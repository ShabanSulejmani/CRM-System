import { useState, useEffect } from 'react';

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  // Funktion för att uppdatera en användare
  const updateUser = async (userId, user) => {
    const newFirstName = prompt("Ange nytt förnamn:", user.firstName);
    const newPassword = prompt("Ange nytt lösenord:", user.password);
    const newRole = prompt("Ange ny roll:", user.role);
    const newCompany = prompt("Ange nytt företag:", user.company);
  
    if (!newFirstName || !newPassword || !newRole || !newCompany) {
      alert("Alla fält måste fyllas i!");
      return;
    }
  
    const updatedUserData = {
      firstName: newFirstName,
      password: newPassword,
      role: newRole,
      company: newCompany
    };
  
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedUserData)
      });
  
      if (!response.ok) {
        throw new Error("Något gick fel vid uppdatering av användaren");
      }
  
      const result = await response.json();
      alert(result.message);
  
      // Uppdatera användarlistan
      setUsers(prevUsers =>
        prevUsers.map(u => (u.id === userId ? { ...u, ...updatedUserData } : u))
      );
    } catch (err) {
      console.error("Fel vid uppdatering av användare:", err);
      alert(`Fel vid uppdatering: ${err.message}`);
    }
  };
  


  // Funktion för att ta bort en användare
  const deleteUser = async (userId) => {
    if (!window.confirm('Är du säker på att du vill ta bort denna användare?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      
      // Anropa API:et för att ta bort användaren
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        
      });
      
      if (!response.ok) {
        throw new Error('Något gick fel vid borttagning av användaren');
      }
      
      // Ta bort användaren från lokal state för att uppdatera UI:t direkt
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      alert('Användaren har tagits bort');
    } catch (err) {
      setError(err.message);
      console.error('Fel vid borttagning av användare:', err);
      alert(`Fel vid borttagning: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Körs när komponenten laddas
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
          <option value="fordon">fordon</option>
          <option value="tele">tele</option>
          <option value="försäkring">försäkring</option>
        </select>
        <button 
          onClick={fetchUsers} 
          className="refresh-button bla"
          disabled={loading}
        >
          {loading ? 'Laddar...' : 'Uppdatera lista'}
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
    <th>Förnamn</th>
    <th>Lösenord</th>
    <th>Företag</th>
    <th>Roll</th>
    <th>Åtgärder</th>
  </tr>
</thead>

<tbody>
  {filteredUsers.length > 0 ? (
    filteredUsers.map(user => (
      <tr key={user.id}>
        <td>{user.firstName}</td>
        <td>{user.password}</td>
        <td>{user.company}</td>
        <td>{user.role}</td>
        <td>
          <button 
            className="edit-button" 
            onClick={() => updateUser(user.id, user)}
          >
            Redigera
          </button>
          <button 
            className="delete-button"
            onClick={() => deleteUser(user.id)}
            disabled={deleteLoading}
          >
            Ta bort
          </button>
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
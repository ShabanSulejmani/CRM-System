import { useState } from 'react';

function DynamiskForm() {
  const [companyType, setCompanyType] = useState('');
  const [formData, setFormData] = useState({
    // Grundläggande fält
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Telecom-specifika fält
    serviceType: '',
    problemType: '',
    
    // Mobiltelefoni-specifika fält
    phoneNumber: '',
    mobileIssue: '',
    
    // Bilverkstad-specifika fält
    carRegistration: '',
    issueType: '',
    
    // Försäkring-specifika fält
    insuranceType: '',
    caseType: '',
    
    // Gemensamt
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/support-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyType,
          ...formData,
          submittedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('Ditt ärende har registrerats! Vi återkommer så snart som möjligt.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          serviceType: '',
          problemType: '',
          phoneNumber: '',
          mobileIssue: '',
          carRegistration: '',
          issueType: '',
          insuranceType: '',
          caseType: '',
          description: ''
        });
        setCompanyType('');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ett fel uppstod. Vänligen försök igen eller kontakta oss via telefon.');
    }
  };

  const renderMobileFields = () => (
    <div>
      <label htmlFor="phoneNumber">Mobilnummer</label>
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Ange mobilnummer"
        value={formData.phoneNumber}
        onChange={handleInputChange}
      />

      {/* Ta bort den extra ärendetyp-väljaren här eftersom vi redan valt typ */}
    </div>
  );

  const renderTelecomFields = () => (
    <div>
      <label htmlFor="serviceType">Typ av tjänst</label>
      <select
        name="serviceType"
        value={formData.serviceType}
        onChange={handleInputChange}
      >
        <option value="">Välj tjänst</option>
        <option value="broadband">Bredband</option>
        <option value="mobile">Mobiltelefoni</option>
        <option value="landline">Fast telefoni</option>
        <option value="tv">TV-tjänster</option>
      </select>

      {formData.serviceType && (
        <label htmlFor="problemType">Vad gäller ditt ärende?</label>
      )}
      {formData.serviceType && (
        <select
          name="problemType"
          value={formData.problemType}
          onChange={handleInputChange}
        >
          <option value="">Välj typ av ärende</option>
          <option value="technical">Tekniskt problem</option>
          <option value="billing">Fakturafrågor</option>
          <option value="change">Ändring av tjänst</option>
          <option value="cancel">Uppsägning</option>
          <option value="other">Övrigt</option>
        </select>
      )}

      {/* Om mobiltelefoni är vald OCH det inte är fakturafrågor, visa mobilfält */}
      {formData.serviceType === 'mobile' && formData.problemType !== 'billing' && renderMobileFields()}
    </div>
  );


  const renderCarRepairFields = () => (
    <div>
      <label htmlFor="carRegistration">Registreringsnummer</label>
      <input
        type="text"
        name="carRegistration"
        placeholder="ABC123"
        value={formData.carRegistration}
        onChange={handleInputChange}
      />

      <label htmlFor="issueType">Vad gäller ditt ärende?</label>
      <select
        name="issueType"
        value={formData.issueType}
        onChange={handleInputChange}
      >
        <option value="">Välj typ av ärende</option>
        <option value="repair">Problem efter reparation</option>
        <option value="warranty">Garantiärende</option>
        <option value="complaint">Reklamation</option>
        <option value="cost">Kostnadsförfrågan</option>
        <option value="parts">Reservdelsfrågor</option>
        <option value="other">Övrigt</option>
      </select>
    </div>
  );

  const renderInsuranceFields = () => (
    <div>
      <label htmlFor="insuranceType">Typ av försäkring</label>
      <select
        name="insuranceType"
        value={formData.insuranceType}
        onChange={handleInputChange}
      >
        <option value="">Välj försäkringstyp</option>
        <option value="home">Hemförsäkring</option>
        <option value="car">Bilförsäkring</option>
        <option value="life">Livförsäkring</option>
        <option value="accident">Olycksfallsförsäkring</option>
      </select>

      <label htmlFor="caseType">Vad gäller ditt ärende?</label>
      <select
        name="caseType"
        value={formData.caseType}
        onChange={handleInputChange}
      >
        <option value="">Välj typ av ärende</option>
        <option value="claim">Pågående skadeärende</option>
        <option value="coverage">Frågor om försäkringsskydd</option>
        <option value="billing">Fakturafrågor</option>
        <option value="changes">Ändring av försäkring</option>
        <option value="documents">Begäran om försäkringshandlingar</option>
      </select>
    </div>
  );

  return (
    <div className="container">
      <h1>Kontakta kundtjänst</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="companyType">Välj område</label>
        <select
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
        >
          <option value="">Välj område</option>
          <option value="telecom">Tele/Bredband</option>
          <option value="autorepair">Fordonsservice</option>
          <option value="insurance">Försäkringsärenden</option>
        </select>

        <label htmlFor="firstName">Förnamn</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="lastName">Efternamn</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="email">E-post</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="phone">Telefon</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />

        {companyType === 'telecom' && renderTelecomFields()}
        {companyType === 'autorepair' && renderCarRepairFields()}
        {companyType === 'insurance' && renderInsuranceFields()}

        <label htmlFor="description">Beskriv ditt ärende</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Beskriv ditt ärende i detalj..."
          required
        />

        <button type="submit">Skicka ärende</button>
      </form>
    </div>
  );
}

export default DynamiskForm;
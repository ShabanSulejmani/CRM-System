import { useState } from 'react';

function DynamicCRMForm() {
  const [companyType, setCompanyType] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    serviceType: '',
    bandwidth: '',
    coverage: '',
    carBrand: '',
    bookingDate: '',
    insuranceType: '',
    policyNumber: '',
    claimType: '',
    ticketPriority: '',
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
      const response = await fetch('/api/formsubmissions', {
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
        alert('Formuläret har skickats!');
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          serviceType: '',
          bandwidth: '',
          coverage: '',
          carBrand: '',
          bookingDate: '',
          insuranceType: '',
          policyNumber: '',
          claimType: '',
          ticketPriority: '',
          description: ''
        });
        setCompanyType('');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ett fel uppstod vid skickande av formuläret.');
    }
  };

  const renderTelecomFields = () => (
    <div>
      <label htmlFor="serviceType">Tjänstetyp</label>
      <select
        name="serviceType"
        value={formData.serviceType}
        onChange={handleInputChange}
      >
        <option value="">Välj tjänstetyp</option>
        <option value="broadband">Bredband</option>
        <option value="mobile">Mobiltelefoni</option>
        <option value="landline">Fast telefoni</option>
        <option value="invoice">Fakturafrågor</option>
      </select>

      <label htmlFor="bandwidth">Bandbredd</label>
      <input
        type="text"
        name="bandwidth"
        placeholder="t.ex. 100/100 Mbit"
        value={formData.bandwidth}
        onChange={handleInputChange}
      />

      <label htmlFor="coverage">Täckningsområde</label>
      <input
        type="text"
        name="coverage"
        placeholder="t.ex. Stockholm, Göteborg"
        value={formData.coverage}
        onChange={handleInputChange}
      />
    </div>
  );

  const renderAutoRepairFields = () => (
    <div>
      <label htmlFor="carBrand">Bilmärke & Modell</label>
      <input
        type="text"
        name="carBrand"
        placeholder="t.ex. Volvo XC60"
        value={formData.carBrand}
        onChange={handleInputChange}
      />

      <label htmlFor="serviceType">Typ av service</label>
      <select
        name="serviceType"
        value={formData.serviceType}
        onChange={handleInputChange}
      >
        <option value="">Välj servicetyp</option>
        <option value="maintenance">Vanlig service</option>
        <option value="repair">Reparation</option>
        <option value="inspection">Besiktning</option>
        <option value="tire">Däckbyte</option>
      </select>

      <label htmlFor="bookingDate">Önskat servicedatum</label>
      <input
        type="date"
        name="bookingDate"
        value={formData.bookingDate}
        onChange={handleInputChange}
      />
    </div>
  );

  const renderInsuranceFields = () => (
    <div>
      <label htmlFor="insuranceType">Försäkringstyp</label>
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

      <label htmlFor="policyNumber">Försäkringsnummer</label>
      <input
        type="text"
        name="policyNumber"
        placeholder="Ange försäkringsnummer"
        value={formData.policyNumber}
        onChange={handleInputChange}
      />

      <label htmlFor="claimType">Typ av ärende</label>
      <select
        name="claimType"
        value={formData.claimType}
        onChange={handleInputChange}
      >
        <option value="">Välj ärendetyp</option>
        <option value="new">Nyteckning</option>
        <option value="claim">Skadeanmälan</option>
        <option value="change">Ändring av försäkring</option>
        <option value="question">Allmän fråga</option>
      </select>
    </div>
  );

  const renderCustomerServiceFields = () => (
    <div>
      <label htmlFor="ticketPriority">Prioritet</label>
      <select
        name="ticketPriority"
        value={formData.ticketPriority}
        onChange={handleInputChange}
      >
        <option value="">Välj prioritet</option>
        <option value="low">Låg</option>
        <option value="medium">Medium</option>
        <option value="high">Hög</option>
      </select>

      <label htmlFor="description">Beskrivning av ärende</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Beskriv ärendet..."
      />
    </div>
  );

  return (
    <div className="container">
      <h1>CRM - Kundtjänstformulär</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="companyType">Företagstyp</label>
        <select
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
        >
          <option value="">Välj företagstyp</option>
          <option value="telecom">Tele/Bredband</option>
          <option value="autorepair">Bilverkstad</option>
          <option value="insurance">Försäkring</option>
        </select>

        <label htmlFor="companyName">Företagsnamn</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="contactPerson">Kontaktperson</label>
        <input
          type="text"
          name="contactPerson"
          value={formData.contactPerson}
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
        {companyType === 'autorepair' && renderAutoRepairFields()}
        {companyType === 'insurance' && renderInsuranceFields()}
        {companyType && renderCustomerServiceFields()}

        <button type="submit">Skicka ärende</button>
      </form>
    </div>
  );
}

export default DynamicCRMForm;
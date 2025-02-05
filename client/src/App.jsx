// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import AdminCreateUser from './pages/AdminCreateUser';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Chat from './pages/Chat';
import Faq from './pages/Faq';
import FormPage from './pages/FormPage';
import StaffDashboard from './pages/StaffDashboard';
import StaffLogin from './pages/StaffLogin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/create-user" element={<AdminCreateUser />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Staff routes */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/login" element={<StaffLogin />} />

        {/* General routes */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/form" element={<FormPage />} />
        
        {/* Default route */}
        <Route path="/" element={<FormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
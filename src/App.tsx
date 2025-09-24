import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderRegister from './pages/ProviderRegister';
import ProviderDashboard from './pages/ProviderDashboard';
import ClientDashboard from './pages/ClientDashboard';
import EquipmentDetail from './pages/EquipmentDetail';
import EquipmentRegister from './pages/EquipmentRegister';
import Search from './pages/Search';
import ChatPage from './pages/ChatPage';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AdminPanel from './pages/Admin';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="App">
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/faq" element={<Layout><FAQ /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/register" element={<Layout><Register /></Layout>} />
              <Route path="/provider/register" element={<Layout><ProviderRegister /></Layout>} />
              <Route path="/provider/dashboard" element={<Layout><ProtectedRoute><ProviderDashboard /></ProtectedRoute></Layout>} />
              <Route path="/client/dashboard" element={<Layout><ProtectedRoute><ClientDashboard /></ProtectedRoute></Layout>} />
              <Route path="/equipment/:id" element={<Layout><EquipmentDetail /></Layout>} />
              <Route path="/equipment/register" element={<Layout><ProtectedRoute><EquipmentRegister /></ProtectedRoute></Layout>} />
              <Route path="/search" element={<Layout><Search /></Layout>} />
              <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
              <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
              <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
              <Route path="/terms" element={<Layout><Terms /></Layout>} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

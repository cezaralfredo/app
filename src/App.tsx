import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProviderRegister from './pages/ProviderRegister';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/provider/register" element={<ProviderRegister />} />
            <Route path="/" element={
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <header>
                  <h1>🔧 EquipaMax - Marketplace de Equipamentos</h1>
                  <p>Sua plataforma de aluguel de equipamentos está sendo construída...</p>
                  <div style={{ marginTop: '30px' }}>
                    <h3>Funcionalidades em desenvolvimento:</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      <li>📋 Cadastro de usuários e fornecedores</li>
                      <li>🔍 Busca e filtros de equipamentos</li>
                      <li>💬 Sistema de chat integrado</li>
                      <li>📊 Dashboard completo</li>
                      <li>🛡️ Sistema de avaliações</li>
                    </ul>
                  </div>
                </header>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
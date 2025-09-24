import React, { useState } from 'react';
import { AdminProvider } from '../../contexts/AdminContext';
import { ProtectedRoute } from '../../contexts/AuthContext';
import AdminSidebar from '../../components/Admin/Sidebar';
import AdminHeader from '../../components/Admin/Header';
import DashboardOverview from './components/DashboardOverview';
import UsersManagement from './Users';
import Analytics from './Analytics';
import ContentManagement from './Content';
import SystemSettings from './Settings';
import Reports from './Reports';
import MonitoringDashboard from './Monitoring';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'users':
        return <UsersManagement />;
      case 'analytics':
        return <Analytics />;
      case 'content':
        return <ContentManagement />;
      case 'settings':
        return <SystemSettings />;
      case 'reports':
        return <Reports />;
      case 'monitoring':
        return <MonitoringDashboard />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminProvider>
        <div className="min-h-screen bg-gray-100">
          <AdminSidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          
          <div className="lg:pl-64 flex flex-col flex-1">
            <AdminHeader />
            
            <main className="flex-1 pb-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </AdminProvider>
    </ProtectedRoute>
  );
};

export const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <AdminPanel />
    </div>
  );
};

export default AdminDashboard;
import React from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CogIcon, 
  DocumentTextIcon, 
  Squares2X2Icon,
  ShieldCheckIcon,
  BellIcon,
  HomeIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, section: 'dashboard' },
  { name: 'Usuários', href: '#', icon: UsersIcon, section: 'users' },
  { name: 'Analytics', href: '#', icon: ChartBarIcon, section: 'analytics' },
  { name: 'Conteúdo', href: '#', icon: Squares2X2Icon, section: 'content' },
  { name: 'Relatórios', href: '#', icon: DocumentTextIcon, section: 'reports' },
  { name: 'Monitoramento', href: '#', icon: EyeIcon, section: 'monitoring' },
  { name: 'Configurações', href: '#', icon: CogIcon, section: 'settings' },
  { name: 'Segurança', href: '#', icon: ShieldCheckIcon, section: 'security' },
  { name: 'Notificações', href: '#', icon: BellIcon, section: 'notifications' },
];

const AdminSidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    // Fixed sidebar on large screens to ensure perfect alignment with content (which uses lg:pl-64)
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-gray-800 h-full border-r border-gray-700">
        {/* Sidebar component */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-2">
                <h1 className="text-white text-lg font-semibold">Admin</h1>
                <p className="text-gray-400 text-xs">EquipaMax</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
            {navigation.map((item) => {
              const isActive = activeSection === item.section;
              return (
                <button
                  key={item.name}
                  onClick={() => onSectionChange(item.section)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Administrador</p>
                <p className="text-xs font-medium text-gray-300">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
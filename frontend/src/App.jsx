import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Expenses } from './pages/Expenses';
import { Assets } from './pages/Assets';
import { Members } from './pages/Members';
import { Maintenance } from './pages/Maintenance';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Header } from './components/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  DollarSign,
  Package,
  Users as UsersIcon,
  FileText,
  BarChart3,
  Menu,
  X,
  Settings as SettingsIcon,
  Home,
  User
} from 'lucide-react';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Don't show sidebar on login page
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Home, label: 'Flats', path: '/flats' },
    { icon: UsersIcon, label: 'Members', path: '/members' },
    { icon: DollarSign, label: 'Maintenance', path: '/maintenance' },
    { icon: ClipboardList, label: 'Projects', path: '/projects' },
    { icon: DollarSign, label: 'Expenses', path: '/expenses' },
    { icon: Package, label: 'Assets', path: '/assets' },
    { icon: UsersIcon, label: 'Vendors', path: '/vendors' },
    { icon: FileText, label: 'Invoices', path: '/invoices' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: UsersIcon, label: 'Users', path: '/users' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 flex-col">
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 overflow-y-auto z-40 fixed h-[calc(100vh-64px)] top-16`}>
          <div className="p-4 flex items-center justify-between">
            {sidebarOpen && <h1 className="text-sm font-bold">Menu</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-700 p-2 rounded">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <nav className="mt-4 space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 rounded-lg transition text-sm"
              >
                <item.icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 overflow-y-auto`}>
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/members" element={<Members />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/users" element={<Users />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

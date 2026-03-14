import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Expenses } from './pages/Expenses';
import { Assets } from './pages/Assets';
import { Members } from './pages/Members';
import { Maintenance } from './pages/Maintenance';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  DollarSign,
  Package,
  Users,
  FileText,
  BarChart3,
  Menu,
  X,
  LogOut,
  Home
} from 'lucide-react';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
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
    { icon: Users, label: 'Members', path: '/members' },
    { icon: DollarSign, label: 'Maintenance', path: '/maintenance' },
    { icon: ClipboardList, label: 'Projects', path: '/projects' },
    { icon: DollarSign, label: 'Expenses', path: '/expenses' },
    { icon: Package, label: 'Assets', path: '/assets' },
    { icon: Users, label: 'Vendors', path: '/vendors' },
    { icon: FileText, label: 'Invoices', path: '/invoices' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 fixed h-full overflow-y-auto z-40`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Aashiyana</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-700 p-2 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-4 px-6 py-3 hover:bg-gray-700 rounded-lg transition"
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition text-white"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
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

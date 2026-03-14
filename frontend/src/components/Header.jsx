import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-white shadow-md border-b border-gray-200">
      <div className="px-8 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-gray-800 font-semibold">Aashiyana Homes</h2>
        </div>

        {/* Right side - User Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-gray-700 font-medium">{user?.username || 'User'}</span>
            <ChevronDown size={16} className={`text-gray-600 transition ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                {user?.full_name && <p className="text-xs text-gray-500">{user.full_name}</p>}
              </div>

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition"
              >
                <User size={18} />
                <span>My Profile</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition"
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>

              <div className="border-t border-gray-200">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition text-left"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

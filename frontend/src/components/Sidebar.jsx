import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Sidebar({ navItems, sidebarOpen, setSidebarOpen }) {
  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 overflow-y-auto z-40 fixed h-[calc(100vh-64px)] top-16`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h1 className="text-sm font-bold">Menu</h1>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hover:bg-gray-700 p-2 rounded"
        >
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
  );
}

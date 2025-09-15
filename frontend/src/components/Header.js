import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl group-hover:shadow-lg transition-all duration-200">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                UserHub
              </h1>
              <p className="text-slate-600 text-sm">Manage your team</p>
            </div>
          </Link>

          {isHomePage && (
            <Link
              to="/add-user"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={18} />
              <span className="font-medium">Add User</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
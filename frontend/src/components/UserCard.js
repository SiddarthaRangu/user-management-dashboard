import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Mail, Phone, MapPin } from 'lucide-react';

const UserCard = ({ user, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDelete(user.id);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div 
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* User Avatar and Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {getInitials(user.name)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-600 transition-colors duration-200">
              {user.name}
            </h3>
            {user.company && (
              <p className="text-slate-600 text-sm">{user.company}</p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className={`flex items-center space-x-2 transition-all duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <Link
            to={`/edit-user/${user.id}`}
            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
            title="Edit user"
          >
            <Edit3 size={16} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
            title="Delete user"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-slate-600">
          <Mail size={16} className="text-slate-400 flex-shrink-0" />
          <span className="text-sm truncate">{user.email}</span>
        </div>
        
        <div className="flex items-center space-x-3 text-slate-600">
          <Phone size={16} className="text-slate-400 flex-shrink-0" />
          <span className="text-sm">{user.phone}</span>
        </div>
        
        {user.address && (user.address.city || user.address.zipcode) && (
          <div className="flex items-center space-x-3 text-slate-600">
            <MapPin size={16} className="text-slate-400 flex-shrink-0" />
            <span className="text-sm truncate">
              {[user.address.city, user.address.zipcode].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
    </div>
  );
};

export default UserCard;
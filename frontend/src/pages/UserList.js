import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, Users, Plus, RefreshCw } from 'lucide-react';
import UserCard from '../components/UserCard';
import { useNotification } from '../components/NotificationProvider';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { showNotification } = useNotification();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      
      if (!response.ok) {
        throw new Error(`Failed to load users`);
      }
      
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      showNotification(`Error loading users: ${error.message}`, 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      setUsers(users.filter(user => user.id !== userId));
      showNotification('User deleted successfully');
    } catch (error) {
      showNotification(`Error deleting user: ${error.message}`, 'error');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-slate-600 text-lg">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white transition-all duration-200"
          >
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <button
            onClick={fetchUsers}
            className="p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white transition-all duration-200"
            title="Refresh users"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {searchTerm ? 'No users found' : 'No users yet'}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search or clear the search to see all users.' 
              : 'Get started by adding your first user.'
            }
          </p>
          
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200 mr-3"
            >
              Clear Search
            </button>
          ) : null}
          
          <Link
            to="/add-user"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <Plus size={18} />
            <span>Add First User</span>
          </Link>
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className="text-center text-slate-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}
    </div>
  );
};

export default UserList;
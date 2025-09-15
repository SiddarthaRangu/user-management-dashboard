import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import { useNotification } from '../components/NotificationProvider';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const UserForm = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: {
      street: '',
      city: '',
      zipcode: '',
      geo: { lat: '', lng: '' }
    }
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const isEditing = Boolean(id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load user data`);
        }
        
        const data = await response.json();
        setUser({
          ...data.data,
          address: data.data.address || {
            street: '',
            city: '',
            zipcode: '',
            geo: { lat: '', lng: '' }
          }
        });
      } catch (error) {
        showNotification(`Error loading user: ${error.message}`, 'error');
        navigate('/');
      } finally {
        setInitialLoading(false);
      }
    };

    if (isEditing) {
      setInitialLoading(true);
      fetchUser();
    }
  }, [id, isEditing, navigate, showNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setUser(prev => {
        const updated = { ...prev };
        let current = updated;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setUser(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const formErrors = {};
    
    if (!user.name.trim()) {
      formErrors.name = 'Name is required.';
    }
    
    if (!user.email.trim()) {
      formErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+/.test(user.email)) {
      formErrors.email = 'Please enter a valid email address.';
    }
    
    if (!user.phone.trim()) {
      formErrors.phone = 'Phone number is required.';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      showNotification('Please fix the errors in the form.', 'error');
      return;
    }

    setLoading(true);

    try {
      const url = isEditing ? `${API_BASE_URL}/users/${id}` : `${API_BASE_URL}/users`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Server error`);
      }

      showNotification(isEditing ? 'User updated!' : 'User created!');
      navigate('/');
    } catch (error) {
      if (error.message.includes('email')) {
        setErrors({ email: 'This email address is already in use.' });
        showNotification('Email already registered.', 'error');
      } else {
        showNotification(`Error: ${error.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-slate-600 text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Link 
          to="/" 
          className="p-2 hover:bg-white/60 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditing ? 'Edit User' : 'Add New User'}
          </h1>
          <p className="text-slate-600">
            {isEditing ? 'Update user information.' : 'Fill in the details below.'}
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-lg">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={user.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Address</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="address.street" className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={user.address.street}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  placeholder="Enter street address"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={user.address.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.zipcode" className="block text-sm font-medium text-slate-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="address.zipcode"
                    value={user.address.zipcode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <Link
              to="/"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors duration-200 font-medium"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Update User' : 'Create User'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
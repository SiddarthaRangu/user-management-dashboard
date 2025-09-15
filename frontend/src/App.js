import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import NotificationProvider from './components/NotificationProvider';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Header />
          <main className="max-w-7xl mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<UserList />} />
              <Route path="/add-user" element={<UserForm />} />
              <Route path="/edit-user/:id" element={<UserForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
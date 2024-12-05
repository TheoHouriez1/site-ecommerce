import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginComponent } from './components/LoginComponent';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import { RegisterComponent } from './components/RegisterComponents';
 
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/register" element={<RegisterComponent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

// src/pages/Admin.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();

  if (!user || user.role !== '["ROLE_ADMIN"]') {
    return <div>Accès interdit. Vous devez être un administrateur pour accéder à cette page.</div>;
  }

  return (
    <div>
      <h1>Page d'administration</h1>
      <p>Bienvenue, {user.firstName} {user.lastName}. Vous avez accès à la page d'administration.</p>
    </div>
  );
};

export default Admin;

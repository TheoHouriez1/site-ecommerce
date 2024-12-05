// src/pages/Home.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavbarComponent } from '../components/NavBarComponents';

const Home = () => {
  const { user, logout } = useAuth(); // Utilisation du contexte d'authentification

  return (
    <div>
      <NavbarComponent />
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold mb-6">Bienvenue sur la page d'accueil</h1>
        {user ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6">
              Bienvenue, {user.firstName} {user.lastName} !
            </h2>
            <div className="text-gray-600">ID : {user.id}</div>
            <div className="text-gray-600">Email : {user.email}</div>
            <div className="text-gray-600">
              Roles :{' '}
              {Array.isArray(user.roles)
                ? user.roles.join(', ')
                : user.roles}
            </div>
            <button
              onClick={logout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <div className="">
            <p>Vous n'êtes pas connecté.</p>
            <a
              href="/login"
              className="text-blue-500 hover:underline mt-2 block"
            >
              Accéder à la page de connexion
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

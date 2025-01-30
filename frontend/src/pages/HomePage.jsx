'use client';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavbarComponent } from '../components/NavBarComponents';
import ProductListingPage from './ProductListingPage';

const Home = () => {
  const { user } = useAuth();
  
  // Pour déboguer - afficher les données brutes dans la console
  console.log('Données utilisateur dans le contexte:', user);

  return (
    <div>
      <NavbarComponent />
      {user && user.isAuthenticated ? (
        <div className="p-8 max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
              Informations utilisateur
            </h1>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Bienvenue {user.firstName} {user.lastName}!
                </h2>
                
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">ID:</span> {user.id}
                  </p>
                  
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  
                  <p className="text-gray-600">
                    <span className="font-medium">Prénom:</span> {user.firstName}
                  </p>
                  
                  <p className="text-gray-600">
                    <span className="font-medium">Nom:</span> {user.lastName}
                  </p>
                  
                  <div className="text-gray-600">
                    <span className="font-medium">Rôles:</span>
                    <ul className="list-disc ml-6 mt-1">
                      {Array.isArray(user.roles) && user.roles.map((role, index) => (
                        <li key={index} className="text-gray-600">
                          {role}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <p className="text-gray-600">
                    <span className="font-medium">Statut:</span>{' '}
                    {user.isAuthenticated ? (
                      <span className="text-green-600">Connecté</span>
                    ) : (
                      <span className="text-red-600">Non connecté</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p className="text-lg text-gray-600">
              Bienvenue sur notre site. Veuillez vous connecter pour accéder à votre espace.
            </p>
          </div>
        </div>
      )}
      <ProductListingPage />
    </div>
  );
};

export default Home;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Key, Shield, CheckCircle, XCircle } from 'lucide-react';

const UserInfoCard = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl transition-all duration-300 hover:shadow-md hover:bg-gray-100">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon className="text-gray-600" size={20} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  </div>
);

const UserProfile = ({ user }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl">
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Mon Profil
      </h1>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${user?.isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={`text-sm font-medium ${user?.isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
          {user?.isAuthenticated ? 'En ligne' : 'Hors ligne'}
        </span>
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-4 mb-8">
      <UserInfoCard 
        icon={User} 
        label="Nom complet" 
        value={`${user?.firstName} ${user?.lastName}`} 
      />
      <UserInfoCard 
        icon={Mail} 
        label="Email" 
        value={user?.email} 
      />
      <UserInfoCard 
        icon={Key} 
        label="ID Utilisateur" 
        value={user?.id} 
      />
      <UserInfoCard 
        icon={Shield} 
        label="Rôles" 
        value={Array.isArray(user?.roles) ? user.roles.join(', ') : 'Aucun rôle'} 
      />
    </div>
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Statut du compte</h2>
      <div className="flex items-center space-x-3">
        {user?.isAuthenticated ? (
          <>
            <CheckCircle className="text-green-500" size={24} />
            <div>
              <p className="font-medium text-green-600">Compte vérifié</p>
              <p className="text-sm text-gray-600">Vous avez accès à toutes les fonctionnalités</p>
            </div>
          </>
        ) : (
          <>
            <XCircle className="text-red-500" size={24} />
            <div>
              <p className="font-medium text-red-600">Non connecté</p>
              <p className="text-sm text-gray-600">Veuillez vous connecter pour accéder à votre espace</p>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Breadcrumb Navigation - Ajouté comme dans ProductCard */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black transition-colors">
              Accueil
            </button>
            <span>/</span>
            <span className="text-black font-medium">Mon Profil</span>
          </div>
        </div>
      </div>
      
      {/* Contenu principal avec padding-top ajusté */}
      <div className="pt-4">
        <div className="container mx-auto px-4 py-6">
          {user && user.isAuthenticated ? (
            <div className="max-w-5xl mx-auto">
              <UserProfile user={user} />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Bienvenue sur notre boutique
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                  Connectez-vous pour découvrir une expérience personnalisée et accéder à votre espace membre.
                </p>
                <div className="h-1 w-24 bg-gray-200 mx-auto rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
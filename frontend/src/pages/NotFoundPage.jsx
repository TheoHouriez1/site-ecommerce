import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Home, ArrowLeft, Search } from 'lucide-react';
import { NavbarComponent } from '../components/NavBarComponents';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent />
      
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black transition-colors">
              Accueil
            </button>
            <span>/</span>
            <span className="text-black font-medium">Page non trouvée</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center max-w-xl mx-auto">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-8">
            <Search className="text-gray-400" size={40} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            404 - Page non trouvée
          </h1>
          
          <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
          
          <p className="text-gray-600 mb-8 text-lg">
            Oups ! La page que vous recherchez semble avoir disparu ou n'existe pas.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-300"
            >
              <Home size={20} />
              Retour à l'accueil
            </button>
            
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              Page précédente
            </button>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-200">
            <button 
              onClick={() => navigate('/products')}
              className="flex items-center justify-center gap-2 text-black hover:underline transition-colors duration-300 mx-auto"
            >
              <ShoppingBag size={20} />
              Continuer votre shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
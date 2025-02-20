import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-xl mx-auto">
          <Search className="mx-auto text-gray-400 mb-6" size={64} />
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            404 - Page non trouvée
          </h1>
          
          <div className="w-24 h-1 bg-gray-900 mx-auto mb-6"></div>
          
          <p className="text-gray-600 mb-8 text-lg">
            Oups ! La page que vous recherchez semble avoir disparu ou n'existe pas.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors duration-300"
            >
              <Home size={20} />
              Retour à l'accueil
            </button>
            
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              Page précédente
            </button>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-200">
            <button 
              onClick={() => navigate('/products')}
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300 mx-auto"
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
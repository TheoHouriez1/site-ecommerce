import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const ProductCard = ({ item, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-2xl shadow-lg overflow-hidden w-full transition-all duration-300 hover:shadow-xl cursor-pointer"
  >
    <div className="relative w-full aspect-square bg-gray-100">
      <img
        src={`http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/${item.image}`}
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
      <p className="text-sm text-gray-500">Chaussure de basket</p>
      <p className="text-lg font-bold text-gray-900 mt-2">{item.price.toFixed(2)} €</p>
    </div>
  </div>
);

const SearchComponent: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/product")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  }, []);

  const handleProductClick = (product) => {
    setIsOpen(false); // Ferme le modal de recherche
    navigate('/productcard', { 
      state: { 
        id: product.id,
        image: `http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/${product.image}`,
        title: product.name,
        description: product.description,
        price: parseFloat(product.price)
      } 
    });
  };

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded-xl flex items-center gap-2">
        <X size={20} />
        <span>Erreur : {error}</span>
      </div>
    );
  }

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const limitedData = filteredData.slice(0, 4);
  const suggestionList = filteredData.slice(0, 5);

  const handleSelectSuggestion = (product) => {
    setSearch(product.name);
    setShowSuggestions(false);
    handleProductClick(product); // Navigation vers la page produit lors de la sélection d'une suggestion
  };

  // Bouton de recherche compact
  const SearchButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
    >
      <Search className="text-gray-600" size={24} />
    </button>
  );

  // Modal de recherche
  const SearchModal = () => (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className={`fixed inset-x-0 top-0 bg-white transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="container mx-auto p-4">
          {/* En-tête avec barre de recherche */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-grow max-w-2xl mx-auto">
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="ml-4 p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
            >
              <X className="text-gray-600" size={24} />
            </button>
          </div>

          {/* Contenu principal */}
          <div className="flex flex-col md:flex-row gap-8 max-h-[70vh] overflow-y-auto">
            {/* Suggestions */}
            <div className="w-full md:w-1/4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Meilleures suggestions
              </h3>
              {showSuggestions && search.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  {suggestionList.map((item) => (
                    <button
                      key={item.id}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-300 first:rounded-t-xl last:rounded-b-xl"
                      onClick={() => handleSelectSuggestion(item)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Résultats */}
            <div className="w-full md:w-3/4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {limitedData.map((item) => (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => handleProductClick(item)} 
                  />
                ))}
              </div>
              {limitedData.length === 0 && search && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun résultat trouvé pour "{search}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SearchButton />
      <SearchModal />
    </>
  );
};

export default SearchComponent; 
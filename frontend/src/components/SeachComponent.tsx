import React, { useEffect, useState, useRef, useContext } from 'react';
import { Search, X, ArrowRight, ShoppingBag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  image2?: string;
  image3?: string;
  category?: string;
  sizes?: string[];
}

const ProductCard = ({ item, onClick }) => {
  const { addToCart } = useContext(CartContext);
  const [favorites, setFavorites] = useState(new Set());
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: `http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/${item.image}`,
      quantity: 1,
      sizes: item.sizes
    });
  };
  
  const toggleFavorite = (productId, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md overflow-hidden w-full transition-all duration-300 hover:shadow-xl cursor-pointer group"
    >
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <img
          src={`http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/${item.image}`}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        <button 
          onClick={(e) => toggleFavorite(item.id, e)}
          className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full shadow hover:bg-opacity-100 transition-all z-10"
          aria-label={favorites.has(item.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart 
            className={favorites.has(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}
            size={18}
          />
        </button>
      </div>
      <div className="p-4">
        {item.category && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md mb-2">
            {item.category}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
        
        {/* Tailles disponibles */}
        {item.sizes && item.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.sizes.map((size) => (
              <span 
                key={size} 
                className="px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded text-gray-700"
              >
                {size}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <p className="text-lg font-bold text-gray-900">{parseFloat(item.price).toFixed(2)} €</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAddToCart}
              className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
              aria-label="Ajouter au panier"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchComponent: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [data, setData] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/product")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
      
    // Charger les recherches récentes du localStorage  
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveSearch = (term: string) => {
    if (term.trim() === '') return;
    
    const updatedSearches = [
      term,
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleProductClick = (product) => {
    saveSearch(product.name);
    setIsOpen(false);
    
    const productData = {
      id: product.id,
      name: product.name,
      image: product.image,
      image2: product.image2,
      description: product.description,
      price: parseFloat(product.price),
      sizes: product.sizes,
      category: product.category || "Vêtements"
    };
    
    // N'ajoute image3 que si elle n'est pas null
    if (product.image3 !== null) {
      productData.image3 = product.image3;
    }
    
    navigate('/Productcard', { state: productData });
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

  const limitedData = filteredData.slice(0, 8);
  const suggestionList = filteredData.slice(0, 5);

  const handleSelectSuggestion = (product) => {
    setSearch(product.name);
    setShowSuggestions(false);
    handleProductClick(product);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      saveSearch(search);
    }
  };

  // Bouton de recherche compact
  const SearchButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 flex items-center justify-center"
      aria-label="Rechercher"
    >
      <Search className="text-gray-600" size={24} />
    </button>
  );

  // Modal de recherche
  const SearchModal = () => (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 backdrop-blur-sm ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className={`fixed inset-x-0 top-0 bg-white transform transition-transform duration-300 shadow-xl ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="container mx-auto py-6 px-4">
          {/* En-tête avec barre de recherche */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="flex justify-between items-center">
              <div className="relative flex-grow max-w-3xl mx-auto">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-lg transition-all duration-300 shadow-sm"
                  placeholder="Rechercher un produit..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
                {search && (
                  <button 
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                aria-label="Fermer la recherche"
              >
                <X className="text-gray-600" size={24} />
              </button>
            </div>
          </form>

          {/* Contenu principal */}
          <div className="flex flex-col md:flex-row gap-8 max-h-[70vh] overflow-y-auto">
            {/* Panneau latéral: Suggestions et Recherches récentes */}
            <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
              {/* Suggestions de recherche */}
              {showSuggestions && search.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <h3 className="text-sm font-semibold text-gray-600 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    Suggestions
                  </h3>
                  {suggestionList.length > 0 ? (
                    <div>
                      {suggestionList.map((item) => (
                        <button
                          key={item.id}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2"
                          onClick={() => handleSelectSuggestion(item)}
                        >
                          <Search size={16} className="text-gray-400" />
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="px-4 py-3 text-gray-500 text-sm">Aucune suggestion trouvée</p>
                  )}
                </div>
              )}

              {/* Recherches récentes */}
              {!search && recentSearches.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <h3 className="text-sm font-semibold text-gray-600 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    Recherches récentes
                  </h3>
                  <div>
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-300 flex items-center justify-between"
                        onClick={() => {
                          setSearch(term);
                          setShowSuggestions(true);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Search size={16} className="text-gray-400" />
                          <span>{term}</span>
                        </div>
                        <X 
                          size={16} 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecentSearches(recentSearches.filter(s => s !== term));
                            localStorage.setItem('recentSearches', JSON.stringify(
                              recentSearches.filter(s => s !== term)
                            ));
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Résultats */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {search && (
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Résultats pour "{search}"
                    </h3>
                  )}
                  
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
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600 font-medium">Aucun résultat trouvé pour "{search}"</p>
                      <p className="text-gray-500 mt-2">Essayez avec d'autres mots-clés</p>
                    </div>
                  )}
                  
                  {filteredData.length > limitedData.length && (
                    <div className="mt-6 text-center">
                      <button 
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 font-medium"
                      >
                        Voir plus de résultats
                        <ArrowRight size={16} className="ml-2" />
                      </button>
                    </div>
                  )}
                </>
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
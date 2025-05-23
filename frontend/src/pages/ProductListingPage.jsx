import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  ChevronDown,
  X,
  AlertCircle,
  Sliders
} from 'lucide-react';
import { NavbarComponent } from '../components/NavBarComponents';

const ProductListingPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    ecoScore: ''
  });
  const [sortBy, setSortBy] = useState('default');
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const API_TOKEN = import.meta.env.VITE_API_TOKEN;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    fetch("http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/product", {
      headers: {
        "Content-Type": "application/json",
        "X-API-TOKEN": API_TOKEN
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        return response.json();
      })
      .then(setProducts)
      .catch((error) => setError(error.message));
    
    fetch("http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/category", {
      headers: {
        "Content-Type": "application/json",
        "X-API-TOKEN": API_TOKEN
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        return response.json();
      })
      .then(setCategories)
      .catch((error) => setError(error.message));
  }, []);
  
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      ecoScore: ''
    });
    setSearch('');
    setSortBy('default');
  };

  const processedProducts = products
    .filter(product => {
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !filters.category || product.category === filters.category;
      const matchMinPrice = !filters.minPrice || product.price >= parseFloat(filters.minPrice);
      const matchMaxPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
      const matchStock = !filters.inStock || (product.stock && product.stock > 0);
      const matchEcoScore = !filters.ecoScore || product.ecoScore === filters.ecoScore;
      return matchSearch && matchCategory && matchMinPrice && matchMaxPrice && matchStock && matchEcoScore;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'priceAsc': return a.price - b.price;
        case 'priceDesc': return b.price - a.price;
        case 'nameAsc': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 text-center max-w-md w-full bg-white rounded-lg shadow-md">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-100">
            <X className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-medium text-gray-800 mb-3">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {/* Bouton "Réessayer" retiré comme demandé */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent />
      
      {/* Hero */}
      <div className="bg-black text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-medium mb-4">Notre Collection</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Des vêtements qui ne sont pas que des vêtements, mais des histoires que vous porterez.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Controls Bar */}
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
              <div className="w-full md:w-auto flex-grow relative">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  {search && (
                    <button 
                      onClick={() => setSearch('')}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Sort, Filter */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="default">Trier: Par défaut</option>
                    <option value="priceAsc">Prix croissant</option>
                    <option value="priceDesc">Prix décroissant</option>
                    <option value="nameAsc">Nom A-Z</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                </div>
                
                {/* Filter Toggle */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-md border transition-all ${
                    isFilterOpen || (filters.category || filters.minPrice || filters.maxPrice || filters.inStock || filters.ecoScore)
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Sliders size={18} />
                  Filtres
                  {(filters.category || filters.minPrice || filters.maxPrice || filters.inStock || filters.ecoScore) && (
                    <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
                      {Object.values(filters).filter(value => typeof value === 'string' ? Boolean(value) : value).length}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Filters Panel */}
            {isFilterOpen && (
              <div className="py-6 border-t border-gray-200 mt-4">
                <div className="flex flex-wrap gap-8 items-start">
                  {/* Category Filter - Maintenant dynamique depuis l'API */}
                  <div className="w-full md:w-auto">
                    <h3 className="font-medium text-gray-700 mb-3 text-sm">Catégorie</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => handleFilterChange('category', filters.category === category.name_category ? '' : category.name_category)}
                          className={`px-4 py-2 text-sm rounded-md transition-all ${
                            filters.category === category.name_category 
                              ? 'bg-black text-white' 
                              : 'border border-gray-200 text-gray-700 hover:border-black hover:text-black'
                          }`}
                        >
                          {category.name_category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div className="w-full md:w-auto">
                    <h3 className="font-medium text-gray-700 mb-3 text-sm">Prix</h3>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-24 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <span className="text-gray-500">à</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-24 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                  
                  {/* EcoScore Filter */}
                  <div className="w-full md:w-auto">
                    <h3 className="font-medium text-gray-700 mb-3 text-sm">EcoScore</h3>
                    <div className="relative">
                      <select 
                        value={filters.ecoScore}
                        onChange={(e) => handleFilterChange('ecoScore', e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent min-w-28"
                      >
                        <option value="">Tous</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  
                  {/* Stock Filter */}
                  <div className="w-full md:w-auto">
                    <h3 className="font-medium text-gray-700 mb-3 text-sm">Disponibilité</h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="inStockFilter"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="w-4 h-4 border-gray-300 rounded text-black focus:ring-black"
                      />
                      <label htmlFor="inStockFilter" className="text-sm text-gray-700">
                        Uniquement les produits en stock
                      </label>
                    </div>
                  </div>
                  
                  {/* Reset Filters */}
                  <div className="w-full md:w-auto ml-auto flex items-end">
                    <button
                      onClick={() => resetFilters()}
                      className="px-4 py-2 text-sm text-black hover:underline transition-all"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Results summary */}
        <div className="mb-6 px-4">
          <p className="text-gray-600 text-sm">
            {processedProducts.length} produit{processedProducts.length !== 1 ? 's' : ''} trouvé{processedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Products Grid/List adaptatif selon la taille d'écran */}
        <div className={`grid gap-6 ${
          isMobile 
            ? 'grid-cols-1' // Vue en liste pour mobile
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' // Vue en grid pour tablettes et desktop
        }`}>
          {processedProducts.map(product => {
            const isInStock = product.stock > 0;
            
            return (
              <div 
                key={product.id}
                className={`group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden ${
                  isMobile ? 'flex' : ''
                }`}
              >
                <div 
                  className={`relative ${isMobile ? 'w-1/3' : 'w-full'}`}
                  onClick={() => handleProductClick(product)}
                > 
                  {/* Image container with square aspect ratio */}
                  <div className="bg-gray-50 overflow-hidden aspect-[4/5]">
                    <img 
                      src={`http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/${product.image}`}
                      alt={product.name}
                      className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${!isInStock ? 'opacity-70' : ''}`}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/600x800?text=Image+non+disponible";
                      }}
                    />
                    
                    {/* Overlay pour produits épuisés */}
                    {!isInStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 bg-opacity-80 text-white px-4 py-2 uppercase text-sm font-medium rounded">
                          Épuisé
                        </div>
                      </div>
                    )}

                    {/* EcoScore Badge */}
                    {product.ecoScore && (
                      <div className="absolute top-2 right-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          product.ecoScore === 'A' ? 'bg-green-600' :
                          product.ecoScore === 'B' ? 'bg-green-400' :
                          product.ecoScore === 'C' ? 'bg-yellow-500' :
                          product.ecoScore === 'D' ? 'bg-orange-500' :
                          product.ecoScore === 'E' ? 'bg-red-500' :
                          'bg-gray-400'
                        }`}>
                          {product.ecoScore}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`p-4 ${isMobile ? 'w-2/3' : ''}`}>
                  <div onClick={() => handleProductClick(product)} className="space-y-1.5">
                    <h2 className="text-base font-medium text-gray-800">{product.name}</h2>
                    
                    {/* Size label */}
                    {product.sizes && product.sizes.length > 0 && (
                      <p className="text-gray-500 text-sm">
                        Tailles: {product.sizes.join(", ")}
                      </p>
                    )}
                    
                    {/* EcoScore info */}
                    {product.ecoScore && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">EcoScore:</span>
                        <span className={`text-xs font-medium ${
                          product.ecoScore === 'A' ? 'text-green-600' :
                          product.ecoScore === 'B' ? 'text-green-500' :
                          product.ecoScore === 'C' ? 'text-yellow-600' :
                          product.ecoScore === 'D' ? 'text-orange-600' :
                          product.ecoScore === 'E' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {product.ecoScore}
                        </span>
                      </div>
                    )}
                    
                    {/* Price */}
                    <p className="font-bold text-black mt-1">
                      €{parseFloat(product.price).toFixed(2)}
                    </p>
                    
                    {/* Stock indicator */}
                    {isInStock ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">En stock</span>
                        
                        {product.stock <= 5 && (
                          <span className="text-orange-600 text-xs flex items-center gap-1 ml-2">
                            <AlertCircle size={12} />
                            <span>Plus que {product.stock} en stock</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-600">Épuisé</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Empty State */}
        {processedProducts.length === 0 && (
          <div className="bg-white rounded-lg shadow-md text-center max-w-lg mx-auto p-8 mt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gray-100">
              <Search className="text-black" size={24} />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-3">
              Aucun produit trouvé
            </h2>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.
            </p>
            <button 
              onClick={resetFilters}
              className="py-3 px-6 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
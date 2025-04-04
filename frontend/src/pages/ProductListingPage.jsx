import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Grid, 
  List, 
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Filter
} from 'lucide-react';
import { CartContext } from '../components/CartContext';

const ProductListingPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('default');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [categories, setCategories] = useState(['Chaussures', 'Vêtements', 'Accessoires']);

  useEffect(() => {
    fetch("http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/product")
      .then((response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        return response.json();
      })
      .then(setProducts)
      .catch((error) => setError(error.message));
  }, []);

  const handleProductClick = (product) => {
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

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: `http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/${product.image}`,
      quantity: 1,
      sizes: product.sizes
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
      maxPrice: ''
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
      return matchSearch && matchCategory && matchMinPrice && matchMaxPrice;
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-50">
            <X className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notre Collection</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Découvrez notre sélection de produits premium pour tous les styles et toutes les occasions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow mb-8 overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full md:w-auto flex-grow relative">
              <input 
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
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

            <div className="flex flex-wrap items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  aria-label="Vue en grille"
                >
                  <Grid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  aria-label="Vue en liste"
                >
                  <List size={18} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg py-3 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="default">Trier par défaut</option>
                  <option value="priceAsc">Prix croissant</option>
                  <option value="priceDesc">Prix décroissant</option>
                  <option value="nameAsc">Nom A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
                  isFilterOpen 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter size={18} />
                Filtres
                {(filters.category || filters.minPrice || filters.maxPrice) && (
                  <span className="flex items-center justify-center w-5 h-5 bg-gray-800 text-white text-xs rounded-full">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {isFilterOpen && (
            <div className="bg-gray-50 p-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-6 items-start">
                {/* Category Filter */}
                <div className="w-full md:w-auto">
                  <h3 className="font-medium text-gray-700 mb-3">Catégorie</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
                        className={`px-4 py-2 rounded-lg text-sm transition ${
                          filters.category === cat 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="w-full md:w-auto">
                  <h3 className="font-medium text-gray-700 mb-3">Prix</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-24 p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <span className="text-gray-500">à</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-24 p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <span className="text-gray-500">€</span>
                  </div>
                </div>

                {/* Reset Filters */}
                <div className="w-full md:w-auto ml-auto flex items-end">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results summary */}
        <div className="mb-8 flex justify-between items-center">
          <p className="text-gray-600">
            {processedProducts.length} produit{processedProducts.length !== 1 ? 's' : ''} trouvé{processedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {processedProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => handleProductClick(product)}
              className={`group bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3 flex-shrink-0' : 'aspect-square'}`}>
                <img 
                  src={`http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button 
                  onClick={(e) => toggleFavorite(product.id, e)}
                  className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full shadow hover:bg-opacity-100 transition-all z-10"
                  aria-label={favorites.has(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart 
                    className={favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                    size={18}
                  />
                </button>
              </div>
              
              <div className={`p-5 flex flex-col ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                <div className="mb-1">
                  {/* Display category as a small badge */}
                  {product.category && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md mb-2">
                      {product.category}
                    </span>
                  )}
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                </div>
                
                {/* Tailles disponibles */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-auto">
                    {product.sizes.map((size) => (
                      <span 
                        key={size} 
                        className="px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded text-gray-700"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xl font-bold text-gray-900">
                    {parseFloat(product.price).toFixed(2)} €
                  </p>
                  <button 
                    onClick={(e) => handleAddToCart(product, e)}
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                    aria-label="Ajouter au panier"
                  >
                    <ShoppingCart size={18} />
                    <span className="text-sm font-medium">Ajouter</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {processedProducts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gray-100">
              <Search className="text-gray-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Aucun produit trouvé
            </h2>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.
            </p>
            <button 
              onClick={resetFilters}
              className="py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
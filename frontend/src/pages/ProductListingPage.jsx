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
  X
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
    navigate('/Productcard', { 
      state: { 
        id: product.id,
        image: `http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/${product.image}`,
        title: product.name,
        description: product.description,
        price: parseFloat(product.price),
        sizes: product.sizes
      } 
    });
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <X className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Notre Collection</h1>

            <div className="flex flex-wrap items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 w-full md:w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-800 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-800 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="default">Trier par défaut</option>
                  <option value="priceAsc">Prix croissant</option>
                  <option value="priceDesc">Prix décroissant</option>
                  <option value="nameAsc">Nom A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={20} />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors duration-300"
              >
                <SlidersHorizontal size={20} />
                Filtres
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {isFilterOpen && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              {/* Add your filter controls here */}
            </div>
          )}
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
              className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                <img 
                  src={`http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover aspect-square"
                />
                <button 
                  onClick={(e) => toggleFavorite(product.id, e)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Heart 
                    className={`transition-colors duration-300 ${
                      favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                    size={20}
                  />
                </button>
              </div>
              <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                
                {/* Tailles disponibles */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.sizes && product.sizes.map((size) => (
                    <span 
                      key={size} 
                      className="px-2 py-1 text-sm bg-gray-100 rounded-lg text-gray-700"
                    >
                      {size}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    {parseFloat(product.price).toFixed(2)} €
                  </p>
                  <button 
                    onClick={(e) => handleAddToCart(product, e)}
                    className="bg-gray-900 text-white p-2 rounded-xl hover:bg-gray-800 transition-colors duration-300"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {processedProducts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Aucun produit trouvé
            </h2>
            <p className="text-gray-600">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
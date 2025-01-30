import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Grid, List } from 'lucide-react';
import { CartContext } from '../components/CartContext';

const ProductListingPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('default');
  const [search, setSearch] = useState('');

  // Récupération des produits depuis l'API
  useEffect(() => {
    fetch("http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/product")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => setError(error.message));
  }, []);

  // Fonction pour naviguer vers la page de détail du produit
  const handleProductClick = (product) => {
    navigate('/Productcard', { 
      state: { 
        id: product.id,
        image: `http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/uploads/images/${product.image}`,
        title: product.name,
        description: product.description,
        price: parseFloat(product.price)
      } 
    });
  };

  // Fonction pour ajouter au panier
  const handleAddToCart = (product) => {
    // Ajout au panier avec toutes les informations nécessaires
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: `http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/uploads/images/${product.image}`,
      quantity: 1
    });
  };

  // Fonction pour filtrer et trier les produits
  const processedProducts = products
    .filter(product => {
      // Filtrage par recherche
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
      
      // Filtrage par catégorie
      const matchCategory = !filters.category || product.category === filters.category;
      
      // Filtrage par prix
      const matchMinPrice = !filters.minPrice || product.price >= parseFloat(filters.minPrice);
      const matchMaxPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
      
      return matchSearch && matchCategory && matchMinPrice && matchMaxPrice;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Gestion des erreurs de chargement
  if (error) {
    return <div className="text-center text-red-600 py-8">Erreur de chargement : {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Titre et filtres */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notre Collection</h1>
        
        <div className="flex items-center space-x-4">
          {/* Recherche */}
          <input 
            type="text"
            placeholder="Rechercher un produit"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded"
          />

          {/* Sélecteur de mode d'affichage */}
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <Grid />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <List />
            </button>
          </div>

          {/* Filtres et tri */}
          <select 
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="default">Trier par défaut</option>
            <option value="priceAsc">Prix : Croissant</option>
            <option value="priceDesc">Prix : Décroissant</option>
            <option value="nameAsc">Nom : A-Z</option>
          </select>
        </div>
      </div>

      {/* Grille ou liste de produits */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
        {processedProducts.map(product => (
          <div 
            key={product.id} 
            className={`bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow ${
              viewMode === 'list' ? 'flex items-center' : ''
            }`}
            onClick={() => handleProductClick(product)}
          >
            <div className={`${viewMode === 'list' ? 'w-1/3 p-4' : 'w-full'}`}>
              <img 
                src={`http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/uploads/images/${product.image}`}
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                </div>
                <button 
                  className="text-gray-500 hover:text-red-500"
                  aria-label="Ajouter aux favoris"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Heart className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{parseFloat(product.price).toFixed(2)} €</p>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              >
                <ShoppingCart className="mr-2" />
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun produit */}
      {processedProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Aucun produit trouvé</p>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
import React, { useState } from 'react';
import { NavbarComponent } from '../components/NavBarComponents';
import { Filter, Search, ShoppingBag, Heart, Eye, X, ChevronDown } from 'lucide-react';

const AlbumPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Données des produits pour l'album
  const products = [
    {
      id: 1,
      name: 'Hoodie Premium Noir',
      category: 'hoodies',
      price: 59.99,
      image: 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: true,
      isFavorite: false
    },
    {
      id: 2,
      name: 'T-shirt Blanc Essential',
      category: 'tshirts',
      price: 24.99,
      image: 'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: false,
      isFavorite: true
    },
    {
      id: 3,
      name: 'Baskets Urbaines',
      category: 'chaussures',
      price: 89.99,
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: true,
      isFavorite: false
    },
    {
      id: 4,
      name: 'Casquette Street Style',
      category: 'accessoires',
      price: 29.99,
      image: 'https://images.pexels.com/photos/6347892/pexels-photo-6347892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: false,
      isFavorite: false
    },
    {
      id: 5,
      name: 'Veste en Jean Oversize',
      category: 'vestes',
      price: 79.99,
      image: 'https://images.pexels.com/photos/6348105/pexels-photo-6348105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: false,
      isFavorite: true
    },
    {
      id: 6,
      name: 'Lunettes de Soleil Urban',
      category: 'accessoires',
      price: 49.99,
      image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: true,
      isFavorite: false
    },
    {
      id: 7,
      name: 'Pantalon Cargo Kaki',
      category: 'pantalons',
      price: 69.99,
      image: 'https://images.pexels.com/photos/10963353/pexels-photo-10963353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: false,
      isFavorite: false
    },
    {
      id: 8,
      name: 'Ensemble Streetwear Complet',
      category: 'ensembles',
      price: 129.99,
      image: 'https://images.pexels.com/photos/9604594/pexels-photo-9604594.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: true,
      isFavorite: false
    },
    {
      id: 9,
      name: 'Bonnet Streetwear Gris',
      category: 'accessoires',
      price: 19.99,
      image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: false,
      isFavorite: false
    },
    {
      id: 10,
      name: 'Sweater Oversize',
      category: 'hoodies',
      price: 49.99,
      image: 'https://images.pexels.com/photos/6347526/pexels-photo-6347526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: true, 
      isFavorite: true
    },
    {
      id: 11,
      name: 'Sac à Dos Urbain',
      category: 'accessoires',
      price: 59.99,
      image: 'https://images.pexels.com/photos/6046183/pexels-photo-6046183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: false,
      isFavorite: false
    },
    {
      id: 12,
      name: 'Jogging Confort Premium',
      category: 'pantalons',
      price: 54.99,
      image: 'https://images.pexels.com/photos/9775983/pexels-photo-9775983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      isNew: false,
      isFavorite: false
    }
  ];

  // Catégories pour les filtres
  const categories = [
    { id: 'all', name: 'Tous les produits' },
    { id: 'hoodies', name: 'Hoodies & Sweaters' },
    { id: 'tshirts', name: 'T-shirts' },
    { id: 'vestes', name: 'Vestes' },
    { id: 'pantalons', name: 'Pantalons' },
    { id: 'chaussures', name: 'Chaussures' },
    { id: 'accessoires', name: 'Accessoires' },
    { id: 'ensembles', name: 'Ensembles' }
  ];

  // Filtrer les produits selon la catégorie active et la recherche
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeFilter === 'all' || product.category === activeFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle favoris
  const toggleFavorite = (id) => {
    // Dans une vraie application, cela mettrait à jour un état ou enverrait une requête API
    console.log(`Toggle favorite for product ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent />
      
      {/* Header de la page */}
      <div className="pt-20 pb-6 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Album de Produits</h1>
          <p className="text-gray-300">Découvrez notre collection complète de vêtements et accessoires streetwear</p>
        </div>
      </div>
      
      {/* Filtres et recherche */}
      <div className="sticky top-16 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Bouton de filtre mobile */}
            <button 
              className="flex items-center gap-2 md:hidden px-4 py-2 bg-gray-100 rounded-lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filtres
              <ChevronDown size={18} />
            </button>
            
            {/* Filtres pour desktop */}
            <div className="hidden md:flex items-center gap-4 overflow-x-auto pb-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    activeFilter === category.id 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Barre de recherche */}
            <div className="w-full md:w-auto relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          
          {/* Filtres pour mobile */}
          {showFilters && (
            <div className="md:hidden mt-3 grid grid-cols-2 gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeFilter === category.id 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Grille de produits */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
              {/* Image container */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform group-hover:scale-105" 
                />
                
                {/* Badge "Nouveau" */}
                {product.isNew && (
                  <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded">
                    Nouveau
                  </div>
                )}
                
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100">
                    <Eye size={20} />
                  </button>
                  <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100">
                    <ShoppingBag size={20} />
                  </button>
                  <button 
                    className={`p-2 rounded-full ${
                      product.isFavorite 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart size={20} />
                  </button>
                </div>
              </div>
              
              {/* Info produit */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-1">Catégorie: {categories.find(c => c.id === product.category)?.name}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-900">{product.price.toFixed(2)} €</span>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    Détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Message si aucun produit trouvé */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucun produit trouvé pour cette recherche.</p>
            <button 
              className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
            >
              Voir tous les produits
            </button>
          </div>
        )}
    </div>
    </div>
  )}
  
export default AlbumPage;
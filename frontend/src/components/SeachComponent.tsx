import React, { useEffect, useState } from 'react';
import { InputIcon, Input } from 'keep-react';
import { MagnifyingGlass } from 'phosphor-react';
import { Drawer, DrawerAction, DrawerContent } from 'keep-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const ProductCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-72">
      <div className="relative w-full h-48 bg-gray-100">
        <img
          src={`http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/uploads/images/${item.image}`}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">Chaussure de basket</p>
        <p className="text-lg font-bold text-gray-900 mt-2">{item.price.toFixed(2)} €</p>
      </div>
    </div>
  );
};

const SearchComponent: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/product")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  }, []);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const limitedData = filteredData.slice(0, 4);
  const suggestionList = filteredData.slice(0, 5); // Limiter les suggestions affichées

  const handleSelectSuggestion = (name: string) => {
    setSearch(name);
    setShowSuggestions(false); // Cacher la liste après sélection
  };

  return (
    <Drawer>
      <DrawerAction asChild>
        <fieldset className="relative max-w-md">
          <Input 
            placeholder="Rechercher" 
            className="ps-11" 
            value={search} 
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
          />
          <InputIcon>
            <MagnifyingGlass size={19} color="#AFBACA" />
          </InputIcon>
        </fieldset>
      </DrawerAction>

      <DrawerContent position="top" style={{ paddingBottom: '450px' }}>
        <div className="p-5">
          {/* Barre de recherche */}
          <div className="text-center mb-8">
            <fieldset className="relative max-w-md mx-auto">
              <Input
                type="text"
                className="ps-11"
                placeholder="Rechercher"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
              />
              <InputIcon>
                <MagnifyingGlass size={19} color="#AFBACA" />
              </InputIcon>
            </fieldset>
          </div>

          {/* Conteneur aligné */}
          <div className="flex justify-between items-start gap-6">
            {/* Colonne gauche : Meilleures suggestions + Liste des suggestions */}
            <div className="flex flex-col w-1/4">
              <p className="text-gray-600 text-sm font-semibold">
                Meilleures suggestions
              </p>

              {showSuggestions && search.length > 0 && (
                <ul className="mt-2 bg-white shadow-md rounded-lg border border-gray-200">
                  {suggestionList.map((item) => (
                    <li
                      key={item.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectSuggestion(item.name)}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Colonne droite : Cartes produits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-3/4">
              {limitedData.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchComponent;

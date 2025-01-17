import React, { useEffect, useState } from 'react';
import { InputIcon, Input } from 'keep-react';
import { MagnifyingGlass } from 'phosphor-react';
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from 'keep-react';
import "../index.css";

// Définir un type pour les données du produit
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const DataList: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetch("http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/back/product")
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

  // Limiter le nombre de cartes affichées à 4
  const limitedData = filteredData.slice(0, 4);

  return (
    <div style={{padding: "20px" }}>
      {/* Barre de recherche */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <fieldset className="relative max-w-md mx-auto">
          <Input
            type="text"
            className="ps-11"
            placeholder="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputIcon>
            <MagnifyingGlass size={19} color="#AFBACA" />
          </InputIcon>
        </fieldset>
      </div>
      {/* Liste des produits */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px", // Espacement légèrement augmenté entre les cartes
          justifyContent: "center",
        }}
      >
        {limitedData.map((item) => (
          <Card
  key={item.id}
  style={{
    width: "240px",
    height: "320px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}
>
  <CardHeader style={{ height: "160px", overflow: "hidden" }}>
    <img
      src={`http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/uploads/images/${item.image}`}
      alt={item.name}
      style={{
        width: "100%", // Prend toute la largeur du conteneur
        height: "100%", // Prend toute la hauteur du conteneur
        objectFit: "cover", // Remplir l'espace sans déformer
      }}
    />
  </CardHeader>
  <CardContent
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "10px",
      height: "160px",
    }}
  >
    <CardTitle
      style={{
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
        textAlign: "left",
        marginBottom: "8px",
      }}
    >
      {item.name}
    </CardTitle>
    <CardDescription
      style={{
        fontSize: "14px",
        color: "#666",
        textAlign: "left",
        marginBottom: "8px",
        height: "50px",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {item.description}
    </CardDescription>
    <CardDescription
      style={{
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
        textAlign: "left",
      }}
    >
      {item.price.toFixed(2)} €
    </CardDescription>
  </CardContent>
</Card>

        ))}
      </div>
    </div>
  );
};

export default DataList;

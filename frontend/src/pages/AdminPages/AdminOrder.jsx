// src/pages/AdminPages/AdminOrder.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { 
 Search, 
 X,
 ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminOrder = () => {
 const navigate = useNavigate();
 const { user } = useAuth();
 const [orders, setOrders] = useState([]);
 const [error, setError] = useState(null);
 const [search, setSearch] = useState('');
 const [sortBy, setSortBy] = useState('default');

 const parseArticles = (articleString) => {
   if (!articleString) return [];
   try {
     const articles = articleString.split(';').map(article => {
       const [quantity, name, size] = article.split(',');
       return {
         quantity: quantity?.trim() || '',
         name: name?.trim() || '',
         size: size?.trim() || ''
       };
     });
     return articles;
   } catch (error) {
     console.error('Erreur lors du parsing des articles:', error);
     return [];
   }
 };

 useEffect(() => {
   // Vérification du rôle admin
   if (!user || !user.roles || !user.roles.includes('ROLE_ADMIN')) {
     navigate('/');
     return;
   }

   // Récupération des commandes
   fetch("http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/orders")
     .then((response) => {
       if (!response.ok) throw new Error(`Erreur HTTP ! statut : ${response.status}`);
       return response.json();
     })
     .then(setOrders)
     .catch((error) => setError(error.message));
 }, [user, navigate]);

 const filteredOrders = orders
   .filter(order => 
     order.nom.toLowerCase().includes(search.toLowerCase()) ||
     order.prenom.toLowerCase().includes(search.toLowerCase()) ||
     order.email.toLowerCase().includes(search.toLowerCase())
   )
   .sort((a, b) => {
     switch(sortBy) {
       case 'dateDesc': return new Date(b.date_commande) - new Date(a.date_commande);
       case 'dateAsc': return new Date(a.date_commande) - new Date(b.date_commande);
       case 'priceAsc': return parseFloat(a.price) - parseFloat(b.price);
       case 'priceDesc': return parseFloat(b.price) - parseFloat(a.price);
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
          <AdminNavbar />
     <div className="container mx-auto px-4">
       {/* Header Section */}
       <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <h1 className="text-3xl font-bold text-gray-800">Gestion des Commandes</h1>

           <div className="flex flex-wrap items-center gap-4">
             {/* Search Bar */}
             <div className="relative">
               <input 
                 type="text"
                 placeholder="Rechercher une commande..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 w-full md:w-64"
               />
               <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
             </div>

             {/* Sort Dropdown */}
             <div className="relative">
               <select 
                 onChange={(e) => setSortBy(e.target.value)}
                 className="appearance-none bg-gray-50 border border-gray-200 rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-200"
               >
                 <option value="default">Trier par défaut</option>
                 <option value="dateDesc">Date (plus récent)</option>
                 <option value="dateAsc">Date (plus ancien)</option>
                 <option value="priceAsc">Prix croissant</option>
                 <option value="priceDesc">Prix décroissant</option>
               </select>
               <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={20} />
             </div>
           </div>
         </div>
       </div>

       {/* Orders Table */}
       <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Nom</th>
                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Prénom</th>
                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Adresse</th>
                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Quantité</th>
                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Article</th>
                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Taille</th>
                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Prix</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-200">
               {filteredOrders.map((order) => (
                 <tr key={order.id} className="hover:bg-gray-50">
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-900">
                       {new Date(order.date_commande).toLocaleDateString()}
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm font-medium text-gray-900">{order.nom}</div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-900">{order.prenom}</div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-900">{order.email}</div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="text-sm text-gray-500 line-clamp-2">{order.address}</div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="space-y-2">
                       {parseArticles(order.article).map((article, index) => (
                         <div key={index} className="text-sm text-gray-900 border-b border-gray-100 last:border-0 py-1">
                           {article.quantity}
                         </div>
                       ))}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="space-y-2">
                       {parseArticles(order.article).map((article, index) => (
                         <div key={index} className="text-sm text-gray-900 border-b border-gray-100 last:border-0 py-1">
                           {article.name}
                         </div>
                       ))}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="space-y-2">
                       {parseArticles(order.article).map((article, index) => (
                         <div key={index} className="text-sm text-gray-900 border-b border-gray-100 last:border-0 py-1">
                           {article.size}
                         </div>
                       ))}
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm font-medium text-gray-900">
                       {parseFloat(order.price).toFixed(2)} €
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>

       {/* Empty State */}
       {filteredOrders.length === 0 && (
         <div className="bg-white rounded-2xl shadow-lg p-12 text-center mt-8">
           <Search className="mx-auto text-gray-400 mb-4" size={48} />
           <h2 className="text-2xl font-bold text-gray-800 mb-2">
             Aucune commande trouvée
           </h2>
           <p className="text-gray-600">
             Essayez de modifier vos critères de recherche
           </p>
         </div>
       )}
     </div>
   </div>
 );
};

export default AdminOrder;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, ArrowLeft, Upload } from 'lucide-react';
import AdminNavbar from '../../components/AdminNavbar';
import { useAuth } from './../../context/AuthContext';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const CreateProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [labelsEcologiques, setLabelsEcologiques] = useState([]);
  const [imagePreview, setImagePreview] = useState({
    image1: null,
    image2: null,
    image3: null
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    sizes: [],
    image: null,
    image2: null,
    image3: null,
    ecoScore: '',
    labelEcologique: ''
  });

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const ecoScoreOptions = ['A', 'B', 'C', 'D', 'E'];

  useEffect(() => {
    if (!user || !user.roles.includes('ROLE_ADMIN')) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/category', {
          headers: {
            'X-API-TOKEN': API_TOKEN
          }
        });
        if (!response.ok) throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    const fetchLabelsEcologiques = async () => {
      try {
        const response = await fetch('http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/labelecologique', {
          headers: {
            'X-API-TOKEN': API_TOKEN
          }
        });
        if (!response.ok) throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        const data = await response.json();
        setLabelsEcologiques(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des labels écologiques:', error);
      }
    };

    fetchCategories();
    fetchLabelsEcologiques();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageChange = (e, imageNumber) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [imageNumber]: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => ({
          ...prev,
          [imageNumber === 'image' ? 'image1' : imageNumber]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.name || !formData.description || !formData.price || !formData.stock || formData.sizes.length === 0 || !formData.category) {
        throw new Error('Veuillez remplir tous les champs obligatoires, sélectionner une catégorie et au moins une taille');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('category', formData.category);
      formData.sizes.forEach((size, index) => {
        formDataToSend.append(`sizes[${index}]`, size);
      });

      // Ajout des nouvelles données environnementales
      if (formData.ecoScore) formDataToSend.append('ecoScore', formData.ecoScore);
      if (formData.labelEcologique) formDataToSend.append('labelEcologique', formData.labelEcologique);

      if (formData.image) formDataToSend.append('image', formData.image);
      if (formData.image2) formDataToSend.append('image2', formData.image2);
      if (formData.image3) formDataToSend.append('image3', formData.image3);

      const response = await fetch(
        'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/create-product',
        {
          method: 'POST',
          body: formDataToSend,
          headers: {
            'X-API-TOKEN': API_TOKEN
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du produit');
      }

      setSuccess('Produit créé avec succès');
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);

    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError(error.message || 'Une erreur est survenue lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <X className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/admin/products')}
            className="mt-4 inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="text-green-500 mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Succès</h2>
          <p className="text-gray-600">{success}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <AdminNavbar />
      <br /><br />
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/products')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Créer un nouveau produit</h1>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images du produit</label>
              <div className="flex flex-wrap gap-4">
                {['image1', 'image2', 'image3'].map((imgKey, idx) => (
                  <div key={imgKey}>
                    <div className="relative h-32 w-32 bg-gray-100 rounded-xl overflow-hidden">
                      {imagePreview[imgKey] ? (
                        <img src={imagePreview[imgKey]} alt={`Aperçu ${idx + 1}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-100">
                          <Upload className="text-gray-400" size={24} />
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <input
                        type="file"
                        id={imgKey}
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, imgKey === 'image1' ? 'image' : imgKey)}
                        className="hidden"
                      />
                      <label htmlFor={imgKey} className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors duration-300 cursor-pointer">
                        <Upload size={20} />
                        {`Image ${idx + 1}`}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" required />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" required />
            </div>

            {/* Prix */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Prix (€)</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} step="0.01" min="0" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" required />
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">Stock disponible</label>
              <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleInputChange} min="0" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" required />
            </div>

            {/* Catégorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" required>
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name_category}>
                    {cat.name_category}
                  </option>
                ))}
              </select>
            </div>

            {/* EcoScore */}
            <div>
              <label htmlFor="ecoScore" className="block text-sm font-medium text-gray-700 mb-2">EcoScore</label>
              <select id="ecoScore" name="ecoScore" value={formData.ecoScore} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                <option value="">Sélectionner un EcoScore</option>
                {ecoScoreOptions.map((score) => (
                  <option key={score} value={score}>
                    {score}
                  </option>
                ))}
              </select>
            </div>

            {/* Label Écologique */}
            <div>
              <label htmlFor="labelEcologique" className="block text-sm font-medium text-gray-700 mb-2">Label écologique</label>
              <select id="labelEcologique" name="labelEcologique" value={formData.labelEcologique} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                <option value="">Sélectionner un label écologique</option>
                {labelsEcologiques.map((label) => (
                  <option key={label.id} value={label.label}>
                    {label.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tailles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tailles disponibles</label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button key={size} type="button" onClick={() => handleSizeToggle(size)} className={`px-4 py-2 rounded-xl text-sm font-medium ${formData.sizes.includes(size) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
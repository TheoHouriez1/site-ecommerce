import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save,
  X,
  ArrowLeft,
  Upload,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState({
    image1: null,
    image2: null,
    image3: null
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sizes: [],
    image: null,
    image2: null,
    image3: null
  });

  // Vérification des permissions admin
  useEffect(() => {
    if (!user || !user.roles || !user.roles.includes('ROLE_ADMIN')) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

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
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('sizes', JSON.stringify(formData.sizes));
      if (formData.image) formDataToSend.append('image', formData.image);
      if (formData.image2) formDataToSend.append('image2', formData.image2);
      if (formData.image3) formDataToSend.append('image3', formData.image3);

      const response = await fetch(
        'http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/api/create-product', 
        {
          method: 'POST',
          body: formDataToSend
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      setSuccess('Produit créé avec succès');
      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);
      
    } catch (error) {
      setError(error.message);
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
      <div className="container mx-auto px-4">
        {/* Header */}
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

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images du produit
              </label>
              <div className="flex flex-wrap gap-4">
                {/* Image 1 */}
                <div>
                  <div className="relative h-32 w-32 bg-gray-100 rounded-xl overflow-hidden">
                    {imagePreview.image1 ? (
                      <img
                        src={imagePreview.image1}
                        alt="Aperçu 1"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-100">
                        <Upload className="text-gray-400" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="image1"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'image')}
                      className="hidden"
                    />
                    <label
                      htmlFor="image1"
                      className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
                    >
                      <Upload size={20} />
                      Image 1
                    </label>
                  </div>
                </div>

                {/* Image 2 */}
                <div>
                  <div className="relative h-32 w-32 bg-gray-100 rounded-xl overflow-hidden">
                    {imagePreview.image2 ? (
                      <img
                        src={imagePreview.image2}
                        alt="Aperçu 2"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-100">
                        <Upload className="text-gray-400" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="image2"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'image2')}
                      className="hidden"
                    />
                    <label
                      htmlFor="image2"
                      className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
                    >
                      <Upload size={20} />
                      Image 2
                    </label>
                  </div>
                </div>

                {/* Image 3 */}
                <div>
                  <div className="relative h-32 w-32 bg-gray-100 rounded-xl overflow-hidden">
                    {imagePreview.image3 ? (
                      <img
                        src={imagePreview.image3}
                        alt="Aperçu 3"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-100">
                        <Upload className="text-gray-400" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="image3"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'image3')}
                      className="hidden"
                    />
                    <label
                      htmlFor="image3"
                      className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
                    >
                      <Upload size={20} />
                      Image 3
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
              />
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tailles disponibles
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${
                      formData.sizes.includes(size)
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
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
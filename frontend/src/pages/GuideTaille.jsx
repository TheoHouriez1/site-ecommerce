import React, { useState, useEffect } from 'react';
import FooterComponent from '../components/FooterComponent';
import CookieConsentComponent from '../components/CookieConsentComponent';
import { 
  Ruler, 
  Shirt, 
  UserRoundSearch, 
  Footprints, 
  ChevronDown, 
  ChevronUp, 
  Mars, 
  Venus, 
  Info,
  ArrowRight,
  Search,
  Check
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const GuideTaille = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('hauts');
  const [activeGender, setActiveGender] = useState('hommes');
  const [openAccordion, setOpenAccordion] = useState('comment-mesurer');
  const [searchQuery, setSearchQuery] = useState('');

  const measurementGuides = {
    hauts: {
      title: "Comment mesurer pour les hauts",
      steps: [
        {
          id: 1,
          title: "Poitrine",
          description: "Mesurez horizontalement à l'endroit le plus fort de votre poitrine, en passant sous les aisselles.",
          image: "/uploads/measure-chest.jpg"
        },
        {
          id: 2,
          title: "Taille",
          description: "Mesurez autour de votre taille naturelle, à l'endroit le plus étroit.",
          image: "/uploads/measure-waist.jpg"
        },
        {
          id: 3,
          title: "Hanches",
          description: "Mesurez autour de la partie la plus large de vos hanches.",
          image: "/uploads/measure-hips.jpg"
        }
      ]
    },
    bas: {
      title: "Comment mesurer pour les bas",
      steps: [
        {
          id: 1,
          title: "Tour de taille",
          description: "Mesurez votre tour de taille naturel en maintenant le mètre ruban légèrement serré.",
          image: "/uploads/measure-waist-UserRoundSearch.jpg"
        },
        {
          id: 2,
          title: "Entrejambe",
          description: "Mesurez de l'entrejambe jusqu'au bas de la jambe. Pour cela, vous pouvez mesurer un pantalon qui vous va bien.",
          image: "/uploads/measure-inseam.jpg"
        },
        {
          id: 3,
          title: "Tour de hanches",
          description: "Mesurez autour de la partie la plus large de vos hanches et fesses.",
          image: "/uploads/measure-hips-UserRoundSearch.jpg"
        }
      ]
    },
    chaussures: {
      title: "Comment mesurer pour les chaussures",
      steps: [
        {
          id: 1,
          title: "Longueur du pied",
          description: "Placez votre pied sur une feuille de papier et tracez le contour. Mesurez la distance entre le talon et l'orteil le plus long.",
          image: "/uploads/measure-foot-length.jpg"
        },
        {
          id: 2,
          title: "Largeur du pied",
          description: "Mesurez la partie la plus large de votre pied.",
          image: "/uploads/measure-foot-width.jpg"
        }
      ]
    }
  };

  const sizeCharts = {
    hauts: {
      hommes: [
        { taille: "XS", poitrine: "86-91", taille: "71-76", epaules: "40-42" },
        { taille: "S", poitrine: "91-97", taille: "76-81", epaules: "42-44" },
        { taille: "M", poitrine: "97-102", taille: "81-86", epaules: "44-46" },
        { taille: "L", poitrine: "102-107", taille: "86-91", epaules: "46-48" },
        { taille: "XL", poitrine: "107-112", taille: "91-97", epaules: "48-50" },
        { taille: "XXL", poitrine: "112-117", taille: "97-102", epaules: "50-52" }
      ],
      femmes: [
        { taille: "XS", poitrine: "81-86", taille: "61-66", epaules: "37-39" },
        { taille: "S", poitrine: "86-91", taille: "66-71", epaules: "39-41" },
        { taille: "M", poitrine: "91-97", taille: "71-76", epaules: "41-43" },
        { taille: "L", poitrine: "97-102", taille: "76-81", epaules: "43-45" },
        { taille: "XL", poitrine: "102-107", taille: "81-86", epaules: "45-47" },
        { taille: "XXL", poitrine: "107-112", taille: "86-91", epaules: "47-49" }
      ]
    },
    bas: {
      hommes: [
        { taille: "XS (28)", waist: "71-76", hanches: "86-91", entrejambe: "76-79" },
        { taille: "S (30)", waist: "76-81", hanches: "91-97", entrejambe: "79-81" },
        { taille: "M (32)", waist: "81-86", hanches: "97-102", entrejambe: "81-84" },
        { taille: "L (34)", waist: "86-91", hanches: "102-107", entrejambe: "84-86" },
        { taille: "XL (36)", waist: "91-97", hanches: "107-112", entrejambe: "86-89" },
        { taille: "XXL (38)", waist: "97-102", hanches: "112-117", entrejambe: "89-91" }
      ],
      femmes: [
        { taille: "XS (26)", waist: "61-66", hanches: "86-91", entrejambe: "76-78" },
        { taille: "S (28)", waist: "66-71", hanches: "91-97", entrejambe: "78-81" },
        { taille: "M (30)", waist: "71-76", hanches: "97-102", entrejambe: "81-84" },
        { taille: "L (32)", waist: "76-81", hanches: "102-107", entrejambe: "84-86" },
        { taille: "XL (34)", waist: "81-86", hanches: "107-112", entrejambe: "86-89" },
        { taille: "XXL (36)", waist: "86-91", hanches: "112-117", entrejambe: "89-91" }
      ]
    },
    chaussures: {
      hommes: [
        { eu: "39", uk: "6", us: "6.5", cm: "24.5" },
        { eu: "40", uk: "6.5", us: "7", cm: "25" },
        { eu: "41", uk: "7", us: "8", cm: "25.5" },
        { eu: "42", uk: "8", us: "8.5", cm: "26.5" },
        { eu: "43", uk: "9", us: "9.5", cm: "27.5" },
        { eu: "44", uk: "9.5", us: "10", cm: "28" },
        { eu: "45", uk: "10.5", us: "11", cm: "29" },
        { eu: "46", uk: "11", us: "12", cm: "30" }
      ],
      femmes: [
        { eu: "35", uk: "3", us: "5", cm: "22" },
        { eu: "36", uk: "3.5", us: "5.5", cm: "22.5" },
        { eu: "37", uk: "4", us: "6", cm: "23.5" },
        { eu: "38", uk: "5", us: "7", cm: "24" },
        { eu: "39", uk: "6", us: "8", cm: "25" },
        { eu: "40", uk: "6.5", us: "9", cm: "25.5" },
        { eu: "41", uk: "7", us: "9.5", cm: "26" },
        { eu: "42", uk: "8", us: "10", cm: "27" }
      ]
    }
  };

  const filteredSizeChart = () => {
    if (!searchQuery) return sizeCharts[activeCategory][activeGender];
    
    return sizeCharts[activeCategory][activeGender].filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return Object.values(item).some(
        value => value.toString().toLowerCase().includes(searchLower)
      );
    });
  };

  const faqs = [
    {
      id: "entre-deux-tailles",
      question: "Je suis entre deux tailles, que faire ?",
      answer: "Si vous êtes entre deux tailles, nous recommandons généralement de prendre la taille supérieure. Pour les vêtements plus ajustés comme les jeans, prenez votre taille habituelle. Pour les hauts et sweats, si vous préférez un style oversized, n'hésitez pas à prendre une taille au-dessus.",
    },
    {
      id: "tailles-differentes",
      question: "Les tailles varient-elles selon les collections ?",
      answer: "Les tailles peuvent légèrement varier selon les collections et les matières utilisées. mais reste toujours similaire au autre collection.",
    },
    {
      id: "retrecissement",
      question: "Les vêtements rétrécissent-ils au lavage ?",
      answer: "Nos vêtements sont prélavés pour minimiser le rétrécissement. Cependant, pour préserver la qualité de vos articles, nous recommandons de suivre les instructions d'entretien sur l'étiquette. En général, lavez à 30°C et évitez le sèche-linge pour les tissus délicats.",
    },
  ];

  const conversionHelper = {
    international: {
      tops: {
        fr: ["XS", "S", "M", "L", "XL", "XXL"],
        us: ["XS", "S", "M", "L", "XL", "XXL"],
        uk: ["6", "8", "10", "12", "14", "16"],
        it: ["38", "40", "42", "44", "46", "48"],
        eu: ["32", "34", "36", "38", "40", "42"]
      },
      bottoms: {
        fr: ["34", "36", "38", "40", "42", "44"],
        us: ["0", "2", "4", "6", "8", "10"],
        uk: ["6", "8", "10", "12", "14", "16"],
        it: ["38", "40", "42", "44", "46", "48"],
        eu: ["32", "34", "36", "38", "40", "42"]
      }
    }
  };

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black transition-colors">
              Accueil
            </button>
            <span>/</span>
            <span className="text-black font-medium">Guide des tailles</span>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="pt-8 pb-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 md:h-64 bg-black">
              {/* Background image */}
              
              {/* Hero Text */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Guide des Tailles
                </h1>
                <p className="text-sm md:text-xl text-white max-w-xl">
                  Trouvez votre taille parfaite pour nos collections streetwear
                </p>
              </div>
            </div>
            
            {/* Category Navigation */}
            <div className="p-4 border-b">
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setActiveCategory('hauts')}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    activeCategory === 'hauts' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Shirt size={18} />
                  <span>Hauts</span>
                </button>
                
                <button
                  onClick={() => setActiveCategory('bas')}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    activeCategory === 'bas' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <UserRoundSearch size={18} />
                  <span>Bas</span>
                </button>
                
                <button
                  onClick={() => setActiveCategory('chaussures')}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    activeCategory === 'chaussures' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Footprints size={18} />
                  <span>Chaussures</span>
                </button>
              </div>
            </div>
            
            {/* Gender Select */}
            <div className="p-4 border-b">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setActiveGender('hommes')}
                  className={`px-6 py-2 rounded-full flex items-center gap-2 ${
                    activeGender === 'hommes' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Mars size={18} />
                  <span>Hommes</span>
                </button>
                
                <button
                  onClick={() => setActiveGender('femmes')}
                  className={`px-6 py-2 rounded-full flex items-center gap-2 ${
                    activeGender === 'femmes' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Venus size={18} />
                  <span>Femmes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - How to Measure */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div 
                className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleAccordion('comment-mesurer')}
              >
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Ruler size={20} />
                  Comment se mesurer
                </h3>
                <div>
                  <ChevronDown size={20} />
                </div>
              </div>
              
              {openAccordion === 'comment-mesurer' && (
                <div className="overflow-hidden">
                  <div className="p-4">
                    <h4 className="font-medium mb-4">{measurementGuides[activeCategory].title}</h4>
                    
                    {measurementGuides[activeCategory].steps.map((step) => (
                      <div key={step.id} className="mb-4 last:mb-0">
                        <div className="flex items-start gap-4">
                          <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="font-bold text-gray-700">{step.id}</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{step.title}</h5>
                            <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                            
                            <div className="mt-3 bg-gray-100 rounded-lg overflow-hidden">
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-2">
                        <Info size={18} className="text-black flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-700">
                          Utilisez un mètre ruban souple et tenez-vous droit mais détendu pour des mesures précises.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* FAQs Accordion */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-100 p-4">
                <h3 className="text-lg font-medium">Questions fréquentes</h3>
              </div>
              
              <div className="divide-y">
                {faqs.map((faq) => (
                  <div key={faq.id}>
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleAccordion(faq.id)}
                    >
                      <h4 className="font-medium">{faq.question}</h4>
                      <div>
                        <ChevronDown size={18} />
                      </div>
                    </div>
                    
                    {openAccordion === faq.id && (
                      <div className="overflow-hidden">
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 text-sm">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Contact for more help */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-700">
                    Besoin d'aide supplémentaire avec votre taille ?
                  </p>
                </div>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full px-4 py-2 bg-black text-white rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  Contacter le service client
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Size Charts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-4 bg-black text-white">
                <h2 className="text-xl font-medium flex items-center gap-2">
                  {activeCategory === 'hauts' && <Shirt size={20} />}
                  {activeCategory === 'bas' && <UserRoundSearch size={20} />}
                  {activeCategory === 'chaussures' && <Footprints size={20} />}
                  Guide des tailles {activeCategory} {activeGender}
                </h2>
              </div>
              
              {/* Search for specific size */}
              <div className="p-4 border-b">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une taille..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Size Chart Table */}
              <div className="p-4 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      {activeCategory === 'hauts' && (
                        <>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Taille</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Poitrine (cm)</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Tour de taille (cm)</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Épaules (cm)</th>
                        </>
                      )}
                      
                      {activeCategory === 'bas' && (
                        <>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Taille</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Tour de taille (cm)</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Tour de hanches (cm)</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Entrejambe (cm)</th>
                        </>
                      )}
                      
                      {activeCategory === 'chaussures' && (
                        <>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">EU</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">UK</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">US</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-700">Longueur (cm)</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSizeChart().map((item, index) => (
                      <tr 
                        key={index}
                        className="border-b hover:bg-gray-50"
                      >
                        {activeCategory === 'hauts' && (
                          <>
                            <td className="py-3 px-4 font-medium">{item.taille}</td>
                            <td className="py-3 px-4">{item.poitrine}</td>
                            <td className="py-3 px-4">{item.taille}</td>
                            <td className="py-3 px-4">{item.epaules}</td>
                            </>
                        )}
                        
                        {activeCategory === 'bas' && (
                          <>
                            <td className="py-3 px-4 font-medium">{item.taille}</td>
                            <td className="py-3 px-4">{item.waist}</td>
                            <td className="py-3 px-4">{item.hanches}</td>
                            <td className="py-3 px-4">{item.entrejambe}</td>
                          </>
                        )}
                        
                        {activeCategory === 'chaussures' && (
                          <>
                            <td className="py-3 px-4 font-medium">{item.eu}</td>
                            <td className="py-3 px-4">{item.uk}</td>
                            <td className="py-3 px-4">{item.us}</td>
                            <td className="py-3 px-4">{item.cm}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredSizeChart().length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500">Aucun résultat trouvé pour "{searchQuery}"</p>
                  </div>
                )}
              </div>
              
              {/* Size Chart Note */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex items-start gap-2">
                  <Info size={18} className="text-gray-700 flex-shrink-0 mt-1" />
                  <p className="text-sm text-gray-600">
                    Toutes les mesures sont indiquées en centimètres. Pour un meilleur confort, il est recommandé de prendre vos mesures par-dessus des sous-vêtements légers.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Perfect Fit Tips */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-100">
                <h3 className="text-lg font-medium">Conseils pour un ajustement parfait</h3>
              </div>
              
              <div className="p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Check size={18} className="text-green-600" />
                      Pour les t-shirts et sweats
                    </h4>
                    <p className="text-sm text-gray-600">
                      Si vous êtes entre deux tailles ou préférez un style oversize, optez pour la taille supérieure.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Check size={18} className="text-green-600" />
                      Pour les pantalons et jeans
                    </h4>
                    <p className="text-sm text-gray-600">
                      La taille du vêtement doit correspondre à votre tour de taille naturel. Vérifiez également la longueur de l'entrejambe.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Check size={18} className="text-green-600" />
                      Pour les chaussures
                    </h4>
                    <p className="text-sm text-gray-600">
                      Mesurez votre pied en fin de journée quand il est légèrement plus grand. Assurez-vous d'avoir environ 0,5 cm d'espace à l'avant.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Check size={18} className="text-green-600" />
                      En cas de doute
                    </h4>
                    <p className="text-sm text-gray-600">
                      Consultez les avis des clients pour chaque produit ou contactez notre service client qui sera ravi de vous aider.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <FooterComponent />
      <CookieConsentComponent />
    </div>
  );
};

export default GuideTaille;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  ShoppingBag, 
  Truck, 
  RefreshCw, 
  CreditCard,
  User,
  Shield,
  Mail,
  ChevronDown,
  Search
} from 'lucide-react';
import NavbarComponent from '../components/NavBarComponents';

const FAQPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // État pour les questions/réponses déroulantes
  const [expandedQuestions, setExpandedQuestions] = useState({});
  
  const toggleQuestion = (id) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Catégories de questions
  const categories = [
    { id: 'all', name: 'Toutes', icon: HelpCircle },
    { id: 'orders', name: 'Commandes', icon: ShoppingBag },
    { id: 'shipping', name: 'Livraison', icon: Truck },
    { id: 'returns', name: 'Retours', icon: RefreshCw },
    { id: 'payment', name: 'Paiement', icon: CreditCard },
    { id: 'account', name: 'Compte', icon: User }
  ];
  
  // Questions fréquemment posées
  const faqs = [
    {
      id: 'q1',
      category: 'orders',
      question: 'Comment puis-je suivre ma commande ?',
      answer: 'Une fois votre commande expédiée, vous recevrez un e-mail contenant un numéro de suivi. Vous pouvez utiliser ce numéro sur notre site dans la section "Mes commandes" après vous être connecté à votre compte. Vous pouvez également suivre votre colis directement sur le site du transporteur en utilisant le même numéro.'
    },
    {
      id: 'q2',
      category: 'orders',
      question: 'Puis-je modifier ou annuler ma commande ?',
      answer: 'Vous pouvez modifier ou annuler votre commande uniquement si elle n\'a pas encore été expédiée. Pour ce faire, connectez-vous à votre compte, accédez à "Mes commandes", sélectionnez la commande concernée et cliquez sur "Modifier" ou "Annuler". Si l\'option n\'est pas disponible, cela signifie que votre commande a déjà été traitée et vous devrez procéder à un retour après réception.'
    },
    {
      id: 'q3',
      category: 'shipping',
      question: 'Quels sont les délais de livraison ?',
      answer: 'Nos délais de livraison varient selon votre localisation :\n- France métropolitaine : 2-3 jours ouvrés\n- Europe : 3-5 jours ouvrés\n- International : 5-10 jours ouvrés\nVeuillez noter que ces délais sont estimatifs et peuvent varier en période de forte affluence ou en cas d\'événements exceptionnels.'
    },
    {
      id: 'q4',
      category: 'shipping',
      question: 'La livraison est-elle gratuite ?',
      answer: 'La livraison est gratuite pour toute commande supérieure à 50€ en France métropolitaine. Pour les commandes inférieures à ce montant, des frais de livraison de 4,95€ sont appliqués. Pour l\'Europe et l\'international, les frais de livraison sont calculés en fonction du poids et de la destination lors du processus de commande.'
    },
    {
      id: 'q5',
      category: 'returns',
      question: 'Comment retourner un article ?',
      answer: 'Pour retourner un article, suivez ces étapes simples :\n1. Connectez-vous à votre compte\n2. Accédez à "Mes commandes"\n3. Sélectionnez la commande et cliquez sur "Retourner"\n4. Sélectionnez les articles à retourner et la raison du retour\n5. Imprimez l\'étiquette de retour prépayée\n6. Emballez soigneusement les articles avec l\'étiquette\n7. Déposez le colis dans un point relais\nVous serez remboursé dans les 14 jours suivant la réception de votre retour.'
    },
    {
      id: 'q6',
      category: 'returns',
      question: 'Quelle est votre politique de retour ?',
      answer: 'Vous disposez de 30 jours à compter de la date de réception pour retourner un article. Les articles doivent être retournés dans leur état d\'origine, non portés, non lavés, avec toutes les étiquettes attachées et dans leur emballage d\'origine. Les articles personnalisés, les sous-vêtements et les articles soldés ne peuvent pas être retournés pour des raisons d\'hygiène et de réglementation, sauf en cas de défaut.'
    },
    {
      id: 'q7',
      category: 'payment',
      question: 'Quels modes de paiement acceptez-vous ?',
      answer: 'Nous acceptons les modes de paiement suivants :\n- Cartes de crédit (Visa, Mastercard, American Express)\n- PayPal\n- Apple Pay\n- Google Pay\n- Virement bancaire (pour les commandes supérieures à 200€)\nToutes les transactions sont sécurisées et vos informations de paiement sont chiffrées.'
    },
    {
      id: 'q8',
      category: 'payment',
      question: 'Proposez-vous le paiement en plusieurs fois ?',
      answer: 'Oui, nous proposons le paiement en 3 ou 4 fois sans frais pour les commandes supérieures à 100€. Cette option est disponible avec les cartes de crédit éligibles et notre partenaire de financement. Vous verrez cette option lors du processus de paiement si votre commande est éligible.'
    },
    {
      id: 'q9',
      category: 'account',
      question: 'Comment créer un compte ?',
      answer: 'Pour créer un compte, cliquez sur l\'icône utilisateur en haut à droite de notre site, puis sélectionnez "Inscription". Remplissez le formulaire avec vos informations personnelles et créez un mot de passe. Vous recevrez un e-mail de confirmation pour activer votre compte. Une fois activé, vous pourrez vous connecter, suivre vos commandes et bénéficier de nos offres exclusives.'
    },
    {
      id: 'q10',
      category: 'account',
      question: 'Comment réinitialiser mon mot de passe ?',
      answer: 'Si vous avez oublié votre mot de passe, cliquez sur "Connexion", puis sur "Mot de passe oublié ?". Entrez l\'adresse e-mail associée à votre compte et nous vous enverrons un lien pour réinitialiser votre mot de passe. Ce lien est valable pendant 24 heures. Si vous ne recevez pas l\'e-mail, vérifiez votre dossier de spam ou contactez notre service client.'
    }
  ];
  
  // Filtrer les FAQs en fonction de la catégorie et de la recherche
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <NavbarComponent />
      <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Foire Aux Questions</h1>
          <p className="text-gray-600 mb-8">
            Trouvez rapidement des réponses à vos questions concernant notre boutique.
          </p>
          
          {/* Barre de recherche */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher une question..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-colors duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Catégories */}
          <div className="flex overflow-x-auto pb-2 mb-8 gap-2 md:gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 p-3 rounded-lg flex-shrink-0 transition-colors duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="whitespace-nowrap">{category.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Liste des questions */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(faq.id)}
                    className="flex items-center justify-between w-full p-5 text-left focus:outline-none"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-gray-600 transition-transform duration-300 ${
                        expandedQuestions[faq.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      expandedQuestions[faq.id]
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-5 pt-0 border-t border-gray-100">
                      <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <HelpCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-600">
                  Nous n'avons pas trouvé de réponse correspondant à votre recherche. Essayez de reformuler ou contactez-nous directement.
                </p>
                <button
                  className="mt-4 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                  onClick={() => navigate('/contact')}
                >
                  Contacter le support
                </button>
              </div>
            )}
          </div>
          
          {/* Besoin d'aide supplémentaire */}
          <div className="bg-gray-800 text-white rounded-xl shadow-md p-6 mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">Besoin d'aide supplémentaire ?</h3>
                <p className="text-gray-300">
                  Notre équipe de support client est là pour vous aider.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="bg-white text-gray-800 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  onClick={() => navigate('/contact')}
                >
                  <Mail size={18} className="mr-2" />
                  Nous contacter
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2025 Shop Théo - Tous droits réservés (Projet scolaire)
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/terms')}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300"
              >
                Conditions d'utilisation
              </button>
              <button 
                onClick={() => navigate('/privacy')}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300"
              >
                Politique de confidentialité
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
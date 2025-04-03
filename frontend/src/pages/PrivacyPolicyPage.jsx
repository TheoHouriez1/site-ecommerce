import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Cookie, User, Database, Eye, Bell, HelpCircle } from 'lucide-react';
import NavbarComponent from '../components/NavBarComponents';
import { resetCookieConsent } from '../components/CookieConsentComponent';
import CookieConsentComponent from '../components/CookieConsentComponent';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetCookies = () => {
    resetCookieConsent();
  };

  return (
    <>
      <NavbarComponent />
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Politique de Confidentialité</h1>
          <p className="text-gray-600 mb-8">
            Dernière mise à jour: 20 mars 2025
          </p>

          {/* Table des matières */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sommaire</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button 
                onClick={() => scrollToSection('collecte')}
                className="flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-300"
              >
                <Database size={20} className="text-gray-700" />
                <span className="text-gray-700">Collecte des données</span>
              </button>
              <button 
                onClick={() => scrollToSection('utilisation')}
                className="flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-300"
              >
                <Eye size={20} className="text-gray-700" />
                <span className="text-gray-700">Utilisation des données</span>
              </button>
              <button 
                onClick={() => scrollToSection('cookies')}
                className="flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-300"
              >
                <Cookie size={20} className="text-gray-700" />
                <span className="text-gray-700">Cookies et traceurs</span>
              </button>
              <button 
                onClick={() => scrollToSection('partage')}
                className="flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-300"
              >
                <User size={20} className="text-gray-700" />
                <span className="text-gray-700">Partage avec des tiers</span>
              </button>
              <button 
                onClick={() => scrollToSection('droits')}
                className="flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-300"
              >
                <Shield size={20} className="text-gray-700" />
                <span className="text-gray-700">Vos droits</span>
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-300"
              >
                <Mail size={20} className="text-gray-700" />
                <span className="text-gray-700">Nous contacter</span>
              </button>
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle size={24} className="text-gray-800" />
              <h2 className="text-xl font-semibold text-gray-800">Introduction</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Shop Théo (ci-après "nous", "notre", "nos") s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web ou effectuez des achats.
            </p>
            <p className="text-gray-600">
              Veuillez noter que ce site est fictif et a été créé uniquement dans le cadre d'un projet scolaire. Aucune donnée réelle n'est collectée.
            </p>
          </div>

          {/* Collecte des données */}
          <div id="collecte" className="bg-white rounded-xl shadow-md p-6 mb-8 scroll-mt-20">
            <div className="flex items-center space-x-3 mb-4">
              <Database size={24} className="text-gray-800" />
              <h2 className="text-xl font-semibold text-gray-800">Collecte des données</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Nous collectons plusieurs types d'informations vous concernant, notamment :
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 ml-4 space-y-2">
              <li>Informations personnelles : nom, adresse, e-mail, numéro de téléphone</li>
              <li>Informations de paiement : détails de carte de crédit, adresse de facturation</li>
              <li>Informations de compte : nom d'utilisateur, mot de passe, préférences d'achat</li>
              <li>Données d'utilisation : pages visitées, produits consultés, temps passé sur le site</li>
              <li>Données de l'appareil : adresse IP, type de navigateur, système d'exploitation</li>
            </ul>
            <p className="text-gray-600">
              Ces informations sont collectées lorsque vous créez un compte, effectuez un achat, remplissez un formulaire, ou naviguez simplement sur notre site.
            </p>
          </div>

          {/* Utilisation des données */}
          <div id="utilisation" className="bg-white rounded-xl shadow-md p-6 mb-8 scroll-mt-20">
            <div className="flex items-center space-x-3 mb-4">
              <Eye size={24} className="text-gray-800" />
              <h2 className="text-xl font-semibold text-gray-800">Utilisation des données</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Nous utilisons vos données personnelles pour :
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 ml-4 space-y-2">
              <li>Traiter vos commandes et paiements</li>
              <li>Gérer votre compte sur notre site</li>
              <li>Vous envoyer des informations sur nos produits et promotions (avec votre consentement)</li>
              <li>Améliorer notre site web et l'expérience utilisateur</li>
              <li>Analyser les tendances d'achat et le comportement des clients</li>
              <li>Prévenir les fraudes et sécuriser notre plateforme</li>
            </ul>
            <p className="text-gray-600">
              Nous conservons vos données uniquement pendant la durée nécessaire pour atteindre les finalités pour lesquelles elles ont été collectées.
            </p>
          </div>

          {/* Cookies et traceurs */}
          <div id="cookies" className="bg-white rounded-xl shadow-md p-6 mb-8 scroll-mt-20">
            <div className="flex items-center space-x-3 mb-4">
              <Cookie size={24} className="text-gray-800" />
              <h2 className="text-xl font-semibold text-gray-800">Cookies et traceurs</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Notre site utilise des cookies et technologies similaires pour améliorer votre expérience, analyser notre trafic et personnaliser le contenu. Nous utilisons les types de cookies suivants :
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 ml-4 space-y-2">
              <li>Cookies essentiels : nécessaires au fonctionnement du site</li>
              <li>Cookies de performance : pour analyser les performances et l'utilisation du site</li>
              <li>Cookies de fonctionnalité : pour mémoriser vos préférences</li>
              <li>Cookies publicitaires : pour diffuser des publicités pertinentes</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour indiquer quand un cookie est envoyé. Cependant, certaines fonctionnalités du site peuvent ne pas fonctionner correctement sans cookies.
            </p>
            <button 
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
              onClick={handleResetCookies}
            >
              Gérer mes préférences de cookies
            </button>
          </div>

          {/* Partage avec des tiers */}
          <div id="partage" className="bg-white rounded-xl shadow-md p-6 mb-8 scroll-mt-20">
            <div className="flex items-center space-x-3 mb-4">
              <User size={24} className="text-gray-800" />
              <h2 className="text-xl font-semibold text-gray-800">Partage avec des tiers</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Nous pouvons partager vos informations personnelles avec :
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 ml-4 space-y-2">
              <li>Prestataires de services : sociétés qui nous aident à exécuter nos services (paiement, livraison, etc.)</li>
              <li>Partenaires marketing : avec votre consentement explicite uniquement</li>
              <li>Autorités légales : lorsque requis par la loi ou pour protéger nos droits</li>
            </ul>
            <p className="text-gray-600">
              Nous ne vendons jamais vos données personnelles à des tiers. Tout partage est soumis à des garanties appropriées pour protéger vos informations.
            </p>
          </div>

          {/* Vos droits */}
          <div id="droits" className="bg-white rounded-xl shadow-md p-6 mb-8 scroll-mt-20">
            <div className="flex items-center space-x-3 mb-4">
              <Shield size={24} className="text-gray-800" />
              <h2 className="text-xl font-semibold text-gray-800">Vos droits</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Conformément aux lois sur la protection des données, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 ml-4 space-y-2">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l'effacement (droit à l'oubli)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition au traitement</li>
              <li>Droit de retirer votre consentement à tout moment</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Pour exercer l'un de ces droits, veuillez nous contacter via notre formulaire dédié ou par e-mail.
            </p>
            <button 
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
              onClick={() => navigate('/contact')}
            >
              Formulaire de demande
            </button>
          </div>

          {/* Nous contacter */}
          <div id="contact" className="bg-white rounded-xl shadow-md p-6 mb-8 scroll-mt-20">
            <div className="flex items-center space-x-3 mb-4">
              <Mail size={24} className="text-gray-800" />
              <h2 className="text-xl font-semibold text-gray-800">Nous contacter</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de données, n'hésitez pas à nous contacter :
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 font-medium">Shop Théo (Projet Scolaire Fictif)</p>
              <p className="text-gray-600">Email : contact@shoptheo-projet.fr</p>
              <p className="text-gray-600">Téléphone : 01 23 45 67 89</p>
              <p className="text-gray-600">Adresse : 123 Avenue de la Mode, 75001 Paris, France</p>
            </div>
            <p className="text-gray-600">
              Nous nous efforçons de répondre à toutes les demandes dans un délai de 30 jours.
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
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
                className="text-gray-700 font-medium text-sm transition-colors duration-300"
              >
                Politique de confidentialité
              </button>
            </div>
          </div>
          <CookieConsentComponent />
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
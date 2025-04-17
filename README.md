<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="#">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">E-Commerce Fullstack App</h3>

  <p align="center">
    Un site de vente complet avec une API Symfony et un frontend React.
    <br />
    <a href="https://github.com/votre-utilisateur/ecommerce-symfony-react"><strong>Voir la doc »</strong></a>
    <br />
    <br />
    <a href="https://github.com/votre-utilisateur/ecommerce-symfony-react">Voir la démo</a>
    ·
    <a href="https://github.com/votre-utilisateur/ecommerce-symfony-react/issues">Signaler un bug</a>
    ·
    <a href="https://github.com/votre-utilisateur/ecommerce-symfony-react/issues">Demander une feature</a>
  </p>
</div>

---

## 📚 Table des matières

<details>
  <summary>Voir</summary>
  <ol>
    <li><a href="#about-the-project">À propos du projet</a></li>
    <li><a href="#built-with">Technologies utilisées</a></li>
    <li><a href="#getting-started">Installation</a></li>
    <li><a href="#usage">Utilisation</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contribuer</a></li>
    <li><a href="#license">Licence</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Remerciements</a></li>
  </ol>
</details>

---

## 💡 À propos du projet

[![Screenshot][product-screenshot]](https://example.com)

Ce projet est un site e-commerce fullstack :  
🖥️ **Frontend React** - ⚙️ **Backend Symfony API** - 💾 **Base de données MySQL**  
Conçu pour être rapide, modulable et facilement déployable.

Fonctionnalités principales :
- Catalogue produits dynamique
- Authentification utilisateur
- Gestion panier & commandes
- Rôles admin & user
- API REST sécurisée
- Interface responsive avec CSS/Tailwind

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

---

## 🔧 Technologies utilisées

- [![Symfony][Symfony.com]][Symfony-url]
- [![React][React.js]][React-url]
- [![MySQL][MySQL.com]][MySQL-url]
- [![Axios][Axios.js]][Axios-url]
- [HTML5](https://developer.mozilla.org/fr/docs/Web/Guide/HTML/HTML5)
- [CSS3](https://developer.mozilla.org/fr/docs/Web/CSS)

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

---

## 🚀 Installation

### Prérequis

- PHP 8.1+
- Node.js 18+
- Composer
- Symfony CLI
- MySQL
- npm

### Backend - Symfony

```bash
cd backend
composer install
cp .env .env.local
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
symfony server:start

<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/your_username/ecommerce">
    <img src="./frontend/public/Logo Théo Vintage.png" alt="Logo">
  </a>

  <h3 align="center">E-commerce | Symfony & React</h3>

  <p align="center">
    Une application e-commerce moderne avec backend Symfony et frontend React
    <br />
    <a href="https://github.com/your_username/ecommerce"><strong>Explorer la documentation »</strong></a>
    <br />
    <br />
    <a href="http://51.159.28.149/theo/site-ecommerce/frontend/dist/">Voir la démo</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table des matières</summary>
  <ol>
    <li>
      <a href="#à-propos-du-projet">À propos du projet</a>
      <ul>
        <li><a href="#construit-avec">Construit avec</a></li>
      </ul>
    </li>
    <li>
      <a href="#mise-en-route">Mise en route</a>
      <ul>
        <li><a href="#prérequis">Prérequis</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#utilisation">Utilisation</a></li>
    <li><a href="#architecture-api">Architecture API</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contribution">Contribution</a></li>
    <li><a href="#licence">Licence</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#remerciements">Remerciements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## À propos du projet

[![Capture d'écran du produit][product-screenshot]](https://demo-ecommerce.votredomaine.com)

Ce projet est une solution e-commerce complète qui combine la puissance de Symfony pour le backend et la flexibilité de React pour le frontend. L'architecture est basée sur une séparation claire entre le serveur (backend) et le client (frontend) qui communiquent via des API RESTful.

Pourquoi choisir cette solution:
* Une architecture moderne et scalable basée sur des API pour une meilleure séparation des préoccupations
* Un backend robuste avec Symfony qui offre sécurité, performance et extensibilité
* Une interface utilisateur réactive et dynamique avec React pour une expérience client optimale
* Une approche modulaire permettant de faire évoluer chaque partie indépendamment

L'objectif de ce projet est de fournir une base solide pour développer des applications e-commerce professionnelles, avec toutes les fonctionnalités essentielles déjà intégrées.

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

### Construit avec

Ce projet utilise les frameworks et bibliothèques suivants:

* [![Symfony][Symfony.com]][Symfony-url]
* [![React][React.js]][React-url]
* [![MySQL][MySQL.com]][MySQL-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![Docker][Docker.com]][Docker-url]
* [![JWT][JWT.io]][JWT-url]
* [![Webpack][Webpack.js]][Webpack-url]

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

<!-- GETTING STARTED -->
## Mise en route

Voici comment configurer le projet localement.

### Prérequis

Assurez-vous d'avoir installé les outils suivants:

* PHP 8.1 ou supérieur
  ```sh
  php -v
  ```
* Composer
  ```sh
  composer --version
  ```
* Node.js 16 ou supérieur
  ```sh
  node -v
  ```
* MySQL/MariaDB
* Symfony CLI (recommandé)
  ```sh
  symfony -v
  ```

### Installation

1. Cloner le dépôt
   ```sh
   git clone https://github.com/your_username/ecommerce.git
   cd ecommerce
   ```

#### Backend (Symfony)

1. Aller dans le répertoire backend
   ```sh
   cd backend
   ```

2. Installer les dépendances
   ```sh
   composer install
   ```

3. Configurer la base de données dans .env
   ```sh
   # Modifier la ligne DATABASE_URL dans le fichier .env
   DATABASE_URL=mysql://user:password@127.0.0.1:3306/ecommerce
   ```

4. Créer la base de données
   ```sh
   php bin/console doctrine:database:create
   ```

5. Exécuter les migrations
   ```sh
   php bin/console doctrine:migrations:migrate
   ```

6. Charger les fixtures (données de test)
   ```sh
   php bin/console doctrine:fixtures:load
   ```

7. Générer les clés JWT
   ```sh
   php bin/console lexik:jwt:generate-keypair
   ```

8. Lancer le serveur de développement
   ```sh
   symfony serve
   # ou
   php -S localhost:8000 -t public
   ```

#### Frontend (React)

1. Aller dans le répertoire frontend
   ```sh
   cd ../frontend
   ```

2. Installer les dépendances
   ```sh
   npm install
   # ou
   yarn install
   ```

3. Configurer l'URL de l'API dans .env
   ```sh
   # Créer ou modifier le fichier .env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. Lancer le serveur de développement
   ```sh
   npm start
   # ou
   yarn start
   ```

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

<!-- USAGE EXAMPLES -->
## Utilisation

### Interface administrateur

Accédez au panneau d'administration pour gérer votre catalogue de produits, les commandes et les utilisateurs:
```
http://localhost:3000/admin
```
Utilisez les identifiants par défaut:
- Email: admin@example.com
- Mot de passe: admin123

### API Documentation

Une documentation Swagger est disponible pour explorer l'API:
```
http://localhost:8000/api/doc
```

### Déploiement en production

Pour déployer l'application en production:

1. Configurer les variables d'environnement pour la production
   ```sh
   # Backend (.env.local)
   APP_ENV=prod
   APP_SECRET=votre_secret_sécurisé
   DATABASE_URL=mysql://user:password@production-host:3306/ecommerce_prod
   
   # Frontend (.env.production)
   REACT_APP_API_URL=https://api.votredomaine.com
   ```

2. Construire le frontend pour la production
   ```sh
   cd frontend
   npm run build
   # ou
   yarn build
   ```

3. Déployer les fichiers du dossier `build` sur votre hébergement statique

4. Déployer le backend Symfony sur votre serveur PHP

_Pour plus d'exemples, veuillez consulter la [Documentation](https://github.com/your_username/ecommerce/wiki)_

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

<!-- API ARCHITECTURE -->
## Architecture API

L'application utilise une architecture RESTful pour la communication entre le frontend et le backend.

### Points d'API principaux

#### Produits
- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/{id}` - Récupérer un produit spécifique
- `POST /api/products` - Créer un nouveau produit (Admin)
- `PUT /api/products/{id}` - Mettre à jour un produit (Admin)
- `DELETE /api/products/{id}` - Supprimer un produit (Admin)

#### Catégories
- `GET /api/categories` - Récupérer toutes les catégories
- `GET /api/categories/{id}` - Récupérer une catégorie et ses produits

#### Authentification
- `POST /api/login_check` - Authentification (retourne un token JWT)
- `POST /api/register` - Inscription d'un nouvel utilisateur

#### Utilisateurs
- `GET /api/users/profile` - Récupérer le profil utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil

#### Commandes
- `POST /api/orders` - Créer une nouvelle commande
- `GET /api/orders` - Récupérer les commandes de l'utilisateur
- `GET /api/orders/{id}` - Récupérer les détails d'une commande

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Authentification via JWT
- [x] Gestion des produits et catégories
- [x] Panier d'achat
- [x] Processus de commande
- [x] Intégration Stripe pour les paiements
- [ ] Gestion multi-langues
- [ ] Optimisation SEO
- [ ] PWA (Progressive Web App)
- [ ] Tests automatisés
    - [ ] Tests unitaires
    - [ ] Tests d'intégration
    - [ ] Tests E2E

Voir les [issues ouvertes](https://github.com/your_username/ecommerce/issues) pour la liste complète des fonctionnalités proposées (et des problèmes connus).

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

<!-- CONTRIBUTING -->
## Contribution

Les contributions sont ce qui fait de la communauté open source un endroit incroyable pour apprendre, inspirer et créer. Toutes les contributions que vous apportez sont **grandement appréciées**.

Si vous avez une suggestion pour améliorer ce projet, merci de forker le dépôt et de créer une pull request. Vous pouvez aussi simplement ouvrir une issue avec le tag "enhancement".
N'oubliez pas de donner une étoile au projet ! Merci encore !

1. Forker le projet
2. Créer votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>


<!-- CONTACT -->
## Contact

Théo Houriez- [@Théo Houriez](https://www.linkedin.com/in/th%C3%A9o-houriez-160756296/) - theohouriez1@gmail.com

Lien du projet: [https://github.com/your_username/ecommerce](https://github.com/your_username/ecommerce)

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

<!-- ACKNOWLEDGMENTS -->


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/your_username/ecommerce.svg?style=for-the-badge
[contributors-url]: https://github.com/your_username/ecommerce/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/your_username/ecommerce.svg?style=for-the-badge
[forks-url]: https://github.com/your_username/ecommerce/network/members
[stars-shield]: https://img.shields.io/github/stars/your_username/ecommerce.svg?style=for-the-badge
[stars-url]: https://github.com/your_username/ecommerce/stargazers
[issues-shield]: https://img.shields.io/github/issues/your_username/ecommerce.svg?style=for-the-badge
[issues-url]: https://github.com/your_username/ecommerce/issues
[license-shield]: https://img.shields.io/github/license/your_username/ecommerce.svg?style=for-the-badge
[license-url]: https://github.com/your_username/ecommerce/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/your_username
[product-screenshot]: images/screenshot.png

[Symfony.com]: https://img.shields.io/badge/Symfony-000000?style=for-the-badge&logo=symfony&logoColor=white
[Symfony-url]: https://symfony.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[MySQL.com]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Docker.com]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[JWT.io]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white
[JWT-url]: https://jwt.io/
[Webpack.js]: https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black
[Webpack-url]: https://webpack.js.org/
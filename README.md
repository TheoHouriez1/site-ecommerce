<div align="center" id="top"> 
  <img src="./frontend/public/Logo Théo Vintage.png" 
       alt="Procter & Gamble Logo" 
       height="300px" />
       <br>
  &#xa0;

  <!-- <a href="https://monprojetpython.netlify.app">Démo</a> -->
</div>

<h1 align="center">Project E-commerce THÉO VINTAGE</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Symfony-000000?style=for-the-badge&logo=symfony&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>



<!-- Status -->

<h4 align="center"> 
  ✅ THÉO VINTAGE :rocket:
</h4>

<hr>

<p align="center">
    <a href="#dart-About">About us</a> &#xa0; | &#xa0;
    <a href="#file_folder-structure">Structure</a> &#xa0; | &#xa0;
    <a href="#white_check_mark-Prerequisites">Prerequisites</a> &#xa0; | &#xa0;
    <a href="#computer-Technology">Technology</a> &#xa0; | &#xa0;
    <a href="#rocket-operation">operation</a> &#xa0; | &#xa0;
    <a href="#mailbox-contact">Contact</a>
</p>

<br>

## :dart: About ##

Théo VINTAGE est un site e-commerce dédié à la vente de vêtements de seconde main, proposés dans des états variables, allant du bon état à l’état usé.
Le site a été conçu en deux parties distinctes :
*	**Le backend**, développé en PHP avec le framework Symfony, ce qui permet d’accélérer le développement grâce aux nombreux bundles proposés par le framework.
*	**Le frontend**, réalisé avec la bibliothèque React, offre une interface utilisateur moderne et réactive, enrichie par le système de styles Tailwind CSS pour une mise en page rapide et responsive.


## :file_folder: Structure ##

Structure simplifier:

```
/site-e-commerce                      
├── /backend                             
│   ├── /src                             (Code source Symfony)
│   │   ├── Controller/                 (Routes + logique)
│   │   ├── Entity/                     (Modèles de données)
│   │   ├── Repository/                 (Requêtes BDD)
│   │   ├── Security/                   (Sécurité / token)
│   ├── /config                          (Fichiers config)
│   ├── /public                          (Fichier index.php)
│   └── .env                             (Variables d’environnement)
├── /frontend                           
│   ├── /src                             (Code source React)
│   │   ├── /components                 (Éléments réutilisables)
│   │   ├── /pages                      (Pages principales)
│   │   ├── /context                    (Utilisateur connecté)
│   │   └── App.jsx                     (Routes React)
│   └── tailwind.config.js              (Styles Tailwind)
└── README.md                            (Doc du projet)

```
### :computer: Prérequis

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

### :white_check_mark: Installation

1. Cloner le dépôt
   ```sh
   git clone https://github.com/TheoHouriez1/site-ecommerce.git
   cd site-ecommerce
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
   # a ajouter dans le fichier .env
   API_ACCESS_TOKEN=token123
   ```

#### Frontend (React)

1. Aller dans le répertoire frontend
   ```sh
   cd ../frontend
   ```

2. Installer les dépendances
   ```sh
   npm install
   ```

3. Configurer l'URL de l'API dans .env
   ```sh
   # Créer ou modifier le fichier .env
   VITE_API_TOKEN=token123
   ```

4. Lancer le serveur de développement
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

### Documentation

Une documentation technique et disponible dans le dossier doc :
```
site-ecommerce/doc/Documentation Technique Théo VINTAGE.pdf
```
et un guide d'utilisation et disponible egalement dans le dossier doc :
```
site-ecommerce/doc/Guide utlisation project e-commerce.pdf
```

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
- [ ] PWA (Progressive Web App)

Voir les [issues ouvertes](https://github.com/your_username/ecommerce/issues) pour la liste complète des fonctionnalités proposées (et des problèmes connus).

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>


<!-- CONTACT -->
## Contact

Théo Houriez - [@Théo Houriez](https://www.linkedin.com/in/th%C3%A9o-houriez-160756296/) - theohouriez1@gmail.com

Lien du projet: [https://github.com/TheoHouriez1/site-ecommerce](https://github.com/TheoHouriez1/site-ecommerce)

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/badge/Contributors-1-brightgreen?style=for-the-badge
[contributors-url]: https://github.com/your_username/ecommerce/graphs/contributors
[status-shield]: https://img.shields.io/badge/Status-Active-success?style=for-the-badge
[status-url]: https://github.com/your_username/ecommerce
[done-shield]: https://img.shields.io/badge/Completed-80%25-blue?style=for-the-badge
[done-url]: https://github.com/your_username/ecommerce/issues

[product-screenshot]: images/screenshot.png
[Symfony.com]: https://img.shields.io/badge/Symfony-000000?style=for-the-badge&logo=symfony&logoColor=white
[Symfony-url]: https://symfony.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[MySQL.com]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com/
[Tailwind.com]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[JWT.io]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white
[JWT-url]: https://jwt.io/
[Webpack.js]: https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black
[Webpack-url]: https://webpack.js.org/
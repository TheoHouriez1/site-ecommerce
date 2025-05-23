<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\User;
use App\Entity\Category;
use App\Entity\Order;
use App\Entity\CartItem;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\MailerInterface;
use App\Entity\LabelEcologique;


class ApiController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private SerializerInterface $serializer;
    private SluggerInterface $slugger;

    public function __construct(
        SerializerInterface $serializer,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger
    ) {
        $this->serializer = $serializer;
        $this->entityManager = $entityManager;
        $this->slugger = $slugger;
    }
    
    #[Route('/api/product', name: 'api_products', methods: ['GET'])]
    public function getProducts(): JsonResponse
    {
        $products = $this->entityManager->getRepository(Product::class)->findAll();
        $jsonContent = $this->serializer->serialize($products, 'json', [
            'groups' => ['product:read']
        ]);
        
        return new JsonResponse($jsonContent, 200, [], true);
    }

    #[Route('/api/product/{id}', name: 'api_get_product', methods: ['GET'])]
    public function getProduct(string $id): JsonResponse
    {
        $productId = (int) $id;
        $product = $this->entityManager->getRepository(Product::class)->find($productId);
        
        if (!$product) {
            return new JsonResponse(['error' => 'Produit non trouvé'], 404);
        }
        
        $jsonContent = $this->serializer->serialize($product, 'json', ['groups' => 'product:read']);
        return new JsonResponse($jsonContent, 200, [], true);
    }

    #[Route('/api/product/update-stock', name: 'api_product_update_stock', methods: ['POST'])]
    public function updateStock(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        if (!isset($data['id']) || !isset($data['quantity'])) {
            return new JsonResponse(['error' => 'Paramètres manquants (id ou quantity)'], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        $product = $this->entityManager->getRepository(Product::class)->find($data['id']);
    
        if (!$product) {
            return new JsonResponse(['error' => 'Produit non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        // Récupérer le stock actuel
        $currentStock = $product->getStock();
        $requestedQuantity = (int)$data['quantity'];
    
        // Vérifier si le stock est suffisant
        if ($currentStock < $requestedQuantity) {
            return new JsonResponse([
                'error' => 'Stock insuffisant',
                'available' => $currentStock,
                'requested' => $requestedQuantity,
                'productName' => $product->getName()
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        // Mise à jour du stock
        $newStock = $currentStock - $requestedQuantity;
        $product->setStock($newStock);
        $this->entityManager->flush();
    
        return new JsonResponse([
            'success' => true,
            'message' => 'Stock mis à jour avec succès',
            'newStock' => $product->getStock(),
            'productName' => $product->getName()
        ]);
    }

#[Route('/api/editProduct/{id}', name: 'api_update_product', methods: ['POST'])]
public function updateProduct(Request $request, int $id): JsonResponse
{
    try {
        $product = $this->entityManager->getRepository(Product::class)->find($id);
        
        if (!$product) {
            return new JsonResponse(['error' => 'Produit non trouvé'], 404);
        }

        $uploadDir = $this->getParameter('image_dir');

        // Récupération des nouvelles données environnementales
        $ecoScore = $request->request->get('ecoScore');
        $labelEcologique = $request->request->get('labelEcologique');

        // AJOUT DE DEBUG (temporaire)
        error_log("EcoScore reçu (edit): " . ($ecoScore ?: 'VIDE'));
        error_log("LabelEcologique reçu (edit): " . ($labelEcologique ?: 'VIDE'));

        // Mise à jour des champs
        $product->setName($request->request->get('name'));
        $product->setDescription($request->request->get('description'));
        $product->setPrice((float)$request->request->get('price'));
        $product->setStock((int)$request->request->get('stock'));
        $product->setSizes($request->request->all('sizes'));
        $product->setCategory($request->request->get('category'));

        // Mise à jour des nouvelles colonnes environnementales
        $product->setEcoScore($ecoScore ?: null);
        $product->setLabelEcologique($labelEcologique ?: null);

        // Gestion des images
        if ($request->files->has('image')) {
            $image = $request->files->get('image');
            if ($product->getImage()) {
                $this->removeOldImage($product->getImage(), $uploadDir);
            }
            $newFilename = $this->uploadImage($image, $uploadDir);
            $product->setImage($newFilename);
        }

        if ($request->files->has('image2')) {
            $image2 = $request->files->get('image2');
            if ($product->getImage2()) {
                $this->removeOldImage($product->getImage2(), $uploadDir);
            }
            $newFilename = $this->uploadImage($image2, $uploadDir);
            $product->setImage2($newFilename);
        }

        if ($request->files->has('image3')) {
            $image3 = $request->files->get('image3');
            if ($product->getImage3()) {
                $this->removeOldImage($product->getImage3(), $uploadDir);
            }
            $newFilename = $this->uploadImage($image3, $uploadDir);
            $product->setImage3($newFilename);
        }

        $this->entityManager->flush();

        $jsonContent = $this->serializer->serialize($product, 'json', ['groups' => 'product:read']);

        return new JsonResponse([
            'success' => true,
            'message' => 'Produit mis à jour avec succès',
            'product' => json_decode($jsonContent, true)
        ]);

    } catch (\Exception $e) {
        return new JsonResponse([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}

    
    #[Route('/api/create-product', name: 'api_create_product', methods: ['POST'])]
    public function createProduct(Request $request): JsonResponse
    {
        try {
            $name = $request->request->get('name');
            $description = $request->request->get('description');
            $price = $request->request->get('price');
            $sizes = $request->request->all('sizes');
            $stock = $request->request->get('stock');
            $categoryName = $request->request->get('category');
            
            // AJOUT DES NOUVELLES VARIABLES
            $ecoScore = $request->request->get('ecoScore');
            $labelEcologique = $request->request->get('labelEcologique');
            
            $image = $request->files->get('image');
            $image2 = $request->files->get('image2');
            $image3 = $request->files->get('image3');

            // AJOUT DE DEBUG (temporaire)
            error_log("EcoScore reçu: " . ($ecoScore ?: 'VIDE'));
            error_log("LabelEcologique reçu: " . ($labelEcologique ?: 'VIDE'));

            if (!$name || !$description || !$price || !$stock || empty($sizes) || !$categoryName) {
                return new JsonResponse(['error' => 'Tous les champs sont obligatoires'], 400);
            }

            $product = new Product();
            $product->setName($name);
            $product->setDescription($description);
            $product->setPrice((float) $price);
            $product->setSizes($sizes);
            $product->setStock((int) $stock);
            $product->setCategory($categoryName);
            
            // AJOUT DES NOUVELLES ASSIGNATIONS
            if ($ecoScore) {
                $product->setEcoScore($ecoScore);
            }
            if ($labelEcologique) {
                $product->setLabelEcologique($labelEcologique);
            }

            if ($image) {
                $imageName = uniqid() . '.' . $image->guessExtension();
                $image->move($this->getParameter('image_dir'), $imageName);
                $product->setImage($imageName);
            }
            if ($image2) {
                $imageName2 = uniqid() . '.' . $image2->guessExtension();
                $image2->move($this->getParameter('image_dir'), $imageName2);
                $product->setImage2($imageName2);
            }
            if ($image3) {
                $imageName3 = uniqid() . '.' . $image3->guessExtension();
                $image3->move($this->getParameter('image_dir'), $imageName3);
                $product->setImage3($imageName3);
            }

            $this->entityManager->persist($product);
            $this->entityManager->flush();

            return new JsonResponse([
                'success' => true,
                'message' => 'Produit créé avec succès',
                'product' => [
                    'id' => $product->getId(),
                    'name' => $product->getName(),
                    'description' => $product->getDescription(),
                    'price' => $product->getPrice(),
                    'sizes' => $product->getSizes(),
                    'stock' => $product->getStock(),
                    'category' => $product->getCategory(),
                    // AJOUT DANS LA RÉPONSE
                    'ecoScore' => $product->getEcoScore(),
                    'labelEcologique' => $product->getLabelEcologique(),
                    'image' => $product->getImage(),
                    'image2' => $product->getImage2(),
                    'image3' => $product->getImage3()
                ]
            ], 201);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Erreur interne du serveur',
                'details' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
    
    #[Route('/api/delete-product/{id}', name: 'api_delete_product', methods: ['DELETE', 'OPTIONS'])]
    public function deleteProduct(int $id): JsonResponse
    {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            $response = new JsonResponse(null, 204);
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            return $response;
        }
    
        try {
            $product = $this->entityManager->getRepository(Product::class)->find($id);
            
            if (!$product) {
                $response = new JsonResponse(['error' => 'Produit non trouvé'], 404);
                $response->headers->set('Access-Control-Allow-Origin', '*');
                return $response;
            }
    
            // Suppression des images
            $uploadDir = $this->getParameter('image_dir');
            if ($product->getImage()) {
                $this->removeOldImage($product->getImage(), $uploadDir);
            }
            if ($product->getImage2()) {
                $this->removeOldImage($product->getImage2(), $uploadDir);
            }
            if ($product->getImage3()) {
                $this->removeOldImage($product->getImage3(), $uploadDir);
            }
    
            $this->entityManager->remove($product);
            $this->entityManager->flush();
    
            $response = new JsonResponse([
                'success' => true,
                'message' => 'Produit supprimé avec succès'
            ]);
    
            // Ajout des headers CORS
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
            return $response;
    
        } catch (\Exception $e) {
            $response = new JsonResponse([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
    
            // Ajout des headers CORS même en cas d'erreur
            $response->headers->set('Access-Control-Allow-Origin', '*');
            $response->headers->set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
            return $response;
        }
    }

    private function uploadImage($file, $uploadDir): string
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();
        
        $file->move($uploadDir, $newFilename);
        
        return $newFilename;
    }

    private function removeOldImage(?string $filename, string $uploadDir): void
    {
        if ($filename) {
            $oldFilePath = $uploadDir . '/' . $filename;
            if (file_exists($oldFilePath)) {
                unlink($oldFilePath);
            }
        }
    }

    #[Route('/api/category', name: 'api_categories', methods: ['GET'])]
    public function getCategories(): JsonResponse
    {
        $categories = $this->entityManager->getRepository(Category::class)->findAll();
        $jsonContent = $this->serializer->serialize($categories, 'json', [
            'groups' => ['category:read']
        ]);

        return new JsonResponse($jsonContent, 200, [], true);
    }   

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request, 
        UserPasswordHasherInterface $passwordHasher, 
        EntityManagerInterface $em
        ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return new JsonResponse(['error' => 'Données invalides'], 400);
            }

            $email = $data['email'] ?? null;
            $password = $data['password'] ?? null;
            $firstName = $data['firstName'] ?? null;
            $lastName = $data['lastName'] ?? null;

            $errors = [];
            if (!$email) $errors[] = 'Email manquant';
            if (!$password) $errors[] = 'Mot de passe manquant';
            if (!$firstName) $errors[] = 'Prénom manquant';
            if (!$lastName) $errors[] = 'Nom manquant';

            if (!empty($errors)) {
                return new JsonResponse(['errors' => $errors], 400);
            }

            $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $email]);
            if ($existingUser) {
                return new JsonResponse(['error' => 'Cet email est déjà utilisé'], 400);
            }

            $user = new User();
            $user->setEmail($email);
            $user->setFirstName($firstName);
            $user->setLastName($lastName);
            $user->setPassword($passwordHasher->hashPassword($user, $password));
            $user->setRoles(['ROLE_USER']);

            $em->persist($user);
            $em->flush();

            return new JsonResponse([
                'message' => 'Inscription réussie',
                'user' => [
                    'id' => $user->getId(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'email' => $user->getEmail(),
                    'roles' => $user->getRoles()
                ]
            ], 201);

        } catch (\Exception $e) {
            $this->container->get('logger')->error('Erreur d\'inscription : ' . $e->getMessage());

            return new JsonResponse([
                'error' => 'Erreur interne du serveur',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data || !isset($data['email']) || !isset($data['password'])) {
                return new JsonResponse(['error' => 'Email et mot de passe requis'], 400);
            }
            
            // Rechercher l'utilisateur par email
            $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            
            if (!$user) {
                return new JsonResponse(['error' => 'Identifiants incorrects'], 401);
            }
            
            // Vérifier le mot de passe
            if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
                return new JsonResponse(['error' => 'Identifiants incorrects'], 401);
            }
            
            $request->getSession()->set('user_id', $user->getId());
            
            return new JsonResponse([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'roles' => $user->getRoles()
            ]);
        } catch (\Exception $e) {
            error_log('Erreur de login: ' . $e->getMessage());
            
            return new JsonResponse([
                'error' => 'Erreur de serveur',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/check-auth', name: 'api_check_auth', methods: ['GET'])]
    public function checkAuth(Request $request, EntityManagerInterface $em): JsonResponse
    {
    $session = $request->getSession();
    $userId = $session->get('user_id');

    if (!$userId) {
        return new JsonResponse(['authenticated' => false], 401);
    }

    $user = $em->getRepository(User::class)->find($userId);

    if (!$user) {
        return new JsonResponse(['authenticated' => false], 401);
    }

    return new JsonResponse([
        'authenticated' => true,
        'user' => [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles()
        ]
    ]);
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(Security $security): JsonResponse
    {
        $security->logout();
        return new JsonResponse(['message' => 'Déconnexion réussie']);
    }


    #[Route('/api/create-order', name: 'api_create_order', methods: ['POST'])]
    #[IsGranted('PUBLIC_ACCESS')]
    public function createOrder(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
    
            // Vérification des données reçues
            if (!$data) {
                return new JsonResponse(['error' => 'Données invalides'], 400);
            }
    
            $nom = $data['nom'] ?? null;
            $prenom = $data['prenom'] ?? null;
            $email = $data['email'] ?? null;
            $address = $data['address'] ?? null;
            $article = $data['article'] ?? null;
            $price = $data['price'] ?? null;
            $userId = $data['id_user'] ?? null; // Récupération de l'ID utilisateur comme un simple entier
    
            // Vérifications détaillées
            $errors = [];
            if (!$nom) $errors[] = 'Nom manquant';
            if (!$prenom) $errors[] = 'Prénom manquant';
            if (!$email) $errors[] = 'Email manquant';
            if (!$address) $errors[] = 'Adresse manquante';
            if (!$article) $errors[] = 'Article(s) manquant(s)';
            if (!$price) $errors[] = 'Prix manquant';
    
            if (!empty($errors)) {
                return new JsonResponse(['errors' => $errors], 400);
            }
    
            // Création de la commande
            $order = new Order();
            $order->setNom($nom);
            $order->setPrenom($prenom);
            $order->setEmail($email);
            $order->setAddress($address);
            $order->setArticle($article);
            $order->setPrice((float)$price);
            $order->setDateCommande(new \DateTimeImmutable());
            
            // Stockage direct de l'ID utilisateur sans relation
            if ($userId !== null) {
                $order->setIdUser($userId);
            }
    
            $em->persist($order);
            $em->flush();
    
            return new JsonResponse([
                'message' => 'Commande enregistrée avec succès',
                'order' => [
                    'id' => $order->getId(),
                    'nom' => $order->getNom(),
                    'prenom' => $order->getPrenom(),
                    'email' => $order->getEmail(),
                    'address' => $order->getAddress(),
                    'article' => $order->getArticle(),
                    'price' => $order->getPrice(),
                    'dateCommande' => $order->getDateCommande()->format('Y-m-d H:i:s')
                ]
            ], 201);
    
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Erreur interne du serveur',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/orders', name: 'api_orders', methods: ['GET'])]
    public function getOrders(): JsonResponse
    {
        $orders = $this->entityManager->getRepository(Order::class)->findAll();
        $jsonContent = $this->serializer->serialize($orders, 'json', ['groups' => 'order:read']);
        
        return new JsonResponse($jsonContent, 200, [], true);
    }

    #[Route('/orders/{id}', name: 'api_get_order', methods: ['GET'])]
    public function getOrder(string $id): JsonResponse
    {
        $orderId = (int) $id;
        $order = $this->entityManager->getRepository(Order::class)->find($orderId);
        
        if (!$order) {
            return new JsonResponse(['error' => 'Commande non trouvée'], 404);
        }
        
        $jsonContent = $this->serializer->serialize($order, 'json', ['groups' => 'order:read']);
        return new JsonResponse($jsonContent, 200, [], true);
    }

    #[Route('/api/cart/{userId}', name: 'api_cart_items', methods: ['GET'])]
    public function getCartItems(int $userId): JsonResponse
    {
        $cartItems = $this->entityManager
            ->getRepository(CartItem::class)
            ->findBy(['userId' => $userId]);
    
        $productRepo = $this->entityManager->getRepository(Product::class);
    
        $data = [];
    
        foreach ($cartItems as $item) {
            $product = $productRepo->find($item->getProductId());
    
            $data[] = [
                'id' => $item->getId(),
                'userId' => $item->getUserId(),
                'productId' => $item->getProductId(),
                'quantity' => $item->getQuantity(),
                'name' => $product?->getName() ?? 'Produit inconnu',
                'price' => $product?->getPrice() ?? 0,
                'image' => $product?->getImage() ?? null,
                'size' =>  $product?->GetSizes() ?? 0,
            ];
        }
    
        return new JsonResponse($data, 200);
    }
 

    #[Route('/api/cart/item/{id}', name: 'api_cart_delete_item', methods: ['DELETE'])]
    public function deleteCartItem(int $id): JsonResponse
    {
        $cartItem = $this->entityManager->getRepository(CartItem::class)->find($id);

        if (!$cartItem) {
            return new JsonResponse(['error' => 'Article introuvable dans le panier'], 404);
        }

        $this->entityManager->remove($cartItem);
        $this->entityManager->flush();

        return new JsonResponse(['success' => true, 'message' => 'Article supprimé du panier']);
    }

    #[Route('/api/cart/clear/{userId}', name: 'api_cart_clear', methods: ['DELETE'])]
    public function clearCart(int $userId): JsonResponse
    {
        $items = $this->entityManager->getRepository(CartItem::class)->findBy(['userId' => $userId]);

        foreach ($items as $item) {
            $this->entityManager->remove($item);
        }

        $this->entityManager->flush();

        return new JsonResponse(['success' => true, 'message' => 'Panier vidé']);
    }
    #[Route('/api/cart/add', name: 'api_cart_add_item', methods: ['POST'])]
    public function addToCart(Request $request): JsonResponse
    {
    $data = json_decode($request->getContent(), true);

    if (!$data || !isset($data['userId'], $data['productId'], $data['quantity'])) {
        return new JsonResponse(['error' => 'Paramètres manquants'], 400);
    }

    $userId = $data['userId'];
    $productId = $data['productId'];
    $quantity = $data['quantity'];

    $cartItemRepo = $this->entityManager->getRepository(CartItem::class);

    $existingItem = $cartItemRepo->findOneBy([
        'userId' => $userId,
        'productId' => $productId
    ]);

    if ($existingItem) {
        $existingItem->setQuantity($existingItem->getQuantity() + $quantity);
    } else {
        $cartItem = new CartItem();
        $cartItem->setUserId($userId);
        $cartItem->setProductId($productId);
        $cartItem->setQuantity($quantity);

        $this->entityManager->persist($cartItem);
    }

    $this->entityManager->flush();

    return new JsonResponse(['success' => true, 'message' => 'Produit ajouté au panier']);
    }
    
    #[Route('/api/cart/update/{id}', name: 'api_cart_update_item', methods: ['PUT'])]
    public function updateCartItem(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $newQuantity = $data['quantity'] ?? null;

        if ($newQuantity === null || $newQuantity < 1) {
            return new JsonResponse(['error' => 'Quantité invalide'], 400);
        }

        $cartItem = $this->entityManager->getRepository(CartItem::class)->find($id);

        if (!$cartItem) {
            return new JsonResponse(['error' => 'Article introuvable dans le panier'], 404);
        }

        $cartItem->setQuantity($newQuantity);
        $this->entityManager->flush();

        return new JsonResponse(['success' => true, 'message' => 'Quantité mise à jour']);
    }

    #[Route('/api/ping', name: 'api_ping', methods: ['GET'])]
    public function ping(): JsonResponse
    {
    return new JsonResponse([
        'success' => true,
        'message' => 'Token valide, accès autorisé ✅'
    ]);
    }
    #[Route('/api/labelecologique', name: 'api_label_ecologique', methods: ['GET'])]
    public function getLabelEcologique(): JsonResponse
    {
        $labels = $this->entityManager->getRepository(LabelEcologique::class)->findAll();
        $jsonContent = $this->serializer->serialize($labels, 'json');

        return new JsonResponse($jsonContent, 200, [], true);
    }
}
<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\User;
use App\Entity\Order;
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
    
    #[Route('/product', name: 'api_products', methods: ['GET'])]
    public function getProducts(): JsonResponse
    {
        $products = $this->entityManager->getRepository(Product::class)->findAll();
        $jsonContent = $this->serializer->serialize($products, 'json', ['groups' => 'product:read']);
        
        return new JsonResponse($jsonContent, 200, [], true);
    }

    #[Route('/product/{id}', name: 'api_get_product', methods: ['GET'])]
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

    #[Route('/editProduct/{id}', name: 'api_update_product', methods: ['POST'])]
    public function updateProduct(Request $request, int $id): JsonResponse
    {
        try {
            $product = $this->entityManager->getRepository(Product::class)->find($id);
            
            if (!$product) {
                return new JsonResponse(['error' => 'Produit non trouvé'], 404);
            }
    
            // Mise à jour des données de base
            $product->setName($request->request->get('name'));
            $product->setDescription($request->request->get('description'));
            $product->setPrice($request->request->get('price'));
            
            // Gestion des tailles
            $sizes = json_decode($request->request->get('sizes'), true);
            $product->setSizes($sizes);
    
            // Gestion des images
            $uploadDir = $this->getParameter('image_dir');
    
            // Image principale
            if ($request->files->has('image')) {
                $image = $request->files->get('image');
                // Supprimer l'ancienne image si elle existe
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
    
            // Image 3
            if ($request->files->has('image3')) {
                $image3 = $request->files->get('image3');
                if ($product->getImage3()) {
                    $this->removeOldImage($product->getImage3(), $uploadDir);
                }
                $newFilename = $this->uploadImage($image3, $uploadDir);
                $product->setImage3($newFilename);
            }
    
            $this->entityManager->flush();
    
            // Sérialiser le produit correctement
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
    #[IsGranted('PUBLIC_ACCESS')]
    public function createProduct(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
    
            // Validation des données
            if (!$data) {
                return new JsonResponse(['error' => 'Données invalides'], 400);
            }
    
            // Création du produit
            $product = new Product();
            $product->setName($data['name']);
            $product->setDescription($data['description']);
            $product->setPrice((float)$data['price']);
            $product->setSizes($data['sizes']);
            
            // Stockage des noms des images
            if (isset($data['image'])) $product->setImage($data['image']);
            if (isset($data['image2'])) $product->setImage2($data['image2']);
            if (isset($data['image3'])) $product->setImage3($data['image3']);
    
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
                    'image' => $product->getImage(),
                    'image2' => $product->getImage2(),
                    'image3' => $product->getImage3()
                ]
            ], 201);
    
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Erreur interne du serveur',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    #[Route('/api/delete-product/{id}', name: 'api_delete_product', methods: ['DELETE', 'OPTIONS'])]
    public function deleteProduct(int $id): JsonResponse
    {
        // Gérer la requête CORS preflight
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
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request, 
        UserPasswordHasherInterface $passwordHasher, 
        EntityManagerInterface $em
        ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);
            
            // Validation des données
            if (!$data) {
                return new JsonResponse(['error' => 'Données invalides'], 400);
            }

            $email = $data['email'] ?? null;
            $password = $data['password'] ?? null;
            $firstName = $data['firstName'] ?? null;
            $lastName = $data['lastName'] ?? null;

            // Validations détaillées
            $errors = [];
            if (!$email) $errors[] = 'Email manquant';
            if (!$password) $errors[] = 'Mot de passe manquant';
            if (!$firstName) $errors[] = 'Prénom manquant';
            if (!$lastName) $errors[] = 'Nom manquant';

            if (!empty($errors)) {
                return new JsonResponse(['errors' => $errors], 400);
            }

            // Vérification si l'utilisateur existe déjà
            $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $email]);
            if ($existingUser) {
                return new JsonResponse(['error' => 'Cet email est déjà utilisé'], 400);
            }

            // Création du nouvel utilisateur
            $user = new User();
            $user->setEmail($email);
            $user->setFirstName($firstName);
            $user->setLastName($lastName);
            $user->setPassword($passwordHasher->hashPassword($user, $password));
            $user->setRoles(['ROLE_USER']);

            $em->persist($user);
            $em->flush();

            // Retourner les données utilisateur en JSON
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
            // Log de l'erreur
            $this->container->get('logger')->error('Erreur d\'inscription : ' . $e->getMessage());

            // Retourne une réponse générique
            return new JsonResponse([
                'error' => 'Erreur interne du serveur',
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
    #[IsGranted('PUBLIC_ACCESS')]  // 🔹 Ajoute ça pour désactiver la sécurité

    public function createOrder(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
    
            // 🔹 Vérification des données reçues
            if (!$data) {
                return new JsonResponse(['error' => 'Données invalides'], 400);
            }
    
            $nom = $data['nom'] ?? null;
            $prenom = $data['prenom'] ?? null;
            $email = $data['email'] ?? null;
            $address = $data['address'] ?? null;
            $article = $data['article'] ?? null;
            $price = $data['price'] ?? null;
    
            // 🔹 Vérifications détaillées
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
    
            // 🔹 Création de la commande
            $order = new Order();
            $order->setNom($nom);
            $order->setPrenom($prenom);
            $order->setEmail($email);
            $order->setAddress($address);
            $order->setArticle($article);
            $order->setPrice((float)$price);
            $order->setDateCommande(new \DateTimeImmutable());
    
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

    #[Route('/orders', name: 'api_orders', methods: ['GET'])]
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
// Dans ApiController.php

#[Route('/api/contact', name: 'contact_submit', methods: ['POST', 'OPTIONS'])]
#[IsGranted('PUBLIC_ACCESS')]  // Ajoutez cette ligne
public function submit(Request $request, MailerInterface $mailer): JsonResponse
{
    // Gérer la requête CORS preflight
    if ($request->getMethod() === 'OPTIONS') {
        $response = new JsonResponse(null, 204);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
        return $response;
    }

    try {
        $data = json_decode($request->getContent(), true);

        // Validation des données
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Les champs nom, email et message sont obligatoires'
            ], 400);
        }

        // Créer l'email
        $email = (new Email())
            ->from('theoshopecommerce@gmail.com')
            ->to('theohouriez1@gmail.com')
            ->subject('Nouveau message de contact: ' . ($data['subject'] ?? 'Sans sujet'))
            ->html($this->renderView('emails/contact.html.twig', [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? 'Non renseigné',
                'subject' => $data['subject'] ?? 'Sans sujet',
                'message' => $data['message']
            ]));

        // Envoyer l'email
        $mailer->send($email);

        $response = new JsonResponse([
            'success' => true,
            'message' => 'Message envoyé avec succès'
        ]);

        // Ajouter les headers CORS
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');

        return $response;

    } catch (\Exception $e) {
        $response = new JsonResponse([
            'success' => false,
            'message' => 'Erreur lors de l\'envoi du message'
        ], 500);

        // Ajouter les headers CORS même en cas d'erreur
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');

        return $response;
    }
}
}
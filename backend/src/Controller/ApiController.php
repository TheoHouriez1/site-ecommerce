<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\SubCategory;
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

class ApiController extends AbstractController
{
    private SerializerInterface $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }
    
    #[Route('/product', name: 'api_products', methods: ['GET'])]
    public function getProducts(EntityManagerInterface $entityManager): JsonResponse
    {
        $products = $entityManager->getRepository(Product::class)->findAll();
        $jsonContent = $this->serializer->serialize($products, 'json', ['groups' => 'product:read']);
        
        return new JsonResponse($jsonContent, 200, [], true);
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request, 
        Security $security, 
        UserPasswordHasherInterface $passwordHasher, 
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
    
        $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);
    
        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Email ou mot de passe incorrect'], 401);
        }
    
        // Création de la session Symfony
        $request->getSession()->set('user_id', $user->getId());
    
        return new JsonResponse([
            'message' => 'Connexion réussie',
            'id' => $user->getId(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles()
        ]);
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
        
    
    
    
}
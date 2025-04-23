<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Security\SecurityAuthenticator; // Votre authentificateur personnalisé

class AuthController extends AbstractController
{

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em,
        UserAuthenticatorInterface $authenticator,
        SecurityAuthenticator $customAuthenticator // Votre authentificateur personnalisé
    ): JsonResponse {
        // Récupérer les données JSON envoyées dans la requête
        $data = json_decode($request->getContent(), true);

        // Vérifier si les champs requis sont présents
        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse(['error' => 'Invalid data'], 400);
        }

        // Rechercher l'utilisateur par email
        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        // Vérifier si l'utilisateur existe et si le mot de passe est valide
        if (!$user || !$passwordHasher->isPasswordValid($user, $data['password'])) {
            return new JsonResponse(['error' => 'Invalid credentials'], 401);
        }

        // Authentifier l'utilisateur côté Symfony
        $authenticator->authenticateUser($user, $customAuthenticator, $request);

        return new JsonResponse([
            'id' => $user->getId(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ], 200);
    }


    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout()
    {
    // Symfony gère automatiquement la déconnexion
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function getUserData(): JsonResponse
    {
        $user = $this->getUser(); // Symfony récupère l'utilisateur connecté via la session

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]);
    }
    #[Route('/api/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        // Récupérer les données envoyées en POST
        $data = json_decode($request->getContent(), true);

        // Vérification des données nécessaires
        if (!isset($data['first_name'], $data['last_name'], $data['email'], $data['password'])) {
            return new JsonResponse(['message' => 'Missing fields'], 400);
        }

        // Vérifier si l'email existe déjà
        $userRepository = $em->getRepository(User::class);
        if ($userRepository->findOneBy(['email' => $data['email']])) {
            return new JsonResponse(['message' => 'Email already exists'], 400);
        }

        // Création de l'utilisateur
        $user = new User();
        $user->setFirstName($data['first_name']);
        $user->setLastName($data['last_name']);
        $user->setEmail($data['email']);
        // Utilisation de password_hash pour sécuriser le mot de passe
        $user->setPassword(password_hash($data['password'], PASSWORD_BCRYPT));

        // Validation de l'entité
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            // Si des erreurs de validation existent, retour avec les messages d'erreur
            return new JsonResponse(['message' => (string) $errors], 400);
        }

        try {
            // Persister l'utilisateur et sauvegarder en base de données
            $em->persist($user);
            $em->flush();

            return new JsonResponse(['message' => 'User registered successfully'], 200);
        } catch (\Exception $e) {
            // En cas d'erreur lors de l'enregistrement
            return new JsonResponse(['message' => 'An error occurred during registration: ' . $e->getMessage()], 500);
        }
    }
}


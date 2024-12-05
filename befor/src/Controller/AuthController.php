<?php
// src/Controller/AuthController.php

namespace App\Controller;

use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AuthController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $em, UserPasswordEncoderInterface $passwordEncoder): JsonResponse
    {
        // Récupérer les données de la requête
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['success' => false, 'message' => 'Email ou mot de passe manquant'], 400);
        }

        // Rechercher l'utilisateur dans la base de données
        $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }

        // Vérifier le mot de passe
        if (!$passwordEncoder->isPasswordValid($user, $password)) {
            return new JsonResponse(['success' => false, 'message' => 'Mot de passe incorrect'], 401);
        }

        // Connexion réussie
        return new JsonResponse(['success' => true]);
    }
}
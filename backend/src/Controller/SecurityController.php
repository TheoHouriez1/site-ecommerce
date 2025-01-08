<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController
{
    #[Route(path: '/login', name: 'app_login', methods: ['GET', 'POST'])]
    public function login(Request $request, AuthenticationUtils $authenticationUtils): Response
    {
        // Gestion API : retourne un message JSON si erreur de login
        if ($request->isXmlHttpRequest()) {
            $error = $authenticationUtils->getLastAuthenticationError();
            if ($error) {
                return new JsonResponse(['message' => $error->getMessage()], Response::HTTP_UNAUTHORIZED);
            }

            return new JsonResponse(['message' => 'Login successful'], Response::HTTP_OK);
        }

        // Rendu pour une interface web (par exemple avec Twig)
        return $this->render('security/login.html.twig', [
            'last_username' => $authenticationUtils->getLastUsername(),
            'error' => $authenticationUtils->getLastAuthenticationError(),
        ]);
    }

    #[Route(path: '/logout', name: 'app_logout', methods: ['GET'])]
    public function logout(): void
    {
        // L'exception est attendue par Symfony pour intercepter la déconnexion
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}

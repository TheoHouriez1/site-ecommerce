<?php
namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;

class SecurityAuthenticator extends AbstractAuthenticator
{
    public function supports(Request $request): ?bool
    {
        // Supporte uniquement les requêtes POST sur /api/login
        return $request->getPathInfo() === '/api/login' && $request->isMethod('POST');
    }

    public function authenticate(Request $request): Passport
    {
        // Récupération des données JSON
        $data = json_decode($request->getContent(), true);

        // Validation des champs attendus
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            throw new AuthenticationException('Email ou mot de passe manquant.');
        }

        // Retourne un Passport avec les informations nécessaires
        return new Passport(
            new UserBadge($email), // Charge l'utilisateur à partir de l'email
            new PasswordCredentials($password) // Vérifie le mot de passe
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Réponse en cas de succès de l'authentification
        return new Response(json_encode(['message' => 'Connexion réussie']), Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        // Réponse en cas d'échec de l'authentification
        return new Response(json_encode(['error' => $exception->getMessage()]), Response::HTTP_UNAUTHORIZED, ['Content-Type' => 'application/json']);
    }
}

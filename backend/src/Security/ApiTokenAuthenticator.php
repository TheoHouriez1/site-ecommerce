<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class ApiTokenAuthenticator extends AbstractAuthenticator
{
    public function supports(Request $request): ?bool
    {
        // Active l'authenticator seulement si le header est présent
        return $request->headers->has('X-API-TOKEN');
    }

    public function authenticate(Request $request): Passport
    {
        $token = $request->headers->get('X-API-TOKEN');

        if ($token !== $_ENV['API_ACCESS_TOKEN']) {
            throw new AuthenticationException('Invalid API token');
        }

        return new SelfValidatingPassport(new UserBadge('api_user'));
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Authentification OK, on laisse passer
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        // Token invalide ou manquant
        return new Response('Unauthorized - Invalid token', 401);
    }
}

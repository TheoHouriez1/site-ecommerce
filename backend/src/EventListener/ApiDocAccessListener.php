<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpFoundation\Response;

class ApiDocAccessListener
{
    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        // On vise uniquement les routes /api/doc ou /api/doc.json
        if (!in_array($request->getPathInfo(), ['/api/doc', '/api/doc.json'])) {
            return;
        }

        $token = $request->query->get('token');
        $validToken = $_ENV['API_DOC_SECRET'];

        if ($token !== $validToken) {
            $event->setResponse(new Response(
                json_encode(['success' => false, 'error' => 'Accès refusé à la documentation API']),
                Response::HTTP_FORBIDDEN,
                ['Content-Type' => 'application/json']
            ));
        }
    }
}

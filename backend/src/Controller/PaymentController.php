<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends AbstractController
{
    #[Route('/create-payment-intent', name: 'create_payment_intent', methods: ['POST'])]
    public function createPaymentIntent(Request $request)
    {
        // Configurez votre clé secrète Stripe directement ici
        Stripe::setApiKey('pk_test_51QmyXuIryYmfQnu6bS82No1lJmDXiPgkupgTwIVTBKArreXpYIfsUnJb6PEMn5l8llZZZrzhL4v8ou3ZWeHiwkpK006PqbQju7');

        try {
            // Récupérer les données de la requête
            $data = json_decode($request->getContent(), true);
            $amount = $data['amount']; // Montant en centimes
            $currency = $data['currency'] ?? 'eur';

            // Créer un PaymentIntent
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency,
                'payment_method_types' => ['card'],
            ]);

            // Retourner le client secret
            return new JsonResponse([
                'clientSecret' => $paymentIntent->client_secret
            ]);

        } catch (\Exception $e) {
            // Gestion des erreurs
            return new JsonResponse([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
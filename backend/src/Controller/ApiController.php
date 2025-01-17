<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\SubCategory;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;

#[Route('/back')]
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

    #[Route('/subcategory', name: 'api_subcategory', methods: ['GET'])]
    public function getSubCategories(EntityManagerInterface $entityManager): JsonResponse
    {
        $subCategories = $entityManager->getRepository(SubCategory::class)->findAll();
        $jsonContent = $this->serializer->serialize($subCategories, 'json', ['groups' => 'subcategory:read']);

        return new JsonResponse($jsonContent, 200, [], true);
    }

    #[Route('/users', name: 'api_users', methods: ['GET'])]
    public function getUsers(EntityManagerInterface $entityManager): JsonResponse
    {
        $users = $entityManager->getRepository(User::class)->findAll();
        $jsonContent = $this->serializer->serialize($users, 'json', ['groups' => 'users:read']);

        return new JsonResponse($jsonContent, 200, [], true);
    }
    
    // src/Controller/ApiController.php

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(EntityManagerInterface $em, Request $request, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
    $data = json_decode($request->getContent(), true);
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;

    if (!$email || !$password) {
        return new JsonResponse(['error' => 'Missing email or password'], 400);
    }

    // Debugging: log the received email
    if (!$user = $em->getRepository(User::class)->findOneBy(['email' => $email])) {
        return new JsonResponse(['error' => 'User not found'], 404);
    }

    // Debugging: log the password verification
    if (!$passwordHasher->isPasswordValid($user, $password)) {
        return new JsonResponse(['error' => 'Invalid password'], 401);
    }

    return new JsonResponse(['message' => 'Login successful'], 200);
    }

    
}
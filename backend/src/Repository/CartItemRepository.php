<?php

namespace App\Repository;

use App\Entity\CartItem;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CartItem>
 */
class CartItemRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CartItem::class);
    }

    /**
     * Trouve tous les articles du panier pour un utilisateur
     */
    public function findByUserId(int $userId): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.userId = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('c.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve un article dans le panier avec userId et productId
     */
    public function findOneByUserAndProduct(int $userId, int $productId): ?CartItem
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.userId = :userId')
            ->andWhere('c.productId = :productId')
            ->setParameter('userId', $userId)
            ->setParameter('productId', $productId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Supprime tous les articles du panier pour un utilisateur
     */
    public function clearCartForUser(int $userId): void
    {
        $this->createQueryBuilder('c')
            ->delete()
            ->andWhere('c.userId = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->execute();
    }
}
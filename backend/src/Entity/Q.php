<?php

namespace App\Entity;

use App\Repository\QRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QRepository::class)]
class Q
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    public function getId(): ?int
    {
        return $this->id;
    }
}

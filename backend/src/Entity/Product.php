<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['product:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['product:read'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['product:read'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['product:read'])]
    private ?int $price = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['product:read'])]
    private ?string $image = null;

    #[ORM\Column]
    #[Groups(['product:read'])]
    private ?int $stock = null;

    #[ORM\Column(type: 'json')]
    #[Groups(['product:read'])]
    private array $sizes = [];

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['product:read'])]
    private ?string $category = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['product:read'])]
    private ?string $image2 = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['product:read'])]
    private ?string $image3 = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['product:read'])]
    private ?string $ecoScore = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['product:read'])]
    private ?string $labelEcologique = null;

    public function __construct()
    {
        $this->sizes = [];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): static
    {
        $this->price = $price;
        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;
        return $this;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(int $stock): static
    {
        $this->stock = $stock;
        return $this;
    }

    public function getSizes(): array
    {
        return $this->sizes;
    }

    public function setSizes(array $sizes): static
    {
        $this->sizes = $sizes;
        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(?string $category): static
    {
        $this->category = $category;
        return $this;
    }

    public function getImage2(): ?string
    {
        return $this->image2;
    }

    public function setImage2(?string $image2): static
    {
        $this->image2 = $image2;
        return $this;
    }

    public function getImage3(): ?string
    {
        return $this->image3;
    }

    public function setImage3(?string $image3): static
    {
        $this->image3 = $image3;
        return $this;
    }

    public function getEcoScore(): ?string
    {
        return $this->ecoScore;
    }

    public function setEcoScore(?string $ecoScore): static
    {
        $this->ecoScore = $ecoScore;
        return $this;
    }

    public function getLabelEcologique(): ?string
    {
        return $this->labelEcologique;
    }

    public function setLabelEcologique(?string $labelEcologique): static
    {
        $this->labelEcologique = $labelEcologique;
        return $this;
    }
}

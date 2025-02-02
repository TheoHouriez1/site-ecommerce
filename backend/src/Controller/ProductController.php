<?php

namespace App\Controller;

use App\Entity\AddProductHistory;
use App\Entity\Product;
use App\Form\AddProductHistoryType;
use App\Form\ProductType;
use App\Repository\AddProductHistoryRepository;
use App\Repository\ProductRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use App\Form\ProductEditType;

#[Route('/admin/product')]
final class ProductController extends AbstractController
{
    #[Route(name: 'app_product_index', methods: ['GET'])]
    public function index(ProductRepository $productRepository): Response
    {
        return $this->render('product/index.html.twig', [
            'products' => $productRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_product_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $product = new Product();
        $product->setSizes([]); // Initialisation du tableau des tailles
        
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);
    
        if ($form->isSubmitted() && $form->isValid()) {
            foreach (['image', 'image2', 'image3'] as $imageField) {
                $image = $form->get($imageField)->getData();
                if ($image) {
                    $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                    $safeFileName = $slugger->slug($originalName);
                    $newFileName = $safeFileName . '-' . uniqid() . '.' . $image->guessExtension();
    
                    try {
                        $image->move(
                            $this->getParameter('image_dir'),
                            $newFileName
                        );
                    } catch (FileException $exception) {
                    }
    
                    $setter = 'set' . ucfirst($imageField);
                    $product->$setter($newFileName);
                }
            }
    
            $entityManager->persist($product);
            $entityManager->flush();
    
            $stockHistory = new AddProductHistory();
            $stockHistory->setQty($product->getStock());
            $stockHistory->setProduct($product);
            $stockHistory->setCreatedAt(new DateTimeImmutable());
            $entityManager->persist($stockHistory);
            $entityManager->flush();
    
            $this->addFlash('success', 'Votre produit a été ajouté !');
            return $this->redirectToRoute('app_product_index', [], Response::HTTP_SEE_OTHER);
        }
    
        return $this->render('product/new.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }
}

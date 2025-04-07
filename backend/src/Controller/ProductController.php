<?php

namespace App\Controller;

use App\Entity\AddProductHistory;
use App\Entity\Product;
use App\Form\AddProductHistoryType;
use App\Form\ProductType;
use App\Form\ProductEditType;
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
        
                dump("Traitement de l'image : " . $imageField);
        
                if ($image) {
                    dump("Fichier reçu :", $image);
        
                    $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                    $safeFileName = $slugger->slug($originalName);
                    $newFileName = $safeFileName . '-' . uniqid() . '.' . $image->guessExtension();
        
                    dump("Nom du fichier généré : " . $newFileName);
        
                    try {
                        $uploadDir = $this->getParameter('image_dir');
                        dump("Chemin cible : " . $uploadDir);
        
                        if (!file_exists($uploadDir)) {
                            mkdir($uploadDir, 0775, true);
                            dump("Dossier créé : " . $uploadDir);
                        }
        
                        $image->move($uploadDir, $newFileName);
                        dump("Fichier déplacé avec succès");
        
                        $this->addFlash('success', 'Image "' . $newFileName . '" enregistrée dans ' . $uploadDir);
                    } catch (FileException $exception) {
                        dump("Erreur pendant le move :", $exception);
                        $this->addFlash('danger', 'Erreur upload image : ' . $exception->getMessage());
                        die(); // stop l'exécution ici pour que tu vois bien l'erreur
                    }
        
                    $setter = 'set' . ucfirst($imageField);
                    $product->$setter($newFileName);
                } else {
                    dump("Aucun fichier reçu pour : " . $imageField);
                }
            } // 🔴 ICI : fermeture du foreach !
        
            // Reste du code en dehors de la boucle
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

    #[Route('/{id}', name: 'app_product_show')]
    public function show(Product $product): Response
    {
        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_product_edit')]
    public function edit(Request $request, Product $product, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_product_index');
        }

        return $this->render('product/edit.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }

    #[Route('/{id}/stock/add', name: 'app_product_stock_add')]
    public function addStock(Product $product, EntityManagerInterface $entityManager, Request $request): Response
    {
        $product->setStock($product->getStock() + 1);
        $entityManager->flush();

        $this->addFlash('success', 'Stock mis à jour !');

        return $this->redirectToRoute('app_product_index');
    }
    #[Route('/{id}', name: 'app_product_delete', methods: ['POST'])]
    public function delete(Request $request, Product $product, EntityManagerInterface $entityManager): Response
    {
    if ($this->isCsrfTokenValid('delete' . $product->getId(), $request->request->get('_token'))) {
        $entityManager->remove($product);
        $entityManager->flush();

        $this->addFlash('success', 'Produit supprimé avec succès.');
    }

    return $this->redirectToRoute('app_product_index');
    }

}
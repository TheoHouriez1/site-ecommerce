<?php

namespace App\Controller\Admin;

use App\Entity\Product;
use App\Controller\ProductCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;


class DashboardController extends AbstractDashboardController
{
    #[Route('/admin', name: 'admin')] 
    public function index(): Response
    {
        return parent::index();

        $adminUrlGenerator = $this->container->get(AdminUrlGenerator::class);
        return $this->redirect($adminUrlGenerator->setController(ProductCrudController::class)->generateUrl());   
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Admin Dashbord');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToCrud('Product', 'fas fa-Product', Product::class);
    }
}

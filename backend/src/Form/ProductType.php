<?php

namespace App\Form;

use App\Entity\Product;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
        ->add('name')
        ->add('description')
        ->add('price')
        ->add('stock')
        ->add('sizes', ChoiceType::class, [
            'choices' => [
                'XS' => 'XS',
                'S' => 'S',
                'M' => 'M',
                'L' => 'L',
                'XL' => 'XL',
                'XXL' => 'XXL',
            ],
            'multiple' => true,
            'expanded' => true,
        ])
    
            ->add('image', FileType::class, [
                'label' => 'Image du produit',
                'mapped' => false,
                'required' => false,
                'constraints' => [
                    new File([
                        "maxSize" => "1024444k",
                        "mimeTypes" => [
                            'image/jpg',
                            'image/png',
                            'image/jpeg'
                        ],
                        'mimeTypesMessage' => "Votre image de produit doit être au format valide (png, jpg, jpeg)"
                    ])
                ]
            ])
            ->add('image2', FileType::class, [
                'label' => 'Image secondaire',
                'mapped' => false,
                'required' => false,
                'constraints' => [
                    new File([
                        "maxSize" => "1024444k",
                        "mimeTypes" => [
                            'image/jpg',
                            'image/png',
                            'image/jpeg'
                        ],
                        'mimeTypesMessage' => "Votre image doit être au format valide (png, jpg, jpeg)"
                    ])
                ]
            ])
            ->add('image3', FileType::class, [
                'label' => 'Troisième image',
                'mapped' => false,
                'required' => false,
                'constraints' => [
                    new File([
                        "maxSize" => "1024444k",
                        "mimeTypes" => [
                            'image/jpg',
                            'image/png',
                            'image/jpeg'
                        ],
                        'mimeTypesMessage' => "Votre image doit être au format valide (png, jpg, jpeg)"
                    ])
                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}

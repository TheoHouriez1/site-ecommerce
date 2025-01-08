<?php

namespace App\Form;

use App\Entity\Product;
use App\Entity\SubCategory;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormConfigBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('description')
            ->add('price')
            ->add('stock')
            ->add('image',filetype::class ,[
                'label'=> 'image du produit',
                'mapped'=> false,
                'required'=> false,
                'constraints'=>[
                    new File([
                        "maxSize" =>"1024k",
                        "mimeTypes" =>[
                            'image/jpg',
                            'image/png',
                            'image/jpeg'
                        ],
                        'mimeTypesMessage' => "votre image de produit doit etre au format valide(png, jpg, jpeg)"
                    ])
                ]
            ])
            ->add('subCategory', EntityType::class, [
                'class' => SubCategory::class,
                'choice_label' => 'name',
                'multiple' => true,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}

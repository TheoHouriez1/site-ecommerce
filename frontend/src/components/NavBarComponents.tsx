import React, { useContext } from 'react'; // Ajout de l'import React
import ThemeSwitcher from './ThemeSwitch.jsx'
import SeachComponent from './SeachComponent.tsx'
import { CartContext } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react'; 
import '../index.css'; 

import {
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarCollapseBtn,
    NavbarContainer,
    NavbarItem,
    NavbarList,
} from 'keep-react'
  
export const NavbarComponent = () => {
    const navigate = useNavigate(); // Ajoutez cette ligne
    const { cart } = useContext(CartContext); // Utilisez useContext pour récupérer le panier

    return (
      <Navbar defaultTheme="light" storageKey="vite-ui-theme">
        <NavbarContainer className='container mx-auto'>
          <NavbarList>
            <NavbarItem>LOGO</NavbarItem>
            <NavbarItem>Research</NavbarItem>
            <NavbarItem>Contact</NavbarItem>
          </NavbarList>
          <NavbarBrand>
            <NavbarItem>Shop Théo</NavbarItem>
          </NavbarBrand>
          <NavbarList>
            <NavbarItem>
              <button 
                onClick={() => navigate('/panniercomponent')}
                className="relative"
              >
                <ShoppingCart />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </NavbarItem>
            <NavbarItem>
              <SeachComponent />
            </NavbarItem>
            <NavbarItem>
              <ThemeSwitcher />
            </NavbarItem>
          </NavbarList>
          <NavbarCollapseBtn />
          <NavbarCollapse defaultTheme="light" storageKey="vite-ui-theme">
            <NavbarItem>Projects</NavbarItem>
            <NavbarItem>Research</NavbarItem>
            <NavbarItem>Contact</NavbarItem>
            <NavbarItem>Figma</NavbarItem>
            <NavbarItem>documentation</NavbarItem>
            <NavbarItem>
              <button 
                onClick={() => navigate('/cart')}
                className="relative"
              >
                <ShoppingCart />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </NavbarItem>
            <NavbarItem><ThemeSwitcher /></NavbarItem>
          </NavbarCollapse>
        </NavbarContainer>
      </Navbar>
    )
}
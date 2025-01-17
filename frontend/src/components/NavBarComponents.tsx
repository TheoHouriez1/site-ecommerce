import ThemeSwitcher from './ThemeSwitch.jsx'
import { DrawerComponent } from './SeachComponent.tsx'
import { MagnifyingGlass  } from 'phosphor-react'
import '../index.css'; 

import {
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarCollapseBtn,
    NavbarContainer,
    NavbarItem,
    NavbarList,
    Dropdown,
    InputIcon,
    Input,
  
  } from 'keep-react'
  
  export const NavbarComponent = () => {
    return (
      <Navbar defaultTheme="light" storageKey="vite-ui-theme">
        <NavbarContainer className='container mx-auto'>
          <NavbarList >
            <NavbarItem>LOGO</NavbarItem>
            <NavbarItem>Research</NavbarItem>
            <NavbarItem>Contact</NavbarItem>
          </NavbarList>
          <NavbarBrand>
          <NavbarItem>Shop Théo</NavbarItem>
          </NavbarBrand>
          <NavbarList>
          <NavbarList> <DrawerComponent /> </NavbarList>
            <NavbarItem><ThemeSwitcher /></NavbarItem>
          </NavbarList>
          <NavbarCollapseBtn />
          <NavbarCollapse defaultTheme="light" storageKey="vite-ui-theme">
            <NavbarItem>Projects</NavbarItem>
            <NavbarItem>Research</NavbarItem>
            <NavbarItem>Contact</NavbarItem>
            <NavbarItem>Figma</NavbarItem>
            <NavbarItem>doccumentation</NavbarItem>
            <NavbarItem><ThemeSwitcher /></NavbarItem>
          </NavbarCollapse>
        </NavbarContainer>
      </Navbar>
    )
  }
  
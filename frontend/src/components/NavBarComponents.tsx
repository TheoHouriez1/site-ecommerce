import ThemeSwitcher from './ThemeSwitch.jsx'


import {
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarCollapseBtn,
    NavbarContainer,
    NavbarItem,
    NavbarList,
    Dropdown,
  } from 'keep-react'
  
  export const NavbarComponent = () => {
    return (
      <Navbar>
        <NavbarContainer className='container mx-auto'>
          <NavbarList>
            <NavbarItem>Projects</NavbarItem>
            <NavbarItem>Research</NavbarItem>
            <NavbarItem>Contact</NavbarItem>
          </NavbarList>
          <NavbarBrand>
          <NavbarItem>Shop Théo</NavbarItem>
          </NavbarBrand>
          <NavbarList>
            <NavbarItem>Figma</NavbarItem>
            <NavbarItem>Documentation</NavbarItem>
            <NavbarItem><ThemeSwitcher /></NavbarItem>
          </NavbarList>
          <NavbarCollapseBtn />
          <NavbarCollapse>
            <NavbarItem>Projects</NavbarItem>
            <NavbarItem>Research</NavbarItem>
            <NavbarItem>Contact</NavbarItem>
            <NavbarItem>Figma</NavbarItem>
            <NavbarItem>Documentation</NavbarItem>
            <NavbarItem><ThemeSwitcher /></NavbarItem>
          </NavbarCollapse>
        </NavbarContainer>
      </Navbar>
    )
  }
  
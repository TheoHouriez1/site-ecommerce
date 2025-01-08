// src/pages/Home.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavbarComponent } from '../components/NavBarComponents';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <NavbarComponent />

  


    </div>
  );
};

export default Home;

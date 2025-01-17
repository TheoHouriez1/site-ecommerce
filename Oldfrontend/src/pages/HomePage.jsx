// src/pages/Home.js
'use client';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavbarComponent } from '../components/NavBarComponents';
import  DataList   from '../components/DataList';
import '../index.css'; 

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <NavbarComponent />

    </div>
  );
};

export default Home;
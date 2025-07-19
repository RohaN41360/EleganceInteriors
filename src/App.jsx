import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import OurProjects from './components/OurProjects';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <OurProjects />
      <Reviews />
      <Contact />
      <WhatsAppButton />
    </>
  );
}

export default App;

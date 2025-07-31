import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import ReviewUsButton from './components/ReviewUsButton';
import SocialTiles from './components/SocialTiles';
import OurProjects from './components/OurProjects';
import CommercialProjects from './components/CommercialProjects';
import ThemeToggle from './components/ThemeToggle';
import ScrollProgress from './components/ProgressBar';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
              <ScrollProgress />
        <ThemeToggle />
        <Navbar />
        <Hero />
        <About />
        <Services />
        <OurProjects />
        <CommercialProjects />
        <Reviews />
        <Contact />
        <SocialTiles />
        <WhatsAppButton />
        <ReviewUsButton />
    </ThemeProvider>
  );
}

export default App;

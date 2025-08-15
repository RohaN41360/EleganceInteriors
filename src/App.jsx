import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import GetQuote from './components/GetQuote';
import WhyChooseUs from './components/WhyChooseUs';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import ReviewUsButton from './components/ReviewUsButton';
import SocialTiles from './components/SocialTiles';
import OurProjects from './components/OurProjects';
import CommercialProjects from './components/CommercialProjects';
import ThemeToggle from './components/ThemeToggle';
import ScrollProgress from './components/ProgressBar';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';
import styled from 'styled-components';

const Footer = styled.footer`
  width: 100%;
  background: var(--bg-secondary, #f8f8f8);
  color: var(--text-secondary, #888);
  font-size: 0.95rem;
  text-align: center;
  padding: 1.1rem 0 1.1rem 0;
  margin-top: auto;
  box-shadow: 0 -1px 8px rgba(0,0,0,0.03);
  position: relative;
  z-index: 10;
  @media (max-width: 600px) {
    font-size: 0.85rem;
    padding: 0.8rem 0 0.8rem 0;
  }
`;

function App() {
  return (
    <>
      <ThemeProvider>
        <ErrorBoundary><ScrollProgress /></ErrorBoundary>
        <ErrorBoundary><ThemeToggle /></ErrorBoundary>
        <ErrorBoundary><Navbar /></ErrorBoundary>
        <ErrorBoundary><Hero /></ErrorBoundary>
        <ErrorBoundary><About /></ErrorBoundary>
        <ErrorBoundary><Services /></ErrorBoundary>
        <ErrorBoundary><GetQuote /></ErrorBoundary>
        <ErrorBoundary><OurProjects /></ErrorBoundary>
        <ErrorBoundary><CommercialProjects /></ErrorBoundary>
        <ErrorBoundary><WhyChooseUs /></ErrorBoundary>
        <ErrorBoundary><Reviews /></ErrorBoundary>
        <ErrorBoundary><Contact /></ErrorBoundary>
        <ErrorBoundary><SocialTiles /></ErrorBoundary>
        <ErrorBoundary><WhatsAppButton /></ErrorBoundary>
        <ErrorBoundary><ReviewUsButton /></ErrorBoundary>
      </ThemeProvider>
      <Footer>
        Made with ❤ | © {new Date().getFullYear()} All rights reserved.
      </Footer>
    </>
  );
}

export default App;

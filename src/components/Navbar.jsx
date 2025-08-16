import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { FaHammer, FaHome, FaStar, FaEnvelope, FaBars, FaTimes, FaSun, FaMoon, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-scroll';
import { useTheme } from '../context/ThemeContext';

const Nav = styled.nav`
  width: 100%;
  background: var(--bg-primary);
  box-shadow: 0 4px 24px var(--shadow-color);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2000;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  /* Ensure navbar uses the updated dark theme colors */
  &[data-theme="dark"] {
    background: #1a1a1a;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  }
`;
const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1.5rem;
  
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.8rem;
  }
`;
const Logo = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-family: 'Montserrat', Arial, Helvetica, sans-serif;
  letter-spacing: 1px;
  transition: color 0.3s ease;
`;
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isDark ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  border-radius: 8px;
  padding: ${props => props.isDark ? '0.5rem' : '0'};
  margin-right: 1.5rem;
  box-shadow: ${props => props.isDark ? '0 4px 15px rgba(0, 0, 0, 0.1)' : 'none'};
  
  @media (max-width: 768px) {
    margin-right: 1rem;
    padding: ${props => props.isDark ? '0.4rem' : '0'};
  }
  
  @media (max-width: 600px) {
    margin-right: 0.7rem;
    padding: ${props => props.isDark ? '0.3rem' : '0'};
  }
  
  @media (max-width: 480px) {
    margin-right: 0.5rem;
    padding: ${props => props.isDark ? '0.2rem' : '0'};
  }
`;

const LogoImg = styled.img`
  height: 48px;
  max-width: 180px;
  object-fit: contain;
  filter: ${props => props.isDark ? 'brightness(1.2) contrast(1.3) saturate(1.4) drop-shadow(0 0 8px rgba(0, 255, 0, 0.4))' : 'none'};
  transition: filter 0.3s ease;
  
  @media (max-width: 768px) {
    height: 42px;
  }
  
  @media (max-width: 600px) {
    height: 36px;
  }
  
  @media (max-width: 480px) {
    height: 32px;
  }
`;
const LogoWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
`;
const LogoText = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--accent-primary);
  letter-spacing: 1.2px;
  margin-top: 0.1rem;
  margin-left: 0.1rem;
  font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
  opacity: 0.92;
  transition: color 0.3s ease;
  text-shadow: ${props => props.isDark ? '0 0 10px rgba(0, 255, 0, 0.4)' : 'none'};
  
  @media (max-width: 768px) {
    font-size: 0.98rem;
  }
  
  @media (max-width: 600px) {
    font-size: 0.92rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;
const NavLinks = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  align-items: center;
  gap: 2rem;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 900px) {
    gap: 1rem;
  }
  
  @media (max-width: 700px) {
    display: none;
  }
`;
const NavLink = styled(Link)`
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  padding: 0.5rem 1.1rem;
  border-radius: 18px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(230, 177, 122, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #e6b17a, #7f5af0);
    transition: width 0.3s ease;
  }
  
  @media (max-width: 900px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.95rem;
  }
  
  &:hover {
    color: #e6b17a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(230, 177, 122, 0.2);
    
    &::before {
      left: 100%;
    }
    
    &::after {
      width: 100%;
    }
  }
  
  &.active {
    background: linear-gradient(135deg, rgba(230, 177, 122, 0.15), rgba(127, 90, 240, 0.1));
    color: #e6b17a;
    box-shadow: 0 2px 8px rgba(230, 177, 122, 0.2);
    
    &::after {
      width: 100%;
    }
  }
`;
const WhatsAppBtn = styled.a`
  background: #25d366;
  color: #fff;
  border-radius: 50%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-left: 1rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 2px 8px rgba(37,211,102,0.10);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #25d366, #128c7e, #25d366);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.4s ease;
    z-index: -1;
  }
  
  @media (max-width: 700px) {
    display: none;
  }
  
  &:hover {
    background: #128c7e;
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 6px 20px rgba(37,211,102,0.3);
    
    &::before {
      width: 100%;
      height: 100%;
    }
    
    &::after {
      opacity: 1;
    }
  }
`;
const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-primary, #1a3c2e);
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  @media (max-width: 700px) {
    display: block;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;
const DrawerOverlay = styled.div`
  display: none;
  
  @media (max-width: 700px) {
    display: ${({ open }) => (open ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(26,60,46,0.18);
    z-index: 2100;
  }
`;
const Drawer = styled.div`
  display: none;
  
  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 70vw;
    max-width: 320px;
    height: 100vh;
    background: var(--bg-primary, #fff);
    box-shadow: -2px 0 16px var(--shadow-color, rgba(26,60,46,0.10));
    z-index: 2200;
    padding: 2.5rem 1.5rem 1.5rem 1.5rem;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.25s cubic-bezier(.4,0,.2,1), background 0.3s ease;
    
    /* Ensure drawer uses updated dark theme colors */
    &[data-theme="dark"] {
      background: #1a1a1a;
      box-shadow: -2px 0 16px rgba(0, 0, 0, 0.4);
    }
    
    @media (max-width: 480px) {
      width: 80vw;
      padding: 2rem 1.2rem 1.2rem 1.2rem;
    }
  }
`;
const DrawerClose = styled.button`
  background: none;
  border: none;
  color: var(--text-primary, #1a3c2e);
  font-size: 2rem;
  align-self: flex-end;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
`;
const DrawerLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    gap: 1.2rem;
  }
`;


const DrawerThemeToggle = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color, #e6e6e6);
`;

const DrawerToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 25px;
  background: ${props => props.isDark ? '#2C3432' : '#e2e8f0'};
  border-radius: 12.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid ${props => props.isDark ? '#3C4744' : '#cbd5e0'};
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.isDark ? '23px' : '2px'};
    width: 21px;
    height: 21px;
    background: ${props => props.isDark ? '#F0F4ED' : '#fff'};
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const DrawerIconContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 4px;
  pointer-events: none;
`;

const DrawerIcon = styled.div`
  font-size: 0.6rem;
  color: ${props => props.isDark ? '#F0F4ED' : '#4a5568'};
  opacity: ${props => props.active ? 1 : 0.5};
  transition: all 0.3s ease;
`;

const DrawerToggleLabel = styled.div`
  text-align: center;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: color 0.3s ease;
`;

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleDrawer = () => setDrawerOpen((v) => !v);
  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    const handleCloseDrawer = () => setDrawerOpen(false);
    window.addEventListener('closeDrawer', handleCloseDrawer);
    return () => window.removeEventListener('closeDrawer', handleCloseDrawer);
  }, []);

  return (
    <Nav data-theme={isDark ? "dark" : "light"}>
      <NavContainer>
        <LogoWrap>
          <LogoWrapper isDark={isDark}>
            <LogoImg 
              src="https://static.wixstatic.com/media/6a53a1_11091e9fa1f840a396dcae740a2213d5~mv2.png/v1/fill/w_714,h_182,al_c,lg_1,q_85,enc_avif,quality_auto/New%20Project%20(1).png" 
              alt="Elegance Interior Logo" 
              isDark={isDark}
            />
          </LogoWrapper>
          <LogoText isDark={isDark}>Elegance Interiors</LogoText>
        </LogoWrap>
        <NavLinks>
          <NavLink to="home" smooth={true} duration={500} spy={true} offset={-80} activeClass="active"><FaHome /> Home</NavLink>
          <NavLink to="services" smooth={true} duration={500} spy={true} offset={-80} activeClass="active"><FaHammer /> Services</NavLink>
          <NavLink to="our-projects" smooth={true} duration={500} spy={true} offset={-80} activeClass="active"><FaStar /> Our Projects</NavLink>
          <NavLink to="commercial-projects" smooth={true} duration={500} spy={true} offset={-80} activeClass="active"><FaBuilding /> Commercial</NavLink>
          <NavLink to="reviews" smooth={true} duration={500} spy={true} offset={-80} activeClass="active"><FaStar /> Reviews</NavLink>
          <NavLink to="contact" smooth={true} duration={500} spy={true} offset={-80} activeClass="active"><FaEnvelope /> Contact</NavLink>
        </NavLinks>
        <Hamburger onClick={handleDrawer} aria-label="Open navigation menu">
          <FaBars />
        </Hamburger>
      </NavContainer>
      <DrawerOverlay open={drawerOpen} onClick={closeDrawer} />
      <Drawer open={drawerOpen} data-theme={isDark ? "dark" : "light"}>
        <DrawerClose onClick={closeDrawer} aria-label="Close navigation menu">
          <FaTimes />
        </DrawerClose>
        <DrawerLinks>
          <NavLink to="home" smooth={true} duration={500} spy={true} offset={-80} activeClass="active" onClick={closeDrawer}><FaHome /> Home</NavLink>
          <NavLink to="services" smooth={true} duration={500} spy={true} offset={-80} activeClass="active" onClick={closeDrawer}><FaHammer /> Services</NavLink>
          <NavLink to="our-projects" smooth={true} duration={500} spy={true} offset={-80} activeClass="active" onClick={closeDrawer}><FaStar /> Our Projects</NavLink>
          <NavLink to="commercial-projects" smooth={true} duration={500} spy={true} offset={-80} activeClass="active" onClick={closeDrawer}><FaBuilding /> Commercial</NavLink>
          <NavLink to="reviews" smooth={true} duration={500} spy={true} offset={-80} activeClass="active" onClick={closeDrawer}><FaStar /> Reviews</NavLink>
          <NavLink to="contact" smooth={true} duration={500} spy={true} offset={-80} activeClass="active" onClick={closeDrawer}><FaEnvelope /> Contact</NavLink>
        </DrawerLinks>
        <DrawerThemeToggle>
          <div style={{ textAlign: 'center' }}>
            <DrawerToggleSwitch
              isDark={isDark}
              onClick={toggleTheme}
            >
              <DrawerIconContainer>
                <DrawerIcon isDark={isDark} active={!isDark}>
                  <FaSun />
                </DrawerIcon>
                <DrawerIcon isDark={isDark} active={isDark}>
                  <FaMoon />
                </DrawerIcon>
              </DrawerIconContainer>
            </DrawerToggleSwitch>
            <DrawerToggleLabel>Theme</DrawerToggleLabel>
          </div>
        </DrawerThemeToggle>
      </Drawer>
    </Nav>
  );
};

export default Navbar; 
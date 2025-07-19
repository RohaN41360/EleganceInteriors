import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { FaWhatsapp, FaHammer, FaHome, FaStar, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-scroll';

const Nav = styled.nav`
  width: 100%;
  background: #fff;
  box-shadow: 0 4px 24px rgba(26,60,46,0.08);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2000;
  transition: box-shadow 0.2s;
`;
const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1.5rem;
`;
const Logo = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #1a3c2e;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-family: 'Montserrat', Arial, Helvetica, sans-serif;
  letter-spacing: 1px;
`;
const LogoImg = styled.img`
  height: 48px;
  max-width: 180px;
  object-fit: contain;
  margin-right: 1.5rem;
  @media (max-width: 600px) {
    height: 36px;
    margin-right: 0.7rem;
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
  color: #7f5af0;
  letter-spacing: 1.2px;
  margin-top: 0.1rem;
  margin-left: 0.1rem;
  font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
  opacity: 0.92;
  @media (max-width: 600px) {
    font-size: 0.92rem;
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
  color: #1a3c2e;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  padding: 0.5rem 1.1rem;
  border-radius: 18px;
  transition: background 0.18s, color 0.18s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  &:hover, &.active {
    background: #e6b17a22;
    color: #e6b17a;
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
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(37,211,102,0.10);
  @media (max-width: 700px) {
    display: none;
  }
  &:hover {
    background: #128c7e;
  }
`;
const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  color: #1a3c2e;
  font-size: 2rem;
  cursor: pointer;
  @media (max-width: 700px) {
    display: block;
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
    background: #fff;
    box-shadow: -2px 0 16px rgba(26,60,46,0.10);
    z-index: 2200;
    padding: 2.5rem 1.5rem 1.5rem 1.5rem;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.25s cubic-bezier(.4,0,.2,1);
  }
`;
const DrawerClose = styled.button`
  background: none;
  border: none;
  color: #1a3c2e;
  font-size: 2rem;
  align-self: flex-end;
  margin-bottom: 2rem;
  cursor: pointer;
`;
const DrawerLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const DrawerWhatsAppBtn = styled.a`
  background: #25d366;
  color: #fff;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 1.5rem auto 0 auto;
  box-shadow: 0 2px 8px rgba(37,211,102,0.10);
  transition: background 0.2s;
  &:hover {
    background: #128c7e;
  }
`;
const DrawerWhatsAppLabel = styled.div`
  text-align: center;
  color: #25d366;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.3rem;
`;

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawer = () => setDrawerOpen((v) => !v);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <Nav>
      <NavContainer>
        <LogoWrap>
          <LogoImg src="https://static.wixstatic.com/media/6a53a1_11091e9fa1f840a396dcae740a2213d5~mv2.png/v1/fill/w_714,h_182,al_c,lg_1,q_85,enc_avif,quality_auto/New%20Project%20(1).png" alt="Elegance Interior Logo" />
          <LogoText>Elegance Interiors</LogoText>
        </LogoWrap>
        <NavLinks>
          <NavLink to="home" smooth={true} duration={500} spy={true} offset={-80} activeClass="active"><FaHome /> Home</NavLink>
          <NavLink to="services" smooth={true} duration={500} spy={true} offset={-80} activeClass="active"><FaHammer /> Services</NavLink>
          <NavLink to="our-projects" smooth={true} duration={500} spy={true} offset={-80} activeClass="active"><FaStar /> Our Projects</NavLink>
          <NavLink to="reviews" smooth={true} duration={500} spy={true} offset={-80} activeClass="active"><FaStar /> Reviews</NavLink>
          <NavLink to="contact" smooth={true} duration={500} spy={true} offset={-80} activeClass="active"><FaEnvelope /> Contact</NavLink>
        </NavLinks>
        <Hamburger onClick={handleDrawer} aria-label="Open navigation menu">
          <FaBars />
        </Hamburger>
      </NavContainer>
      <DrawerOverlay open={drawerOpen} onClick={closeDrawer} />
      <Drawer open={drawerOpen}>
        <DrawerClose onClick={closeDrawer} aria-label="Close navigation menu">
          <FaTimes />
        </DrawerClose>
        <DrawerLinks>
          <NavLink to="home" smooth={true} duration={500} spy={true} offset={-80} activeClass="active" onClick={closeDrawer}><FaHome /> Home</NavLink>
          <NavLink to="services" smooth={true} duration={500} spy={true} offset={-80} activeClass="active" onClick={closeDrawer}><FaHammer /> Services</NavLink>
          <NavLink to="our-projects" smooth={true} duration={500} spy={true} offset={-80} activeClass="active" onClick={closeDrawer}><FaStar /> Our Projects</NavLink>
          <NavLink to="reviews" smooth={true} duration={500} spy={true} offset={-80} activeClass="active" onClick={closeDrawer}><FaStar /> Reviews</NavLink>
          <NavLink to="contact" smooth={true} duration={500} spy={true} offset={-80} activeClass="active" onClick={closeDrawer}><FaEnvelope /> Contact</NavLink>
          <DrawerWhatsAppBtn href="https://wa.me/917499052825" target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp">
            <FaWhatsapp />
          </DrawerWhatsAppBtn>
          <DrawerWhatsAppLabel>WhatsApp</DrawerWhatsAppLabel>
        </DrawerLinks>
      </Drawer>
    </Nav>
  );
};

export default Navbar; 
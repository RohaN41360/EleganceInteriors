import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminGalleryUpload from './components/AdminGalleryUpload';
import AdminReviews from './components/AdminReviews';
import AdminQuotes from './components/AdminQuotes';
import AdminMessages from './components/AdminMessages';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import styled from 'styled-components';
import { FaImages, FaComments, FaFileAlt, FaSignOutAlt, FaUser, FaBars, FaTimes, FaEnvelope } from 'react-icons/fa';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  
  &.admin-container {
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
  }
`;

const Header = styled.header`
  background: linear-gradient(135deg, #1a3c2e, #2d5a4a);
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const LogoutButton = styled.button`
  background: rgba(230, 177, 122, 0.2);
  color: #e6b17a;
  border: 1px solid #e6b17a;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-height: 44px;
  
  &:hover {
    background: #e6b17a;
    color: #1a3c2e;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
    gap: 0.3rem;
    min-height: 40px;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.6rem;
    font-size: 0.8rem;
    min-height: 36px;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  margin-top: 140px; /* Account for fixed header and navbar */
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 120px;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    margin-top: 110px;
  }
`;

const Navbar = styled.nav`
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 999;
  
  @media (max-width: 768px) {
    top: 60px;
  }
  
  @media (max-width: 480px) {
    top: 55px;
  }
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  justify-content: space-between;
  min-height: 60px;
  overflow-x: auto;
  @media (max-width: 900px) {
    padding: 0 0.5rem;
    min-height: 50px;
  }
  @media (max-width: 768px) {
    padding: 0 0.2rem;
    min-height: 48px;
  }
  @media (max-width: 480px) {
    padding: 0 0.1rem;
    min-height: 44px;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: auto;
  }
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #1a3c2e;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  min-height: 44px;
  min-width: 44px;
  border-radius: 6px;
  
  &:hover {
    color: #e6b17a;
    background: rgba(230, 177, 122, 0.1);
  }
  
  &:active {
    background: rgba(230, 177, 122, 0.2);
    transform: scale(0.95);
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    padding: 0.4rem;
    min-height: 40px;
    min-width: 40px;
  }
`;

const MobileNav = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 998;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const NavItem = styled.button`
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.active ? '#1a3c2e' : '#666'};
  border-bottom: 3px solid ${props => props.active ? '#e6b17a' : 'transparent'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  min-height: 44px;
  @media (max-width: 900px) {
    padding: 0.8rem 1rem;
    font-size: 0.92rem;
    gap: 0.5rem;
  }
  @media (max-width: 768px) {
    padding: 0.7rem 0.7rem;
    font-size: 0.85rem;
    gap: 0.4rem;
    min-height: 40px;
  }
  @media (max-width: 600px) {
    padding: 0.5rem 0.5rem;
    font-size: 0.8rem;
    min-height: 36px;
  }
`;

const AdminApp = () => {
  const [user] = useAuthState(auth);
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };



  if (!user && !loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <AdminContainer className="admin-container">
      <Header>
        <HeaderTitle>Elegance Interiors Admin Panel</HeaderTitle>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </LogoutButton>
      </Header>

      <Navbar>
        <NavContainer>
          <NavItems>
            <NavItem 
              active={activeTab === 'gallery'} 
              onClick={() => handleNavItemClick('gallery')}
            >
              <FaImages />
              Gallery Management
            </NavItem>
            <NavItem 
              active={activeTab === 'reviews'} 
              onClick={() => handleNavItemClick('reviews')}
            >
              <FaComments />
              Reviews Management
            </NavItem>
            <NavItem 
              active={activeTab === 'quotes'} 
              onClick={() => handleNavItemClick('quotes')}
            >
              <FaFileAlt />
              Quote Requests
            </NavItem>
            <NavItem 
              active={activeTab === 'messages'} 
              onClick={() => handleNavItemClick('messages')}
            >
              <FaEnvelope />
              Contact Messages
            </NavItem>
          </NavItems>
          
          <MobileMenu>
            <HamburgerButton onClick={handleMobileMenuToggle}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </HamburgerButton>
          </MobileMenu>
        </NavContainer>
        
        <MobileNav isOpen={isMobileMenuOpen}>
          <NavItem 
            active={activeTab === 'gallery'} 
            onClick={() => handleNavItemClick('gallery')}
          >
            <FaImages />
            Gallery Management
          </NavItem>
          <NavItem 
            active={activeTab === 'reviews'} 
            onClick={() => handleNavItemClick('reviews')}
          >
            <FaComments />
            Reviews Management
          </NavItem>
          <NavItem 
            active={activeTab === 'quotes'} 
            onClick={() => handleNavItemClick('quotes')}
          >
            <FaFileAlt />
            Quote Requests
          </NavItem>
          <NavItem 
            active={activeTab === 'messages'} 
            onClick={() => handleNavItemClick('messages')}
          >
            <FaEnvelope />
            Contact Messages
          </NavItem>
        </MobileNav>
      </Navbar>

      <ContentArea>
        {activeTab === 'gallery' && <AdminGalleryUpload />}
        {activeTab === 'reviews' && <AdminReviews />}
        {activeTab === 'quotes' && <AdminQuotes />}
        {activeTab === 'messages' && <AdminMessages />}
      </ContentArea>
    </AdminContainer>
  );
};

export default AdminApp; 
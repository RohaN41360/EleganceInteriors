import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminGalleryUpload from './components/AdminGalleryUpload';
import AdminReviews from './components/AdminReviews';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import styled from 'styled-components';
import { FaImages, FaComments } from 'react-icons/fa';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: #f7f5f2;
`;

const Header = styled.header`
  background: #1a3c2e;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const LogoutButton = styled.button`
  background: #e6b17a;
  color: #1a3c2e;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background: #d4a06a;
  }
`;

const TabContainer = styled.div`
  display: flex;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.active ? '#e6b17a' : '#666'};
  border-bottom: 3px solid ${props => props.active ? '#e6b17a' : 'transparent'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #e6b17a;
  }
`;

const TabContent = styled.div`
  padding: 2rem;
`;

const AdminApp = () => {
  const [user] = useAuthState(auth);
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user && !loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <AdminContainer>
      <Header>
        <HeaderTitle>Elegance Interiors Admin Panel</HeaderTitle>
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </Header>

      <TabContainer>
        <Tab 
          active={activeTab === 'gallery'} 
          onClick={() => setActiveTab('gallery')}
        >
          <FaImages /> Gallery Management
        </Tab>
        <Tab 
          active={activeTab === 'reviews'} 
          onClick={() => setActiveTab('reviews')}
        >
          <FaComments /> Reviews Management
        </Tab>
      </TabContainer>

      <TabContent>
        {activeTab === 'gallery' && <AdminGalleryUpload />}
        {activeTab === 'reviews' && <AdminReviews />}
      </TabContent>
    </AdminContainer>
  );
};

export default AdminApp; 
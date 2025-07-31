import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaPhone, FaEnvelope, FaPlus, FaTimes } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const FABContainer = styled.div`
  position: fixed;
  bottom: 90px;
  right: 24px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 85px;
    right: 24px;
  }
  
  @media (max-width: 480px) {
    bottom: 80px;
    right: 24px;
  }
`;

const MainButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--cta-color, #e6b17a) 0%, var(--accent-primary, #7f5af0) 100%);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(45deg, #e6b17a, #7f5af0);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
`;

const ActionButton = styled(motion.a)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: ${props => props.bgColor};
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  position: absolute;
  bottom: 0;
  right: 0;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();

  const actions = [
    {
      icon: <FaWhatsapp />,
      href: 'https://wa.me/919876543210',
      bgColor: '#25d366',
      label: 'WhatsApp'
    },
    {
      icon: <FaPhone />,
      href: 'tel:+919876543210',
      bgColor: '#e6b17a',
      label: 'Call'
    },
    {
      icon: <FaEnvelope />,
      href: 'mailto:info@elegance.com',
      bgColor: '#7f5af0',
      label: 'Email'
    }
  ];

  return (
    <FABContainer>
      <AnimatePresence>
        {isOpen && (
          <>
            {actions.map((action, index) => (
              <ActionButton
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                bgColor={action.bgColor}
                initial={{ opacity: 0, scale: 0, x: 0 }}
                animate={{ opacity: 1, scale: 1, x: -(index + 1) * 70 }}
                exit={{ opacity: 0, scale: 0, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={action.label}
              >
                {action.icon}
              </ActionButton>
            ))}
          </>
        )}
      </AnimatePresence>
      
      <MainButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.3 }}
        title={isOpen ? 'Close' : 'Quick Contact'}
      >
        {isOpen ? <FaTimes /> : <FaPlus />}
      </MainButton>
    </FABContainer>
  );
};

export default FloatingActionButton; 
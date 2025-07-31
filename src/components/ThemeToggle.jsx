import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ToggleContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
  }
  
  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
  background: ${props => props.isDark ? '#2C3432' : '#e2e8f0'};
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid ${props => props.isDark ? '#3C4744' : '#cbd5e0'};
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.isDark ? '32px' : '2px'};
    width: 26px;
    height: 26px;
    background: ${props => props.isDark ? '#F0F4ED' : '#fff'};
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    width: 55px;
    height: 28px;
    
    &::before {
      width: 24px;
      height: 24px;
      left: ${props => props.isDark ? '29px' : '2px'};
    }
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 25px;
    
    &::before {
      width: 21px;
      height: 21px;
      left: ${props => props.isDark ? '26px' : '2px'};
    }
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 6px;
  pointer-events: none;
  
  @media (max-width: 768px) {
    padding: 0 5px;
  }
  
  @media (max-width: 480px) {
    padding: 0 4px;
  }
`;

const Icon = styled.div`
  font-size: 0.8rem;
  color: ${props => props.isDark ? '#F0F4ED' : '#4a5568'};
  opacity: ${props => props.active ? 1 : 0.5};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const SunIcon = styled(FaSun)`
  color: #FFD700;
  filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.3));
`;

const MoonIcon = styled(FaMoon)`
  color: #E0E0E0;
  filter: drop-shadow(0 0 2px rgba(224, 224, 224, 0.3));
`;

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ToggleContainer>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ToggleSwitch
          isDark={isDark}
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconContainer>
            <Icon isDark={isDark} active={!isDark}>
              <SunIcon />
            </Icon>
            <Icon isDark={isDark} active={isDark}>
              <MoonIcon />
            </Icon>
          </IconContainer>
        </ToggleSwitch>
      </motion.div>
    </ToggleContainer>
  );
};

export default ThemeToggle; 
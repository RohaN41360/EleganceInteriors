import React from 'react';
import styled from 'styled-components';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingBtn = styled.a`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #25d366;
  color: #fff;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  z-index: 2000;
  transition: background 0.2s;
  
  &:hover {
    background: #128c7e;
  }
  
  @media (max-width: 768px) {
    bottom: 24px;
    right: 24px;
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    font-size: 1.6rem;
  }
  
  @media (max-width: 360px) {
    bottom: 24px;
    right: 24px;
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
  }
`;

const WhatsAppButton = () => (
  <FloatingBtn href="https://wa.me/918806414374" target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp">
    <FaWhatsapp />
  </FloatingBtn>
);

export default WhatsAppButton; 
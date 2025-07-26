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
`;

const WhatsAppButton = () => (
  <FloatingBtn href="https://wa.me/918806414374" target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp">
    <FaWhatsapp />
  </FloatingBtn>
);

export default WhatsAppButton; 
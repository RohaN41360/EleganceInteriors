import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';

const SocialSection = styled.section`
  padding: 4rem 1rem 2rem 1rem;
  background: var(--bg-secondary);
  text-align: center;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 3rem 0.8rem 1.5rem 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0.6rem 1rem 0.6rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-weight: 700;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
`;

const TilesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const SocialTile = styled(motion.div)`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--brand-color), var(--hover-color));
    opacity: 0;
    transition: all 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--brand-color);
  transition: all 0.3s ease;
  
  ${SocialTile}:hover & {
    color: #fff;
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const TileTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a3c2e;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  ${SocialTile}:hover & {
    color: var(--brand-color);
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const TileDescription = styled.p`
  font-size: 0.9rem;
  color: #6c757d;
  text-align: center;
  line-height: 1.4;
  margin-bottom: 0.8rem;
  transition: all 0.3s ease;
  
  ${SocialTile}:hover & {
    color: #495057;
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ContactInfo = styled.div`
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brand-color);
  transition: all 0.3s ease;
  
  ${SocialTile}:hover & {
    color: #fff;
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const socialData = [
  {
    id: 1,
    icon: <FaWhatsapp />,
    title: "WhatsApp",
    description: "Get instant responses to your queries and project discussions",
    contact: "+91 8806414374",
    bgColor: "#25d366",
    hoverBgColor: "#128c7e",
    href: "https://wa.me/918806414374"
  },
  {
    id: 2,
    icon: <FaPhone />,
    title: "Phone Call",
    description: "Speak directly with our expert team for detailed consultations",
    contact: "+91 8806414374",
    bgColor: "#e6b17a",
    hoverBgColor: "#d4a06a",
    href: "tel:+918806414374"
  },
  {
    id: 3,
    icon: <FaEnvelope />,
    title: "Email",
    description: "Send us detailed project requirements and get comprehensive quotes",
    contact: "info@elegance.com",
    bgColor: "#7f5af0",
    hoverBgColor: "#6b4fd8",
    href: "mailto:info@elegance.com"
  },
  {
    id: 4,
    icon: <FaFacebook />,
    title: "Facebook",
    description: "Follow our latest projects and behind-the-scenes content",
    contact: "@EleganceInteriors",
    bgColor: "#1877f2",
    hoverBgColor: "#166fe5",
    href: "https://facebook.com/EleganceInteriors"
  },
  {
    id: 5,
    icon: <FaInstagram />,
    title: "Instagram",
    description: "Explore our portfolio and get inspired by our work",
    contact: "@elegance_interiors_pune",
    bgColor: "#e4405f",
    hoverBgColor: "#c13584",
    href: "https://www.instagram.com/elegance_interiors_pune/?hl=en"
  }
];

const SocialTiles = () => {
  return (
    <SocialSection id="social">
      <Title>Connect With Us</Title>
      <Subtitle>Get in touch with us through your preferred platform</Subtitle>
      
      <TilesContainer>
        {socialData.map((social, index) => (
          <SocialTile
            key={social.id}
            as="a"
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              '--brand-color': social.bgColor,
              '--hover-color': social.hoverBgColor
            }}
          >
            <IconWrapper>
              {social.icon}
            </IconWrapper>
          </SocialTile>
        ))}
      </TilesContainer>
    </SocialSection>
  );
};

export default SocialTiles; 
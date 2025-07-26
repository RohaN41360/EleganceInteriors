import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const heroImgUrl = 'https://res.cloudinary.com/dxw6gft9d/image/upload/v1752918067/elegance/img_o4dmjd.avif';
const personImgUrl = 'https://res.cloudinary.com/dxw6gft9d/image/upload/q_auto,f_auto,w_400,h_400,c_fill,g_face/v1753545761/elegance/WhatsApp_Image_2025-07-26_at_9.23.03_PM_s5yjjw.jpg';

const HeroSection = styled.section`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: url(${heroImgUrl}) center/cover no-repeat;
  color: #fff;
  text-align: center;
  padding: 4rem 1rem 2rem 1rem;
  overflow: hidden;
  
  @media (max-width: 768px) {
    min-height: 80vh;
    padding: 3rem 0.8rem 1.5rem 0.8rem;
  }
  
  @media (max-width: 480px) {
    min-height: 70vh;
    padding: 2rem 0.6rem 1rem 0.6rem;
  }
`;
const Overlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(120deg, rgba(26,60,46,0.7) 60%, rgba(26,60,46,0.4) 100%);
  z-index: 1;
`;
const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    padding: 0 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 0.6rem;
  }
`;
const Title = styled(motion.h1)`
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }
`;
const PersonImgWrap = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1.2rem auto;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
  }
`;
const PersonImg = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 6px 32px 0 rgba(26,60,46,0.18), 0 1.5px 8px 0 rgba(230,177,122,0.12);
  border: 5px solid #fff;
  background: #fff;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
  
  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;
const Subtitle = styled(motion.p)`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }
`;
const CTAButton = styled(motion.a)`
  background: #e6b17a;
  color: #1a3c2e;
  padding: 0.8rem 2.2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  transition: background 0.2s;
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.8rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
  
  &:hover {
    background: #fff;
    color: #e6b17a;
  }
`;

const Hero = () => (
  <HeroSection id="home">
    <Overlay />
    <Content>
      <Title initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        Transforming Spaces with <span style={{ color: '#e6b17a' }}>Elegance</span>
      </Title>
      <PersonImgWrap initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.7 }}>
        <PersonImg src={personImgUrl} alt="Home Interior Expert" />
      </PersonImgWrap>
      <Subtitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
        Bespoke Carpentry & Interior Solutions for Modern Living
      </Subtitle>
      <CTAButton href="#services" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
        Explore Our Services
      </CTAButton>
    </Content>
  </HeroSection>
);

export default Hero; 
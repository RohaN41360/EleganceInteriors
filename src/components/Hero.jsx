import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const heroImgUrl = 'https://res.cloudinary.com/dxw6gft9d/image/upload/v1752918067/elegance/img_o4dmjd.avif';
const personImgUrl = 'https://static.wixstatic.com/media/6a53a1_0ccfa9d9b31c48819c357b57081c5f66~mv2.jpeg/v1/crop/x_27,y_0,w_905,h_1280/fill/w_812,h_1148,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202024-06-20%20at%2012_58_59%20AM.jpeg';

const HeroSection = styled.section`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: url(${heroImgUrl}) center/cover no-repeat;
  color: #fff;
  text-align: center;
  padding-top: 4rem;
  overflow: hidden;
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
`;
const Title = styled(motion.h1)`
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
`;
const PersonImgWrap = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1.2rem auto;
`;
const PersonImg = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 6px 32px 0 rgba(26,60,46,0.18), 0 1.5px 8px 0 rgba(230,177,122,0.12);
  border: 5px solid #fff;
  background: #fff;
  @media (max-width: 600px) {
    width: 90px;
    height: 90px;
  }
`;
const Subtitle = styled(motion.p)`
  font-size: 1.3rem;
  margin-bottom: 2rem;
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
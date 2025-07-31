import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHammer, FaRulerCombined, FaTools } from 'react-icons/fa';

const AboutSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 5rem 1rem 2rem 1rem;
  background: var(--bg-primary);
  transition: all 0.3s ease;
  
  @media (max-width: 900px) {
    flex-direction: column;
    padding: 3rem 0.8rem 1.5rem 0.8rem;
    gap: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0.6rem 1rem 0.6rem;
    gap: 1.5rem;
  }
`;
const AboutText = styled(motion.div)`
  flex: 1.2;
  min-width: 270px;
  max-width: 540px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;
const IconRow = styled.div`
  display: flex;
  width: 100%;
  max-width: 700px;
  margin: 0 auto 2.5rem auto;
  align-items: center;
  justify-content: space-between;
  min-height: 90px;
  
  @media (max-width: 900px) {
    max-width: 98vw;
    min-height: 70px;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 600px) {
    min-height: 54px;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.2rem;
  }
`;
const IconCircle = styled(motion.div)`
  background: linear-gradient(120deg, var(--bg-secondary) 60%, rgba(230, 177, 122, 0.1) 100%);
  border-radius: 50%;
  box-shadow: 0 2px 12px 0 rgba(230,177,122,0.13);
  padding: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s, background 0.2s;
  
  @media (max-width: 768px) {
    padding: 0.6rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
  
  &:hover {
    box-shadow: 0 4px 18px 0 rgba(26,60,46,0.18);
    background: linear-gradient(120deg, rgba(230, 177, 122, 0.2) 60%, var(--bg-secondary) 100%);
  }
`;
const AboutTitle = styled.h2`
  font-size: 2.2rem;
  color: var(--text-primary);
  margin-bottom: 1.2rem;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
  }
`;
const AboutDesc = styled.p`
  font-size: 1.15rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
  line-height: 1.7;
  
  @media (max-width: 768px) {
    font-size: 1.05rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;
const Mission = styled.div`
  background: rgba(230, 177, 122, 0.1);
  border-left: 5px solid var(--accent-primary, #e6b17a);
  padding: 1.1rem 1.5rem;
  border-radius: 12px;
  font-size: 1.08rem;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1.2rem;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1rem 1.2rem;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
  }
`;
const AboutImgWrap = styled(motion.div)`
  flex: 1;
  min-width: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const AboutImg = styled.img`
  width: 320px;
  max-width: 90vw;
  border-radius: 18px;
  box-shadow: 0 6px 32px 0 rgba(26,60,46,0.13), 0 1.5px 8px 0 rgba(230,177,122,0.10);
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: 280px;
    border-radius: 14px;
  }
  
  @media (max-width: 600px) {
    width: 98vw;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    border-radius: 8px;
  }
`;
const VideoWrap = styled(motion.div)`
  width: 480px;
  max-width: 98vw;
  aspect-ratio: 16/9;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 6px 32px 0 rgba(26,60,46,0.13), 0 1.5px 8px 0 rgba(230,177,122,0.10);
  background: #222;
  position: relative;
  cursor: pointer;
  border: 4px solid var(--accent-primary, #e6b17a);
  transition: box-shadow 0.2s, border 0.2s, transform 0.2s;
  margin: 2.5rem auto 0 auto;
  
  @media (max-width: 900px) {
    width: 98vw;
    min-width: 220px;
    border-radius: 14px;
    margin: 2rem auto 0 auto;
  }
  
  @media (max-width: 768px) {
    border-radius: 12px;
    border-width: 3px;
    margin: 1.5rem auto 0 auto;
  }
  
  @media (max-width: 480px) {
    border-radius: 10px;
    border-width: 2px;
    margin: 1.2rem auto 0 auto;
  }
  
  &:hover {
    box-shadow: 0 12px 40px 0 rgba(230,177,122,0.18), 0 2px 12px 0 rgba(26,60,46,0.10);
    border: 4px solid #1a3c2e;
    transform: scale(1.03);
  }
`;
const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #222;
`;
const VideoOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  background: linear-gradient(120deg,rgba(26,60,46,0.08),rgba(230,177,122,0.18));
  pointer-events: none;
`;

const About = () => (
  <AboutSection id="about">
    <AboutText
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <IconRow>
        <IconCircle whileHover={{ scale: 1.2, rotate: -10 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300 }}>
          <FaHammer size={36} color="#e6b17a" />
        </IconCircle>
        <IconCircle whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300 }}>
          <FaRulerCombined size={32} color="#1a3c2e" />
        </IconCircle>
        <IconCircle whileHover={{ scale: 1.2, rotate: -10 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300 }}>
          <FaTools size={34} color="#e6b17a" />
        </IconCircle>
      </IconRow>
      <AboutTitle>About Elegance Interiors</AboutTitle>
      <AboutDesc>
        Elegance Interiors is a leading home and office interior design firm in Pune, specializing in bespoke carpentry, modular kitchens, wardrobes, and complete interior solutions. With a passion for craftsmanship and a commitment to quality, we transform spaces into elegant, functional, and inspiring environments.
      </AboutDesc>
      <Mission>
        <strong>Our Mission:</strong> To deliver innovative, beautiful, and practical interiors that reflect your personality and lifestyle, while ensuring the highest standards of workmanship and customer satisfaction.
      </Mission>
      <AboutDesc>
        From concept to completion, our experienced team works closely with you to bring your vision to life. We believe every space deserves a touch of elegance.
      </AboutDesc>
    </AboutText>
    <AboutImgWrap
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <AboutImg src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80" alt="About Elegance Interiors" />
    </AboutImgWrap>
  </AboutSection>
);

export default About; 
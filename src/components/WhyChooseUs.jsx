import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaAward, 
  FaPalette, 
  FaGem, 
  FaClock, 
  FaHandshake, 
  FaHeart 
} from 'react-icons/fa';

const reasons = [
  {
    icon: <FaAward size={32} color="#e6b17a" />,
    title: 'Experienced Craftsmanship',
    description: 'Over a decade of hands-on experience in delivering modern and traditional woodworking projects with precision.',
    color: '#e6b17a'
  },
  {
    icon: <FaPalette size={32} color="#7f5af0" />,
    title: 'Customized Solutions',
    description: 'Every design is tailored to suit your space, style, and budget.',
    color: '#7f5af0'
  },
  {
    icon: <FaGem size={32} color="#39FF14" />,
    title: 'High-Quality Materials',
    description: 'We use only the finest woods and materials to ensure long-lasting results.',
    color: '#39FF14'
  },
  {
    icon: <FaClock size={32} color="#FF6B35" />,
    title: 'Timely Delivery',
    description: 'Committed to finishing every project on or before schedule without compromising quality.',
    color: '#FF6B35'
  },
  {
    icon: <FaHandshake size={32} color="#00BFFF" />,
    title: 'Transparent Pricing',
    description: 'No hidden charges. Clear estimates and honest communication from start to finish.',
    color: '#00BFFF'
  },
  {
    icon: <FaHeart size={32} color="#FF69B4" />,
    title: 'Client Satisfaction Guaranteed',
    description: '100+ happy clients and glowing reviews across residential and commercial projects.',
    color: '#FF69B4'
  }
];

const Section = styled.section`
  padding: 5rem 1rem 2rem 1rem;
  background: var(--bg-primary);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 3rem 0.8rem 1.5rem 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0.6rem 1rem 0.6rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.6rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
`;

const Card = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: 18px;
  box-shadow: 0 2px 12px var(--shadow-color);
  padding: 2rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.2rem;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.color}20, ${props => props.color}10);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
  position: relative;
  transition: all 0.4s ease;
  
  ${Card}:hover & {
    transform: scale(1.1);
    background: linear-gradient(135deg, ${props => props.color}40, ${props => props.color}20);
  }
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 0 0 0.8rem 0;
  font-weight: 600;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  ${Card}:hover & {
    color: ${props => props.color};
    transform: scale(1.02);
  }
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
  
  ${Card}:hover & {
    color: var(--text-primary);
  }
`;

const WhyChooseUs = () => {
  return (
    <Section id="why-choose-us">
      <Title>Why Choose Us</Title>
      <Subtitle>
        Discover what sets us apart in the world of custom carpentry and interior design
      </Subtitle>
      <Grid>
        {reasons.map((reason, idx) => (
          <Card 
            key={reason.title} 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <IconWrapper color={reason.color}>
              {reason.icon}
            </IconWrapper>
            <CardTitle color={reason.color}>{reason.title}</CardTitle>
            <CardDescription>{reason.description}</CardDescription>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default WhyChooseUs; 
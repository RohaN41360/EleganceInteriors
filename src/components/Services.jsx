import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCouch, FaDoorOpen, FaTools } from 'react-icons/fa';

const services = [
  {
    title: 'Custom Furniture',
    icon: <FaCouch size={32} color="#e6b17a" />,
    img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Modular Kitchens',
    icon: <FaTools size={32} color="#e6b17a" />,
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Wooden Doors',
    icon: <FaDoorOpen size={32} color="#e6b17a" />,
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Wardrobe Installation',
    icon: <FaCouch size={32} color="#e6b17a" />,
    img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
  }
];

const videos = [
  // Video removed as requested
];

const Section = styled.section`
  padding: 5rem 1rem 2rem 1rem;
  background: #f7f5f2;
  
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
  color: #1a3c2e;
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto 2.5rem auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;
const Card = styled(motion.div)`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s;
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.03);
  }
`;
const CardImg = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    height: 160px;
  }
  
  @media (max-width: 480px) {
    height: 140px;
  }
`;
const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: #1a3c2e;
  margin: 0.7rem 0 0.3rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;
const VideoRow = styled.div`
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 auto;
  max-width: 1400px;
  
  @media (max-width: 1200px) {
    gap: 1.5rem;
    max-width: 98vw;
  }
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.8rem;
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
  border: 4px solid #e6b17a;
  transition: box-shadow 0.2s, border 0.2s, transform 0.2s;
  
  @media (max-width: 900px) {
    width: 98vw;
    min-width: 220px;
    border-radius: 14px;
  }
  
  @media (max-width: 768px) {
    border-radius: 12px;
    border-width: 3px;
  }
  
  @media (max-width: 480px) {
    border-radius: 10px;
    border-width: 2px;
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

const Services = () => {
  const videoRef = useRef(null);

  // Play video when in view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(video);
    }
    return () => {
      if (observer && video) observer.unobserve(video);
    };
  }, []);

  // Play on focus or hover
  const handlePlay = () => {
    if (videoRef.current) videoRef.current.play();
  };
  const handlePause = () => {
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <Section id="services">
      <Title>Our Services</Title>
      <Grid>
        {services.map((service, idx) => (
          <Card key={service.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
            <CardImg src={service.img} alt={service.title} />
            {service.icon}
            <CardTitle>{service.title}</CardTitle>
          </Card>
        ))}
      </Grid>
      {videos.length > 0 && (
        <VideoRow>
          <VideoWrap
            onMouseEnter={handlePlay}
            onMouseLeave={handlePause}
            onFocus={handlePlay}
            onBlur={handlePause}
            tabIndex={0}
            aria-label={videos[0].alt}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <StyledVideo
              ref={videoRef}
              src={videos[0].src}
              poster={videos[0].poster}
              muted
              loop
              playsInline
              preload="none"
              controls={false}
              tabIndex={-1}
            />
            <VideoOverlay />
          </VideoWrap>
        </VideoRow>
      )}
    </Section>
  );
};

export default Services; 
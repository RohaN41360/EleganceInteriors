import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiImage, FiVideo } from 'react-icons/fi';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import LazyImage from './LazyImage';

const Section = styled.section`
  padding: 5rem 1rem 2rem 1rem;
  background: var(--bg-primary);
  transition: all 0.3s ease;
  
  @media (max-width: 900px) {
    padding: 3rem 0.8rem 1.5rem 0.8rem;
  }
  
  @media (max-width: 700px) {
    padding: 2rem 0.6rem 1rem 0.6rem;
  }
  
  @media (max-width: 600px) {
    padding: 1.5rem 0.4rem 0.8rem 0.4rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.2rem 0.3rem 0.6rem 0.3rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  color: var(--text-primary);
  margin-bottom: 3rem;
  font-weight: 700;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const SectionTitle = styled.h3`
  text-align: center;
  font-size: 1.8rem;
  color: var(--text-primary);
  margin: 4rem 0 2rem 0;
  font-weight: 600;
  position: relative;
  transition: color 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #e6b17a 0%, #7f5af0 100%);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 3rem 0 1.5rem 0;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin: 2rem 0 1rem 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Card = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  }
`;

const CardImg = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 200px;
  }
  
  @media (max-width: 480px) {
    height: 180px;
  }
`;

const MediaItem = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const VideoItem = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  
  &:hover {
    background: rgba(230, 177, 122, 0.9);
    transform: translate(-50%, -50%) scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
`;

const LoadMoreBtn = styled(motion.button)`
  background: linear-gradient(135deg, #e6b17a 0%, #7f5af0 100%);
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 2rem auto 0 auto;
  display: block;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(230, 177, 122, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
  }
`;

// Lightbox Components
const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;

const LightboxContainer = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
`;

const LightboxVideo = styled.video`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 1.5rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
  z-index: 10000;
  font-weight: bold;
  
  @media (max-width: 768px) {
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    top: 15px;
    right: 15px;
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 1.8rem;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
  z-index: 10000;
  font-weight: bold;
  opacity: ${props => props.visible ? 1 : 0.8};
  pointer-events: auto;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-50%) scale(1.1);
    opacity: 1;
  }
  
  &.prev {
    left: 30px;
    
    @media (max-width: 768px) {
      left: 20px;
    }
    
    @media (max-width: 480px) {
      left: 15px;
    }
  }
  
  &.next {
    right: 30px;
    
    @media (max-width: 768px) {
      right: 20px;
    }
    
    @media (max-width: 480px) {
      right: 15px;
    }
  }
`;

const MediaCounter = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`;

const NoMediaMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  padding: 3rem 1rem;
  background: #fff;
  border-radius: 12px;
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 2rem 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 1.5rem 1rem;
  }
`;

const SectionIcon = styled.div`
  display: inline-block;
  margin-right: 0.5rem;
  font-size: 1.2rem;
  color: #e6b17a;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const OurProjects = () => {
  const [media, setMedia] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);
  const [currentMediaType, setCurrentMediaType] = useState('image');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaRef = collection(db, 'media');
        const q = query(mediaRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const mediaData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMedia(mediaData);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMedia();
  }, []);

  const images = media.filter(item => item.type === 'image');
  const videos = media.filter(item => item.type === 'video');

  const openLightbox = (index, type) => {
    setCurrentMediaIndex(index);
    setCurrentMediaType(type);
    setLightboxOpen(true);
    setShowNavigation(true);
    
    // Auto-hide navigation for videos after 1 second
    if (type === 'video') {
      setTimeout(() => {
        setShowNavigation(false);
      }, 1000);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentVideo(null);
    setIsPlaying(false);
    setShowNavigation(true);
  };

  const nextMedia = () => {
    const currentMedia = currentMediaType === 'image' ? images : videos;
    setCurrentMediaIndex((prev) => (prev + 1) % currentMedia.length);
    setShowNavigation(true);
    
    // Keep navigation visible for videos
    if (currentMediaType === 'video') {
      setShowNavigation(true);
    }
  };

  const prevMedia = () => {
    const currentMedia = currentMediaType === 'image' ? images : videos;
    setCurrentMediaIndex((prev) => (prev - 1 + currentMedia.length) % currentMedia.length);
    setShowNavigation(true);
    
    // Keep navigation visible for videos
    if (currentMediaType === 'video') {
      setShowNavigation(true);
    }
  };

  const handleVideoPlay = (videoElement) => {
    if (videoElement.paused) {
      videoElement.play();
      setIsPlaying(true);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextMedia();
    } else if (e.key === 'ArrowLeft') {
      prevMedia();
    }
  };

  const handleMouseMove = () => {
    if (currentMediaType === 'video') {
      setShowNavigation(true);
    }
  };

  useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightboxOpen]);

  const currentMedia = currentMediaType === 'image' ? images[currentMediaIndex] : videos[currentMediaIndex];

  return (
    <Section id="our-projects">
      <Title>Our Projects</Title>
      
      {/* Photo Tour Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <SectionTitle>
          <SectionIcon>
            <FiImage />
          </SectionIcon>
          Photo Tour of Our Work
        </SectionTitle>
        
        {images.length > 0 ? (
          <Grid>
            {images.map((item, index) => (
              <Card 
                key={item.id}
                onClick={() => openLightbox(index, 'image')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CardImg>
                  <LazyImage src={item.url} alt={item.name || 'Project Image'} />
                </CardImg>
              </Card>
            ))}
          </Grid>
        ) : (
          <NoMediaMessage>
            No project images available at the moment. Check back soon for updates!
          </NoMediaMessage>
        )}
      </motion.div>

      {/* Experience Our Work (Videos) Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <SectionTitle>
          <SectionIcon>
            <FiVideo />
          </SectionIcon>
          Experience Our Work (Videos)
        </SectionTitle>
        
        {videos.length > 0 ? (
          <Grid>
            {videos.map((item, index) => (
              <Card 
                key={item.id}
                onClick={() => openLightbox(index, 'video')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CardImg>
                  <VideoItem 
              src={item.url}
                    muted 
                    onMouseEnter={(e) => {
                      e.target.play();
                      setIsPlaying(true);
                    }}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      setIsPlaying(false);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoPlay(e.target);
                    }}
                  />
                  <PlayButton onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(index, 'video');
                  }}>
                    <FiPlay />
                  </PlayButton>
                </CardImg>
              </Card>
            ))}
          </Grid>
        ) : (
          <NoMediaMessage>
            No project videos available at the moment. Check back soon for updates!
          </NoMediaMessage>
        )}
      </motion.div>

      {lightboxOpen && currentMedia && (
        <LightboxOverlay onClick={closeLightbox} onMouseMove={handleMouseMove}>
          <LightboxContainer onClick={(e) => e.stopPropagation()}>
            {currentMediaType === 'image' ? (
              <LightboxImage src={currentMedia.url} alt={currentMedia.name || 'Project Image'} />
            ) : (
              <LightboxVideo 
                src={currentMedia.url} 
                controls
                autoPlay
                muted={false}
                ref={(el) => setCurrentVideo(el)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            )}
            
            <CloseButton onClick={closeLightbox} aria-label="Close">✕</CloseButton>
            
            {(currentMediaType === 'image' ? images : videos).length > 1 && (
              <>
                <NavigationButton 
                  className="prev" 
                  onClick={prevMedia} 
                  aria-label="Previous"
                  visible={showNavigation}
                >
                  ‹
                </NavigationButton>
                <NavigationButton 
                  className="next" 
                  onClick={nextMedia} 
                  aria-label="Next"
                  visible={showNavigation}
                >
                  ›
                </NavigationButton>
                <MediaCounter>
                  {currentMediaIndex + 1} / {(currentMediaType === 'image' ? images : videos).length}
                </MediaCounter>
              </>
            )}
          </LightboxContainer>
        </LightboxOverlay>
      )}
    </Section>
  );
};

export default OurProjects; 
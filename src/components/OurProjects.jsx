import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiImage, FiVideo, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import LazyImage from './LazyImage';

const Section = styled.section`
  padding: 5rem 1rem 2rem 1rem;
  background: var(--bg-secondary, #fff);
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

// Modern, responsive styled-components for carousel
const CarouselOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;
const CarouselContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30,30,30,0.98);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.35);
  max-width: 96vw;
  max-height: 90vh;
  padding: 0;
  overflow: hidden;
  @media (max-width: 900px) {
    max-width: 99vw;
    max-height: 92vh;
    border-radius: 10px;
  }
  @media (max-width: 600px) {
    max-width: 100vw;
    max-height: 98vh;
    border-radius: 6px;
  }
`;
const CarouselMedia = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #181818;
`;
const CarouselImage = styled.img`
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.18);
  @media (max-width: 600px) {
    max-width: 98vw;
    max-height: 70vh;
    border-radius: 6px;
  }
`;
const CarouselVideo = styled.video`
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.18);
  background: #000;
  @media (max-width: 600px) {
    max-width: 98vw;
    max-height: 70vh;
    border-radius: 6px;
  }
`;
const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent !important;
  border: none !important;
  color: #fff;
  font-size: 2.5rem;
  width: auto;
  height: auto;
  border-radius: 0;
  cursor: pointer;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, transform 0.2s;
  box-shadow: none;
  &:hover, &:focus {
    color: #e6b17a;
    outline: none;
    background: transparent !important;
    border: none !important;
    transform: translateY(-50%) scale(1.08);
  }
  @media (max-width: 600px) {
    font-size: 1.7rem;
  }
`;
const CarouselButtonPrev = styled(CarouselButton)`
  left: 18px;
  @media (max-width: 600px) { left: 6px; }
`;
const CarouselButtonNext = styled(CarouselButton)`
  right: 18px;
  @media (max-width: 600px) { right: 6px; }
`;
const CarouselClose = styled(CarouselButton)`
  top: 24px;
  right: 24px;
  left: auto;
  transform: none;
  @media (max-width: 600px) {
    top: 8px;
    right: 8px;
  }
`;
const CarouselCounter = styled.div`
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: #fff;
  padding: 8px 18px;
  border-radius: 18px;
  font-size: 1rem;
  font-weight: 600;
  z-index: 10001;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  @media (max-width: 600px) {
    font-size: 0.9rem;
    padding: 6px 12px;
    bottom: 8px;
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
    // Dispatch custom event to close mobile drawer
    window.dispatchEvent(new Event('closeDrawer'));
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentVideo(null);
    setIsPlaying(false);
    setShowNavigation(true);
    // Dispatch custom event to close mobile drawer
    window.dispatchEvent(new Event('closeDrawer'));
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
        <AnimatePresence>
          <CarouselOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
          >
            <CarouselContainer
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            >
              <CarouselMedia>
            {currentMediaType === 'image' ? (
                  <CarouselImage
                    src={currentMedia.url}
                    alt={currentMedia.name || 'Project Image'}
                    as={motion.img}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <CarouselVideo
                src={currentMedia.url} 
                controls
                autoPlay
                muted={false}
                    ref={el => setCurrentVideo(el)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                    as={motion.video}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.3 }}
              />
            )}
              </CarouselMedia>
              {/* Navigation Controls */}
            {(currentMediaType === 'image' ? images : videos).length > 1 && (
              <>
                  <CarouselButtonPrev onClick={prevMedia} aria-label="Previous">
                    <FiChevronLeft />
                    <span style={{ position: 'absolute', left: '-9999px' }}>Previous</span>
                  </CarouselButtonPrev>
                  <CarouselButtonNext onClick={nextMedia} aria-label="Next">
                    <FiChevronRight />
                    <span style={{ position: 'absolute', left: '-9999px' }}>Next</span>
                  </CarouselButtonNext>
                  <CarouselCounter>
                  {currentMediaIndex + 1} / {(currentMediaType === 'image' ? images : videos).length}
                  </CarouselCounter>
              </>
            )}
              <CarouselClose onClick={closeLightbox} aria-label="Close">
                <FiX />
                <span style={{ position: 'absolute', left: '-9999px' }}>Close</span>
              </CarouselClose>
            </CarouselContainer>
          </CarouselOverlay>
        </AnimatePresence>
      )}
    </Section>
  );
};

export default OurProjects; 
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiPlay, FiHome, FiShoppingBag } from 'react-icons/fi';
import { FaBuilding, FaCoffee } from 'react-icons/fa';
import LazyImage from './LazyImage';

const Section = styled.section`
  padding: 80px 0;
  background: var(--bg-section);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
  
  @media (max-width: 480px) {
    padding: 40px 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--text-primary, #1a3c2e);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-secondary, #666);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 2rem;
  }
`;

const FilterBtn = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--border-color, #e6e6e6);
  background: ${props => props.$active ? 'var(--accent-primary, #1a3c2e)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : 'var(--text-primary, #1a3c2e)'};
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: var(--accent-primary, #1a3c2e);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(26, 60, 46, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Card = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0,0,0,0.1));
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  backdrop-filter: blur(5px);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px var(--shadow-color, rgba(0,0,0,0.15));
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(26, 60, 46, 0.1) 0%, rgba(26, 60, 46, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
    z-index: 2;
  }
  
  &:hover::after {
    transform: translateX(100%);
  }
`;

const MediaContainer = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;
  background: var(--bg-secondary, #f8f9fa);
  
  /* Special handling for retail images */
  &:has(img[src*="retail"]) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
  }
  
  /* Fallback for browsers without :has() support */
  &.retail-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
  }
  
  @media (max-width: 768px) {
    height: 200px;
    
    &:has(img[src*="retail"]) {
      padding: 10px;
    }
    
    &.retail-container {
      padding: 10px;
    }
  }
`;

const MediaItem = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
  
  /* Better fitting for retail and restaurant images */
  &[src*="retail"] {
    object-fit: contain;
    background: var(--bg-secondary, #f8f9fa);
  }
  
  &[src*="restraunt"] {
    object-fit: cover;
    object-position: center 30%;
  }
  
  @media (max-width: 768px) {
    &[src*="retail"] {
      object-fit: contain;
      padding: 10px;
    }
    
    &[src*="restraunt"] {
      object-position: center 25%;
    }
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--accent-primary, #1a3c2e);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary, #1a3c2e);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CardCategory = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--accent-primary, #1a3c2e);
  color: #fff;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const CardDesc = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary, #666);
  margin-bottom: 0;
`;

const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
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
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
`;

const LightboxVideo = styled.video`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
  controls
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    top: -40px;
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: ${props => props.$visible ? 1 : 0.8};
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &.prev {
    left: -70px;
  }
  
  &.next {
    right: -70px;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    
    &.prev {
      left: -50px;
    }
    
    &.next {
      right: -50px;
    }
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
`;

const NoImagesMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary, #666);
  font-size: 1.1rem;
`;

const CommercialProjects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(0);
  const [currentMediaType, setCurrentMediaType] = useState('image');

  const projects = [
    {
      id: 1,
      title: "Luxury Hotel Lobby",
      category: "hotel",
      description: "Custom reception desk, elegant wall panels, and sophisticated lighting fixtures creating a welcoming atmosphere for guests.",
      media: [
        { type: "image", url: "https://res.cloudinary.com/dxw6gft9d/image/upload/v1753949879/elegance/hotel1_jicxjw.jpg" },
        { type: "image", url: "https://res.cloudinary.com/dxw6gft9d/image/upload/v1753949879/elegance/hotel2_marlki.jpg" }
      ]
    },
    {
      id: 2,
      title: "Modern Office Workspace",
      category: "office",
      description: "Modular workstations, custom storage solutions, and acoustic panels designed for productivity and collaboration.",
      media: [
        { type: "image", url: "https://res.cloudinary.com/dxw6gft9d/image/upload/v1753949879/elegance/office1_qs5ply.jpg" },
        { type: "image", url: "https://res.cloudinary.com/dxw6gft9d/image/upload/v1753949901/elegance/office2_eflwtr.jpg" }
      ]
    },
    {
      id: 3,
      title: "Boutique Retail Store",
      category: "retail",
      description: "Custom display units, elegant shelving systems, and branded furniture pieces that enhance the shopping experience.",
      media: [
        { type: "image", url: "https://res.cloudinary.com/dxw6gft9d/image/upload/v1753949878/elegance/retail_y3zkdv.jpg" }
      ]
    },
    {
      id: 4,
      title: "Fine Dining Restaurant",
      category: "restaurant",
      description: "Custom dining tables, elegant bar counter, and ambient lighting fixtures creating an intimate dining atmosphere.",
      media: [
        { type: "image", url: "https://res.cloudinary.com/dxw6gft9d/image/upload/v1753949879/elegance/restraunt1_pt2cuk.jpg" },
        { type: "image", url: "https://res.cloudinary.com/dxw6gft9d/image/upload/v1753949879/elegance/restraunt2_ssqb3o.jpg" }
      ]
    },
    {
      id: 5,
      title: "Corporate Conference Room",
      category: "office",
      description: "Custom conference table, integrated AV systems, and acoustic wall treatments for professional presentations.",
      media: [
        { type: "image", url: "https://res.cloudinary.com/dxw6gft9d/image/upload/v1753949901/elegance/office2_eflwtr.jpg" }
      ]
    },
    {
      id: 6,
      title: "Boutique Hotel Suite",
      category: "hotel",
      description: "Custom furniture pieces, elegant headboards, and sophisticated storage solutions for luxury accommodation.",
      media: [
        { type: "image", url: "https://res.cloudinary.com/dxw6gft9d/image/upload/v1753949879/elegance/hotel2_marlki.jpg" }
      ]
    }
  ];

  const filters = [
    { id: 'all', label: 'All Projects', icon: FaBuilding },
    { id: 'hotel', label: 'Hotels', icon: FaBuilding },
    { id: 'office', label: 'Offices', icon: FiHome },
    { id: 'retail', label: 'Retail', icon: FiShoppingBag },
    { id: 'restaurant', label: 'Restaurants', icon: FaCoffee }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const allMedia = filteredProjects.flatMap(project => 
    project.media.map(media => ({ ...media, projectTitle: project.title }))
  );

  const openLightbox = (index, type) => {
    setCurrentMedia(index);
    setCurrentMediaType(type);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextMedia = () => {
    setCurrentMedia((prev) => (prev + 1) % allMedia.length);
  };

  const prevMedia = () => {
    setCurrentMedia((prev) => (prev - 1 + allMedia.length) % allMedia.length);
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

  React.useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightboxOpen]);

  return (
    <Section id="commercial-projects">
      <Container>
        <Title>Our Work in Commercial Spaces</Title>
        <Subtitle>
          From elegant hotel lobbies to dynamic office environments, we transform commercial spaces 
          with custom woodwork, modular solutions, and sophisticated interior elements.
        </Subtitle>

        <FilterRow>
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <FilterBtn
                key={filter.id}
                $active={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
              >
                <IconComponent />
                {filter.label}
              </FilterBtn>
            );
          })}
        </FilterRow>

        {filteredProjects.length > 0 ? (
          <Grid>
            {filteredProjects.map((project, index) => (
              <Card
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {project.media[0] && (
                  <MediaContainer className={project.category === 'retail' ? 'retail-container' : ''}>
                    <MediaItem onClick={() => openLightbox(0, project.media[0].type)}>
                      {project.media[0].type === 'video' ? (
                        <>
                          <Video src={project.media[0].url} muted />
                          <PlayButton>
                            <FiPlay />
                          </PlayButton>
                        </>
                      ) : (
                        <LazyImage src={project.media[0].url} alt={project.title} />
                      )}
                    </MediaItem>
                  </MediaContainer>
                )}
                <CardContent>
                  <CardCategory>{project.category.charAt(0).toUpperCase() + project.category.slice(1)}</CardCategory>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDesc>{project.description}</CardDesc>
                </CardContent>
              </Card>
            ))}
          </Grid>
        ) : (
          <NoImagesMessage>
            No projects found for the selected category.
          </NoImagesMessage>
        )}

        {lightboxOpen && (
          <LightboxOverlay onClick={closeLightbox}>
            <LightboxContainer onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={closeLightbox}>
                <FiX />
              </CloseButton>
              
              {allMedia.length > 1 && (
                <>
                  <NavigationButton 
                    className="prev" 
                    onClick={prevMedia}
                    $visible={true}
                  >
                    <FiChevronLeft />
                  </NavigationButton>
                  <NavigationButton 
                    className="next" 
                    onClick={nextMedia}
                    $visible={true}
                  >
                    <FiChevronRight />
                  </NavigationButton>
                </>
              )}

              {currentMediaType === 'video' ? (
                <LightboxVideo 
                  src={allMedia[currentMedia].url} 
                  autoPlay 
                  controls
                  muted={false}
                />
              ) : (
                <LightboxImage src={allMedia[currentMedia].url} alt={allMedia[currentMedia].projectTitle} />
              )}

              <ImageCounter>
                {currentMedia + 1} / {allMedia.length}
              </ImageCounter>
            </LightboxContainer>
          </LightboxOverlay>
        )}
      </Container>
    </Section>
  );
};

export default CommercialProjects; 
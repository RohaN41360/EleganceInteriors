import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { FiImage, FiGrid, FiChevronDown } from 'react-icons/fi';

const CATEGORIES = [
  'All',
  'Modular Kitchen',
  'Wardrobe',
  'Ceiling',
  'Living Room',
  'Bedroom',
  'TV Unit',
  'False Ceiling',
  'Other',
];
const PAGE_SIZE = 6;

const Section = styled.section`
  padding: 5rem 1rem 2rem 1rem;
  background: #f7f7fa;
`;
const Title = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  color: #232946;
  margin-bottom: 2.5rem;
  font-weight: 900;
`;
const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2.5rem;
`;
const FilterBtn = styled.button`
  background: ${({ active }) => (active ? 'linear-gradient(90deg, #7f5af0 0%, #00e6e6 100%)' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#232946')};
  border: 2px solid #e6eaf0;
  border-radius: 22px;
  padding: 0.7rem 1.7rem;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px #7f5af011;
  transition: background 0.18s, color 0.18s, border 0.18s;
  &:hover, &:focus {
    background: linear-gradient(90deg, #00e6e6 0%, #7f5af0 100%);
    color: #fff;
    border: 2px solid #7f5af0;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.2rem 2vw;
  max-width: 1200px;
  margin: 0 auto 2.5rem auto;
`;
const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(44,83,100,0.10);
  padding: 2rem 1.2rem 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  align-items: flex-start;
  position: relative;
  min-width: 0;
  border: 1.5px solid #e6eaf0;
  transition: box-shadow 0.2s, border 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 8px 32px #7f5af033;
    border-color: #7f5af0;
    transform: translateY(-4px) scale(1.02);
  }
`;
const CardTitle = styled.h3`
  font-size: 1.25rem;
  color: #232946;
  font-weight: 800;
  margin-bottom: 0.2rem;
`;
const CardDesc = styled.p`
  color: #4a6572;
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
`;
const CardCategory = styled.div`
  font-size: 0.98rem;
  color: #7f5af0;
  font-weight: 700;
  margin-bottom: 0.7rem;
  letter-spacing: 0.5px;
`;
const GalleryRow = styled.div`
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;
const GalleryMedia = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 16/10;
  border-radius: 12px;
  overflow: hidden;
  background: #eee;
  box-shadow: 0 2px 8px #7f5af011;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const GalleryImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  display: block;
`;
const GalleryVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  display: block;
  background: #000;
`;
const LoadMoreBtn = styled.button`
  display: block;
  margin: 2.5rem auto 0 auto;
  background: linear-gradient(90deg, #7f5af0 0%, #00e6e6 100%);
  color: #fff;
  border: none;
  border-radius: 22px;
  padding: 1rem 2.5rem;
  font-size: 1.15rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 2px 12px #7f5af022;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  &:hover, &:focus {
    background: linear-gradient(90deg, #00e6e6 0%, #7f5af0 100%);
    color: #fff;
    box-shadow: 0 4px 24px #00e6e644;
  }
`;
const LightboxOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(44,41,70,0.85);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LightboxImg = styled.img`
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 18px;
  box-shadow: 0 8px 40px #7f5af066;
  background: #fff;
`;
const LightboxClose = styled.button`
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 2.5rem;
  cursor: pointer;
  z-index: 1001;
  &:hover {
    color: #00e6e6;
  }
`;

function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index);
  if (!images || images.length === 0) return null;
  return (
    <LightboxOverlay onClick={onClose}>
      <LightboxImg src={images[current]} alt="Project" onClick={e => e.stopPropagation()} />
      <LightboxClose onClick={onClose} title="Close"><FiImage /></LightboxClose>
    </LightboxOverlay>
  );
}

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.2rem 2vw;
  max-width: 1200px;
  margin: 0 auto 2.5rem auto;
`;
const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #232946;
  font-weight: 800;
  margin: 2.5rem 0 1.2rem 0;
  text-align: center;
`;

const OurProjects = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const videoRefs = useRef({});

  const fetchMedia = async (reset = false) => {
    setLoading(true);
    let q = query(
      collection(db, 'media'),
      orderBy('createdAt', 'desc'),
      ...(reset ? [limit(PAGE_SIZE)] : [startAfter(lastDoc), limit(PAGE_SIZE)])
    );
    const snap = await getDocs(q);
    const newMedia = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMedia(reset ? newMedia : [...media, ...newMedia]);
    setLastDoc(snap.docs[snap.docs.length - 1]);
    setHasMore(snap.docs.length === PAGE_SIZE);
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia(true);
    // eslint-disable-next-line
  }, []);

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    fetchMedia(false);
  };

  // Video hover handlers
  const handleVideoPlay = (id) => {
    if (videoRefs.current[id]) {
      videoRefs.current[id].play();
    }
  };
  const handleVideoPause = (id) => {
    if (videoRefs.current[id]) {
      videoRefs.current[id].pause();
      videoRefs.current[id].currentTime = 0;
    }
  };

  // Separate images and videos
  const images = media.filter(item => item.type === 'image' || (item.url && !item.url.match(/\.(mp4|webm|mov)$/i)));
  const videos = media.filter(item => item.type === 'video' || (item.url && item.url.match(/\.(mp4|webm|mov)$/i)));

  return (
    <Section id="our-projects">
      <Title>Our Projects</Title>
      <SectionTitle>Project Images</SectionTitle>
      <MediaGrid>
        {images.map(item => (
          <GalleryMedia key={item.id}>
            <GalleryImg src={item.url} alt={item.name || 'Project Image'} loading="lazy" />
          </GalleryMedia>
        ))}
      </MediaGrid>
      <SectionTitle>Project Videos</SectionTitle>
      <MediaGrid>
        {videos.map(item => (
          <GalleryMedia key={item.id}>
            <GalleryVideo
              ref={el => (videoRefs.current[item.id] = el)}
              src={item.url}
              preload="none"
              tabIndex={0}
              poster={item.poster || ''}
              onMouseEnter={() => handleVideoPlay(item.id)}
              onMouseLeave={() => handleVideoPause(item.id)}
              onFocus={() => handleVideoPlay(item.id)}
              onBlur={() => handleVideoPause(item.id)}
              controls={false}
              playsInline
              style={{ cursor: 'pointer' }}
            />
          </GalleryMedia>
        ))}
      </MediaGrid>
      {hasMore && (
        <LoadMoreBtn onClick={handleLoadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </LoadMoreBtn>
      )}
    </Section>
  );
};

export default OurProjects; 
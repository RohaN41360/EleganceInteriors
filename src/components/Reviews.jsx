import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaStar } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Section = styled.section`
  padding: 5rem 1rem 2rem 1rem;
  background: var(--bg-secondary);
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
  font-weight: 700;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  max-width: 600px;
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

const ReviewCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-primary);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 8px 32px var(--shadow-color);
  max-width: 450px;
  margin: 0 auto;
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '"';
    position: absolute;
    top: 1rem;
    left: 1.5rem;
    font-size: 4rem;
    color: rgba(230, 177, 122, 0.2);
    font-family: serif;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    max-width: 400px;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1.2rem;
    max-width: 350px;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  }
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e6b17a 0%, #7f5af0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  border: 4px solid #e6b17a;
  box-shadow: 0 4px 16px rgba(230, 177, 122, 0.3);
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    margin-bottom: 1.2rem;
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

const Name = styled.h3`
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 0.3rem;
  font-weight: 700;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Location = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Text = styled.p`
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  text-align: center;
  font-style: italic;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const Stars = styled.div`
  color: #e6b17a;
  margin-bottom: 0.5rem;
  display: flex;
  gap: 0.2rem;
  
  svg {
    font-size: 1.2rem;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  padding: 0 4rem;
  margin: 0 auto;
  max-width: 800px;
  
  @media (max-width: 768px) {
    padding: 0 3rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 2.5rem;
  }
  
  .carousel .slide {
    padding: 0 1rem;
    
    @media (max-width: 768px) {
      padding: 0 0.5rem;
    }
    
    @media (max-width: 480px) {
      padding: 0 0.3rem;
    }
  }
  
  .carousel .control-dots {
    bottom: -2rem;
    
    .dot {
      background: #e6b17a;
      opacity: 0.3;
      
      &.selected {
        opacity: 1;
      }
    }
  }
  
  .carousel .control-arrow {
    background: rgba(230, 177, 122, 0.9);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgba(230, 177, 122, 0.4);
    transition: all 0.3s ease;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    
    @media (max-width: 768px) {
      width: 55px;
      height: 55px;
    }
    
    @media (max-width: 480px) {
      width: 50px;
      height: 50px;
    }
    
    &:hover {
      background: rgba(230, 177, 122, 1);
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 4px 12px rgba(230, 177, 122, 0.3);
    }
    
    &::before {
      border-color: #fff;
      border-width: 3px;
      width: 12px;
      height: 12px;
    }
    
    &.control-prev {
      left: -30px;
      
      &::before {
        border-right: 3px solid #fff;
        border-bottom: 3px solid #fff;
        transform: rotate(135deg);
      }
    }
    
    &.control-next {
      right: -30px;
      
      &::before {
        border-left: 3px solid #fff;
        border-bottom: 3px solid #fff;
        transform: rotate(-45deg);
      }
    }
  }
`;

const NoReviewsMessage = styled.div`
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

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        
        // Get only approved reviews without orderBy to avoid index requirement
        const approvedReviewsQuery = query(
          reviewsRef,
          where('approved', '==', true)
        );
        const approvedReviewsSnapshot = await getDocs(approvedReviewsQuery);
        const approvedReviews = approvedReviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by createdAt in JavaScript
        approvedReviews.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt?.seconds * 1000) || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt?.seconds * 1000) || new Date(0);
          return dateB - dateA; // Sort newest first
        });
        
        setReviews(approvedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Section id="reviews">
        <Title>What Our Customers Say</Title>
        <Subtitle>Loading reviews...</Subtitle>
      </Section>
    );
  }

  return (
    <Section id="reviews">
      <Title>What Our Customers Say</Title>
      <Subtitle>Don't just take our word for it - hear from our satisfied customers</Subtitle>
      
      {reviews.length > 0 ? (
        <CarouselContainer>
          <Carousel 
            showThumbs={false} 
            showStatus={false} 
            infiniteLoop 
            autoPlay 
            interval={4000}
            showArrows={true}
            showIndicators={true}
            stopOnHover={true}
            swipeable={true}
            emulateTouch={true}
            useKeyboardArrows={true}
            dynamicHeight={false}
          >
            {reviews.map((review, idx) => (
              <ReviewCard key={review.id}>
                <Avatar>
                  {getInitials(review.name)}
                </Avatar>
                <Name>{review.name}</Name>
                <Location>{review.location}</Location>
                <Text>"{review.text}"</Text>
                <Stars>
                  {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                </Stars>
              </ReviewCard>
            ))}
          </Carousel>
        </CarouselContainer>
      ) : (
        <NoReviewsMessage>
          No reviews available yet. Be the first to share your experience!
        </NoReviewsMessage>
      )}
    </Section>
  );
};

export default Reviews; 
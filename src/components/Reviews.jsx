import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaStar } from 'react-icons/fa';

const reviews = [
  {
    name: 'Amit Sharma',
    text: 'Elegance Interiors transformed my living room! The craftsmanship is top-notch.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
  },
  {
    name: 'Priya Verma',
    text: 'Professional, punctual, and creative. Highly recommended for custom furniture.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
  },
  {
    name: 'Rahul Singh',
    text: 'Loved the modular kitchen design. The team was very responsive and skilled.',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    rating: 4,
  },
];

const Section = styled.section`
  padding: 5rem 1rem 2rem 1rem;
  background: #fff;
`;
const Title = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  color: #1a3c2e;
  margin-bottom: 2.5rem;
`;
const ReviewCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f7f5f2;
  border-radius: 18px;
  padding: 2rem 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  max-width: 400px;
  margin: 0 auto;
`;
const Avatar = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
`;
const Name = styled.h3`
  font-size: 1.1rem;
  color: #1a3c2e;
  margin-bottom: 0.5rem;
`;
const Text = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 1rem;
`;
const Stars = styled.div`
  color: #e6b17a;
  margin-bottom: 0.5rem;
`;

const Reviews = () => (
  <Section id="reviews">
    <Title>Customer Reviews</Title>
    <Carousel showThumbs={false} showStatus={false} infiniteLoop autoPlay interval={5000}>
      {reviews.map((review, idx) => (
        <ReviewCard key={idx}>
          <Avatar src={review.avatar} alt={review.name} />
          <Name>{review.name}</Name>
          <Stars>
            {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
          </Stars>
          <Text>"{review.text}"</Text>
        </ReviewCard>
      ))}
    </Carousel>
  </Section>
);

export default Reviews; 
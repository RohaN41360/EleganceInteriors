import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaStar, FaUser, FaMapMarkerAlt, FaCommentDots, FaHeart } from 'react-icons/fa';

const Section = styled.section`
  padding: 5rem 1rem 2rem 1rem;
  background: linear-gradient(120deg, #f7f5f2 60%, #e6b17a22 100%);
  color: #1a3c2e;
  
  @media (max-width: 768px) {
    padding: 3rem 0.8rem 1.5rem 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0.6rem 1rem 0.6rem;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const Info = styled.div`
  @media (max-width: 900px) {
    order: 2;
  }
`;

const InfoTitle = styled.h2`
  font-size: 2.2rem;
  color: #1a3c2e;
  margin-bottom: 1rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FormWrap = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  border: 1px solid rgba(230, 177, 122, 0.1);
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h3`
  font-size: 1.8rem;
  color: #1a3c2e;
  margin-bottom: 1rem;
  font-weight: 700;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Intro = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Field = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1a3c2e;
  font-size: 1rem;
  
  &::after {
    content: '*';
    color: #e6b17a;
    margin-left: 0.2rem;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #1a3c2e;
  font-size: 1.15rem;
  z-index: 3;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 1.1rem 1.2rem 1.1rem 2.7rem;
  border-radius: 12px;
  border: 1.5px solid #1a3c2e;
  font-size: 1.08rem;
  background: #fff;
  color: #232946;
  box-shadow: 0 1.5px 8px #7f5af011;
  transition: border 0.18s, box-shadow 0.18s;
  margin-bottom: 0.2rem;
  appearance: none;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    padding: 1rem 1.1rem 1rem 2.5rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.9rem 1rem 0.9rem 2.3rem;
    font-size: 0.95rem;
  }
  
  &:focus {
    border: 1.5px solid #7f5af0;
    outline: none;
    box-shadow: 0 2px 12px #7f5af044;
    background: #f7f5f2;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 1.1rem 1.2rem 1.1rem 2.7rem;
  border-radius: 12px;
  border: 1.5px solid #1a3c2e;
  font-size: 1.08rem;
  background: #fff;
  color: #232946;
  box-shadow: 0 1.5px 8px #7f5af011;
  transition: border 0.18s, box-shadow 0.18s;
  margin-bottom: 0.2rem;
  min-height: 110px;
  resize: vertical;
  font-family: inherit;
  
  @media (max-width: 768px) {
    padding: 1rem 1.1rem 1rem 2.5rem;
    font-size: 1rem;
    min-height: 100px;
  }
  
  @media (max-width: 480px) {
    padding: 0.9rem 1rem 0.9rem 2.3rem;
    font-size: 0.95rem;
    min-height: 90px;
  }
  
  &:focus {
    border: 1.5px solid #7f5af0;
    outline: none;
    box-shadow: 0 2px 12px #7f5af044;
    background: #f7f5f2;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const RatingSection = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(230, 177, 122, 0.05);
  border-radius: 12px;
  border: 1.5px solid rgba(230, 177, 122, 0.2);
`;

const RatingLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #1a3c2e;
  font-size: 1rem;
`;

const RatingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 1.8rem;
  color: ${props => props.filled ? '#e6b17a' : '#ddd'};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 50%;
  
  &:hover {
    color: #e6b17a;
    transform: scale(1.1);
    background: rgba(230, 177, 122, 0.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, #e6b17a 0%, #7f5af0 100%);
  color: #fff;
  border: none;
  padding: 1.1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(230, 177, 122, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(230, 177, 122, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 3rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const ModalIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => props.type === 'success' ? '#28a745' : '#dc3545'};
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  color: #1a3c2e;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const ModalMessage = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
`;

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 0,
    text: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [modalType, setModalType] = useState('success');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.rating || !formData.text) {
      setModalMsg('Please fill in all fields');
      setModalType('error');
      setShowModal(true);
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, 'reviews'), {
        ...formData,
        approved: false,
        createdAt: serverTimestamp()
      });

      setFormData({
        name: '',
        location: '',
        rating: 0,
        text: ''
      });
      setModalMsg('Thank you! Your review has been submitted.');
      setModalType('success');
      setShowModal(true);
    } catch (error) {
      console.error('Error submitting review:', error);
      setModalMsg('Something went wrong. Please try again.');
      setModalType('error');
      setShowModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => setShowModal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  return (
    <Section id="review-form">
      <Container>
        <Info>
          <InfoTitle>Share Your Experience</InfoTitle>
          <InfoText>
            We'd love to hear about your experience with Elegance Interiors. 
            Your feedback helps us improve and helps other customers make informed decisions.
            Share your thoughts and help us continue delivering exceptional service.
          </InfoText>
        </Info>

        <FormWrap>
          <Title>Write a Review</Title>
          <Intro>
            Tell us about your experience with our services
          </Intro>
          
          <StyledForm onSubmit={handleSubmit}>
            <Field>
              <Label>Your Name</Label>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <StyledInput
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </Field>

            <Field>
              <Label>Location</Label>
              <InputIcon>
                <FaMapMarkerAlt />
              </InputIcon>
              <StyledInput
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your city/location"
                required
              />
            </Field>

            <RatingSection>
              <RatingLabel>Rate Your Experience</RatingLabel>
              <RatingContainer>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarButton
                    key={star}
                    type="button"
                    filled={star <= (hoveredRating || formData.rating)}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <FaStar />
                  </StarButton>
                ))}
              </RatingContainer>
            </RatingSection>

            <Field>
              <Label>Your Review</Label>
              <InputIcon>
                <FaCommentDots />
              </InputIcon>
              <StyledTextArea
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                placeholder="Share your experience with us..."
                required
              />
            </Field>

            <Button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </StyledForm>
        </FormWrap>
      </Container>

      {/* Modal for success/error */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalClose onClick={() => setShowModal(false)}>&times;</ModalClose>
            <ModalIcon type={modalType}>
              {modalType === 'success' ? <FaHeart /> : '⚠️'}
            </ModalIcon>
            <ModalTitle>
              {modalType === 'success' ? 'Thank You!' : 'Oops!'}
            </ModalTitle>
            <ModalMessage>{modalMsg}</ModalMessage>
          </Modal>
        </ModalOverlay>
      )}
    </Section>
  );
};

export default ReviewForm; 
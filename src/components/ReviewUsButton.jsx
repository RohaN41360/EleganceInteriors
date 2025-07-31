import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaUser, FaEnvelope, FaCommentDots, FaTimes, FaHeart } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Button = styled(motion.button)`
  position: fixed;
  bottom: 100px;
  right: 24px;
  background: linear-gradient(135deg, var(--cta-color, #e6b17a) 0%, var(--accent-primary, #7f5af0) 100%);
  color: #fff;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(230, 177, 122, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(230, 177, 122, 0.4);
  }
  
  @media (max-width: 768px) {
    bottom: 90px;
    right: 24px;
    padding: 0.7rem 1rem;
    font-size: 0.8rem;
    gap: 0.3rem;
  }
  
  @media (max-width: 480px) {
    bottom: 90px;
    right: 24px;
    width: 56px;
    height: 56px;
    padding: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
  }
  
  @media (max-width: 360px) {
    bottom: 85px;
    right: 24px;
    width: 50px;
    height: 50px;
  }
`;

const ButtonText = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

const ButtonIcon = styled.div`
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
  
  @media (max-width: 360px) {
    font-size: 1.8rem;
  }
`;

const ModalOverlay = styled(motion.div)`
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
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    padding: 2rem;
    max-height: 95vh;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
  
  @media (max-width: 480px) {
    top: 1rem;
    right: 1rem;
    font-size: 1.3rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  color: #1a3c2e;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
  }
`;

const ModalSubtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    gap: 1.2rem;
  }
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
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 1.1rem 1.2rem 1.1rem 2.7rem;
  border-radius: 12px;
  border: 1.5px solid var(--text-primary, #1a3c2e);
  font-size: 1.08rem;
  background: var(--bg-primary, #fff);
  color: var(--text-primary, #232946);
  box-shadow: 0 1.5px 8px var(--shadow-color, #7f5af011);
  transition: border 0.18s, box-shadow 0.18s, background 0.18s, color 0.18s;
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
    background: var(--bg-secondary, #f7f5f2);
    color: var(--text-primary, #232946);
  }
  
  &::placeholder {
    color: var(--text-secondary, #999);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 1.1rem 1.2rem 1.1rem 2.7rem;
  border-radius: 12px;
  border: 1.5px solid var(--text-primary, #1a3c2e);
  font-size: 1.08rem;
  background: var(--bg-primary, #fff);
  color: var(--text-primary, #232946);
  box-shadow: 0 1.5px 8px var(--shadow-color, #7f5af011);
  transition: border 0.18s, box-shadow 0.18s, background 0.18s, color 0.18s;
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
    background: var(--bg-secondary, #f7f5f2);
    color: var(--text-primary, #232946);
  }
  
  &::placeholder {
    color: var(--text-secondary, #999);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: var(--text-primary, #1a3c2e);
  font-size: 1.15rem;
  z-index: 3;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const TextAreaIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 1.5rem;
  color: #1a3c2e;
  z-index: 2;
  font-size: 1.15rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const RatingSection = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(230, 177, 122, 0.05);
  border-radius: 12px;
  border: 1.5px solid rgba(230, 177, 122, 0.2);
  
  @media (max-width: 480px) {
    padding: 1.2rem;
  }
`;

const RatingLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #1a3c2e;
  font-size: 1rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  
  @media (max-width: 480px) {
    gap: 0.6rem;
  }
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: ${props => props.filled ? '#e6b17a' : '#ddd'};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 50%;
  
  &:hover {
    color: #e6b17a;
    transform: scale(1.2);
    background: rgba(230, 177, 122, 0.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    padding: 0.4rem;
  }
`;

const SubmitButton = styled(motion.button)`
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
  
  @media (max-width: 480px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const ReviewUsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    text: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
    
    if (!formData.rating || !formData.text) {
      setMessage({ type: 'error', text: 'Please provide a rating and review text' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await addDoc(collection(db, 'reviews'), {
        ...formData,
        approved: false,
        createdAt: serverTimestamp()
      });

      setFormData({
        name: '',
        email: '',
        rating: 0,
        text: ''
      });
      setMessage({ 
        type: 'success', 
        text: 'Thank you for your feedback!' 
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage({ 
        type: 'error', 
        text: 'Something went wrong. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      name: '',
      email: '',
      rating: 0,
      text: ''
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ButtonIcon>
          <FaStar />
        </ButtonIcon>
        <ButtonText>Share Your Feedback</ButtonText>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <Modal
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>

              <ModalTitle>Tell Us What You Think</ModalTitle>
              <ModalSubtitle>
                Leave a Review About Your Experience
              </ModalSubtitle>

              <Form onSubmit={handleSubmit}>
                <Field>
                  <Label>Name (Optional)</Label>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </Field>

                <Field>
                  <Label>Email (Optional)</Label>
                  <IconWrapper>
                    <FaEnvelope />
                  </IconWrapper>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </Field>

                <RatingSection>
                  <RatingLabel>Rate Your Experience *</RatingLabel>
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
                  <Label>Your Review *</Label>
                  <TextAreaIconWrapper>
                    <FaCommentDots />
                  </TextAreaIconWrapper>
                  <TextArea
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    placeholder="Share your experience with us..."
                    required
                  />
                </Field>

                <SubmitButton
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </SubmitButton>

                {message.type && (
                  message.type === 'success' ? (
                    <SuccessMessage
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <FaHeart />
                      {message.text}
                    </SuccessMessage>
                  ) : (
                    <ErrorMessage
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {message.text}
                    </ErrorMessage>
                  )
                )}
              </Form>
            </Modal>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReviewUsButton; 
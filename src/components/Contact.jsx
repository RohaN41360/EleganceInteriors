import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaUser, FaPhone, FaCommentDots } from 'react-icons/fa';

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
const Container = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (min-width: 800px) {
    flex-direction: row;
  }
  
  @media (max-width: 768px) {
    border-radius: 14px;
  }
  
  @media (max-width: 480px) {
    border-radius: 12px;
  }
`;
const Info = styled.div`
  flex: 1;
  background: #1a3c2e;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 2.5rem 2rem;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    gap: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1.2rem;
    gap: 1rem;
  }
`;
const InfoTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #e6b17a;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;
const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 0.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    gap: 0.5rem;
  }
`;
const InstaLink = styled.a`
  color: #e6b17a;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;
const FormWrap = styled.div`
  flex: 2;
  padding: 2.5rem 2rem;
  background: linear-gradient(120deg, #f7f5f2 60%, #e6b17a11 100%);
  border-radius: 18px;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1.2rem;
  }
`;
const Title = styled.h2`
  text-align: left;
  font-size: 2.2rem;
  color: #1a3c2e;
  margin-bottom: 2.5rem;
  font-weight: 900;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;
const Intro = styled.p`
  font-size: 1.18rem;
  color: #1a3c2e;
  margin-bottom: 1.7rem;
  text-align: left;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 1.05rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1.2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;
const Field = styled.div`
  position: relative;
  width: 100%;
`;
const Label = styled.label`
  position: absolute;
  top: 1.1rem;
  left: 2.7rem;
  color: #1a3c2e;
  font-size: 1.08rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  background: transparent;
  pointer-events: none;
  transition: 0.18s all;
  opacity: 0.92;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    top: 1rem;
    left: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    top: 0.9rem;
    left: 2.3rem;
  }
  
  &.active {
    top: -0.7rem;
    left: 2.2rem;
    font-size: 0.92rem;
    background: #fff;
    padding: 0 0.3em;
    border-radius: 6px;
    opacity: 1;
    color: #1a3c2e;
    font-weight: 800;
    
    @media (max-width: 768px) {
      font-size: 0.85rem;
      left: 2rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
      left: 1.8rem;
    }
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
`;
const Button = styled(motion.button)`
  background: #1a3c2e;
  color: #fff;
  padding: 0.8rem 2.2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  transition: background 0.2s, color 0.2s, border 0.2s;
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.8rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 1.5rem;
    font-size: 0.95rem;
  }
  
  &:hover, &:focus {
    background: #fff;
    color: #1a3c2e;
    border: 1.5px solid #1a3c2e;
  }
`;
const SuccessMsg = styled.p`
  color: #1a3c2e;
  text-align: center;
  font-weight: 600;
`;
const ErrorMsg = styled.p`
  color: #1a3c2e;
  text-align: center;
  font-weight: 600;
  margin-top: -0.7rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(44, 41, 70, 0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Modal = styled.div`
  background: linear-gradient(120deg, #fff 80%, #f7f5f2 100%);
  border-radius: 22px;
  box-shadow: 0 16px 48px 0 #23294633, 0 2px 12px #7f5af044;
  border: 2.5px solid #e6eaf0;
  padding: 2.2rem 2rem 2rem 2rem;
  max-width: 98vw;
  width: 340px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  
  @media (max-width: 600px) {
    width: 98vw;
    padding: 1.5rem 1rem 1.5rem 1rem;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.2rem 0.8rem 1.2rem 0.8rem;
    gap: 0.8rem;
  }
`;
const ModalClose = styled.button`
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  background: #fff;
  border: none;
  color: #232946;
  font-size: 2.1rem;
  font-weight: 900;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px #7f5af022;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  z-index: 10;
  
  @media (max-width: 480px) {
    width: 2rem;
    height: 2rem;
    font-size: 1.8rem;
  }
  
  &:hover, &:focus {
    background: #ff5959;
    color: #fff;
    box-shadow: 0 4px 16px #ff595955;
  }
`;

const Contact = () => {
  const form = useRef();
  const [formVals, setFormVals] = useState({ name: '', email: '', phone: '', message: '' });
  const [focus, setFocus] = useState({});
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [modalType, setModalType] = useState('success'); // 'success' or 'error'

  const handleChange = e => {
    setFormVals({ ...formVals, [e.target.name]: e.target.value });
    setError('');
  };
  const handleFocus = e => setFocus({ ...focus, [e.target.name]: true });
  const handleBlur = e => setFocus({ ...focus, [e.target.name]: !!formVals[e.target.name] });

  const validate = () => {
    if (!formVals.name.trim()) return 'Name is required.';
    if (!formVals.email.trim()) return 'Email is required.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formVals.email)) return 'Enter a valid email.';
    if (formVals.phone && !/^\+?\d{7,15}$/.test(formVals.phone.replace(/\s/g, ''))) return 'Enter a valid phone number.';
    if (!formVals.message.trim()) return 'Message is required.';
    return '';
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setModalMsg(err);
      setModalType('error');
      setShowModal(true);
      return;
    }
    try {
      await addDoc(collection(db, 'messages'), {
        ...formVals,
        createdAt: serverTimestamp(),
        read: false,
      });
      setSent(true);
      setModalMsg('Thank you! Your message has been sent.');
      setModalType('success');
      setShowModal(true);
      setFormVals({ name: '', email: '', phone: '', message: '' });
      setFocus({});
    } catch (e) {
      setModalMsg('Something went wrong. Please try again.');
      setModalType('error');
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => setShowModal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  return (
    <Section id="contact">
      <Container initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Info>
          <InfoTitle>Contact Information</InfoTitle>
          <InfoItem><FaPhoneAlt color="#1a3c2e" /> +91 88064 14374</InfoItem>
          <InfoItem><FaEnvelope color="#1a3c2e" /> info@eleganceinteriors.com</InfoItem>
          <InstaLink href="https://www.instagram.com/elegance_interiors_pune/?igsh=MWdwcWR0bmo4cm5keg%3D%3D" target="_blank" rel="noopener noreferrer"><FaInstagram color="#1a3c2e" /> elegance_interiors_pune</InstaLink>
        </Info>
        <FormWrap>
          <Title>We'd Love to Hear From You</Title>
          <Intro>We'd love to hear from you! Fill out the form and our team will get back to you soon.</Intro>
          <StyledForm autoComplete="on" onSubmit={sendMessage}>
            <Field>
              <InputIcon><FaUser /></InputIcon>
              <StyledInput
                type="text"
                name="name"
                value={formVals.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="name"
                required
              />
              <Label className={focus.name || formVals.name ? 'active' : ''}>Full Name</Label>
            </Field>
            <Field>
              <InputIcon><FaEnvelope /></InputIcon>
              <StyledInput
                type="email"
                name="email"
                value={formVals.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="email"
                required
              />
              <Label className={focus.email || formVals.email ? 'active' : ''}>Email</Label>
            </Field>
            <Field>
              <InputIcon><FaPhone /></InputIcon>
              <StyledInput
                type="tel"
                name="phone"
                value={formVals.phone}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="tel"
                placeholder=""
              />
              <Label className={focus.phone || formVals.phone ? 'active' : ''}>Phone (optional)</Label>
            </Field>
            <Field>
              <InputIcon><FaCommentDots /></InputIcon>
              <StyledTextArea
                name="message"
                value={formVals.message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
              <Label className={focus.message || formVals.message ? 'active' : ''}>Message</Label>
            </Field>
            <Button type="submit" whileTap={{ scale: 0.95 }}>Send Message</Button>
            {error && <ErrorMsg>{error}</ErrorMsg>}
            {/* Modal for success/error */}
            {showModal && (
              <ModalOverlay onClick={()=>setShowModal(false)}>
                <Modal onClick={e=>e.stopPropagation()}>
                  <ModalClose onClick={()=>setShowModal(false)}>&times;</ModalClose>
                  <div style={{
                    color: modalType==='success' ? '#1a3c2e' : '#ff5959',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    textAlign: 'center',
                    marginBottom: '0.7rem',
                  }}>{modalMsg}</div>
                  <div style={{color:'#888',fontSize:'0.98rem',textAlign:'center'}}>This will close automatically in 5 seconds.</div>
                </Modal>
              </ModalOverlay>
            )}
          </StyledForm>
        </FormWrap>
      </Container>
    </Section>
  );
};

export default Contact; 
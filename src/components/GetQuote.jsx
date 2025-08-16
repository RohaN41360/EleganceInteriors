import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaPhone, FaCommentDots, FaHome, FaBuilding, FaHotel, FaShoppingBag, FaDollarSign } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';

const projectTypes = [
  { value: 'home', label: 'Home Interior', icon: <FaHome /> },
  { value: 'office', label: 'Office Setup', icon: <FaBuilding /> },
  { value: 'hotel', label: 'Hotel', icon: <FaHotel /> },
  { value: 'retail', label: 'Retail Space', icon: <FaShoppingBag /> },
  { value: 'other', label: 'Other', icon: <FaBuilding /> }
];
const budgetRanges = [
  { value: 'under-50k', label: 'Under ₹50,000' },
  { value: '50k-100k', label: '₹50,000 - ₹1,00,000' },
  { value: '100k-250k', label: '₹1,00,000 - ₹2,50,000' },
  { value: '250k-500k', label: '₹2,50,000 - ₹5,00,000' },
  { value: '500k+', label: '₹5,00,000+' },
  { value: 'not-sure', label: 'Not Sure' }
];

// Styled-components copied from Contact.jsx (with unique names to avoid conflicts)
const Section = styled.section`
  background: var(--bg-secondary, #fff);
  border-radius: 18px;
  box-shadow: 0 4px 20px var(--shadow-color);
  padding: 2.5rem 2.2rem 2.2rem 2.2rem;
  margin: 2rem 0;
  @media (max-width: 600px) {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    border-radius: 10px;
  }
`;
const FormWrap = styled.div`
  background: var(--bg-card);
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--shadow-color, rgba(0,0,0,0.1));
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color, rgba(230, 177, 122, 0.1));
  @media (max-width: 768px) { padding: 2rem; }
  @media (max-width: 480px) { padding: 1.5rem; }
`;
const Title = styled.h2`
  text-align: left;
  font-size: 2.2rem;
  color: var(--text-primary);
  margin-bottom: 2.5rem;
  font-weight: 900;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
  @media (max-width: 768px) { font-size: 1.8rem; margin-bottom: 2rem; }
  @media (max-width: 480px) { font-size: 1.5rem; margin-bottom: 1.5rem; }
`;
const Intro = styled.p`
  font-size: 1.18rem;
  color: var(--text-primary);
  margin-bottom: 1.7rem;
  text-align: left;
  font-weight: 500;
  transition: color 0.3s ease;
  @media (max-width: 768px) { font-size: 1.05rem; margin-bottom: 1.5rem; }
  @media (max-width: 480px) { font-size: 1rem; margin-bottom: 1.2rem; }
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) { gap: 1.2rem; }
  @media (max-width: 480px) { gap: 1rem; }
`;
const Field = styled.div`
  position: relative;
  width: 100%;
`;
const Label = styled.label`
  position: absolute;
  top: 1.1rem;
  left: 2.7rem;
  color: var(--text-primary);
  font-size: 1.08rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  background: transparent;
  pointer-events: none;
  transition: 0.18s all;
  opacity: 0.92;
  z-index: 2;
  @media (max-width: 768px) { font-size: 1rem; top: 1rem; left: 2.5rem; }
  @media (max-width: 480px) { font-size: 0.95rem; top: 0.9rem; left: 2.3rem; }
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
    @media (max-width: 768px) { font-size: 0.85rem; left: 2rem; }
    @media (max-width: 480px) { font-size: 0.8rem; left: 1.8rem; }
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
  @media (max-width: 768px) { font-size: 1.1rem; }
  @media (max-width: 480px) { font-size: 1rem; }
`;
const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 1.1rem 1.2rem 1.1rem 2.7rem;
  border-radius: 12px;
  border: 1.5px solid var(--text-primary);
  font-size: 1.08rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: 0 1.5px 8px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-bottom: 0.2rem;
  appearance: none;
  line-height: 1.2;
  position: relative;
  @media (max-width: 768px) { padding: 1rem 1.1rem 1rem 2.5rem; font-size: 1rem; }
  @media (max-width: 480px) { padding: 0.9rem 1rem 0.9rem 2.3rem; font-size: 0.95rem; }
  &:hover { border: 1.5px solid #e6b17a; box-shadow: 0 4px 16px rgba(230, 177, 122, 0.2); transform: translateY(-2px); }
  &:focus { border: 1.5px solid #7f5af0; outline: none; box-shadow: 0 6px 20px rgba(127, 90, 240, 0.3); background: var(--bg-secondary); color: var(--text-primary); transform: translateY(-2px); }
`;
const StyledTextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 1.1rem 1.2rem 1.1rem 2.7rem;
  border-radius: 12px;
  border: 1.5px solid var(--text-primary);
  font-size: 1.08rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: 0 1.5px 8px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-bottom: 0.2rem;
  min-height: 110px;
  resize: vertical;
  position: relative;
  @media (max-width: 768px) { padding: 1rem 1.1rem 1rem 2.5rem; font-size: 1rem; min-height: 100px; }
  @media (max-width: 480px) { padding: 0.9rem 1rem 0.9rem 2.3rem; font-size: 0.95rem; min-height: 90px; }
  &:hover { border: 1.5px solid #e6b17a; box-shadow: 0 4px 16px rgba(230, 177, 122, 0.2); transform: translateY(-2px); }
  &:focus { border: 1.5px solid #7f5af0; outline: none; box-shadow: 0 6px 20px rgba(127, 90, 240, 0.3); background: var(--bg-secondary); color: var(--text-primary); transform: translateY(-2px); }
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
  box-shadow: 0 4px 16px rgba(26, 60, 46, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  @media (max-width: 768px) { padding: 0.7rem 1.8rem; font-size: 1rem; }
  @media (max-width: 480px) { padding: 0.6rem 1.5rem; font-size: 0.95rem; }
  &:hover, &:focus { background: #2d5a4a; color: #fff; transform: translateY(-3px); box-shadow: 0 8px 25px rgba(26, 60, 46, 0.3); }
`;
const ErrorMsg = styled.p`
  color: #1a3c2e;
  text-align: center;
  font-weight: 600;
  margin-top: -0.7rem;
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
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
`;
const ModalDialog = styled(motion.div)`
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f1f5f9;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  isolation: isolate;
  & * { overscroll-behavior: contain; }
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  & > * { overscroll-behavior: contain; }
  &:focus { outline: none; }
  @media (max-width: 768px) { padding: 2rem; max-height: 95vh; }
  @media (max-width: 480px) { padding: 1.5rem; border-radius: 16px; max-height: 98vh; }
`;
const ModalClose = styled.button`
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
  &:hover { background: #f0f0f0; color: #333; }
  @media (max-width: 480px) { top: 1rem; right: 1rem; font-size: 1.3rem; }
`;

// Add styled select to match input style and fix label overlap
const StyledSelect = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 1.1rem 1.2rem 1.1rem 2.7rem;
  border-radius: 12px;
  border: 1.5px solid var(--text-primary);
  font-size: 1.08rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: 0 1.5px 8px var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-bottom: 0.2rem;
  appearance: none;
  line-height: 1.2;
  position: relative;
  &:hover {
    border: 1.5px solid #e6b17a;
    box-shadow: 0 4px 16px rgba(230, 177, 122, 0.2);
    transform: translateY(-2px);
  }
  &:focus {
    border: 1.5px solid #7f5af0;
    outline: none;
    box-shadow: 0 6px 20px rgba(127, 90, 240, 0.3);
    background: var(--bg-secondary);
    color: var(--text-primary);
    transform: translateY(-2px);
  }
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.3s ease;
  @media (max-width: 768px) { font-size: 1rem; margin-bottom: 0.8rem; }
  @media (max-width: 480px) { font-size: 0.9rem; margin-bottom: 0.6rem; }
`;
const Description = styled.p`
  text-align: center;
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 2.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  transition: color 0.3s ease;
  @media (max-width: 768px) { font-size: 0.95rem; margin-bottom: 2rem; }
  @media (max-width: 480px) { font-size: 0.9rem; margin-bottom: 1.5rem; }
`;
const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ToggleButton = styled(motion.button)`
  background: #1a3c2e;
  color: #fff;
  padding: 0.8rem 2.2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(26, 60, 46, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
  &:hover, &:focus { background: #2d5a4a; color: #fff; transform: translateY(-3px); box-shadow: 0 8px 25px rgba(26, 60, 46, 0.3); }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 2rem;
`;

const GetQuote = () => {
  const [formVals, setFormVals] = useState({ name: '', email: '', phone: '', message: '', projectType: '', budgetRange: '' });
  const [focus, setFocus] = useState({});
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [modalType, setModalType] = useState('success');
  const modalRef = useRef(null);

  // Scroll isolation and body lock (like ReviewUsButton)
  useEffect(() => {
    if (modalOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.dataset.scrollY = scrollY.toString();
      if (modalRef.current) modalRef.current.focus();
    } else {
      const scrollY = document.body.dataset.scrollY;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        delete document.body.dataset.scrollY;
      }
    }
    return () => {
      const scrollY = document.body.dataset.scrollY;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        delete document.body.dataset.scrollY;
      }
    };
  }, [modalOpen]);

  // Modal accessibility: close on Escape
  const handleModalKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setModalOpen(false);
  }, []);

  // Modal scroll/touch isolation
  const handleModalScroll = useCallback((e) => { e.stopPropagation(); }, []);
  const handleModalWheel = useCallback((e) => { e.stopPropagation(); }, []);
  const handleModalTouchStart = useCallback((e) => { e.stopPropagation(); }, []);
  const handleModalTouchMove = useCallback((e) => { e.stopPropagation(); }, []);
  const handleModalTouchEnd = useCallback((e) => { e.stopPropagation(); }, []);

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

  const sendQuote = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setModalMsg(err);
      setModalType('error');
      return;
    }
    try {
      await addDoc(collection(db, 'quotes'), {
        name: formVals.name,
        email: formVals.email,
        phone: formVals.phone,
        message: formVals.message,
        projectType: formVals.projectType,
        budgetRange: formVals.budgetRange,
        createdAt: serverTimestamp(),
        status: 'new',
      });
      setSent(true);
      setModalMsg('Thank you! Your quote request has been sent.');
      setModalType('success');
      setFormVals({ name: '', email: '', phone: '', message: '', projectType: '', budgetRange: '' });
      setFocus({});
      setTimeout(() => setModalOpen(false), 1500);
    } catch (e) {
      setModalMsg('Something went wrong. Please try again.');
      setModalType('error');
    }
  };

  return (
    <>
    <Section id="get-quote">
        <Title style={{textAlign: 'center'}}>Get a Custom Quote Today</Title>
      <Subtitle>Tailored pricing for your specific needs, space, and design vision.</Subtitle>
      <Description>
        Whether it's a modular kitchen, elegant wardrobes, office furniture, or a complete interior makeover – tell us your requirements and our team will get back to you with a personalized estimate.
      </Description>
        <ButtonWrapper>
          <ToggleButton onClick={() => setModalOpen(true)} whileTap={{ scale: 0.95 }}>
            Get a Quote
      </ToggleButton>
        </ButtonWrapper>
      </Section>
      {typeof window !== 'undefined' && ReactDOM.createPortal(
      <AnimatePresence>
          {modalOpen && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
            >
              <ModalDialog
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={handleModalScroll}
                onWheel={handleModalWheel}
                onKeyDown={handleModalKeyDown}
                onTouchStart={handleModalTouchStart}
                onTouchMove={handleModalTouchMove}
                onTouchEnd={handleModalTouchEnd}
                ref={modalRef}
                tabIndex={-1}
              >
                <ModalClose onClick={() => setModalOpen(false)}>&times;</ModalClose>
                <Title style={{textAlign: 'center'}}>Request a Custom Quote</Title>
                <Intro style={{textAlign: 'center'}}>Fill out the form and our team will get back to you soon with a personalized estimate.</Intro>
                <StyledForm autoComplete="on" onSubmit={sendQuote}>
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
                    <Label className={focus.message || formVals.message ? 'active' : ''}>Describe Your Requirements</Label>
                  </Field>
                  <SelectWrapper>
                    <InputIcon><FaHome /></InputIcon>
                    <StyledSelect
                        name="projectType"
                      value={formVals.projectType}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    >
                      <option value=""></option>
                        {projectTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </StyledSelect>
                    <Label className={focus.projectType || formVals.projectType ? 'active' : ''} style={{pointerEvents:'none', left:'2.7rem', top: (focus.projectType || formVals.projectType) ? '-0.7rem' : '1.1rem', fontSize: (focus.projectType || formVals.projectType) ? '0.92rem' : '1.08rem', background: (focus.projectType || formVals.projectType) ? '#fff' : 'transparent', padding: (focus.projectType || formVals.projectType) ? '0 0.3em' : 0, color: (focus.projectType || formVals.projectType) ? '#1a3c2e' : 'var(--text-primary)', fontWeight: (focus.projectType || formVals.projectType) ? 800 : 700, zIndex:2 }}>Project Type </Label>
                  </SelectWrapper>
                  <SelectWrapper>
                    <InputIcon><FaDollarSign /></InputIcon>
                    <StyledSelect
                        name="budgetRange"
                      value={formVals.budgetRange}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    >
                      <option value=""></option>
                        {budgetRanges.map(budget => (
                        <option key={budget.value} value={budget.value}>{budget.label}</option>
                      ))}
                    </StyledSelect>
                    <Label className={focus.budgetRange || formVals.budgetRange ? 'active' : ''} style={{pointerEvents:'none', left:'2.7rem', top: (focus.budgetRange || formVals.budgetRange) ? '-0.7rem' : '1.1rem', fontSize: (focus.budgetRange || formVals.budgetRange) ? '0.92rem' : '1.08rem', background: (focus.budgetRange || formVals.budgetRange) ? '#fff' : 'transparent', padding: (focus.budgetRange || formVals.budgetRange) ? '0 0.3em' : 0, color: (focus.budgetRange || formVals.budgetRange) ? '#1a3c2e' : 'var(--text-primary)', fontWeight: (focus.budgetRange || formVals.budgetRange) ? 800 : 700, zIndex:2 }}>Budget Range </Label>
                  </SelectWrapper>
                  <ButtonWrapper>
                    <Button type="submit" whileTap={{ scale: 0.95 }}>Request Quote</Button>
                  </ButtonWrapper>
                  {modalMsg && (
                    <ErrorMsg style={{ color: modalType === 'success' ? '#1a3c2e' : '#ff5959' }}>{modalMsg}</ErrorMsg>
                  )}
                </StyledForm>
              </ModalDialog>
            </ModalOverlay>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
   );
};

export default GetQuote; 
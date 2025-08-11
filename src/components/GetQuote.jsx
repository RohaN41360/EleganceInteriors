import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFileUpload, 
  FaCheck, 
  FaPhone, 
  FaShieldAlt, 
  FaQuoteLeft, 
  FaTimes,
  FaUser,
  FaEnvelope,
  FaMobile,
  FaHome,
  FaBuilding,
  FaHotel,
  FaShoppingBag,
  FaDollarSign,
  FaEdit
} from 'react-icons/fa';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

const Section = styled.section`
  padding: 5rem 1rem 2rem 1rem;
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
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
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.6rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
  }
`;

const Description = styled.p`
  text-align: center;
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  transition: color 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-primary);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  border: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  ${props => props.fullWidth && `
    grid-column: 1 / -1;
  `}
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4E7E5D;
    box-shadow: 0 0 0 3px rgba(78, 126, 93, 0.1);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4E7E5D;
    box-shadow: 0 0 0 3px rgba(78, 126, 93, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #4E7E5D;
    box-shadow: 0 0 0 3px rgba(78, 126, 93, 0.1);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const FileUploadContainer = styled.div`
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #4E7E5D;
    background: rgba(78, 126, 93, 0.05);
  }
`;

const FileUploadInput = styled.input`
  display: none;
`;

const FileUploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.3s ease;
  
  &:hover {
    color: #4E7E5D;
  }
`;

const FileUploadIcon = styled(FaFileUpload)`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #4E7E5D;
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #4E7E5D, #5a8b6a);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  
  &:hover {
    background: linear-gradient(135deg, #5a8b6a, #4E7E5D);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(78, 126, 93, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.9rem 1.5rem;
    font-size: 1rem;
    gap: 0.6rem;
  }
`;

const ReassuranceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const ReassuranceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  
  svg {
    color: #4E7E5D;
  }
`;

const ToggleButton = styled(motion.button)`
  background: linear-gradient(135deg, #4E7E5D, #5a8b6a);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0 auto 2rem auto;
  
  &:hover {
    background: linear-gradient(135deg, #5a8b6a, #4E7E5D);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(78, 126, 93, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 0.9rem 1.5rem;
    font-size: 1rem;
    gap: 0.6rem;
  }
`;

const FormWrapper = styled(motion.div)`
  overflow: hidden;
`;

const InputWithIcon = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    z-index: 1;
  }
  
  input, select, textarea {
    padding-left: 3rem !important;
  }
`;

const SelectWithIcon = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    z-index: 1;
  }
  
  select {
    padding-left: 3rem !important;
  }
`;

const ConfirmationDialog = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const DialogContent = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const DialogIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4E7E5D, #5a8b6a);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
  font-size: 2rem;
  color: white;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const DialogTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const DialogMessage = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const DialogButton = styled(motion.button)`
  background: linear-gradient(135deg, #4E7E5D, #5a8b6a);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #5a8b6a, #4E7E5D);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(78, 126, 93, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(135deg, #4E7E5D, #5a8b6a);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 1rem;
  box-shadow: 0 4px 20px rgba(78, 126, 93, 0.2);
`;

const GetQuote = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectType: '',
    budgetRange: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleForm = () => {
    setIsFormVisible(!isFormVisible);
    if (!isFormVisible) {
      // Scroll to form when opening
      setTimeout(() => {
        document.getElementById('quote-form')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 300);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to Firebase Firestore
      const quoteData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.projectType,
        budgetRange: formData.budgetRange,
        description: formData.description,
        status: 'new',
        createdAt: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      };
      
      await addDoc(collection(db, 'quotes'), quoteData);
      
      setIsSubmitting(false);
      setShowConfirmation(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        projectType: '',
        budgetRange: '',
        description: ''
      });
      
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error submitting quote:', error);
      setIsSubmitting(false);
      // You could show an error message here
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <Section id="get-quote">
      <Title>Get a Custom Quote Today</Title>
      <Subtitle>Tailored pricing for your specific needs, space, and design vision.</Subtitle>
      <Description>
        Whether it's a modular kitchen, elegant wardrobes, office furniture, or a complete interior makeover – tell us your requirements and our team will get back to you with a personalized estimate.
      </Description>
      
      <ToggleButton
        onClick={handleToggleForm}
        aria-expanded={isFormVisible}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isFormVisible ? (
          <>
            <FaTimes />
            Close Quote Form
          </>
        ) : (
          <>
            <FaQuoteLeft />
            Get a Quote
          </>
        )}
      </ToggleButton>
      
      <AnimatePresence>
        {isFormVisible && (
          <FormWrapper
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <FormContainer id="quote-form">
              <form onSubmit={handleSubmit}>
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="fullName">📛 Full Name *</Label>
                    <InputWithIcon>
                      <FaUser />
                      <Input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </InputWithIcon>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="email">📧 Email Address *</Label>
                    <InputWithIcon>
                      <FaEnvelope />
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        required
                      />
                    </InputWithIcon>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="phone">📱 Phone Number *</Label>
                    <InputWithIcon>
                      <FaMobile />
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </InputWithIcon>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="projectType">🏠 Type of Project *</Label>
                    <SelectWithIcon>
                      <FaHome />
                      <Select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Select>
                    </SelectWithIcon>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="budgetRange">💰 Budget Range (Optional)</Label>
                    <SelectWithIcon>
                      <FaDollarSign />
                      <Select
                        id="budgetRange"
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleInputChange}
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map(budget => (
                          <option key={budget.value} value={budget.value}>
                            {budget.label}
                          </option>
                        ))}
                      </Select>
                    </SelectWithIcon>
                  </FormGroup>
                  
                  <FormGroup fullWidth>
                    <Label htmlFor="description">🗒️ Describe Your Requirements *</Label>
                    <InputWithIcon>
                      <FaEdit />
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your project requirements, design preferences, timeline, and any specific details..."
                        required
                      />
                    </InputWithIcon>
                  </FormGroup>
                </FormGrid>
                
                <SubmitButton
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Sending Request...' : (
                    <>
                      <FaEnvelope />
                      Request My Quote
                    </>
                  )}
                </SubmitButton>
                
                               </form>
               
               <ReassuranceContainer>
                 <ReassuranceItem>
                   <FaCheck />
                   <span>No hidden costs</span>
                 </ReassuranceItem>
                 <ReassuranceItem>
                   <FaPhone />
                   <span>Direct consultation</span>
                 </ReassuranceItem>
                 <ReassuranceItem>
                   <FaShieldAlt />
                   <span>Your info is safe with us</span>
                 </ReassuranceItem>
               </ReassuranceContainer>
             </FormContainer>
           </FormWrapper>
         )}
       </AnimatePresence>
       
       <AnimatePresence>
         {showConfirmation && (
           <ConfirmationDialog
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={handleCloseConfirmation}
           >
             <DialogContent
               onClick={(e) => e.stopPropagation()}
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.8, opacity: 0 }}
               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
             >
               <DialogIcon>
                 <FaCheck />
               </DialogIcon>
               <DialogTitle>Quote Request Submitted!</DialogTitle>
               <DialogMessage>
                 Thank you for your interest! We've received your quote request and will review it carefully. 
                 Our team will get back to you within 24-48 hours with a personalized estimate.
               </DialogMessage>
               <DialogButton
                 onClick={handleCloseConfirmation}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                 Got it!
               </DialogButton>
             </DialogContent>
           </ConfirmationDialog>
         )}
       </AnimatePresence>
     </Section>
   );
};

export default GetQuote; 
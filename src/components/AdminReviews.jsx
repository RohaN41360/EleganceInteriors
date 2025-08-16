import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { FaStar, FaCheck, FaTimes, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

// Remove this line:
// import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalActionButton, CloseButton, DetailRow, DetailLabel, DetailValue } from './Modal';
// Instead, define the modal styled components locally (copy from AdminQuotes.jsx):
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalFadeIn 0.3s ease-out;
  @media (max-width: 768px) {
    width: 95%;
    max-width: 450px;
  }
  @media (max-width: 480px) {
    width: 90%;
    max-width: 350px;
  }
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
  @media (max-width: 768px) {
    padding: 1rem 1rem 0.5rem;
  }
  @media (max-width: 480px) {
    padding: 0.8rem 0.8rem 0.5rem;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--text-primary);
  margin: 0;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: color 0.2s ease;
  &:hover {
    color: var(--primary-color);
  }
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  @media (max-width: 768px) {
    padding: 1rem;
  }
  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const DetailLabel = styled.span`
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 600;
  min-width: 100px;
  @media (max-width: 768px) {
    font-size: 0.9rem;
    min-width: 80px;
  }
  @media (max-width: 480px) {
    font-size: 0.85rem;
    min-width: 70px;
  }
`;

const DetailValue = styled.span`
  font-size: 1rem;
  color: var(--text-primary);
  flex: 1;
  word-break: break-word;
  white-space: pre-line;
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    gap: 0.8rem;
  }
  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    gap: 0.6rem;
  }
`;

const NoReviewsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
`;

// Add styled components for table layout (reuse from AdminQuotes.jsx)
const TableContainer = styled.div`
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 2px 12px var(--shadow-color);
  border: 1px solid var(--border-color);
  overflow: hidden;
  margin-bottom: 2rem;
  @media (max-width: 768px) { border-radius: 8px; }
`;
const TableWrapper = styled.div`
  width: 100vw;
  max-width: 100vw;
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--bg-primary);
  height: calc(100vh - 220px);
  @media (max-width: 900px) { min-width: 700px; }
  &::-webkit-scrollbar { height: 10px; background: #f1f1f1; }
  &::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 6px; }
`;
const Table = styled.table`
  width: 1100px;
  min-width: 1100px;
  border-collapse: collapse;
  @media (max-width: 900px) { min-width: 900px; }
  @media (max-width: 600px) { min-width: 700px; }
`;
const Th = styled.th`
  background: var(--bg-secondary);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  @media (max-width: 768px) { padding: 0.8rem; font-size: 0.9rem; }
  @media (max-width: 480px) { padding: 0.6rem; font-size: 0.85rem; }
`;
const Td = styled.td`
  padding: 1rem 0.8rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
  vertical-align: middle;
  &:hover { background-color: rgba(230, 177, 122, 0.05); }
  select, input, button { pointer-events: auto; }
  &.actions {
    background: var(--bg-secondary);
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.03);
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    justify-content: flex-start;
    min-width: 180px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  @media (max-width: 768px) { padding: 0.8rem 0.5rem; font-size: 0.9rem; }
  @media (max-width: 480px) { padding: 0.6rem 0.3rem; font-size: 0.85rem; }
`;
const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 60px;
  height: 60px;
  &:hover { background-color: rgba(230, 177, 122, 0.05); }
  select, input, button { pointer-events: auto; }
`;

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 2rem;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 12px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-color: #e6b17a;
  }
  @media (max-width: 900px) {
    padding: 1rem;
    border-radius: 8px;
  }
  @media (max-width: 600px) {
    padding: 0.7rem;
    border-radius: 7px;
    font-size: 0.95rem;
  }
`;
const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.color || '#4E7E5D'};
  margin-bottom: 0.5rem;
  @media (max-width: 900px) {
    font-size: 1.3rem;
    margin-bottom: 0.3rem;
  }
  @media (max-width: 600px) {
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e6e6e6;
  background: #f7f7fa;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  border-radius: 10px;
  overflow-x: auto;
  @media (max-width: 900px) {
    gap: 0.5rem;
    padding: 0.3rem 0.2rem;
  }
`;
const Tab = styled.button`
  background: ${props => props.active ? '#e6b17a' : 'transparent'};
  border: none;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.active ? '#fff' : '#666'};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  min-width: 120px;
  @media (max-width: 900px) {
    font-size: 0.92rem;
    padding: 0.5rem 0.7rem;
    min-width: 90px;
  }
  @media (max-width: 600px) {
    font-size: 0.85rem;
    padding: 0.4rem 0.5rem;
    min-width: 70px;
  }
  &:hover {
    background: #ffe7c2;
    color: #1a3c2e;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background-color: ${props => props.approved === 'true' ? '#28a745' : '#dc3545'};
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.2s cubic-bezier(.4,0,.2,1), transform 0.15s;
  min-width: 90px;
  min-height: 36px;
  box-shadow: none;
  justify-content: center;
  &:hover {
    transform: scale(1.05);
  }
  &.approve:hover {
    background: #28a745;
    color: #fff;
    border-color: #28a745;
  }
  &.reject:hover {
    background: #dc3545;
    color: #fff;
    border-color: #dc3545;
  }
  &.delete:hover {
    background: #ff5959;
    color: #fff;
    border-color: #ff5959;
  }
  &:active {
    transform: scale(0.97);
  }
  @media (max-width: 768px) {
    padding: 0.3rem 0.5rem;
    font-size: 0.75rem;
    min-width: 70px;
  }
  @media (max-width: 480px) {
    padding: 0.2rem 0.3rem;
    font-size: 0.7rem;
    min-width: 60px;
  }
`;

const ModalActionButton = styled.button`
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  min-width: 120px;
  justify-content: center;
  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--text-primary);
  }
  &.approve:hover {
    background: #28a745;
    border-color: #28a745;
    color: #fff;
  }
  &.reject:hover {
    background: #dc3545;
    border-color: #dc3545;
    color: #fff;
  }
  &.delete:hover {
    background: #ff5959;
    border-color: #ff5959;
    color: #fff;
  }
  &:active {
    transform: scale(0.98);
  }
  @media (max-width: 768px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
    min-height: 40px;
    min-width: 100px;
    gap: 0.4rem;
  }
  @media (max-width: 480px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
    min-height: 36px;
    min-width: 90px;
    gap: 0.3rem;
  }
`;

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0
  });
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      
      setReviews(reviewsData);
      
      const approved = reviewsData.filter(review => review.approved).length;
      const pending = reviewsData.filter(review => !review.approved).length;
      
      setStats({
        total: reviewsData.length,
        approved,
        pending
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        approved: true
      });
      await fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        approved: false
      });
      await fetchReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteDoc(doc(db, 'reviews', reviewId));
        await fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'approved') return review.approved;
    if (activeTab === 'pending') return !review.approved;
    return true;
  });

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container>
        <Title>Loading reviews...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Review Management</Title>
      
      <StatsContainer>
        <StatCard>
          <StatNumber>{stats.total}</StatNumber>
          <p>Total Reviews</p>
        </StatCard>
        <StatCard>
          <StatNumber color="#28a745">{stats.approved}</StatNumber>
          <p>Approved</p>
        </StatCard>
        <StatCard>
          <StatNumber color="#ffc107">{stats.pending}</StatNumber>
          <p>Pending</p>
        </StatCard>
      </StatsContainer>

      <TabsContainer>
        <Tab 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          All Reviews ({reviews.length})
        </Tab>
        <Tab 
          active={activeTab === 'pending'} 
          onClick={() => setActiveTab('pending')}
        >
          Pending ({stats.pending})
        </Tab>
        <Tab 
          active={activeTab === 'approved'} 
          onClick={() => setActiveTab('approved')}
        >
          Approved ({stats.approved})
        </Tab>
      </TabsContainer>

      {filteredReviews.length > 0 ? (
        <TableContainer>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Location</Th>
                  <Th>Rating</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map(review => (
                  <Tr key={review.id} onClick={() => { setSelectedReview(review); setShowModal(true); }}>
                    <Td>{review.name}</Td>
                    <Td>{review.email || '-'}</Td>
                    <Td>{review.location || '-'}</Td>
                    <Td>
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < review.rating ? '#e6b17a' : '#ddd'} />
                      ))}
                      <span style={{ marginLeft: '0.5rem', color: '#666' }}>({review.rating}/5)</span>
                    </Td>
                    <Td>{review.createdAt ? formatDate(review.createdAt) : '-'}</Td>
                    <Td>
                      <StatusBadge approved={review.approved ? 'true' : 'false'}>
                        {review.approved ? 'Approved' : 'Pending'}
                      </StatusBadge>
                    </Td>
                    <Td className="actions">
                      <ActionButton
                        className={review.approved ? 'reject' : 'approve'}
                        onClick={e => { e.stopPropagation(); review.approved ? handleReject(review.id) : handleApprove(review.id); }}
                      >
                        {review.approved ? <FaTimes /> : <FaCheck />} {review.approved ? 'Reject' : 'Approve'}
                      </ActionButton>
                      <ActionButton
                        className="delete"
                        onClick={e => { e.stopPropagation(); handleDelete(review.id); }}
                      >
                        <FaTrash /> Delete
                      </ActionButton>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </TableContainer>
      ) : (
        <NoReviewsMessage>
          No {activeTab} reviews found.
        </NoReviewsMessage>
      )}

      {/* Modal/dialog for review details (reuse quote modal structure) */}
      <AnimatePresence>
        {showModal && selectedReview && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Review Details</ModalTitle>
                <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
              </ModalHeader>
              <ModalBody>
                <DetailRow>
                  <DetailLabel>Name:</DetailLabel>
                  <DetailValue>{selectedReview.name}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Email:</DetailLabel>
                  <DetailValue>{selectedReview.email || '-'}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Location:</DetailLabel>
                  <DetailValue>{selectedReview.location || '-'}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Rating:</DetailLabel>
                  <DetailValue>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} color={i < selectedReview.rating ? '#e6b17a' : '#ddd'} />
                    ))}
                    <span style={{ marginLeft: '0.5rem', color: '#666' }}>({selectedReview.rating}/5)</span>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Date:</DetailLabel>
                  <DetailValue>{selectedReview.createdAt ? formatDate(selectedReview.createdAt) : '-'}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Status:</DetailLabel>
                  <DetailValue>
                    <StatusBadge approved={selectedReview.approved ? 'true' : 'false'}>
                      {selectedReview.approved ? 'Approved' : 'Pending'}
                    </StatusBadge>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Review:</DetailLabel>
                  <DetailValue style={{ textAlign: 'left', maxWidth: '350px', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                    {selectedReview.text}
                  </DetailValue>
                </DetailRow>
              </ModalBody>
              <ModalFooter>
                <ModalActionButton
                  className={selectedReview.approved ? 'reject' : 'approve'}
                  onClick={e => { e.stopPropagation(); selectedReview.approved ? handleReject(selectedReview.id) : handleApprove(selectedReview.id); }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {selectedReview.approved ? <FaTimes /> : <FaCheck />} {selectedReview.approved ? 'Reject' : 'Approve'}
                </ModalActionButton>
                <ModalActionButton
                  className="delete"
                  onClick={e => { e.stopPropagation(); handleDelete(selectedReview.id); }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTrash /> Delete
                </ModalActionButton>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AdminReviews; 
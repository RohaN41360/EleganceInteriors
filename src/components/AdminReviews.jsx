import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { FaStar, FaCheck, FaTimes, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #1a3c2e;
  margin-bottom: 2rem;
  text-align: center;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  
  h3 {
    font-size: 2rem;
    color: #e6b17a;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    font-weight: 600;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e6e6e6;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.active ? '#e6b17a' : '#666'};
  border-bottom: 3px solid ${props => props.active ? '#e6b17a' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #e6b17a;
  }
`;

const ReviewsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const ReviewCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => props.approved ? '#28a745' : '#ffc107'};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const ReviewInfo = styled.div`
  flex: 1;
`;

const ReviewName = styled.h4`
  font-size: 1.1rem;
  color: #1a3c2e;
  margin-bottom: 0.25rem;
`;

const ReviewLocation = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ReviewDate = styled.p`
  color: #999;
  font-size: 0.8rem;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
  
  svg {
    color: #e6b17a;
  }
`;

const ReviewText = styled.p`
  color: #333;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &.approve {
    background: #28a745;
    color: #fff;
    
    &:hover {
      background: #218838;
    }
  }
  
  &.reject {
    background: #dc3545;
    color: #fff;
    
    &:hover {
      background: #c82333;
    }
  }
  
  &.delete {
    background: #6c757d;
    color: #fff;
    
    &:hover {
      background: #5a6268;
    }
  }
  
  &.toggle {
    background: ${props => props.approved ? '#ffc107' : '#17a2b8'};
    color: #fff;
    
    &:hover {
      background: ${props => props.approved ? '#e0a800' : '#138496'};
    }
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.approved ? '#d4edda' : '#fff3cd'};
  color: ${props => props.approved ? '#155724' : '#856404'};
`;

const NoReviewsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
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
          <h3>{stats.total}</h3>
          <p>Total Reviews</p>
        </StatCard>
        <StatCard>
          <h3>{stats.approved}</h3>
          <p>Approved</p>
        </StatCard>
        <StatCard>
          <h3>{stats.pending}</h3>
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
        <ReviewsGrid>
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} approved={review.approved}>
              <ReviewHeader>
                <ReviewInfo>
                  <ReviewName>{review.name}</ReviewName>
                  <ReviewLocation>{review.location}</ReviewLocation>
                  <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
                </ReviewInfo>
                <StatusBadge approved={review.approved}>
                  {review.approved ? 'Approved' : 'Pending'}
                </StatusBadge>
              </ReviewHeader>

              <ReviewRating>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < review.rating ? '#e6b17a' : '#ddd'} />
                ))}
                <span style={{ marginLeft: '0.5rem', color: '#666' }}>
                  ({review.rating}/5)
                </span>
              </ReviewRating>

              <ReviewText>"{review.text}"</ReviewText>

              <ActionButtons>
                {!review.approved ? (
                  <ActionButton 
                    className="approve"
                    onClick={() => handleApprove(review.id)}
                  >
                    <FaCheck /> Approve
                  </ActionButton>
                ) : (
                  <ActionButton 
                    className="reject"
                    onClick={() => handleReject(review.id)}
                  >
                    <FaTimes /> Reject
                  </ActionButton>
                )}
                
                <ActionButton 
                  className="toggle"
                  approved={review.approved}
                  onClick={() => review.approved ? handleReject(review.id) : handleApprove(review.id)}
                >
                  {review.approved ? <FaEyeSlash /> : <FaEye />}
                  {review.approved ? 'Hide' : 'Show'}
                </ActionButton>
                
                <ActionButton 
                  className="delete"
                  onClick={() => handleDelete(review.id)}
                >
                  <FaTrash /> Delete
                </ActionButton>
              </ActionButtons>
            </ReviewCard>
          ))}
        </ReviewsGrid>
      ) : (
        <NoReviewsMessage>
          No {activeTab} reviews found.
        </NoReviewsMessage>
      )}
    </Container>
  );
};

export default AdminReviews; 
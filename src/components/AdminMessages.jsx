import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  startAfter,
  getCountFromServer
} from 'firebase/firestore';
import { 
  FaEnvelope, 
  FaUser, 
  FaPhone, 
  FaCommentDots, 
  FaEye, 
  FaTrash, 
  FaTimes, 
  FaCheck,
  FaSearch,
  FaFilter,
  FaCalendarAlt
} from 'react-icons/fa';
import Pagination from './Pagination';

const db = getFirestore();

// Container
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Header
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Stats Cards
const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
`;

const StatCard = styled.div`
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px var(--shadow-color);
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-color: #e6b17a;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    border-radius: 6px;
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.color || '#4E7E5D'};
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 0.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
  }
`;

const StatLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

// Filter Section
const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.6rem;
    margin-bottom: 1.5rem;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
  min-height: 44px;
  
  &:focus {
    outline: none;
    border-color: #4E7E5D;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    font-size: 1rem;
    min-height: 48px;
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 0.8rem;
    font-size: 0.9rem;
    min-height: 44px;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
  min-width: 200px;
  min-height: 44px;
  
  &:focus {
    outline: none;
    border-color: #4E7E5D;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    font-size: 1rem;
    min-width: auto;
    width: 100%;
    min-height: 48px;
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 0.8rem;
    font-size: 0.9rem;
    min-height: 44px;
  }
`;

// Messages Grid
const MessagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.8rem;
  }
`;

const MessageCard = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.unread {
    border-left: 4px solid #4E7E5D;
    background: rgba(78, 126, 93, 0.05);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
    min-height: 180px;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    border-radius: 6px;
    min-height: 160px;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const MessageInfo = styled.div`
  flex: 1;
`;

const MessageName = styled.h3`
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.3rem 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const MessageEmail = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 0.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const MessagePhone = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const MessageDate = styled.div`
  color: #4E7E5D;
  font-size: 0.8rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const MessageContent = styled.div`
  color: var(--text-primary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 0.8rem;
    max-height: 60px;
    -webkit-line-clamp: 2;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.6rem;
    max-height: 50px;
  }
`;

const MessageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: auto;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.4rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.3rem;
  }
`;



const StatusBadge = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${props => props.read ? 'rgba(78, 126, 93, 0.2)' : 'rgba(255, 89, 89, 0.2)'};
  color: ${props => props.read ? '#4E7E5D' : '#ff5959'};
`;

// Modal
const ModalOverlay = styled(motion.div)`
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

const Modal = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    max-height: 95vh;
    margin: 0.5rem;
  }
  
  @media (max-width: 480px) {
    max-height: 98vh;
    margin: 0.25rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 1rem 0.8rem 1rem;
  }
`;

const ModalTitle = styled.h2`
  color: var(--text-primary);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const ModalBody = styled.div`
  padding: 1rem 2rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  
  /* Custom scrollbar for content */
  &::-webkit-scrollbar {
    width: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(230, 177, 122, 0.6);
    border-radius: 6px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(230, 177, 122, 0.8);
    background-clip: content-box;
  }
  
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
  }
`;

const ModalFooter = styled.div`
  padding: 1rem 2rem 2rem 2rem;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    flex-direction: row;
    gap: 0.8rem;
    justify-content: flex-end;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem 1rem 1rem 1rem;
    gap: 0.6rem;
  }
`;

const ModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const ModalLabel = styled.label`
  font-weight: 600;
  color: #4E7E5D;
  font-size: 0.9rem;
`;

const ModalValue = styled.div`
  color: var(--text-primary);
  font-size: 1rem;
  padding: 0.8rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-line;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.7rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.6rem;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const ActionButton = styled(motion.button)`
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.8rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 36px;
  min-width: 100px;
  
  &:hover {
    background: #4E7E5D;
    color: white;
    border-color: #4E7E5D;
  }
  
  &.delete:hover {
    background: #ff5959;
    border-color: #ff5959;
  }
  
  &.unread:hover {
    background: #ffc107;
    color: #1a3c2e;
    border-color: #ffc107;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.7rem;
    font-size: 0.75rem;
    min-height: 40px;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.7rem;
    min-height: 36px;
  }
`;

const ModalActionButton = styled(motion.button)`
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
  
  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--text-primary);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &.read {
    color: #4E7E5D;
    border-color: #4E7E5D;
    
    &:hover {
      background: #4E7E5D;
      color: white;
    }
  }
  
  &.unread {
    color: #ffc107;
    border-color: #ffc107;
    
    &:hover {
      background: #ffc107;
      color: #1a3c2e;
    }
  }
  
  &.delete {
    color: #dc3545;
    border-color: #dc3545;
    
    &:hover {
      background: #dc3545;
      color: white;
    }
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

// Empty State
const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [lastDocs, setLastDocs] = useState([]); // Array to store last docs for each page
  const [hasMore, setHasMore] = useState(true);

  // Fetch total count
  const fetchTotalCount = async () => {
    try {
      const messagesRef = collection(db, 'messages');
      const snapshot = await getCountFromServer(messagesRef);
      setTotalItems(snapshot.data().count);
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  };

  // Fetch messages with pagination
  const fetchMessages = async (page = 1, size = pageSize, reset = false) => {
    setLoading(true);
    try {
      const messagesRef = collection(db, 'messages');
      let q = query(messagesRef, orderBy('createdAt', 'desc'), limit(size));
      
      // If we're going to a specific page and have the cursor for that page
      if (page > 1 && lastDocs[page - 2] && !reset) {
        q = query(messagesRef, orderBy('createdAt', 'desc'), startAfter(lastDocs[page - 2]), limit(size));
      }
      
      const querySnapshot = await getDocs(q);
      const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Always replace the messages data, don't accumulate
      setMessages(messagesData);
      
      // Store the last document for this page
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      if (lastDoc) {
        setLastDocs(prev => {
          const newLastDocs = [...prev];
          newLastDocs[page - 1] = lastDoc;
          return newLastDocs;
        });
      }
      
      setHasMore(querySnapshot.docs.length === size);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTotalCount();
    fetchMessages(1, pageSize, true);
  }, []);

  useEffect(() => {
    fetchMessages(currentPage, pageSize, false);
  }, [currentPage, pageSize]);

  const handleView = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, 'messages', id), { read: true });
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => ({ ...prev, read: true }));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAsUnread = async (id) => {
    try {
      await updateDoc(doc(db, 'messages', id), { read: false });
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, read: false } : msg
      ));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => ({ ...prev, read: false }));
      }
    } catch (error) {
      console.error('Error marking as unread:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(prev => prev.filter(msg => msg.id !== id));
      setTotalItems(prev => prev - 1);
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
    setLoading(false);
  };

  const handleStatCardClick = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    setLastDocs([]); // Reset pagination cursors when filter changes
  };

  const getStatusCount = (status) => {
    if (status === 'all') return totalItems;
    return messages.filter(msg => msg.read === (status === 'read')).length;
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'read' && message.read) ||
      (filterStatus === 'unread' && !message.read);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    setLastDocs([]); // Reset pagination cursors when page size changes
  };

  return (
    <Container>
      <Header>
        <Title>Contact Messages</Title>
      </Header>

      <StatsContainer>
        <StatCard onClick={() => handleStatCardClick('all')}>
          <StatNumber>{getStatusCount('all')}</StatNumber>
          <StatLabel>Total Messages</StatLabel>
        </StatCard>
        <StatCard onClick={() => handleStatCardClick('read')}>
          <StatNumber color="#4E7E5D">{getStatusCount('read')}</StatNumber>
          <StatLabel>Read</StatLabel>
        </StatCard>
        <StatCard onClick={() => handleStatCardClick('unread')}>
          <StatNumber color="#ff5959">{getStatusCount('unread')}</StatNumber>
          <StatLabel>Unread</StatLabel>
        </StatCard>
      </StatsContainer>

      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Messages</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </FilterSelect>
      </FilterContainer>

      {loading && messages.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📧</EmptyIcon>
          <EmptyTitle>Loading...</EmptyTitle>
        </EmptyState>
      ) : filteredMessages.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📧</EmptyIcon>
          <EmptyTitle>No messages found</EmptyTitle>
          <EmptyText>
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No contact messages have been received yet.'
            }
          </EmptyText>
        </EmptyState>
      ) : (
        <MessagesGrid>
          {filteredMessages.map((message) => (
            <MessageCard
              key={message.id}
              className={!message.read ? 'unread' : ''}
              onClick={() => handleView(message)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
            >
              <MessageHeader>
                <MessageInfo>
                  <MessageName>{message.name || 'Anonymous'}</MessageName>
                  <MessageEmail>{message.email}</MessageEmail>
                  {message.phone && <MessagePhone>{message.phone}</MessagePhone>}
                  <StatusBadge read={message.read}>
                    {message.read ? 'Read' : 'Unread'}
                  </StatusBadge>
                </MessageInfo>
                <MessageDate>
                  <FaCalendarAlt style={{ marginRight: '0.3rem' }} />
                  {formatDate(message.createdAt)}
                </MessageDate>
              </MessageHeader>
              
              <MessageContent>{message.message}</MessageContent>
              
              <MessageActions>
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(message);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEye />
                  View
                </ActionButton>
                
                <ActionButton
                  className="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(message.id);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTrash />
                  Delete
                </ActionButton>
              </MessageActions>
            </MessageCard>
          ))}
        </MessagesGrid>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        itemsPerPageOptions={[5, 10, 20, 50]}
      />

      <AnimatePresence>
        {selectedMessage && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedMessage(null);
              }
            }}
          >
            <Modal
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Message Details</ModalTitle>
                <CloseButton onClick={() => setSelectedMessage(null)}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              
              <ModalBody>
                <ModalField>
                  <ModalLabel>Name</ModalLabel>
                  <ModalValue>{selectedMessage.name || 'Anonymous'}</ModalValue>
                </ModalField>
                
                <ModalField>
                  <ModalLabel>Email</ModalLabel>
                  <ModalValue>{selectedMessage.email}</ModalValue>
                </ModalField>
                
                {selectedMessage.phone && (
                  <ModalField>
                    <ModalLabel>Phone</ModalLabel>
                    <ModalValue>{selectedMessage.phone}</ModalValue>
                  </ModalField>
                )}
                
                <ModalField>
                  <ModalLabel>Message</ModalLabel>
                  <ModalValue>
                    {selectedMessage.message}
                  </ModalValue>
                </ModalField>
                
                <ModalField>
                  <ModalLabel>Date</ModalLabel>
                  <ModalValue>{formatDate(selectedMessage.createdAt)}</ModalValue>
                </ModalField>
                
                <ModalField>
                  <ModalLabel>Status</ModalLabel>
                  <ModalValue>
                    <StatusBadge read={selectedMessage.read}>
                      {selectedMessage.read ? 'Read' : 'Unread'}
                    </StatusBadge>
                  </ModalValue>
                </ModalField>
              </ModalBody>
              
              <ModalFooter>
              <ModalActions>
                  {selectedMessage.read ? (
                    <ModalActionButton
                      className="unread"
                      onClick={() => {
                        markAsUnread(selectedMessage.id);
                        setSelectedMessage(null);
                      }}
                    >
                      <FaEnvelope />
                      Mark as Unread
                    </ModalActionButton>
                  ) : (
                    <ModalActionButton
                    onClick={() => {
                      markAsRead(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                  >
                    <FaCheck />
                    Mark as Read
                    </ModalActionButton>
                )}
                
                  <ModalActionButton
                  className="delete"
                  onClick={() => {
                    handleDelete(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                >
                  <FaTrash />
                  Delete Message
                  </ModalActionButton>
              </ModalActions>
              </ModalFooter>
            </Modal>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
} 
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
  FaEye, 
  FaTrash, 
  FaCheck, 
  FaTimes,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import Pagination from './Pagination';

const db = getFirestore();

// Container
const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Header
const Title = styled.h1`
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-size: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
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

// Table
const TableContainer = styled.div`
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 2px 12px var(--shadow-color);
  border: 1px solid var(--border-color);
  overflow: hidden;
  
  @media (max-width: 768px) {
    border-radius: 8px;
  }
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
  @media (max-width: 768px) { min-width: 900px; }
  @media (max-width: 480px) { min-width: 700px; }
`;

const Th = styled.th`
  background: var(--bg-secondary);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.85rem;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(230, 177, 122, 0.05);
  }
  
  /* Prevent click on form elements from bubbling up to the cell */
  select, input, button {
    pointer-events: auto;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.85rem;
  }
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(230, 177, 122, 0.05);
  }
  
  /* Prevent click on form elements from triggering row click */
  select, input, button {
    pointer-events: auto;
  }
`;

// Action Buttons
const ActionButton = styled(motion.button)`
  background: none;
  border: none;
  padding: 0.5rem;
  margin: 0 0.2rem;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  min-height: 36px;
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &.view {
    color: #4E7E5D;
  }
  
  &.delete {
    color: #dc3545;
  }
  
  &.approve {
    color: #28a745;
  }
  
  &.reject {
    color: #dc3545;
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem;
    margin: 0 0.1rem;
    font-size: 0.9rem;
    min-height: 40px;
    min-width: 40px;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem;
    margin: 0 0.05rem;
    font-size: 0.85rem;
    min-height: 36px;
    min-width: 36px;
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
  
  &.approve {
    color: #28a745;
    border-color: #28a745;
    
    &:hover {
      background: #28a745;
      color: white;
    }
  }
  
  &.reject {
    color: #dc3545;
    border-color: #dc3545;
    
    &:hover {
      background: #dc3545;
      color: white;
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

// Modal
const Modal = styled(motion.div)`
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
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ModalContent = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    max-height: 85vh;
    margin: 0.5rem;
  }
  
  @media (max-width: 480px) {
    max-height: 90vh;
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

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
    gap: 0.3rem;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const DetailValue = styled.span`
  color: var(--text-secondary);
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: left;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

// Loading and Empty States
const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
`;

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [lastDocs, setLastDocs] = useState([]); // Array to store last docs for each page
  const [hasMore, setHasMore] = useState(true);

  // Fetch total count
  const fetchTotalCount = async () => {
    try {
      const quotesRef = collection(db, 'quotes');
      const snapshot = await getCountFromServer(quotesRef);
      setTotalItems(snapshot.data().count);
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  };

  // Fetch quotes with pagination
  const fetchQuotes = async (page = 1, size = pageSize, reset = false) => {
    setLoading(true);
    try {
      const quotesRef = collection(db, 'quotes');
      let q = query(quotesRef, orderBy('createdAt', 'desc'), limit(size));
      
      // If we're going to a specific page and have the cursor for that page
      if (page > 1 && lastDocs[page - 2] && !reset) {
        q = query(quotesRef, orderBy('createdAt', 'desc'), startAfter(lastDocs[page - 2]), limit(size));
      }
      
      const querySnapshot = await getDocs(q);
      const quotesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date || new Date(doc.data().createdAt?.toDate()).toISOString().split('T')[0]
      }));
      
      // Always replace the quotes data, don't accumulate
      setQuotes(quotesData);
      
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
      console.error('Error fetching quotes:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTotalCount();
    fetchQuotes(1, pageSize, true);
  }, []);

  useEffect(() => {
    fetchQuotes(currentPage, pageSize, false);
  }, [currentPage, pageSize]);

  // Filter quotes based on status and search
  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    const matchesSearch = !searchTerm || 
      quote.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      const quoteRef = doc(db, 'quotes', quoteId);
      await updateDoc(quoteRef, { status: newStatus });
      
      // Update local state
      setQuotes(prev => prev.map(quote => 
        quote.id === quoteId ? { ...quote, status: newStatus } : quote
      ));
      
      if (selectedQuote?.id === quoteId) {
        setSelectedQuote(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    
    try {
      await deleteDoc(doc(db, 'quotes', quoteId));
      setQuotes(prev => prev.filter(quote => quote.id !== quoteId));
      setTotalItems(prev => prev - 1);
      
      if (selectedQuote?.id === quoteId) {
        setShowModal(false);
        setSelectedQuote(null);
      }
      } catch (error) {
        console.error('Error deleting quote:', error);
    }
  };

  const handleView = (quote) => {
    setSelectedQuote(quote);
    setShowModal(true);
  };

  const handleStatusTileClick = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    setLastDocs([]); // Reset pagination cursors when filter changes
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    setLastDocs([]); // Reset pagination cursors when page size changes
  };

  const getStatusCount = (status) => {
    if (status === 'all') return totalItems;
    return quotes.filter(quote => quote.status === status).length;
  };

  const getProjectTypeLabel = (type) => {
    const labels = {
      'kitchen': 'Kitchen Remodeling',
      'bathroom': 'Bathroom Remodeling',
      'living-room': 'Living Room',
      'bedroom': 'Bedroom',
      'office': 'Office',
      'custom': 'Custom Project'
    };
    return labels[type] || type;
  };

  const getBudgetLabel = (budget) => {
    const labels = {
      'under-10k': 'Under $10,000',
      '10k-25k': '$10,000 - $25,000',
      '25k-50k': '$25,000 - $50,000',
      '50k-100k': '$50,000 - $100,000',
      'over-100k': 'Over $100,000'
    };
    return labels[budget] || budget;
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <Container>
      <Title>Quote Requests</Title>
      
      <StatsContainer>
        <StatCard onClick={() => handleStatusTileClick('all')}>
          <StatNumber>{getStatusCount('all')}</StatNumber>
          <StatLabel>Total Quotes</StatLabel>
        </StatCard>
        <StatCard onClick={() => handleStatusTileClick('new')}>
          <StatNumber color="#ff5959">{getStatusCount('new')}</StatNumber>
          <StatLabel>New</StatLabel>
        </StatCard>
        <StatCard onClick={() => handleStatusTileClick('contacted')}>
          <StatNumber color="#ffc107">{getStatusCount('contacted')}</StatNumber>
          <StatLabel>Contacted</StatLabel>
        </StatCard>
        <StatCard onClick={() => handleStatusTileClick('quoted')}>
          <StatNumber color="#17a2b8">{getStatusCount('quoted')}</StatNumber>
          <StatLabel>Quoted</StatLabel>
        </StatCard>
        <StatCard onClick={() => handleStatusTileClick('completed')}>
          <StatNumber color="#28a745">{getStatusCount('completed')}</StatNumber>
          <StatLabel>Completed</StatLabel>
        </StatCard>
      </StatsContainer>

      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Search quotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="quoted">Quoted</option>
          <option value="completed">Completed</option>
        </FilterSelect>
      </FilterContainer>

      {loading && quotes.length === 0 ? (
        <LoadingState>
          <div>Loading quotes...</div>
        </LoadingState>
      ) : filteredQuotes.length === 0 ? (
        <EmptyState>
          <div>No quotes found</div>
        </EmptyState>
      ) : (
        <>
      <TableContainer>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Project Type</Th>
                <Th>Budget</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map(quote => (
                    <Tr key={quote.id} onClick={() => handleView(quote)}>
                      <Td>{quote.name || quote.fullName}</Td>
                      <Td>{quote.email}</Td>
                  <Td>{getProjectTypeLabel(quote.projectType)}</Td>
                  <Td>{getBudgetLabel(quote.budgetRange)}</Td>
                  <Td>
                        <select
                          value={quote.status}
                          onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            minHeight: '32px',
                            minWidth: '100px'
                          }}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="completed">Completed</option>
                        </select>
                  </Td>
                  <Td>{new Date(quote.date).toLocaleDateString()}</Td>
                  <Td>
                    <ActionButton
                      className="view"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(quote);
                          }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                          title="View Details"
                    >
                      <FaEye />
                    </ActionButton>
                        <ActionButton
                          className="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(quote.id);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete Quote"
                        >
                          <FaTrash />
                    </ActionButton>
                  </Td>
                    </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </TableContainer>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            itemsPerPageOptions={[5, 10, 20, 50]}
          />
        </>
      )}

      <AnimatePresence>
      {showModal && selectedQuote && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
              }
            }}
          >
            <ModalContent 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
            <ModalHeader>
              <ModalTitle>Quote Request Details</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>
            
              <ModalBody>
            <DetailRow>
              <DetailLabel>Name:</DetailLabel>
              <DetailValue>{selectedQuote.fullName}</DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Email:</DetailLabel>
              <DetailValue>{selectedQuote.email}</DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Phone:</DetailLabel>
              <DetailValue>{selectedQuote.phone}</DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Project Type:</DetailLabel>
              <DetailValue>{getProjectTypeLabel(selectedQuote.projectType)}</DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Budget Range:</DetailLabel>
              <DetailValue>{getBudgetLabel(selectedQuote.budgetRange)}</DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Status:</DetailLabel>
              <DetailValue>
                    <select
                      value={selectedQuote.status}
                      onChange={(e) => {
                        handleStatusChange(selectedQuote.id, e.target.value);
                        setSelectedQuote({...selectedQuote, status: e.target.value});
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '2px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        minHeight: '44px',
                        minWidth: '120px',
                        width: '100%'
                      }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="completed">Completed</option>
                    </select>
              </DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Date:</DetailLabel>
              <DetailValue>{new Date(selectedQuote.date).toLocaleDateString()}</DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Description:</DetailLabel>
              <DetailValue style={{ textAlign: 'left', maxWidth: '300px' }}>
                {selectedQuote.message || selectedQuote.description}
              </DetailValue>
            </DetailRow>
              </ModalBody>

              <ModalFooter>
                <ModalActionButton
                  className="approve"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(selectedQuote.id, 'completed');
                    setSelectedQuote({...selectedQuote, status: 'completed'});
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaCheck /> Approve
                </ModalActionButton>
                <ModalActionButton
                  className="reject"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(selectedQuote.id, 'new');
                    setSelectedQuote({...selectedQuote, status: 'new'});
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes /> Reject
                </ModalActionButton>
                <ModalActionButton
                  className="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(selectedQuote.id);
                  }}
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

export default AdminQuotes; 
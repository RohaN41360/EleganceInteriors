import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    font-size: 0.8rem;
    gap: 0.5rem;
  }
`;

const PageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PageSizeLabel = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const PageSizeSelect = styled.select`
  padding: 0.4rem 0.8rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  min-height: 36px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4E7E5D;
  }
  
  &:hover {
    border-color: #e6b17a;
  }
  
  @media (max-width: 768px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
    min-height: 32px;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.3rem;
  }
`;

const PageButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #4E7E5D;
    color: white;
    border-color: #4E7E5D;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(78, 126, 93, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &.active {
    background: #4E7E5D;
    color: white;
    border-color: #4E7E5D;
    box-shadow: 0 2px 8px rgba(78, 126, 93, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    min-width: 36px;
    height: 36px;
    font-size: 0.8rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    min-width: 32px;
    height: 32px;
    font-size: 0.75rem;
    border-radius: 6px;
  }
`;

const NavigationButton = styled(PageButton)`
  min-width: 44px;
  
  @media (max-width: 768px) {
    min-width: 40px;
  }
  
  @media (max-width: 480px) {
    min-width: 36px;
  }
`;

const Ellipsis = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: var(--text-secondary);
  font-weight: 600;
  
  @media (max-width: 768px) {
    min-width: 36px;
    height: 36px;
  }
  
  @media (max-width: 480px) {
    min-width: 32px;
    height: 32px;
  }
`;

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  itemsPerPageOptions = [10, 20, 50, 100]
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }
    
    rangeWithDots.push(...range);
    
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }
    
    return rangeWithDots;
  };
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePageSizeChange = (newPageSize) => {
    const newPageSizeNum = parseInt(newPageSize);
    if (newPageSizeNum !== pageSize) {
      onPageSizeChange(newPageSizeNum);
      // Reset to first page when changing page size
      onPageChange(1);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  if (totalPages <= 1) {
    return (
      <PaginationContainer>
        <PaginationInfo>
          Showing {totalItems} of {totalItems} items
        </PaginationInfo>
        <PageSizeSelector>
          <PageSizeLabel>Show:</PageSizeLabel>
          <PageSizeSelect
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </PageSizeSelect>
        </PageSizeSelector>
      </PaginationContainer>
    );
  }
  
  return (
    <PaginationContainer>
      <PaginationInfo>
        Showing {startItem}-{endItem} of {totalItems} items
      </PaginationInfo>
      
      <PaginationControls>
        <NavigationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaChevronLeft />
        </NavigationButton>
        
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <Ellipsis>
                <FaEllipsisH />
              </Ellipsis>
            ) : (
              <PageButton
                className={page === currentPage ? 'active' : ''}
                onClick={() => handlePageChange(page)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {page}
              </PageButton>
            )}
          </React.Fragment>
        ))}
        
        <NavigationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaChevronRight />
        </NavigationButton>
      </PaginationControls>
      
      <PageSizeSelector>
        <PageSizeLabel>Show:</PageSizeLabel>
        <PageSizeSelect
          value={pageSize}
          onChange={(e) => handlePageSizeChange(e.target.value)}
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </PageSizeSelect>
      </PageSizeSelector>
    </PaginationContainer>
  );
};

export default Pagination; 
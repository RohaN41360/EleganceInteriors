import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  FaPlus, 
  FaImage, 
  FaVideo, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaTimes, 
  FaCheck,
  FaUpload,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const db = getFirestore();

// Main Container
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Header Section
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

const AddButton = styled(motion.button)`
  background: linear-gradient(135deg, #4E7E5D, #5a8b6a);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #5a8b6a, #4E7E5D);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(78, 126, 93, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Search and Filter Section
const SearchFilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
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

const FilterSelect = styled.select`
  padding: 0.8rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4E7E5D;
    box-shadow: 0 0 0 3px rgba(78, 126, 93, 0.1);
  }
`;

// Upload Form
const UploadForm = styled(motion.form)`
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
`;

const FormTitle = styled.h2`
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
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
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4E7E5D;
    box-shadow: 0 0 0 3px rgba(78, 126, 93, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #4E7E5D, #5a8b6a);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
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
`;

const ErrorMessage = styled.div`
  color: #ff5959;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

// Gallery Grid
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const MediaCard = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const MediaImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const MediaVideo = styled.video`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  background: #000;
`;

const MediaContent = styled.div`
  padding: 1.5rem;
`;

const MediaTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const MediaType = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.type === 'image' ? 'rgba(78, 126, 93, 0.1)' : 'rgba(127, 90, 240, 0.1)'};
  color: ${props => props.type === 'image' ? '#4E7E5D' : '#7f5af0'};
`;

const MediaActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)`
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  
  &:hover {
    background: #4E7E5D;
    color: white;
    border-color: #4E7E5D;
  }
  
  &.delete:hover {
    background: #ff5959;
    border-color: #ff5959;
  }
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
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

export default function AdminGalleryUpload() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    type: 'image'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setMedia(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching media:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.url) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'media'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      
      setFormData({ name: '', url: '', type: 'image' });
      setShowUploadForm(false);
      await fetchMedia();
    } catch (error) {
      setError('Error uploading media: ' + error.message);
    }
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingMedia) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'media', editingMedia.id), {
        name: formData.name,
        url: formData.url,
        type: formData.type,
      });
      
      setEditingMedia(null);
      setFormData({ name: '', url: '', type: 'image' });
      await fetchMedia();
    } catch (error) {
      setError('Error updating media: ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media?')) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'media', id));
      await fetchMedia();
    } catch (error) {
      setError('Error deleting media: ' + error.message);
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditingMedia(item);
    setFormData({
      name: item.name,
      url: item.url,
      type: item.type
    });
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <Container>
      <Header>
        <Title>Gallery Management</Title>
        <AddButton
          onClick={() => setShowUploadForm(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus />
          Add New Media
        </AddButton>
      </Header>

      <SearchFilterSection>
        <SearchInput
          type="text"
          placeholder="Search media by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </FilterSelect>
      </SearchFilterSection>

      <AnimatePresence>
        {showUploadForm && (
          <UploadForm
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
          >
            <FormTitle>
              <FaUpload />
              Add New Media
            </FormTitle>
            
            <FormGrid>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  placeholder="Enter media name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </Select>
              </FormGroup>
            </FormGrid>
            
            <FormGroup>
              <Label>URL</Label>
              <Input
                type="url"
                placeholder="Enter media URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </FormGroup>
            
            <SubmitButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Uploading...' : (
                <>
                  <FaUpload />
                  Upload Media
                </>
              )}
            </SubmitButton>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </UploadForm>
        )}
      </AnimatePresence>

      {loading && media.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📷</EmptyIcon>
          <EmptyTitle>Loading...</EmptyTitle>
        </EmptyState>
      ) : filteredMedia.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📷</EmptyIcon>
          <EmptyTitle>No media found</EmptyTitle>
          <EmptyText>
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Start by adding some media to your gallery.'
            }
          </EmptyText>
        </EmptyState>
      ) : (
        <GalleryGrid>
          {filteredMedia.map((item) => (
            <MediaCard
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ y: -4 }}
            >
              {item.type === 'image' ? (
                <MediaImage src={item.url} alt={item.name} />
              ) : (
                <MediaVideo controls>
                  <source src={item.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </MediaVideo>
              )}
              
              <MediaContent>
                <MediaTitle>{item.name}</MediaTitle>
                <MediaType type={item.type}>
                  {item.type === 'image' ? <FaImage /> : <FaVideo />}
                  {item.type}
                </MediaType>
                
                <MediaActions>
                  <ActionButton
                    onClick={() => handleEdit(item)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Edit"
                  >
                    <FaEdit />
                  </ActionButton>
                  
                  <ActionButton
                    onClick={() => handleDelete(item.id)}
                    className="delete"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete"
                  >
                    <FaTrash />
                  </ActionButton>
                </MediaActions>
              </MediaContent>
            </MediaCard>
          ))}
        </GalleryGrid>
      )}

      <AnimatePresence>
        {editingMedia && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingMedia(null)}
          >
            <Modal
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Edit Media</ModalTitle>
                <CloseButton onClick={() => setEditingMedia(null)}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleUpdate}>
                <FormGrid>
                  <FormGroup>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      placeholder="Enter media name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Type</Label>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </Select>
                  </FormGroup>
                </FormGrid>
                
                <FormGroup>
                  <Label>URL</Label>
                  <Input
                    type="url"
                    placeholder="Enter media URL"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                  />
                </FormGroup>
                
                <SubmitButton
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Updating...' : (
                    <>
                      <FaCheck />
                      Update Media
                    </>
                  )}
                </SubmitButton>
                
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </form>
            </Modal>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
} 
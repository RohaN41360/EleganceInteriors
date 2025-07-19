import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { FiLogOut } from 'react-icons/fi';

const Wrapper = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 2.5rem 2rem;
  position: relative;
`;
const LogoutBtn = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  background: #fff;
  color: #d32f2f;
  border: 2px solid #d32f2f;
  border-radius: 30px;
  padding: 0.5rem 1.3rem 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(211,47,47,0.07);
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #d32f2f;
    color: #fff;
  }
`;
const Title = styled.h2`
  color: #1a3c2e;
  margin-bottom: 2rem;
`;
const UploadForm = styled.form`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;
const FileInput = styled.input`
  padding: 0.5rem;
`;
const Button = styled.button`
  background: #e6b17a;
  color: #1a3c2e;
  padding: 0.7rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1a3c2e;
    color: #e6b17a;
  }
`;
const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
`;
const ImgCard = styled.div`
  background: #f7f5f2;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Img = styled.img`
  width: 100%;
  max-width: 150px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.7rem;
`;
const RemoveBtn = styled.button`
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0.3rem 1rem;
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: 0.5rem;
  &:hover {
    background: #b71c1c;
  }
`;

// Dummy images for UI preview
const dummyImages = [
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
];

const AdminGallery = () => {
  const fileRef = useRef();
  const [images, setImages] = useState(dummyImages);

  // Placeholder upload handler
  const handleUpload = (e) => {
    e.preventDefault();
    // Firebase upload logic will go here
    alert('Upload logic will be added after Firebase Storage is enabled.');
  };

  // Placeholder remove handler
  const handleRemove = (url) => {
    // Firebase delete logic will go here
    setImages(images.filter(img => img !== url));
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <Wrapper>
      <LogoutBtn onClick={handleLogout} title="Logout">
        <FiLogOut size={20} /> Logout
      </LogoutBtn>
      <Title>Manage Gallery</Title>
      <UploadForm onSubmit={handleUpload}>
        <FileInput type="file" accept="image/*,video/*" ref={fileRef} />
        <Button type="submit">Upload</Button>
      </UploadForm>
      <Gallery>
        {images.map((img, idx) => (
          <ImgCard key={idx}>
            <Img src={img} alt={`Gallery ${idx}`} />
            <RemoveBtn onClick={() => handleRemove(img)}>Remove</RemoveBtn>
          </ImgCard>
        ))}
      </Gallery>
    </Wrapper>
  );
};

export default AdminGallery; 
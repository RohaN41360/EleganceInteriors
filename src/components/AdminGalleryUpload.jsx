import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { FiLogOut, FiPlus, FiImage, FiTrash2, FiMenu, FiMoreVertical, FiEdit2, FiX, FiMail } from 'react-icons/fi';

const db = getFirestore();

// Layout
const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  background: #f4f7fa;
`;
const Sidebar = styled.nav`
  width: 220px;
  background: #232946;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 2.5rem 0 1.5rem 0;
  gap: 2rem;
  box-shadow: 2px 0 16px #23294622;
  transition: left 0.25s;
  position: sticky;
  top: 0;
  z-index: 20;
  @media (max-width: 900px) {
    position: fixed;
    left: ${({ open }) => (open ? '0' : '-220px')};
    height: 100vh;
    width: 180px;
    padding: 1.2rem 0 1rem 0;
    gap: 1.2rem;
    box-shadow: 2px 0 16px #23294644;
  }
`;
const SidebarOverlay = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: ${({ open }) => (open ? 'block' : 'none')};
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.18);
    z-index: 15;
  }
`;
const Brand = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: #00e6e6;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  justify-content: center;
`;
const SideLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  align-items: stretch;
`;
const SideLink = styled.button`
  background: ${({ active }) => (active ? '#121629' : 'none')};
  color: ${({ active }) => (active ? '#00e6e6' : '#fff')};
  border: none;
  font-size: 1.08rem;
  font-weight: 700;
  padding: 0.9rem 1.5rem;
  border-radius: 10px 0 0 10px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  justify-content: flex-start;
  &:hover, &:focus {
    background: #121629;
    color: #00e6e6;
  }
  @media (max-width: 900px) {
    justify-content: center;
    padding: 0.9rem 0.5rem;
    font-size: 1.2rem;
    border-radius: 10px;
  }
`;
const LogoutBtn = styled.button`
  background: #232946;
  color: #ff5959;
  border: 2px solid #ff5959;
  border-radius: 30px;
  padding: 0.5rem 1.3rem 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin: 0 1.5rem;
  box-shadow: 0 2px 8px #ff595911;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #ff5959;
    color: #fff;
  }
  @media (max-width: 900px) {
    margin: 0 0.5rem;
    justify-content: center;
    padding: 0.5rem 0.7rem;
  }
`;
const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;
const Topbar = styled.div`
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 12px #0001;
  padding: 1.2rem 2vw 1.2rem 2vw;
  font-size: 1.25rem;
  font-weight: 700;
  color: #232946;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;
const MenuBtn = styled.button`
  display: none;
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: #232946;
    font-size: 1.7rem;
    margin-right: 1rem;
    cursor: pointer;
  }
`;
const Content = styled.div`
  flex: 1;
  padding: 2.5rem 2vw 2.5rem 2vw;
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
  @media (max-width: 600px) {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
`;
// Add New Form
const Card = styled.div`
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(44,83,100,0.13);
  padding: 2.7rem 2.2rem 2.2rem 2.2rem;
  max-width: 560px;
  min-width: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  box-sizing: border-box;
  @media (max-width: 700px) {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    max-width: 98vw;
  }
`;
const CardHeader = styled.div`
  text-align: left;
  margin-bottom: 0.5rem;
  padding-left: 0.2rem;
`;
const Title = styled.h2`
  color: #232946;
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 0.2rem;
`;
const Subtitle = styled.p`
  color: #4a6572;
  font-size: 1.05rem;
  margin-bottom: 0.2rem;
`;
const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  box-sizing: border-box;
`;
const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  box-sizing: border-box;
`;
const Label = styled.label`
  font-weight: 600;
  color: #232946;
  margin-bottom: 0.1rem;
  font-size: 1.08rem;
`;
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 1.3rem 1.2rem 0.7rem 1.2rem;
  border-radius: 12px;
  border: 1.8px solid #b2becd;
  font-size: 1.15rem;
  background: #f7f7fa;
  color: #232946;
  box-shadow: 0 1.5px 8px #7f5af011;
  transition: border 0.18s, box-shadow 0.18s;
  margin-bottom: 0.2rem;
  appearance: none;
  line-height: 1.2;
  &:focus {
    border: 1.8px solid #7f5af0;
    outline: none;
    box-shadow: 0 2px 12px #7f5af044;
  }
`;
const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 1.3rem 1.2rem 0.7rem 1.2rem;
  border-radius: 12px;
  border: 1.8px solid #b2becd;
  font-size: 1.15rem;
  background: #f7f7fa;
  color: #232946;
  box-shadow: 0 1.5px 8px #7f5af011;
  transition: border 0.18s, box-shadow 0.18s;
  margin-bottom: 0.2rem;
  appearance: none;
  line-height: 1.2;
  &:focus {
    border: 1.8px solid #00e6e6;
    outline: none;
    box-shadow: 0 2px 12px #00e6e644;
  }
`;
const Button = styled.button`
  background: linear-gradient(90deg, #7f5af0 0%, #00e6e6 100%);
  color: #fff;
  padding: 1.1rem 2.2rem;
  border-radius: 14px;
  font-size: 1.15rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px #7f5af022;
  letter-spacing: 0.5px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 54px;
  box-sizing: border-box;
  @media (max-width: 900px) {
    width: 100%;
    margin-top: 0;
  }
  &:hover {
    background: linear-gradient(90deg, #00e6e6 0%, #7f5af0 100%);
    color: #fff;
    box-shadow: 0 4px 16px #23294622;
  }
`;
const ErrorMsg = styled.div`
  color: #ff5959;
  text-align: center;
  font-size: 1rem;
  margin-top: -0.5rem;
`;
const MediaSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;
const MediaTitle = styled.h3`
  color: #232946;
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  text-align: left;
  padding-left: 0.2rem;
`;
const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem 2vw;
  width: 100%;
`;
const MediaCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px 0 rgba(44,83,100,0.13);
  padding: 1.2rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  min-width: 0;
  border: 1.5px solid #e6eaf0;
  &:hover {
    box-shadow: 0 8px 32px #00e6e633;
    transform: translateY(-4px) scale(1.03);
    border-color: #00e6e6;
  }
`;
const MediaCardTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
  position: relative;
`;
const MoreBtn = styled.button`
  background: none;
  color: #7f5af0; /* Vibrant indigo */
  border: none;
  border-radius: 0;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  cursor: pointer;
  transition: color 0.18s, transform 0.18s;
  z-index: 5;
  outline: none;
  box-shadow: none;
  padding: 0.2rem;
  &:hover, &:focus {
    color: #00e6e6; /* Cyan accent on hover */
    transform: scale(1.15);
  }
`;
const Dropdown = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 32px #23294633, 0 1.5px 8px #7f5af022;
  min-width: 130px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  padding: 0.3rem 0;
  border: 1.5px solid #e6eaf0;
`;
const DropdownItem = styled.button`
  background: none;
  border: none;
  color: #232946;
  font-size: 1rem;
  padding: 0.7rem 1.2rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.18s, color 0.18s;
  &:hover, &:focus {
    background: #e6eaf0;
    color: #ff5959;
  }
`;
const UpdateForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  background: #f7f7fa;
  border-radius: 10px;
  padding: 1rem 0.5rem;
  margin-bottom: 0.7rem;
`;
const UpdateInput = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #b2becd;
  font-size: 1rem;
  background: #fff;
  color: #232946;
  &:focus {
    border: 1.5px solid #00e6e6;
    outline: none;
  }
`;
const UpdateSelect = styled.select`
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #b2becd;
  font-size: 1rem;
  background: #fff;
  color: #232946;
  &:focus {
    border: 1.5px solid #00e6e6;
    outline: none;
  }
`;
const UpdateActions = styled.div`
  display: flex;
  gap: 0.7rem;
  margin-top: 0.5rem;
`;
const UpdateBtn = styled.button`
  background: #00e6e6;
  color: #232946;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  &:hover, &:focus {
    background: #232946;
    color: #00e6e6;
  }
`;
const CancelBtn = styled(UpdateBtn)`
  background: #e6eaf0;
  color: #232946;
  &:hover, &:focus {
    background: #ff5959;
    color: #fff;
  }
`;
const MediaName = styled.div`
  font-weight: 600;
  margin-bottom: 0.7rem;
  color: #232946;
  text-align: center;
  word-break: break-word;
`;
const MediaImg = styled.img`
  width: 100%;
  border-radius: 10px;
  max-height: 180px;
  object-fit: cover;
  margin-bottom: 0.5rem;
  display: block;
`;
const MediaVideo = styled.video`
  width: 100%;
  border-radius: 10px;
  max-height: 180px;
  margin-bottom: 0.5rem;
  background: #000;
  display: block;
`;
const DeleteBtn = styled.button`
  position: absolute;
  top: -18px;
  right: -18px;
  background: #ff5959;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 16px #ff595955, 0 1.5px 8px #fff8;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
  z-index: 3;
  outline: none;
  &:hover, &:focus {
    background: #d32f2f;
    color: #fff;
    box-shadow: 0 8px 32px #d32f2f55, 0 1.5px 8px #fff8;
    transform: scale(1.08);
  }
  &::after {
    content: attr(title);
    position: absolute;
    top: 110%;
    left: 50%;
    transform: translateX(-50%);
    background: #232946;
    color: #fff;
    font-size: 0.92rem;
    padding: 0.25em 0.7em;
    border-radius: 6px;
    opacity: 0;
    pointer-events: none;
    white-space: nowrap;
    transition: opacity 0.18s;
    margin-top: 2px;
  }
  &:hover::after, &:focus::after {
    opacity: 1;
  }
`;
const EmptyMsg = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.05rem;
`;

// Modal styles
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
  padding-top: 3.5rem;
  max-width: 98vw;
  width: 420px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  overflow-y: auto;
  max-height: 90vh;
  @media (max-width: 600px) {
    width: 98vw;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    padding-top: 3.2rem;
    gap: 1.2rem;
    max-height: 96vh;
  }
`;
const ModalIcon = styled.div`
  background: linear-gradient(135deg, #7f5af0 0%, #00e6e6 100%);
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 24px #7f5af044;
`;
const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #232946;
  font-size: 1.5rem;
  cursor: pointer;
  &:hover, &:focus {
    color: #ff5959;
  }
`;
const ModalTitle = styled.h3`
  color: #232946;
  font-size: 1.6rem;
  font-weight: 900;
  margin-bottom: 0.2rem;
  text-align: center;
  letter-spacing: 0.5px;
`;
const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  width: 100%;
`;
const ModalField = styled.div`
  position: relative;
  width: 100%;
`;
const ModalLabel = styled.label`
  position: absolute;
  top: 1.1rem;
  left: 1.2rem;
  color: #7f5af0;
  font-size: 1.08rem;
  font-weight: 600;
  background: transparent;
  pointer-events: none;
  transition: 0.18s all;
  opacity: 0.85;
  z-index: 2;
  &.active {
    top: -0.7rem;
    left: 0.9rem;
    font-size: 0.92rem;
    background: #fff;
    padding: 0 0.3em;
    border-radius: 6px;
    opacity: 1;
  }
`;
const ModalInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 1.3rem 1.2rem 0.7rem 1.2rem;
  border-radius: 12px;
  border: 1.8px solid #b2becd;
  font-size: 1.15rem;
  background: #f7f7fa;
  color: #232946;
  box-shadow: 0 1.5px 8px #7f5af011;
  transition: border 0.18s, box-shadow 0.18s;
  margin-bottom: 0.2rem;
  appearance: none;
  line-height: 1.2;
  &:focus {
    border: 1.8px solid #7f5af0;
    outline: none;
    box-shadow: 0 2px 12px #7f5af044;
  }
`;
const ModalSelect = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 1.3rem 1.2rem 0.7rem 1.2rem;
  border-radius: 12px;
  border: 1.8px solid #b2becd;
  font-size: 1.15rem;
  background: #f7f7fa;
  color: #232946;
  box-shadow: 0 1.5px 8px #7f5af011;
  transition: border 0.18s, box-shadow 0.18s;
  margin-bottom: 0.2rem;
  appearance: none;
  line-height: 1.2;
  &:focus {
    border: 1.8px solid #00e6e6;
    outline: none;
    box-shadow: 0 2px 12px #00e6e644;
  }
`;
const ModalActions = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;
const ModalBtn = styled.button`
  background: linear-gradient(90deg, #7f5af0 0%, #00e6e6 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.9rem 2.2rem;
  font-weight: 800;
  font-size: 1.15rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 12px #7f5af022;
  &:hover, &:focus {
    background: linear-gradient(90deg, #00e6e6 0%, #7f5af0 100%);
    color: #fff;
    box-shadow: 0 4px 24px #00e6e644;
  }
`;
const ModalCancel = styled(ModalBtn)`
  background: #e6eaf0;
  color: #232946;
  box-shadow: none;
  &:hover, &:focus {
    background: #ff5959;
    color: #fff;
  }
`;

const MessagesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;
const MessageCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px 0 rgba(44,83,100,0.13);
  padding: 1.2rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  border: 1.5px solid #e6eaf0;
  min-width: 0;
`;
const MessageHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.08rem;
  color: #232946;
  font-weight: 700;
`;
const MessageField = styled.div`
  color: #4a6572;
  font-size: 1.05rem;
  margin-bottom: 0.2rem;
  word-break: break-word;
`;
const MessageDate = styled.div`
  color: #7f5af0;
  font-size: 0.98rem;
  margin-left: auto;
`;
const MessageActions = styled.div`
  display: flex;
  gap: 0.7rem;
  margin-top: 0.5rem;
`;
const ActionBtn = styled.button`
  background: #f7f7fa;
  color: #232946;
  border: 1.5px solid #e6eaf0;
  border-radius: 8px;
  padding: 0.4rem 1.1rem;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
  &:hover, &:focus {
    background: #7f5af0;
    color: #fff;
    border: 1.5px solid #7f5af0;
  }
`;
const SearchBar = styled.input`
  width: 100%;
  max-width: 340px;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  border: 1.5px solid #e6eaf0;
  font-size: 1.08rem;
  background: #fff;
  color: #232946;
  margin-bottom: 1.2rem;
  box-shadow: 0 1.5px 8px #7f5af011;
  transition: border 0.18s, box-shadow 0.18s;
  &:focus {
    border: 1.5px solid #7f5af0;
    outline: none;
    box-shadow: 0 2px 12px #7f5af044;
  }
`;
const SortSelect = styled.select`
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  border: 1.5px solid #e6eaf0;
  font-size: 1.05rem;
  background: #fff;
  color: #232946;
  margin-left: 1rem;
  margin-bottom: 1.2rem;
  transition: border 0.18s;
  &:focus {
    border: 1.5px solid #7f5af0;
    outline: none;
  }
`;

export default function AdminGalleryUpload() {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('image');
  const [error, setError] = useState('');
  const [media, setMedia] = useState([]);
  const [tab, setTab] = useState('gallery');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); // id of open dropdown
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editType, setEditType] = useState('image');
  const videoRefs = useRef({});
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date_desc');
  const [viewMsg, setViewMsg] = useState(null); // message object for modal
  const [readIds, setReadIds] = useState(() => new Set());
  const [deletingId, setDeletingId] = useState(null);

  // --- Dropdown close on outside click ---
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      // Only close if click is outside any open dropdown or MoreBtn
      if (!e.target.closest('.dropdown-menu') && !e.target.closest('.more-btn')) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  useEffect(() => {
    fetchMedia();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (tab === 'messages') fetchMessages();
    // eslint-disable-next-line
  }, [tab]);

  async function fetchMedia() {
    setLoading(true);
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setMedia(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  }

  async function fetchMessages() {
    setMessagesLoading(true);
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setMessagesLoading(false);
  }

  const handleUpload = async e => {
    e.preventDefault();
    if (!url || !name) {
      setError('Please enter a URL and a name.');
      return;
    }
    setError('');
    try {
      await addDoc(collection(db, 'media'), {
        name,
        url,
        type,
        createdAt: serverTimestamp(),
      });
      setUrl('');
      setName('');
      setType('image');
      await fetchMedia();
      setTab('gallery');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this media?')) return;
    await deleteDoc(doc(db, 'media', id));
    await fetchMedia();
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  // Video hover/focus handlers
  const handleVideoPlay = (id) => {
    if (videoRefs.current[id]) {
      videoRefs.current[id].play();
    }
  };
  const handleVideoPause = (id) => {
    if (videoRefs.current[id]) {
      videoRefs.current[id].pause();
      videoRefs.current[id].currentTime = 0;
    }
  };

  const handleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditUrl(item.url);
    setEditType(item.type);
    setDropdownOpen(null);
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    await updateDoc(doc(db, 'media', id), {
      name: editName,
      url: editUrl,
      type: editType,
    });
    setEditingId(null);
    await fetchMedia();
  };

  const closeModal = () => {
    setEditingId(null);
  };

  // Filter and sort messages
  const filteredMessages = messages
    .filter(msg =>
      (!search || (msg.name && msg.name.toLowerCase().includes(search.toLowerCase())) || (msg.email && msg.email.toLowerCase().includes(search.toLowerCase())))
    )
    .sort((a, b) => {
      if (sort === 'date_desc') return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      if (sort === 'date_asc') return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
      if (sort === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      if (sort === 'name_desc') return (b.name || '').localeCompare(a.name || '');
      return 0;
    });

  // Mark as read in Firestore when opening a message
  const handleOpenMsg = async (msg) => {
    setViewMsg(msg);
    if (!msg.read) {
      await updateDoc(doc(db, 'messages', msg.id), { read: true });
      await fetchMessages();
    }
  };
  // Mark as unread in Firestore
  const handleMarkUnreadFirestore = async (id) => {
    await updateDoc(doc(db, 'messages', id), { read: false });
    await fetchMessages();
    setViewMsg(null);
  };
  // Mark as read in Firestore
  const handleMarkReadFirestore = async (id) => {
    await updateDoc(doc(db, 'messages', id), { read: true });
    await fetchMessages();
    setViewMsg(null);
  };

  const handleDeleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    setDeletingId(id);
    await deleteDoc(doc(db, 'messages', id));
    await fetchMessages();
    setDeletingId(null);
  };
  const handleMarkRead = (id) => {
    setReadIds(new Set([...readIds, id]));
  };
  const handleMarkUnread = (id) => {
    const newSet = new Set(readIds);
    newSet.delete(id);
    setReadIds(newSet);
  };

  return (
    <Layout>
      <Sidebar open={sidebarOpen}>
        <Brand><FiImage /> Admin</Brand>
        <SideLinks>
          <SideLink active={tab === 'gallery'} onClick={() => { setTab('gallery'); setSidebarOpen(false); }}><FiImage /> <span style={{display: 'inline-block', minWidth: 0}}>Gallery</span></SideLink>
          <SideLink active={tab === 'add'} onClick={() => { setTab('add'); setSidebarOpen(false); }}><FiPlus /> <span style={{display: 'inline-block', minWidth: 0}}>Add New</span></SideLink>
          <SideLink active={tab === 'messages'} onClick={() => { setTab('messages'); setSidebarOpen(false); }}><FiMail /> <span style={{display: 'inline-block', minWidth: 0}}>Messages</span></SideLink>
        </SideLinks>
        <LogoutBtn onClick={handleLogout}><FiLogOut /> Logout</LogoutBtn>
      </Sidebar>
      <SidebarOverlay open={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <Main>
        <Topbar>
          <MenuBtn onClick={() => setSidebarOpen((v) => !v)}><FiMenu /></MenuBtn>
          {tab === 'gallery' ? <><FiImage /> Gallery</> : <><FiPlus /> Add New</>}
        </Topbar>
        <Content>
          {tab === 'add' && (
            <Card>
              <CardHeader>
                <Title>Add New Media</Title>
                <Subtitle>Enter the name, URL, and type of the image or video.</Subtitle>
              </CardHeader>
              <StyledForm onSubmit={handleUpload} autoComplete="off">
                <FormGroup>
                  <Label htmlFor="media-name">Name</Label>
                  <Input id="media-name" type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="media-url">URL</Label>
                  <Input id="media-url" type="text" placeholder="Paste image or video URL" value={url} onChange={e => setUrl(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="media-type">Type</Label>
                  <Select id="media-type" value={type} onChange={e => setType(e.target.value)}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </Select>
                </FormGroup>
                <Button type="submit"><FiPlus /> Add</Button>
                {error && <ErrorMsg>{error}</ErrorMsg>}
              </StyledForm>
            </Card>
          )}
          {tab === 'gallery' && (
            <MediaSection>
              <MediaTitle>Uploaded Media</MediaTitle>
              {loading ? <EmptyMsg>Loading...</EmptyMsg> : (
                <MediaGrid>
                  {media.map(item => (
                    <MediaCard key={item.id}>
                      <MediaCardTop>
                        <MoreBtn className="more-btn" title="More" onClick={() => handleDropdown(item.id)} aria-label="More options">
                          <FiMoreVertical size={24} style={{
                            background: 'linear-gradient(135deg, #7f5af0 0%, #00e6e6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }} />
                        </MoreBtn>
                        {dropdownOpen === item.id && (
                          <Dropdown className="dropdown-menu">
                            <DropdownItem onClick={() => { setDropdownOpen(null); handleEdit(item); }}><FiEdit2 /> Update</DropdownItem>
                            <DropdownItem onClick={() => { setDropdownOpen(null); handleDelete(item.id); }}><FiTrash2 /> Delete</DropdownItem>
                          </Dropdown>
                        )}
                      </MediaCardTop>
                      <>
                        <MediaName>{item.name}</MediaName>
                        {item.type === 'image' ? (
                          <MediaImg src={item.url} alt={item.name} />
                        ) : item.type === 'video' ? (
                          <MediaVideo
                            ref={el => (videoRefs.current[item.id] = el)}
                            controls={false}
                            preload="none"
                            tabIndex={0}
                            onMouseEnter={() => handleVideoPlay(item.id)}
                            onMouseLeave={() => handleVideoPause(item.id)}
                            onFocus={() => handleVideoPlay(item.id)}
                            onBlur={() => handleVideoPause(item.id)}
                            poster={item.poster || ''}
                          >
                            <source src={item.url} type="video/mp4" />
                          </MediaVideo>
                        ) : null}
                      </>
                    </MediaCard>
                  ))}
                  {media.length === 0 && <EmptyMsg>No media uploaded yet.</EmptyMsg>}
                </MediaGrid>
              )}
            </MediaSection>
          )}
          {tab === 'messages' && (
            <MessagesSection>
              <MediaTitle>Customer Messages</MediaTitle>
              <div style={{display:'flex',flexWrap:'wrap',gap:'1rem',alignItems:'center',marginBottom:'0.7rem'}}>
                <SearchBar
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <SortSelect value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="name_asc">Name A-Z</option>
                  <option value="name_desc">Name Z-A</option>
                </SortSelect>
              </div>
              {messagesLoading ? <EmptyMsg>Loading...</EmptyMsg> : (
                filteredMessages.length === 0 ? <EmptyMsg>No messages found.</EmptyMsg> : (
                  <MediaGrid style={{gap:'1.2rem 2vw', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))'}}>
                    {filteredMessages.map(msg => {
                      const isRead = readIds.has(msg.id);
                      return (
                        <MessageCard
                          key={msg.id}
                          style={{
                            boxShadow: msg.read ? '0 1.5px 8px #7f5af011' : '0 4px 24px #7f5af044',
                            cursor: 'pointer',
                            borderLeft: msg.read ? '6px solid #e6eaf0' : '6px solid #7f5af0',
                            transition: 'box-shadow 0.18s, border 0.18s, background 0.18s',
                            background: msg.read ? '#f7f7fa' : '#fff',
                          }}
                          onClick={() => handleOpenMsg(msg)}
                          tabIndex={0}
                          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleOpenMsg(msg); }}
                          aria-label={`View message from ${msg.name}`}
                        >
                          <MessageHeader style={{justifyContent:'space-between'}}>
                            <span style={{fontWeight:700, color:'#232946', fontSize:'1.08rem'}}>{msg.name || 'No Name'}</span>
                            <MessageDate>{msg.createdAt && msg.createdAt.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString() : ''}</MessageDate>
                            <span style={{marginLeft:'auto',fontSize:'0.95rem',fontWeight:600,color:msg.read?'#7f5af0':'#ff5959',background:msg.read?'#e6eaf0':'#fff0f0',borderRadius:'8px',padding:'0.2rem 0.7rem'}}>{msg.read ? 'Read' : 'Unread'}</span>
                          </MessageHeader>
                        </MessageCard>
                      );
                    })}
                  </MediaGrid>
                )
              )}
              {viewMsg && (
                <ModalOverlay onClick={()=>setViewMsg(null)}>
                  <Modal onClick={e=>e.stopPropagation()}>
                    <ModalClose onClick={()=>setViewMsg(null)}>&times;</ModalClose>
                    <h3 style={{color:'#232946',fontWeight:800,marginBottom:'1.2rem',fontSize:'1.25rem',textAlign:'center'}}>Customer Message Details</h3>
                    <form style={{width:'100%',display:'flex',flexDirection:'column',gap:'1.1rem'}}>
                      <div style={{display:'flex',flexDirection:'column',gap:'0.2rem'}}>
                        <label style={{fontWeight:700,color:'#7f5af0',fontSize:'1.05rem'}}>Name</label>
                        <div style={{color:'#232946',fontWeight:600,fontSize:'1.08rem',background:'#f7f7fa',borderRadius:'8px',padding:'0.7rem 1rem'}}>{viewMsg.name || 'No Name'}</div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:'0.2rem'}}>
                        <label style={{fontWeight:700,color:'#7f5af0',fontSize:'1.05rem'}}>Email</label>
                        <div style={{color:'#232946',fontWeight:500,fontSize:'1.05rem',background:'#f7f7fa',borderRadius:'8px',padding:'0.7rem 1rem'}}>{viewMsg.email}</div>
                      </div>
                      {viewMsg.phone && (
                        <div style={{display:'flex',flexDirection:'column',gap:'0.2rem'}}>
                          <label style={{fontWeight:700,color:'#7f5af0',fontSize:'1.05rem'}}>Phone</label>
                          <div style={{color:'#232946',fontWeight:500,fontSize:'1.05rem',background:'#f7f7fa',borderRadius:'8px',padding:'0.7rem 1rem'}}>{viewMsg.phone}</div>
                        </div>
                      )}
                      <div style={{display:'flex',flexDirection:'column',gap:'0.2rem'}}>
                        <label style={{fontWeight:700,color:'#7f5af0',fontSize:'1.05rem'}}>Message</label>
                        <div style={{color:'#232946',fontWeight:500,fontSize:'1.08rem',background:'#f7f7fa',borderRadius:'8px',padding:'0.7rem 1rem',whiteSpace:'pre-line',minHeight:'80px'}}>{viewMsg.message}</div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:'0.2rem'}}>
                        <label style={{fontWeight:700,color:'#7f5af0',fontSize:'1.05rem'}}>Date</label>
                        <div style={{color:'#7f5af0',fontWeight:500,fontSize:'1.02rem',background:'#f7f7fa',borderRadius:'8px',padding:'0.7rem 1rem'}}>{viewMsg.createdAt && viewMsg.createdAt.seconds ? new Date(viewMsg.createdAt.seconds * 1000).toLocaleString() : ''}</div>
                      </div>
                    </form>
                    <MessageActions>
                      {viewMsg.read ? (
                        <ActionBtn onClick={() => handleMarkUnreadFirestore(viewMsg.id)}>Mark as Unread</ActionBtn>
                      ) : (
                        <ActionBtn onClick={() => handleMarkReadFirestore(viewMsg.id)}>Mark as Read</ActionBtn>
                      )}
                      <ActionBtn style={{color:'#ff5959',borderColor:'#ff5959'}} disabled={deletingId===viewMsg.id} onClick={() => { handleDeleteMsg(viewMsg.id); setViewMsg(null); }}>{deletingId===viewMsg.id?'Deleting...':'Delete'}</ActionBtn>
                    </MessageActions>
                  </Modal>
                </ModalOverlay>
              )}
            </MessagesSection>
          )}
        </Content>
      </Main>
      {/* Move the modal to the root, outside the map, and show only when editingId is set */}
      {editingId && (
        <ModalOverlay>
          <Modal>
            <ModalIcon><FiEdit2 /></ModalIcon>
            <ModalTitle>Update Media</ModalTitle>
            <ModalForm onSubmit={e => handleUpdate(e, editingId)}>
              <ModalField>
                <ModalInput id="edit-name" value={editName} onChange={e => setEditName(e.target.value)} placeholder=" " autoFocus />
                <ModalLabel htmlFor="edit-name" className={editName ? 'active' : ''}>Name</ModalLabel>
              </ModalField>
              <ModalField>
                <ModalInput id="edit-url" value={editUrl} onChange={e => setEditUrl(e.target.value)} placeholder=" " />
                <ModalLabel htmlFor="edit-url" className={editUrl ? 'active' : ''}>URL</ModalLabel>
              </ModalField>
              <ModalField>
                <ModalSelect id="edit-type" value={editType} onChange={e => setEditType(e.target.value)}>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </ModalSelect>
                <ModalLabel htmlFor="edit-type" className={editType ? 'active' : ''}>Type</ModalLabel>
              </ModalField>
              <ModalActions>
                <ModalBtn type="submit">Update</ModalBtn>
                <ModalCancel type="button" onClick={closeModal}>Cancel</ModalCancel>
              </ModalActions>
            </ModalForm>
            <ModalClose onClick={closeModal} aria-label="Close"><FiX /></ModalClose>
          </Modal>
        </ModalOverlay>
      )}
    </Layout>
  );
} 
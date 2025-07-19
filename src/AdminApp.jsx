import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminGalleryUpload from './components/AdminGalleryUpload';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

const AdminApp = () => {
  const [user] = useAuthState(auth);
  const [loggedIn, setLoggedIn] = useState(false);

  if (!user && !loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }
  return <AdminGalleryUpload />;
};

export default AdminApp; 
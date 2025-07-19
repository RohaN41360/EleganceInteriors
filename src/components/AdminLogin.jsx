import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import styled, { keyframes } from 'styled-components';

// Remove background gradient for login page
const accent = '#00e6e6'; // cyan
const accentDark = '#00b3b3';
const cardGlass = 'rgba(255,255,255,0.98)';
const inputBg = 'rgba(79,44,140,0.07)';
const inputBorder = '#b2becd';
const focusShadow = '0 0 0 2px #00e6e655';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: none; }
`;

const Bg = styled.div`
  min-height: 100vh;
  width: 100vw;
  /* background removed */
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;
// AbstractShape is not needed if background is removed, so skip rendering it
const Card = styled.div`
  position: relative;
  z-index: 1;
  background: ${cardGlass};
  box-shadow: 0 8px 32px 0 rgba(44,83,100,0.18);
  border-radius: 24px;
  padding: 2.5rem 2.2rem 2rem 2.2rem;
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.7s cubic-bezier(.39,.575,.56,1.000);
  @media (max-width: 480px) {
    max-width: 98vw;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
`;
const Logo = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  color: #fff;
  margin-bottom: 1.1rem;
  box-shadow: 0 2px 12px ${accent}33;
`;
const Title = styled.h2`
  text-align: center;
  color: #2c225a;
  margin-bottom: 0.5rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  font-size: 1.5rem;
`;
const Subtitle = styled.p`
  color: #4a6572;
  font-size: 1.05rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;
const StyledForm = styled.form`
  width: 100%;
  box-sizing: border-box;
`;
const InputGroup = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 1.1rem;
  box-sizing: border-box;
`;
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.85rem 1rem 0.85rem 2.5rem;
  border-radius: 12px;
  border: 1.5px solid ${inputBorder};
  font-size: 1rem;
  background: ${inputBg};
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
  color: #2c225a;
  &:focus {
    border: 1.5px solid ${accent};
    background: #fff;
    box-shadow: ${focusShadow};
  }
`;
const InputIcon = styled.span`
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${accent};
  font-size: 1.2rem;
  pointer-events: none;
`;
const ShowPassword = styled.button`
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #b2becd;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
`;
const Button = styled.button`
  width: 100%;
  background: linear-gradient(90deg, ${accent} 60%, ${accentDark} 100%);
  color: #2c225a;
  padding: 0.95rem 0;
  border-radius: 30px;
  font-size: 1.13rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  margin-bottom: 0.7rem;
  box-shadow: 0 2px 8px ${accent}22;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  &:hover {
    background: #2c225a;
    color: ${accent};
    box-shadow: 0 4px 16px #2c225a22;
  }
`;
const ErrorMsg = styled.p`
  color: #d32f2f;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.98rem;
`;

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError('Invalid credentials.');
    }
  };

  return (
    <Bg>
      <Card>
        <Logo>
          {/* Modern SVG shield icon for admin */}
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 4v5c0 5.25-3.75 10-7 10s-7-4.75-7-10V7l7-4z" fill="#fff" stroke="#00b3b3" strokeWidth="1.5"/><path d="M9 11l2 2 4-4" stroke="#00e6e6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Logo>
        <Title>Admin Login</Title>
        <Subtitle>Sign in to manage your portfolio and gallery</Subtitle>
        <StyledForm onSubmit={handleLogin} autoComplete="on">
          <InputGroup>
            <InputIcon>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" stroke={accent} strokeWidth="1.5"/></svg>
            </InputIcon>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </InputGroup>
          <InputGroup>
            <InputIcon>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M17 11V7a5 5 0 0 0-10 0v4M5 11h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8Z" stroke={accent} strokeWidth="1.5"/></svg>
            </InputIcon>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <ShowPassword type="button" onClick={() => setShowPassword(s => !s)} tabIndex={-1} aria-label="Show password">
              {showPassword ? (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#bfa77a" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="#bfa77a" strokeWidth="1.5"/></svg>
              ) : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-5.94M9.53 9.53A3.5 3.5 0 0 1 12 8.5c1.93 0 3.5 1.57 3.5 3.5 0 .47-.09.92-.26 1.33" stroke="#bfa77a" strokeWidth="1.5"/><path d="M1 1l22 22" stroke="#bfa77a" strokeWidth="1.5"/></svg>
              )}
            </ShowPassword>
          </InputGroup>
          <Button type="submit">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="#2c225a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Login
          </Button>
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </StyledForm>
      </Card>
    </Bg>
  );
};

export default AdminLogin; 
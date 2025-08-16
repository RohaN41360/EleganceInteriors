import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminApp from './AdminApp'
import NotFound from './components/NotFound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import SmoothScrollProvider from './components/SmoothScrollProvider'
import ParallaxProvider from './components/ParallaxProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SmoothScrollProvider>
        <ParallaxProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin" element={<AdminApp />} />
              <Route path="/" element={<App />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ParallaxProvider>
      </SmoothScrollProvider>
    </ErrorBoundary>
  </StrictMode>,
)

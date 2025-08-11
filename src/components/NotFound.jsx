import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const parallaxRef = useRef(null);
  const floatingElementsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = parallaxRef.current;
      const floatingElements = floatingElementsRef.current;
      
      if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
      }

      if (floatingElements) {
        const children = floatingElements.children;
        Array.from(children).forEach((child, index) => {
          const speed = scrolled * (0.1 + index * 0.05);
          child.style.transform = `translateY(${speed}px) rotate(${scrolled * 0.01}deg)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="not-found-container">
      {/* Parallax Background */}
      <div className="parallax-background" ref={parallaxRef}>
        <div className="gradient-overlay"></div>
        <div className="floating-shapes" ref={floatingElementsRef}>
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="not-found-content">
        <div className="error-code">
          <span className="digit">4</span>
          <div className="zero-container">
            <div className="zero">0</div>
          </div>
          <span className="digit">4</span>
        </div>

        <h1 className="error-title">Page Not Found</h1>
        <p className="error-description">
          Oops! The page you're looking for seems to have wandered off into the digital wilderness.
        </p>

        <div className="error-actions">
          <Link to="/" className="home-button">
            <span className="button-icon">🏠</span>
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="back-button"
          >
            <span className="button-icon">←</span>
            Go Back
          </button>
        </div>


      </div>

      {/* Animated Elements */}
      <div className="animated-elements">
        <div className="floating-icon floating-icon-1">🔧</div>
        <div className="floating-icon floating-icon-2">🛠️</div>
        <div className="floating-icon floating-icon-3">🏗️</div>
        <div className="floating-icon floating-icon-4">⚒️</div>
      </div>
    </div>
  );
};

export default NotFound; 
import React, { useEffect, useRef } from 'react';

const ParallaxElement = ({ 
  children, 
  speed = 0.5, 
  rotation = 0, 
  className = '', 
  style = {},
  addParallaxElement,
  removeParallaxElement,
  ...props 
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    
    if (element && addParallaxElement) {
      addParallaxElement(element);
    }

    return () => {
      if (element && removeParallaxElement) {
        removeParallaxElement(element);
      }
    };
  }, [addParallaxElement, removeParallaxElement]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const element = elementRef.current;
      
      if (element) {
        const translateY = scrolled * speed;
        const rotate = scrolled * rotation;
        element.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, rotation]);

  return (
    <div
      ref={elementRef}
      className={`parallax-element ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default ParallaxElement; 
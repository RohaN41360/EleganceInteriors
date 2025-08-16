import React, { useEffect, useRef } from 'react';

const ParallaxProvider = ({ children }) => {
  const parallaxElementsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElementsRef.current.forEach((element, index) => {
        if (element) {
          const speed = scrolled * (0.1 + index * 0.05);
          const rotation = scrolled * 0.01;
          element.style.transform = `translateY(${speed}px) rotate(${rotation}deg)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addParallaxElement = (element) => {
    if (element && !parallaxElementsRef.current.includes(element)) {
      parallaxElementsRef.current.push(element);
    }
  };

  const removeParallaxElement = (element) => {
    parallaxElementsRef.current = parallaxElementsRef.current.filter(el => el !== element);
  };

  return (
    <div className="parallax-provider">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            addParallaxElement,
            removeParallaxElement
          });
        }
        return child;
      })}
    </div>
  );
};

export default ParallaxProvider; 
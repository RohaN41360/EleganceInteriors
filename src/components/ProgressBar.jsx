import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ProgressContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${props => props.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  z-index: 9999;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #e6b17a 0%, #7f5af0 100%);
  transform-origin: 0%;
  box-shadow: 0 0 10px rgba(230, 177, 122, 0.5);
`;

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const { isDark } = useTheme();

  return (
    <ProgressContainer isDark={isDark}>
      <ProgressBar style={{ scaleX }} />
    </ProgressContainer>
  );
};

export default ScrollProgress; 
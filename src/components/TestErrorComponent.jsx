import React from 'react';

const TestErrorComponent = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('This is a test error to demonstrate the Error Boundary!');
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Test Component</h3>
      <p>This component is working normally.</p>
      <button 
        onClick={() => {
          throw new Error('Error triggered by button click!');
        }}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Trigger Error
      </button>
    </div>
  );
};

export default TestErrorComponent; 
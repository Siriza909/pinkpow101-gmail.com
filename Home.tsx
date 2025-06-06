import React from 'react';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
      color: 'white',
      textAlign: 'center',
      padding: 20,
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: 10 }}>Welcome to our app!</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: 30 }}>Ready to get started? Click the button below!</p>
      <button
        onClick={() => history.push('/login')}
        style={{
          backgroundColor: '#FFD700',
          border: 'none',
          padding: '15px 30px',
          borderRadius: 30,
          fontSize: '1.2rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}
      >
        Login
      </button>
    </div>
  );
};

export default Home;

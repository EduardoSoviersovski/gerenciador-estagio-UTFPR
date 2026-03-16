import React from 'react';
import { authService } from '../../services/authService';
export const Login = () => {

  const handleSignIn = () => {
    try {
      const loginUrl = authService.getLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      alert("Erro ao redirecionar para o login.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Estágios UTFPR</h2>
      <button onClick={handleSignIn} style={styles.button}>
        Entrar com Google
      </button>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  button: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#005a9c', color: 'white', border: 'none', borderRadius: '4px' }
};
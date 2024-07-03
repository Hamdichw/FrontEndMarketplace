// src/components/GoogleSignInButton.js
import React, { useEffect } from 'react';

const GoogleSignInButton = ({ onLoginSuccess, onLoginFailure }) => {
  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id: '458756993711-6jnb1ji8j3algfclth6q7tv1f5k00378.apps.googleusercontent.com',
      callback: handleCallbackResponse
    });

    window.google?.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      { theme: 'outline', size: 'large' }  
    );
  }, []);

  function handleCallbackResponse(response) {
    const { credential } = response;

    onLoginSuccess(credential);

  }

  return (
    <div id="signInDiv"></div>
  );
};

export default GoogleSignInButton;

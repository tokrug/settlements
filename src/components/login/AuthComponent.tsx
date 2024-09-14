import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User signed up:', userCredential.user);
      navigate('/settlements'); // Navigate to listing component
    } catch (e) {
      console.error('Error signing up:', e);
    }
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User signed in:', userCredential.user);
      navigate('/settlements'); // Navigate to listing component
    } catch (e) {
      console.error('Error signing in:', e);
    }
  };

  return (
    <form onSubmit={signIn}>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <button type="submit">Sign In</button>
        <button type="button" onClick={signUp}>Sign Up</button>
      </div>
    </form>
  );
};

export default AuthComponent;
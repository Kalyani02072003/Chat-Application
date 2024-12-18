import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatApp from './components/ChatApp';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatApp />} />
      <Route path="/:roomCode" element={<ChatApp />} />
    </Routes>
  );
}

export default App;

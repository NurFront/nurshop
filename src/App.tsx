import React, { useState, useEffect } from 'react';
import './index.css'
import Main from './components/ImageGallery'
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
function App() {
  

  return (
    <div className="App">
      <Header />
      <Main />
    </div>
  );
}

export default App;

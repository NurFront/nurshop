import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Admin from './components/AdminPanel';
import Pokupka from './components/Pokupka';
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/adminpanel2233" element={<Admin />} />
        <Route path="/buyproducts" element={<Pokupka />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
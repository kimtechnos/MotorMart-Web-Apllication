import { useState } from 'react'
import "./assets/global.css"
import Navbar from './components/Common/Navbar'
import Home from './components/Pages/Home'
import Contact from './components/Pages/Contact'
import About from './components/Pages/About'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

import { BrowserRouter,Routes, Route } from 'react-router-dom'



import './App.css'

function App() {
 

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App

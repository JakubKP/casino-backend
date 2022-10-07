import React from 'react'
import './App.css'
import Main from './pages/Main'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route
           path="*"
           element={<Navigate to="/" replace />}
           />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
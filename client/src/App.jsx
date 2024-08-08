import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import Dashboard from './pages/Dashboard'
import PostApplication from './pages/PostApplication'
import Register from './pages/Register'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import './App.css'
import { ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from './store/slices/userSlice'
import 'react-toastify/dist/ReactToastify.css'
const App = () => {
  const dispatch = useDispatch()

  const { isAuthenticated } = useSelector((state) => state.user)
  useEffect(() => {
    dispatch(getUser())
  }, [])
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/post/application/:jobId"
            element={<PostApplication />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" theme="dark" />
      </BrowserRouter>
    </>
  )
}

export default App

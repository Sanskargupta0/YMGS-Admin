import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Contacts from './pages/Contacts'
import { useState } from 'react'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react'
import SiteSettings from './pages/SiteSettings'
import Coupons from './pages/Coupons'
import CryptoWallets from './pages/CryptoWallets'
import BlogManagement from './pages/BlogManagement'


export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const frontendUrl = import.meta.env.VITE_FRONTEND_URL
export const currency = '$'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'): '');
  
  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      { token === "" ? <Login setToken={setToken} />: 
      <>
      <Navbar setToken={setToken} />
      <hr />
      <div className='flex w-full'>
        <Sidebar />
        <div className='w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base'>
          <Routes>
            <Route path='/add' element={<Add token={token} />} />
            <Route path='/list' element={<List token={token} />} />
            <Route path='/' element={<Orders token={token} />} />
            <Route path='/contacts' element={<Contacts token={token} />} />
            <Route path='/site-settings' element={<SiteSettings token={token} />} />
            <Route path='/coupons' element={<Coupons token={token} />} />
            <Route path='/crypto-wallets' element={<CryptoWallets token={token} />} />
            <Route path='/blogs' element={<BlogManagement token={token} />} />
          </Routes>
        </div>
      </div>
      </>
      }
      
    </div>
  )
}

export default App

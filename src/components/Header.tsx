import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/header.css'
import { useState } from 'react'
import Basket from './Basket'

const Header = () => {

  const [basket, setBasket] = useState(false)
  const navigate = useNavigate()

  const navMain = () => {
    navigate('/')
  }

  const [title, setTitle] = useState(true)

  setTimeout(() => {
    setTitle(false)
  }, 2000)

  const openBasket = () => {
    setBasket(!basket)
  }

  return (
    < div >
      <header className="main-header">
        <button onClick={navMain} className='nav-main-btn'>Nur SHOP</button>
        <button className='basket-btn' onClick={openBasket}>🛒</button>
      </header>
      {basket && <Basket />}
      {
        title && <div id="loader">
          <div className="spinner"></div>
        </div>
      }
    </ div>
  )
}

export default Header;
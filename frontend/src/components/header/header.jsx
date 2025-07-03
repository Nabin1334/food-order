import React from 'react'
import './header.css'; // Importing the CSS file for styling


const Header = () => {
  return (
    <div className="header">
      <div className='header-content'>
        <h2>Order your favorite food here</h2>
        <p>Order food online from your favorite restaurants with just a few clicks.</p>
        <br />
        
        <button>View Menu</button>
      </div>
    </div>
  )
}

export default Header

import React from 'react'
import './Footer.css' // Importing the CSS file for styling
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className="footer" id='footer'>
       <div className="footer-content">
      <div className="footer-content-left">
        
          <h1 className='brandName1'>Food<span className='brandName2'>Plaza</span></h1>
        
        <p>All rights reserved.</p>
        <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.instagram_icon} alt="Instagram" />
            <img src={assets.twitter_icon} alt="Twitter" /> 
        </div>
      </div>
       <div className="footer-content-center">
        <h2>COMPANY</h2>
        <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
            
        </ul>
       </div>
        <div className="footer-content-right">
        <h2>GET IN TOUCH</h2>
        <ul>
            <li>+977-9812345678</li>
            <li>Suppor@foodplaza.com</li>
          </ul> 
        </div>
 
       </div>
       <hr />
      < p className="footer-copyright"> Copyright 2025 ©  foodplaza.com - All rights Reserved.</p>
    </div>
  )
}

export default Footer

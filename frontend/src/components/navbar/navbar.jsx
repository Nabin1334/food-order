import React, { useContext, useState } from 'react'
import "./navbar.css" // Importing the CSS file for styling
// This component will serve as the navigation bar for the application
import { assets } from '../../assets/assets' // Importing assets for the navbar
import { Link, useNavigate } from 'react-router-dom' // Importing Link from react-router-dom for routing
import { StoreContext } from '../../context/StoreContext'
const Navbar = ({setShowLogin} ) => {

  const [menu, setMenu] = useState("menu"); // State to manage the menu toggle
  
  const{getTotalCartAmount,token,setToken} = useContext(StoreContext); 
  
  const navigate = useNavigate();

const logout = () => {
  localStorage.removeItem("token");
  setToken("");
  navigate("/")
}
const handleClick = () => {
  if (!token) {
    setShowLogin(true);
  } else {
    navigate("/order");
  }
}

  return (
    <div className="navbar">
     <Link to='/' className='brand'><h1 className='brandName1'>Food<span className='brandName2'>Plaza</span></h1></Link>
      <ul className="navbar-menu">

        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a  href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="" /> </Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div> 

{!token?  <button onClick={()=>setShowLogin(true)}>sign in </button>:<div className='navbar-profile'>
<img src={assets.profile_icon} alt="" />
<ul className="nav-profile-dropdown">
<li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" /> 
<p
onClick={handleClick}
>Orders</p> 

</li>
<hr />
<li onClick={logout}><img src={assets.logout_icon} alt="" /> <p>Logout</p> </li>
</ul>
</div> }

       
      </div>
    </div>
  )
}

export default Navbar

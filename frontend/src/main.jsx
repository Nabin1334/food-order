import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
impo
// Importing necessary libraries and components


import StoreContextProvider from './context/StoreContext.jsx' // Importing the StoreContextProvider to manage global state
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StoreContextProvider>
       <App />
  </StoreContextProvider>
 
  </BrowserRouter>
)

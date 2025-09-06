"use client"

import { createContext, useEffect, useState } from "react"
import axios from "axios"

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({})
  const [token, setToken] = useState("")
  const [user, setUser] = useState(null)
  const [food_list, setFoodList] = useState([])

  const url = "http://localhost:4000"

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
    }
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
    }
  }

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } })
    }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item)
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item]
        }
      }
    }
    return totalAmount
  }

  const getCartCount = () => {
    let totalCount = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalCount += cartItems[item]
      }
    }
    return totalCount
  }

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list")
      setFoodList(response.data.data)
    } catch (error) {
      console.error("Error fetching food list:", error)
    }
  }

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } })
      setCartItems(response.data.cartData)
    } catch (error) {
      console.error("Error loading cart data:", error)
    }
  }

  useEffect(() => {
    async function loadData() {
      await fetchFoodList()
      const storedToken = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (storedToken) {
        setToken(storedToken)
        await loadCartData(storedToken)
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Error parsing stored user:", error)
          localStorage.removeItem("user")
        }
      }
    }
    loadData()
  }, [])

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getCartCount,
    url,
    token,
    setToken,
    user,
    setUser,
  }

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>
}

export default StoreContextProvider

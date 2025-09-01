"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "./List.css"

const List = ({ url }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sortBy: "name",
  })

  const fetchList = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filters.search) queryParams.append("search", filters.search)
      if (filters.category !== "All") queryParams.append("category", filters.category)
      queryParams.append("sortBy", filters.sortBy)

      const response = await axios.get(`${url}/api/food/list?${queryParams}`)
      if (response.data.success) {
        setList(response.data.data)
      } else {
        toast.error("Error fetching food items")
      }
    } catch (error) {
      toast.error("Error fetching food items")
    }
    setLoading(false)
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
    await fetchList()
    if (response.data.success) {
      toast.success(response.data.message)
    } else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchList()
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="list loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading food items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="list add flex-col">
      <div className="list-header">
        <h2>All Foods List</h2>

        <div className="list-filters">
          <input
            type="text"
            placeholder="Search food items..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />

          <select value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Salad">Salad</option>
            <option value="Rolls">Rolls</option>
            <option value="Deserts">Deserts</option>
            <option value="Sandwich">Sandwich</option>
            <option value="Cake">Cake</option>
            <option value="Pure Veg">Pure Veg</option>
            <option value="Pasta">Pasta</option>
            <option value="Noodles">Noodles</option>
          </select>

          <select value={filters.sortBy} onChange={(e) => handleFilterChange("sortBy", e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="category">Sort by Category</option>
            <option value="orderCount">Sort by Popularity</option>
          </select>
        </div>
      </div>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Orders</b>
          <b>Status</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <div className="item-details">
                <p className="item-name">{item.name}</p>
                <div className="item-badges">
                  {item.isVegetarian && <span className="badge veg">Veg</span>}
                  {item.isVegan && <span className="badge vegan">Vegan</span>}
                  <span className="badge spice">{item.spiceLevel}</span>
                </div>
              </div>
              <p>{item.category}</p>
              <p>Rs.{item.price}</p>
              <p>{item.orderCount || 0}</p>
              <p className={`status ${item.isAvailable ? "available" : "unavailable"}`}>
                {item.isAvailable ? "Available" : "Unavailable"}
              </p>
              <p onClick={() => removeFood(item._id)} className="cursor">
                <i className="fas fa-trash"></i>
              </p>
            </div>
          )
        })}
      </div>

      <div className="list-stats">
        <p>Total Items: {list.length}</p>
        <p>Categories: {new Set(list.map((item) => item.category)).size}</p>
      </div>
    </div>
  )
}

export default List

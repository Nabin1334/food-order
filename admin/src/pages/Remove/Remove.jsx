"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "./Remove.css"

const Remove = ({ url }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])

  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${url}/api/food/list`)
      console.log("Response from backend:", response)
      if (response.data.success) {
        setList(response.data.data)
      } else {
        toast.error(response.data.message || "Error fetching food items")
      }
    } catch (error) {
      console.error("Fetch error:", error)
      toast.error("Failed to fetch food items")
    }
    setLoading(false)
  }

  const removeFood = async (foodId, foodName) => {
    if (window.confirm(`Are you sure you want to remove "${foodName}"?`)) {
      try {
        // Use POST method with ID in request body (matching your backend)
        const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
        if (response.data.success) {
          toast.success(response.data.message || "Food item removed successfully")
          await fetchList() // Refresh the list
        } else {
          toast.error(response.data.message || "Error removing food item")
        }
      } catch (error) {
        console.error("Remove error:", error)
        toast.error("Failed to remove food item")
      }
    }
  }

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast.warning("Please select items to delete")
      return
    }

    if (window.confirm(`Are you sure you want to remove ${selectedItems.length} items?`)) {
      try {
        for (const itemId of selectedItems) {
          await axios.post(`${url}/api/food/remove`, { id: itemId })
        }
        toast.success(`${selectedItems.length} items removed successfully`)
        setSelectedItems([])
        await fetchList()
      } catch (error) {
        console.error("Bulk delete error:", error)
        toast.error("Error removing items")
      }
    }
  }

  useEffect(() => {
    if (!url) {
      toast.error("API URL is not set")
      return
    }
    fetchList()
  }, [url])

  if (loading) {
    return (
      <div className="remove loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading food items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="remove">
      <div className="remove-header">
        <h2>Remove Food Items</h2>
        <div className="remove-actions">
          {selectedItems.length > 0 && (
            <button className="bulk-delete-btn" onClick={handleBulkDelete}>
              <i className="fas fa-trash"></i>
              Delete Selected ({selectedItems.length})
            </button>
          )}
          <p>Click on items to select them for bulk deletion</p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="no-items">
          <i className="fas fa-utensils"></i>
          <h3>No food items found</h3>
          <p>Add some food items first to see them here</p>
        </div>
      ) : (
        <div className="remove-list">
          <div className="remove-list-header">
            <span>
              <input
                type="checkbox"
                checked={selectedItems.length === list.length && list.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems(list.map((item) => item._id))
                  } else {
                    setSelectedItems([])
                  }
                }}
              />
              Select All
            </span>
            <span>Image</span>
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span>Orders</span>
            <span>Action</span>
          </div>

          <div className="remove-items">
            {list.map((item, index) => (
              <div
                key={index}
                className={`remove-item ${selectedItems.includes(item._id) ? "selected" : ""}`}
                onClick={() => handleSelectItem(item._id)}
              >
                <div className="item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleSelectItem(item._id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="item-image">
                  <img
                    src={`${url}/images/${item.image}`}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=60&width=60&text=No+Image"
                    }}
                  />
                </div>

                <div className="item-name">
                  <h4>{item.name}</h4>
                  <p className="item-description">{item.description}</p>
                  <div className="item-badges">
                    {item.isVegetarian && <span className="badge veg">Veg</span>}
                    {item.isVegan && <span className="badge vegan">Vegan</span>}
                    <span className="badge spice">{item.spiceLevel}</span>
                  </div>
                </div>

                <div className="item-category">
                  <span className={`category-badge ${item.category.toLowerCase().replace(" ", "-")}`}>
                    {item.category}
                  </span>
                </div>

                <div className="item-price">
                  <span>Rs.{item.price}</span>
                </div>

                <div className="item-orders">
                  <span>{item.orderCount || 0} orders</span>
                </div>

                <div className="item-action">
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFood(item._id, item.name)
                    }}
                    title={`Remove ${item.name}`}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="remove-stats">
        <div className="stat-item">
          <i className="fas fa-utensils"></i>
          <span>Total Items: {list.length}</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-tags"></i>
          <span>Categories: {new Set(list.map((item) => item.category)).size}</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-check-square"></i>
          <span>Selected: {selectedItems.length}</span>
        </div>
      </div>
    </div>
  )
}

export default Remove

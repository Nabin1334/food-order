"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "./Remove.css"

const Remove = ({ url }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [error, setError] = useState(null)

  const fetchList = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Fetching from URL:", `${url}/api/food/list`)
      const response = await axios.get(`${url}/api/food/list`)
      console.log("Full response:", response)

      if (response.data && response.data.success) {
        setList(response.data.data || [])
        console.log("Food items loaded:", response.data.data?.length || 0)
      } else {
        const errorMsg = response.data?.message || "Failed to fetch food items"
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      console.error("Fetch error details:", error)
      const errorMsg = error.response?.data?.message || error.message || "Network error occurred"
      setError(errorMsg)
      toast.error(`Failed to fetch food items: ${errorMsg}`)
    }
    setLoading(false)
  }

  const removeFood = async (foodId, foodName) => {
    if (!foodId) {
      toast.error("Invalid food ID")
      return
    }

    if (window.confirm(`Are you sure you want to remove "${foodName}"?`)) {
      try {
        console.log("Removing food with ID:", foodId)
        console.log("Remove URL:", `${url}/api/food/remove`)

        const response = await axios.post(
          `${url}/api/food/remove`,
          {
            id: foodId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        )

        console.log("Remove response:", response)

        if (response.data && response.data.success) {
          toast.success(response.data.message || "Food item removed successfully")
          // Remove from local state immediately for better UX
          setList((prevList) => prevList.filter((item) => item._id !== foodId))
          // Also remove from selected items if it was selected
          setSelectedItems((prev) => prev.filter((id) => id !== foodId))
          // Refresh the list to ensure consistency
          await fetchList()
        } else {
          const errorMsg = response.data?.message || "Failed to remove food item"
          toast.error(errorMsg)
          console.error("Remove failed:", response.data)
        }
      } catch (error) {
        console.error("Remove error details:", error)
        const errorMsg = error.response?.data?.message || error.message || "Network error"
        toast.error(`Failed to remove food item: ${errorMsg}`)
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
        let successCount = 0
        let errorCount = 0

        for (const itemId of selectedItems) {
          try {
            const response = await axios.post(
              `${url}/api/food/remove`,
              {
                id: itemId,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              },
            )

            if (response.data && response.data.success) {
              successCount++
            } else {
              errorCount++
              console.error(`Failed to remove item ${itemId}:`, response.data)
            }
          } catch (error) {
            errorCount++
            console.error(`Error removing item ${itemId}:`, error)
          }
        }

        if (successCount > 0) {
          toast.success(`${successCount} items removed successfully`)
        }
        if (errorCount > 0) {
          toast.error(`${errorCount} items failed to remove`)
        }

        setSelectedItems([])
        await fetchList()
      } catch (error) {
        console.error("Bulk delete error:", error)
        toast.error("Error during bulk deletion")
      }
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(list.map((item) => item._id))
    } else {
      setSelectedItems([])
    }
  }

  useEffect(() => {
    if (!url) {
      setError("API URL is not configured")
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

  if (error && list.length === 0) {
    return (
      <div className="remove error">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={fetchList} className="retry-btn">
            <i className="fas fa-redo"></i>
            Retry
          </button>
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
          <button onClick={fetchList} className="refresh-btn">
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
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
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              Select All ({list.length})
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
                key={item._id || index}
                className={`remove-item ${selectedItems.includes(item._id) ? "selected" : ""}`}
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
                  {item.discount > 0 && <span className="discount">-{item.discount}%</span>}
                </div>

                <div className="item-orders">
                  <span>{item.orderCount || 0} orders</span>
                  <div className="rating">
                    <i className="fas fa-star"></i>
                    <span>{item.rating || 0}</span>
                  </div>
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

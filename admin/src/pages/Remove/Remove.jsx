import React, { useState, useEffect } from "react";
import "./Remove.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets"; // Make sure this includes a valid default image

const Remove = ({ url }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      toast.error("API URL is not set");
      setLoading(false);
      return;
    }
    fetchFoodItems();
    // eslint-disable-next-line
  }, [url]);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log("response from backend:",response)
      if (response.data.success) {
        setFoodItems(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch food items");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch food items");
    } finally {
      setLoading(false);
    }
  };
//function for removing the item
  const handleRemove = async (id) => {
    try {
    
      const response = await axios.delete(`${url}/api/food/remove/${id}`);
    
      if (response.data.success) {
        toast.success("Food item removed successfully");
        setFoodItems((prevItems) => prevItems.filter((item) => item._id !== id));
      } else {
        toast.error(response.data.message || "Failed to remove food item");
      }
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove food item");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }



  return (
    <div className="remove-container">
      <h2>Remove Food Items</h2>
      <div className="food-items-grid">
        {foodItems.length === 0 ? (
          <div className="empty-state">No food items found. 🍽️</div>
        ) : (
          foodItems.map((item) => (
            <div key={item._id || item.id} className="food-item-card">
              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `${url}/${item.image}`
                }
                alt={item.name}
                className="food-item-image"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = assets.defaultFoodImage;
                }}
              />
              <div className="food-item-details">
                <h3>{item.name}</h3>
                <p className="category">{item.category}</p>
                <p className="price">₹{item.price}</p>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item._id || item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Remove;

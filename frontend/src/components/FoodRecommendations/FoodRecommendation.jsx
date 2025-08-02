
import { useContext, useEffect, useState } from "react"
import { StoreContext } from "../../context/StoreContext"
import FoodItem from "../FoodItem/FoodItem"
import axios from "axios"
import "./FoodRecommendations.css"

const FoodRecommendations = () => {
  const { url, token, user } = useContext(StoreContext)
  const [recommendations, setRecommendations] = useState({
    personalized: [],
    trending: [],
    similar: [],
    seasonal: [],
    newItems: [],
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("personalized")
  const [userPreferences, setUserPreferences] = useState({
    favoriteCategories: [],
    dietaryRestrictions: [],
    spicePreference: "medium",
    priceRange: { min: 0, max: 1000 },
  })

  useEffect(() => {
    fetchRecommendations()
    if (token) {
      fetchUserPreferences()
    }
  }, [token])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const headers = token ? { token } : {}

      const [personalizedRes, trendingRes, seasonalRes, newItemsRes] = await Promise.all([
        token
          ? axios.get(`${url}/api/recommendations/personalized`, { headers })
          : Promise.resolve({ data: { success: false } }),
        axios.get(`${url}/api/recommendations/trending`),
        axios.get(`${url}/api/recommendations/seasonal`),
        axios.get(`${url}/api/recommendations/new-items`),
      ])

      setRecommendations({
        personalized: personalizedRes.data.success ? personalizedRes.data.data.recommendations : [],
        trending: trendingRes.data.success ? trendingRes.data.data : [],
        seasonal: seasonalRes.data.success ? seasonalRes.data.data : [],
        newItems: newItemsRes.data.success ? newItemsRes.data.data : [],
        similar: [],
      })
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    }
    setLoading(false)
  }

  const fetchUserPreferences = async () => {
    try {
      const response = await axios.get(`${url}/api/user/preferences`, {
        headers: { token },
      })
      if (response.data.success) {
        setUserPreferences(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error)
    }
  }

  const fetchSimilarItems = async (foodId) => {
    try {
      const response = await axios.get(`${url}/api/recommendations/similar/${foodId}`)
      if (response.data.success) {
        setRecommendations((prev) => ({
          ...prev,
          similar: response.data.data,
        }))
        setActiveTab("similar")
      }
    } catch (error) {
      console.error("Error fetching similar items:", error)
    }
  }

  const getRecommendationReason = (item, type) => {
    switch (type) {
      case "personalized":
        return "Based on your order history"
      case "trending":
        return "Popular this week"
      case "seasonal":
        return "Perfect for this season"
      case "newItems":
        return "New on our menu"
      case "similar":
        return "Similar to items you liked"
      default:
        return "Recommended for you"
    }
  }

  const tabs = [
    { id: "personalized", label: "For You", icon: "fas fa-heart", count: recommendations.personalized.length },
    { id: "trending", label: "Trending", icon: "fas fa-fire", count: recommendations.trending.length },
    { id: "seasonal", label: "Seasonal", icon: "fas fa-leaf", count: recommendations.seasonal.length },
    { id: "newItems", label: "New Items", icon: "fas fa-star", count: recommendations.newItems.length },
    { id: "similar", label: "Similar", icon: "fas fa-clone", count: recommendations.similar.length },
  ]

  if (loading) {
    return (
      <div className="recommendations loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Finding perfect recommendations for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="food-recommendations">
      <div className="recommendations-header">
        <div className="header-content">
          <h2>Smart Food Recommendations</h2>
          <p>Discover your next favorite meal with AI-powered suggestions</p>
        </div>

        {token && (
          <div className="preferences-quick-setup">
            <button className="preferences-btn">
              <i className="fas fa-cog"></i>
              Customize Preferences
            </button>
          </div>
        )}
      </div>

      <div className="recommendation-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.count === 0}
          >
            <i className={tab.icon}></i>
            <span>{tab.label}</span>
            {tab.count > 0 && <span className="count-badge">{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="recommendations-content">
        {recommendations[activeTab]?.length > 0 ? (
          <>
            <div className="section-info">
              <h3>
                {activeTab === "personalized" && "🎯 Personalized Just for You"}
                {activeTab === "trending" && "🔥 Trending This Week"}
                {activeTab === "seasonal" && "🍂 Seasonal Favorites"}
                {activeTab === "newItems" && "✨ Fresh Additions"}
                {activeTab === "similar" && "🔄 Similar Items"}
              </h3>
              <p>
                {activeTab === "personalized" && "Based on your taste preferences and order history"}
                {activeTab === "trending" && "Most popular items among our customers"}
                {activeTab === "seasonal" && "Perfect dishes for the current season"}
                {activeTab === "newItems" && "Latest additions to our menu"}
                {activeTab === "similar" && "Items similar to your recent choices"}
              </p>
            </div>

            <div className="recommendations-grid">
              {recommendations[activeTab].map((item, index) => (
                <div key={index} className="recommendation-item">
                  <div className="recommendation-badge">
                    <span className="reason">{getRecommendationReason(item, activeTab)}</span>
                    {item.matchScore && <span className="match-score">{Math.round(item.matchScore)}% match</span>}
                  </div>

                  <FoodItem
                    id={item._id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.image}
                    rating={item.rating}
                    preparationTime={item.preparationTime}
                    isVegetarian={item.isVegetarian}
                    isVegan={item.isVegan}
                    spiceLevel={item.spiceLevel}
                  />

                  <div className="recommendation-actions">
                    <button className="similar-btn" onClick={() => fetchSimilarItems(item._id)}>
                      <i className="fas fa-search"></i>
                      Find Similar
                    </button>

                    {item.discount && (
                      <div className="discount-badge">
                        <i className="fas fa-tag"></i>
                        {item.discount}% OFF
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-recommendations">
            <div className="no-rec-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>No recommendations available</h3>
            <p>
              {activeTab === "personalized" && !token && "Sign in to get personalized recommendations"}
              {activeTab === "personalized" && token && "Order more items to get better recommendations"}
              {activeTab !== "personalized" && "Check back later for new recommendations"}
            </p>
            {activeTab === "personalized" && !token && (
              <button className="sign-in-btn">
                <i className="fas fa-sign-in-alt"></i>
                Sign In for Personalized Recommendations
              </button>
            )}
          </div>
        )}
      </div>

      {token && userPreferences.favoriteCategories.length > 0 && (
        <div className="ai-insights">
          <h3>🤖 AI Insights About Your Taste</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">
                <i className="fas fa-heart"></i>
              </div>
              <div className="insight-content">
                <h4>Favorite Categories</h4>
                <div className="categories-list">
                  {userPreferences.favoriteCategories.map((cat, index) => (
                    <span key={index} className="category-tag">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">
                <i className="fas fa-pepper-hot"></i>
              </div>
              <div className="insight-content">
                <h4>Spice Preference</h4>
                <p>You prefer {userPreferences.spicePreference} spice level</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="insight-content">
                <h4>Price Range</h4>
                <p>
                  Rs.{userPreferences.priceRange.min} - Rs.{userPreferences.priceRange.max}
                </p>
              </div>
            </div>

            {userPreferences.dietaryRestrictions.length > 0 && (
              <div className="insight-card">
                <div className="insight-icon">
                  <i className="fas fa-leaf"></i>
                </div>
                <div className="insight-content">
                  <h4>Dietary Preferences</h4>
                  <div className="dietary-list">
                    {userPreferences.dietaryRestrictions.map((diet, index) => (
                      <span key={index} className="dietary-tag">
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {token && (
        <div className="recommendation-settings">
          <h3>⚙️ Recommendation Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>
                <input type="checkbox" defaultChecked />
                Include trending items
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input type="checkbox" defaultChecked />
                Show seasonal recommendations
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input type="checkbox" defaultChecked />
                Consider price preferences
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input type="checkbox" defaultChecked />
                Respect dietary restrictions
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodRecommendations

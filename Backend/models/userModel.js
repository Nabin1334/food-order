import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 👤 Basic Info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🔑 Role-based Access
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // ☎️ Contact Info
    phone: { type: String },
    address: { steet: String, zip: String, country: String, state: String, city: String }, 

    // 🛒 Cart (items stored before placing order)
    cartData: { type: Array, default: [] },

    // 🍔 Preferences for recommendations
    preferences: {
      dietary: [String],   // e.g. ["vegan", "gluten-free"]
      cuisine: [String],   // e.g. ["indian", "italian"]
      spiceLevel: String,  // "mild" | "medium" | "hot"
    },

    // 🧾 Order history (connects to Order model)
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],

    // ❤️ Favorite foods (connects to Food model)
    favoriteItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "food" }],

    // 📅 Activity tracking
    lastLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { minimize: false }
);

// Prevent model overwrite in dev (Next.js/Hot Reload)
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

import { error } from "console";
import foodModel from "../models/foodModel.js";
import mergeSort from "../utils/mergeShort.js";
import fs from "fs";
import path from "path";

//add food item

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food item added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to add food item" });
  }
};

//all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch food items" });
  }
};



const removeFood = async (req, res) => {
  try {
    console.log( "this is the id camefrom frontend:",req.params.foodId)
    const food = await foodModel.findById(req.params.foodId);
    if (!food) {
      return res.json({ success: false, message: "Food item not found" });
    }

    // Remove image from file system
    const imagePath = `uploads/${food.image}`;
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Image deletion error:", err.message);
        // Not failing the whole request just because image wasn't deleted
      }
    });
    

    // Delete food from DB
    await foodModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Food item removed successfully" });
  } catch (error) {
    console.error("Remove error:", error.message);
    res.json({ success: false, message: "Failed to remove food item" });
  }
};

//add algorithm to merge and sort food items
 const getSortedFoods = async (req, res) => {
  try {
    const key = req.query.sortBy || "price"; // Get sorting key from URL (default: price)

    const foodItems = await foodModel.find();
    const sortedFoods = mergeSort(foodItems, key); // Use merge sort

    res.json(200).json({ success: true, data: sortedFoods });
  } catch (err) {
    console.log("Error sorting foods:", error);
    res.status(500).json({ success: false, message: "Sorting failed" });
  }
};


export { addFood, listFood, removeFood ,getSortedFoods };
// export default { addFood, listFood };

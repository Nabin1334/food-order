import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://nabinduwadi12345:nabinduwadi12345@cluster0.93fqnla.mongodb.net/food-Order"
    )
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
};

//mongodb+srv://nabinduwadi12345:foodorder@food-order.wv3ibyd.mongodb.net/?retryWrites=true&w=majority&appName=food-order

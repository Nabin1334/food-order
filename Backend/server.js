import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import paymentRoute from "./routes/payment.js";
import mergeSort from './utils/mergeShort.js';
import dashboardRoute from './routes/dashboardRoute.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

//const dashboardRoutes = require('./routes/dashboardRoute');


app.use(cors());
app.use(express.json());



app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});




// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
connectDB();

// Routes
app.use('/api/food', foodRouter);
app.use('/api/order', orderRouter);
app.use('/api/users', userRouter);
app.use('/api/cart', cartRouter);
app.use('/images', express.static('uploads'));
app.use("/api", paymentRoute);
app.use('/api/food', mergeSort);
app.use('/api/dashboard', dashboardRoute);
app.get('/', (req, res) => {
  res.send('API running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





export default app;

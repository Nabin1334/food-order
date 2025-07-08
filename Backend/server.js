import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js'
import foodRouter from './routes/foodRoute.js';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';
//  import  'dotenv.config';
import cartRouter from './routes/cartRoute.js';
import mongoose from 'mongoose';
// import orderRouter from './routes/orderRoute.js';
// import { connectToDatabase } from './config/db.js';

// app.use(express.json());
// connectToDatabase();

dotenv.config();
//app config
const app = express()
const PORT =  process.env.PORT|| 4000;

//middleware 
app.use(express.json())
app.use(cors())

//db connection
connectDB();
//api endpoints

const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment');


app.use('/api/food', foodRouter)
app.use('/api/food', orderRouter);
app.use('/images', express.static('uploads'))
app.use('/api/users',userRouter)
app.use('/api/cart',cartRouter)
// app.use("/api/order",orderRouter)
//  import('./routes/foodRoute.js').then(module => module.default));
// Serve static files from the 'uploads' directory

app.get('/', (req, res) => {
    res.send('API  running')
})
app.use('/api/order', orderRoutes); // Ensure orderRoutes is imported correctly
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

// Export the app for testing or further configuration
export default app;
import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/add', authMiddleware ,addToCart)
cartRouter.post('/remove',authMiddleware , removeFromCart)
cartRouter.post('/get',authMiddleware , getCart)

// Payment route for initiating Esewa payment
// This route will handle the payment initiation process with Esewa
const express = require("express");
const router = express.Router();
const { initiateEsewaPayment } = require("../controllers/paymentController");

router.post("/initiate", initiateEsewaPayment);

module.exports = router;

export default cartRouter;
import express from 'express';
import authmiddleware from '../middleware/auth.js';
 import { placeOrder, verifyOrder,userOrders,listOrders ,updateStatus} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/place', authmiddleware, placeOrder);
orderRouter.post("verify", verifyOrder)
orderRouter.post("/userorders", authmiddleware, userOrders);
orderRouter.get('/list',listOrders); 

orderRouter.post("/status",updateStatus)


import {
  placeOrder,
  esewaSuccess,
  // ... other functions
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/place', placeOrder);
router.get('/esewa-success', esewaSuccess);
router.post('/place',PaymentSuccess);
router.post('/place',PaymentFailed);



export default orderRouter;
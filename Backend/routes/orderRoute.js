import { Router } from 'express';
import authmiddleware from '../middleware/auth.js';
 import { placeOrder, userOrder, listAllOrders, updateStatus, verifyToken, getUserOrders} 
 from '../controllers/orderController.js';

const router = Router();

router.post('/place', authmiddleware, placeOrder);
router.post("/userorders", authmiddleware, userOrder);
router.get('/list',listAllOrders); 

router.post("/status",updateStatus)

router.get('/user/:id', verifyToken, getUserOrders);




export default router;
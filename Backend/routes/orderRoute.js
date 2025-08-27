import { Router } from 'express';
import authmiddleware from '../middleware/auth.js';
 import { placeOrder, userOrder, listAllOrders, updateStatus,  } 
 from '../controllers/orderController.js';

const router = Router();

router.post('/place', authmiddleware, placeOrder);
router.post("/userorders", authmiddleware, userOrder);
router.get('/list',listAllOrders); 

router.post("/status",updateStatus)






export default router;
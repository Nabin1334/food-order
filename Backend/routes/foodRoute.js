import { Router } from 'express';
import multer from 'multer';
import { getSortedFoods } from "../controllers/foodController.js";
import mergeSort from '../utils/mergeShort.js';
import foodModel from '../models/foodModel.js';

import {
  addFood,
  listFood,
  removeFood,
} from '../controllers/foodController.js';

const router = Router();

// Image storage engine using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // ensure "uploads" folder  
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post('/add', upload.single('image'), addFood);
router.get('/list', listFood);
<<<<<<< HEAD
router.delete('/remove/:foodId', removeFood);
=======
router.post('/remove', removeFood);
// Route to get sorted food items
router.get("/sort", getSortedFoods);

>>>>>>> b159b0b6847e8d41eb608fb2f3f4e4ee73bea2e1

export default router;

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
router.post('/remove', removeFood);
// Route to get sorted food items
router.get("/sort", getSortedFoods);


export default router;

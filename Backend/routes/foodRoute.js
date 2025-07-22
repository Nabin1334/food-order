import { Router } from 'express';
import multer from 'multer';
import { getSortedFoods } from "../controllers/foodController.js";
import mergeSort from '../utils/mergeShort.js';
import foodModel from '../models/foodModel.js';
import userModel from '../models/userModel.js';


import {
   getAllFoods,
  addFood,
  getSortedFoods,
  listFood,
  updateFood,
  deleteFood,
  removeFood,
  someOtherHandler,
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

router.get('/all', getAllFood);
router.post('/add', addFood);
router.get('/sort', getSortedFoods);
router.put('/update/:id', updateFood);
router.delete('/delete/:id', removeFood);
 

// Routes
router.post('/add', upload.single('image'), addFood);
router.get('/list', listFood);

router.delete('/remove/:foodId', removeFood);

router.post('/remove', removeFood);
// Route to get sorted food items
router.get("/sort", getSortedFoods);
// or keep both if both are needed
router.get('/some-other-route', someOtherHandler);

>>>>>>> b159b0b6847e8d41eb608fb2f3f4e4ee73bea2e1

export default router;

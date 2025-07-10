import { Router } from 'express';
import multer from 'multer';
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

export default router;

import { Router } from 'express';
import multer from 'multer';
import mergeSort from '../utils/mergeShort.js';
import {
  addFood,
  listFood,
  removeFood,
  getSortedFoods
} from '../controllers/foodController.js';
import Dashboard from '../../admin/src/pages/Dashboard/Dashboard.jsx';

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
router.get('/dashboard', Dashboard);
router.post('/add', upload.single('image'), addFood);
router.get('/list', listFood);

router.delete('/remove/:foodId', removeFood);
// Route to get sorted food items
router.get("/sort", getSortedFoods);
// or keep both if both are needed
// router.get('/some-other-route', someOtherHandler);


export default router;

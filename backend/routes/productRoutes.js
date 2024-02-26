import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

// CHALLENGE -> '/top' route if below is giving me error in crousel: Invalid ObjectId of: top
router.route('/').get(getProducts).post(protect, admin, createProduct);

router.get('/top', getTopProducts); // for crousel

router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

// router.get('/top', getTopProducts);

export default router;

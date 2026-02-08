import express from 'express';
import {
    createTransaction,
    getTransactions,
    getFilteredTransactions,
    updateTransaction,
    deleteTransaction,
    getCategories
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/filter', getFilteredTransactions);
router.get('/categories', getCategories);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;

import express from 'express';
import {
    createAccount,
    getAccounts,
    getAccount,
    updateAccount,
    deleteAccount,
    transferMoney,
    getTransfers
} from '../controllers/accountController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/', createAccount);
router.get('/', getAccounts);
router.get('/transfers', getTransfers);
router.post('/transfer', transferMoney);
router.get('/:id', getAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

export default router;

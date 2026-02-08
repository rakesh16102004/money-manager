import express from 'express';
import {
    getSummary,
    getMonthlyData,
    getWeeklyData,
    getYearlyData,
    getCategoryData,
    getDivisionData,
    getRecentTransactions
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/summary', getSummary);
router.get('/monthly', getMonthlyData);
router.get('/weekly', getWeeklyData);
router.get('/yearly', getYearlyData);
router.get('/categories', getCategoryData);
router.get('/divisions', getDivisionData);
router.get('/recent', getRecentTransactions);

export default router;

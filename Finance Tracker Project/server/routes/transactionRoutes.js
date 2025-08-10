const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Specific routes (must come before parameterized routes)
router.get('/analytics', transactionController.getAnalytics);

// Root routes
router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);

// Parameterized routes (must come after specific routes)
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
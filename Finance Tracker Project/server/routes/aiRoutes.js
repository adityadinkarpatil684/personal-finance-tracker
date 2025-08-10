const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const aiController = require('../controllers/aiController');

router.use(authMiddleware);

router.get('/advice', aiController.getAdvice);

module.exports = router;


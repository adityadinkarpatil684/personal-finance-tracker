const express = require('express');
const router = express.Router();

// Simple test routes without controllers
router.get('/', (req, res) => {
  res.json({ message: 'Get transactions' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create transaction' });
});

router.get('/analytics', (req, res) => {
  res.json({ message: 'Get analytics' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update transaction', id: req.params.id });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete transaction', id: req.params.id });
});

module.exports = router; 
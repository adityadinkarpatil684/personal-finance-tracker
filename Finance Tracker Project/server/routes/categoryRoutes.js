const express = require('express');
const router = express.Router();
const categoryModel = require('../models/categoryModel');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json({ 
      success: true, 
      categories 
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get categories by type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid category type' 
      });
    }

    const categories = await categoryModel.getCategoriesByType(type);
    res.json({ 
      success: true, 
      categories 
    });
  } catch (error) {
    console.error('Get categories by type error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router; 
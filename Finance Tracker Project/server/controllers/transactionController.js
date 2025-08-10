const transactionModel = require('../models/transactionModel');
const categoryModel = require('../models/categoryModel');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.getTransactionsByUser(req.user.id);
    res.json({ 
      success: true, 
      transactions 
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { categoryId, amount, description, date } = req.body;

    // Validation
    if (!categoryId || !amount || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category, amount, and date are required' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be greater than 0' 
      });
    }

    // Verify category exists
    const category = await categoryModel.getCategoryById(categoryId);
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid category' 
      });
    }

    const transactionId = await transactionModel.createTransaction(
      req.user.id,
      categoryId,
      amount,
      description || '',
      date
    );

    res.status(201).json({ 
      success: true, 
      message: 'Transaction created successfully',
      transactionId 
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, amount, description, date } = req.body;

    // Validation
    if (!categoryId || !amount || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category, amount, and date are required' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be greater than 0' 
      });
    }

    // Verify category exists
    const category = await categoryModel.getCategoryById(categoryId);
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid category' 
      });
    }

    const success = await transactionModel.updateTransaction(
      id,
      req.user.id,
      categoryId,
      amount,
      description || '',
      date
    );

    if (!success) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Transaction updated successfully' 
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await transactionModel.deleteTransaction(id, req.user.id);

    if (!success) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Transaction deleted successfully' 
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentYear = year || new Date().getFullYear();
    const currentMonth = month || new Date().getMonth() + 1;

    const [monthlyAnalytics, categoryAnalytics] = await Promise.all([
      transactionModel.getMonthlyAnalytics(req.user.id, currentYear, currentMonth),
      transactionModel.getCategoryAnalytics(req.user.id)
    ]);

    res.json({ 
      success: true, 
      analytics: {
        monthly: monthlyAnalytics,
        categories: categoryAnalytics
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};
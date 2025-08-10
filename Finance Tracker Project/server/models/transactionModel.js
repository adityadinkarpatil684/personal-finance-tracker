const db = require('./db');

exports.getTransactionsByUser = async (userId) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id,
        t.amount,
        t.description,
        t.date,
        t.created_at,
        c.name as category_name,
        c.type as category_type,
        c.color as category_color
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
      ORDER BY t.date DESC, t.created_at DESC
    `, [userId]);
    return rows;
  } catch (error) {
    console.error('Error getting transactions by user:', error);
    throw error;
  }
};

exports.createTransaction = async (userId, categoryId, amount, description, date) => {
  try {
    const [result] = await db.query(
      'INSERT INTO transactions (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)',
      [userId, categoryId, amount, description, date]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

exports.updateTransaction = async (transactionId, userId, categoryId, amount, description, date) => {
  try {
    const [result] = await db.query(
      'UPDATE transactions SET category_id = ?, amount = ?, description = ?, date = ? WHERE id = ? AND user_id = ?',
      [categoryId, amount, description, date, transactionId, userId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

exports.deleteTransaction = async (transactionId, userId) => {
  try {
    const [result] = await db.query(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, userId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

exports.getMonthlyAnalytics = async (userId, year, month) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END) as total_income,
        SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE -t.amount END) as net_amount
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND YEAR(t.date) = ? AND MONTH(t.date) = ?
    `, [userId, year, month]);
    return rows[0];
  } catch (error) {
    console.error('Error getting monthly analytics:', error);
    throw error;
  }
};

exports.getCategoryAnalytics = async (userId) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.name as category_name,
        c.type as category_type,
        c.color as category_color,
        COUNT(*) as transaction_count,
        SUM(t.amount) as total_amount,
        AVG(t.amount) as avg_amount
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
      GROUP BY c.id, c.name, c.type, c.color
      ORDER BY c.type, total_amount DESC
    `, [userId]);
    return rows;
  } catch (error) {
    console.error('Error getting category analytics:', error);
    throw error;
  }
};
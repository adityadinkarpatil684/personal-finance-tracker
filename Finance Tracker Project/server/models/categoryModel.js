const db = require('./db');

exports.getAllCategories = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY type, name');
    return rows;
  } catch (error) {
    console.error('Error getting all categories:', error);
    throw error;
  }
};

exports.getCategoriesByType = async (type) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories WHERE type = ? ORDER BY name', [type]);
    return rows;
  } catch (error) {
    console.error('Error getting categories by type:', error);
    throw error;
  }
};

exports.getCategoryById = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Error getting category by id:', error);
    throw error;
  }
}; 
-- Personal Finance Tracker Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS finance_tracker;
USE finance_tracker;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    color VARCHAR(7) DEFAULT '#007bff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, date),
    INDEX idx_category (category_id)
);

-- Create savings_goals table
CREATE TABLE IF NOT EXISTS savings_goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) DEFAULT 0,
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default categories
INSERT INTO categories (name, type, color) VALUES
-- Income categories
('Salary', 'income', '#28a745'),
('Freelance', 'income', '#20c997'),
('Investment', 'income', '#17a2b8'),
('Business', 'income', '#6f42c1'),
('Other Income', 'income', '#fd7e14'),

-- Expense categories
('Food & Dining', 'expense', '#dc3545'),
('Transportation', 'expense', '#fd7e14'),
('Entertainment', 'expense', '#e83e8c'),
('Shopping', 'expense', '#6f42c1'),
('Bills & Utilities', 'expense', '#ffc107'),
('Healthcare', 'expense', '#6c757d'),
('Education', 'expense', '#20c997'),
('Travel', 'expense', '#17a2b8'),
('Housing', 'expense', '#28a745'),
('Other Expenses', 'expense', '#6c757d');

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_savings_goals_user ON savings_goals(user_id);

-- Create view for monthly analytics
CREATE VIEW monthly_analytics AS
SELECT 
    user_id,
    YEAR(date) as year,
    MONTH(date) as month,
    SUM(CASE WHEN c.type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN c.type = 'expense' THEN amount ELSE 0 END) as total_expenses,
    SUM(CASE WHEN c.type = 'income' THEN amount ELSE -amount END) as net_amount
FROM transactions t
JOIN categories c ON t.category_id = c.id
GROUP BY user_id, YEAR(date), MONTH(date)
ORDER BY user_id, year, month;

-- Create view for category analytics
CREATE VIEW category_analytics AS
SELECT 
    t.user_id,
    c.name as category_name,
    c.type as category_type,
    c.color as category_color,
    COUNT(*) as transaction_count,
    SUM(t.amount) as total_amount,
    AVG(t.amount) as avg_amount
FROM transactions t
JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, c.id, c.name, c.type, c.color
ORDER BY t.user_id, c.type, total_amount DESC; 
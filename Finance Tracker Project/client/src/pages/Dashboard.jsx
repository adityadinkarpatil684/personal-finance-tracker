import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm.jsx';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [transactionsRes, analyticsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/transactions/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setTransactions(transactionsRes.data.transactions);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleTransactionSubmit = () => {
    setShowForm(false);
    setEditingTransaction(null);
    fetchData();
  };

  const fetchAiAdvice = async () => {
    try {
      setAiLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/ai/advice', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiAdvice(res.data.advice);
    } catch (err) {
      console.error('AI advice error:', err);
      setError('Failed to load AI advice');
    } finally {
      setAiLoading(false);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        setError('Failed to delete transaction');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Chart data
  const barChartData = {
    labels: transactions.map(t => t.category_name),
    datasets: [{
      label: 'Amount',
      data: transactions.map(t => t.amount),
      backgroundColor: transactions.map(t => t.category_color),
      borderColor: transactions.map(t => t.category_color),
      borderWidth: 1
    }]
  };

  const pieChartData = {
    labels: analytics.categories?.map(c => c.category_name) || [],
    datasets: [{
      data: analytics.categories?.map(c => c.total_amount) || [],
      backgroundColor: analytics.categories?.map(c => c.category_color) || [],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your financial data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <h2>Please log in to access your dashboard</h2>
        <p>You need to be authenticated to view your financial data.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>💰 Personal Finance Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        <div className="analytics-summary">
          <div className="summary-card income">
            <h3>Total Income</h3>
            <p>{formatCurrency(analytics.monthly?.total_income || 0)}</p>
          </div>
          <div className="summary-card expense">
            <h3>Total Expenses</h3>
            <p>{formatCurrency(analytics.monthly?.total_expenses || 0)}</p>
          </div>
          <div className="summary-card net">
            <h3>Net Amount</h3>
            <p className={analytics.monthly?.net_amount >= 0 ? 'positive' : 'negative'}>
              {formatCurrency(analytics.monthly?.net_amount || 0)}
            </p>
          </div>
        </div>

        <div className="dashboard-actions">
          <button onClick={() => setShowForm(true)} className="add-transaction-button">
            + Add Transaction
          </button>
          <button
            onClick={fetchAiAdvice}
            className="ai-advice-button"
            disabled={aiLoading}
          >
            {aiLoading ? 'Analyzing...' : 'Get AI Advice'}
          </button>
          {aiAdvice && (
            <button
              onClick={() => setAiAdvice(null)}
              className="clear-advice-button"
            >
              Clear Advice
            </button>
          )}
        </div>

        {showForm && (
          <TransactionForm
            onSubmit={handleTransactionSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }}
            editingTransaction={editingTransaction}
          />
        )}

        <div className="charts-section">
          <div className="chart-container">
            <h3>Transaction Overview</h3>
            <Bar 
              data={barChartData} 
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
              }}
            />
          </div>

          <div className="chart-container">
            <h3>Category Distribution</h3>
            <Pie 
              data={pieChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
              }}
            />
          </div>
        </div>

        {aiAdvice && (() => {
          // Helper function to parse AI advice response
          const parseAiAdvice = (advice) => {
            // If it's already an object, return it
            if (typeof advice === 'object' && advice !== null) {
              return advice;
            }

            // If it's a string, try to parse it
            if (typeof advice === 'string') {
              let cleanedAdvice = advice.trim();

              // Remove markdown code blocks if present
              cleanedAdvice = cleanedAdvice.replace(/```json\s*/g, '').replace(/```\s*/g, '');

              // Try to parse as JSON
              try {
                const parsed = JSON.parse(cleanedAdvice);
                return parsed;
              } catch (e) {
                // If JSON parsing fails, try to extract JSON from the text
                const jsonMatch = cleanedAdvice.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  try {
                    return JSON.parse(jsonMatch[0]);
                  } catch (e2) {
                    // If that fails too, return a structured object with the raw text
                    return {
                      summary: cleanedAdvice,
                      tips: [],
                      riskCategories: []
                    };
                  }
                } else {
                  // No JSON found, return structured object with raw text
                  return {
                    summary: cleanedAdvice,
                    tips: [],
                    riskCategories: []
                  };
                }
              }
            }

            // Fallback for unexpected types
            return {
              summary: 'Unable to parse AI response',
              tips: [],
              riskCategories: []
            };
          };

          const adviceObj = parseAiAdvice(aiAdvice);

          return (
            <div className="ai-advice-card">
              <h3>🤖 AI Financial Advice</h3>

              {adviceObj.summary && (
                <div className="advice-section">
                  <h4>📊 Summary</h4>
                  <p className="advice-summary">{adviceObj.summary}</p>
                </div>
              )}

              {Array.isArray(adviceObj.tips) && adviceObj.tips.length > 0 && (
                <div className="advice-section">
                  <h4>💡 Personalized Tips</h4>
                  <ul className="advice-tips">
                    {adviceObj.tips.map((tip, idx) => (
                      <li key={idx} className="advice-tip">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(adviceObj.riskCategories) && adviceObj.riskCategories.length > 0 && (
                <div className="advice-section">
                  <h4>⚠️ Risk Categories</h4>
                  <div className="risk-categories">
                    {adviceObj.riskCategories.map((category, idx) => (
                      <span key={idx} className="risk-category-tag">{category}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        <div className="transactions-section">
          <h3>Recent Transactions</h3>
          <div className="transactions-list">
            {transactions.length === 0 ? (
              <p className="no-transactions">No transactions yet. Add your first transaction to get started!</p>
            ) : (
              transactions.map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-category">
                      <span 
                        className="category-color" 
                        style={{ backgroundColor: transaction.category_color }}
                      ></span>
                      {transaction.category_name}
                    </div>
                    <div className="transaction-details">
                      <p className="transaction-description">
                        {transaction.description || 'No description'}
                      </p>
                      <p className="transaction-date">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="transaction-amount">
                    <span className={transaction.category_type === 'income' ? 'income' : 'expense'}>
                      {transaction.category_type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <div className="transaction-actions">
                      <button onClick={() => handleEditTransaction(transaction)} className="edit-button">Edit</button>
                      <button onClick={() => handleDeleteTransaction(transaction.id)} className="delete-button">Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import './Dashboard.css';
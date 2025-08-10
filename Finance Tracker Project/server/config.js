require('dotenv').config();

module.exports = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'finance_tracker'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here'
  },
  server: {
    port: process.env.PORT || 5000
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || ''
  }
}; 
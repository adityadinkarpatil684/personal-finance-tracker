# 💰 Personal Finance Tracker

A modern, full-stack personal finance tracking application built with React, Node.js, Express, and MySQL. Track your income, expenses, and get detailed analytics with beautiful charts.

## ✨ Features

- 🤖 **AI Summary Advice** - Provide the user with major insights and advice
- 🔐 **User Authentication** - Secure login and registration system
- 💳 **Transaction Management** - Add, edit, and delete transactions
- 📊 **Analytics Dashboard** - Visual charts and financial insights
- 🎨 **Modern UI** - Beautiful, responsive design
- 📱 **Mobile Friendly** - Works perfectly on all devices
- 🔒 **Secure** - JWT authentication and password hashing
- 📈 **Real-time Charts** - Bar and pie charts using Chart.js

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **npm** 

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finance-tracker
```

### 2. Database Setup

1. **Clone the Repository**

git clone https://github.com/adityadinkarpatil684/personal-finance-tracker.git
cd personal-finance-tracker

2. **Create the database and tables** by running the SQL script:

```bash
# Login to MySQL and run:
mysql -u root -p
```

Then copy and paste the contents of `database_schema.sql` into your MySQL console.

### 3. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
# Create a .env file in the server directory with the following content:
```

Create a `.env` file in the `server` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=finance_tracker

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

#Gemini API key
GEMINI_API_KEY=your API key
```

```bash
# Start the server
npm start
```

The server will start on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will open on `http://localhost:5173`

## 📁 Project Structure

```
finance-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── database_schema.sql    # Database schema
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/analytics` - Get analytics data

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:type` - Get categories by type

### AI 
- `GET /api/ai/advice` - Generate the Finance Summary for the user

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Add Transactions**: Click "Add Transaction" to record income or expenses
3. **View Analytics**: See your financial overview with charts
4. **Manage Transactions**: Edit or delete transactions as needed

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

## 🎨 UI Features

- Responsive design for all devices
- Modern gradient backgrounds
- Smooth animations and transitions
- Color-coded categories
- Interactive charts
- Loading states and error handling

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check if MySQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change port in `.env` file
   - Kill process using the port

3. **CORS Errors**
   - Ensure frontend is running on `http://localhost:5173`
   - Check CORS configuration in server

### Getting Help

If you encounter any issues:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure database is properly configured
4. Check network connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Chart.js for beautiful data visualization
- React team for the amazing framework
- Express.js for the robust backend framework

---

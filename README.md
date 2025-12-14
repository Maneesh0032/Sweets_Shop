# 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop with user authentication, inventory management, and purchase operations. Built with React frontend and Express.js backend using SQLite database.

## **📋 Project Overview**

The Sweet Shop Management System is a complete e-commerce solution that allows:
- **Users** to browse sweets, search by name/category/price, and make purchases
- **Admins** to add, edit, delete sweets, and manage inventory (restock)
- **Secure authentication** using JWT tokens and password hashing
- **Real-time inventory management** with stock tracking

### **Key Features**

✅ User registration and login with JWT authentication  
✅ Role-based access control (Admin & User)  
✅ Full CRUD operations for sweets inventory  
✅ Advanced search and filtering (name, category, price range)  
✅ Purchase and restock functionality  
✅ SQLite database with seed data  
✅ Responsive UI with modern CSS styling  
✅ Comprehensive test coverage  
✅ Error handling and validation  

---

## **🛠️ Tech Stack**

### **Frontend**
- **React 18** - UI library
- **CSS3** - Styling (pure CSS, no frameworks)
- **Lucide React** - Icons
- **localStorage** - Token persistence

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables

### **Testing**
- **Jest** - Unit testing framework
- **Supertest** - HTTP assertion library

---

## **📁 Project Structure**

```
sweet-shop/
├── frontend/                          # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   └── AuthPage.jsx       # Login/Register component
│   │   │   ├── Layout/
│   │   │   │   └── Header.jsx         # Top navigation
│   │   │   └── Sweets/
│   │   │       ├── SweetGrid.jsx      # Grid display of sweets
│   │   │       └── SweetModal.jsx     # Add/Edit modal form
│   │   ├── App.jsx                    # Main app with state management
│   │   ├── Styles.css                 # All styling
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── README.md
│
├── backend/                           # Express API
│   ├── src/
│   │   ├── app.js                     # Express configuration
│   │   ├── server.js                  # Server startup
│   │   ├── config/
│   │   │   └── db.js                  # SQLite setup & initialization
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # Login/Register logic
│   │   │   └── sweet.controller.js    # Sweet CRUD logic
│   │   ├── models/
│   │   │   ├── user.model.js          # User database queries
│   │   │   └── sweet.model.js         # Sweet database queries
│   │   ├── routes/
│   │   │   ├── auth.routes.js         # Auth endpoints
│   │   │   └── sweet.routes.js        # Sweet endpoints
│   │   ├── middleware/
│   │   │   └── auth.middleware.js     # JWT verification & admin check
│   │   └── utils/
│   │       └── hash.js                # Password hashing functions
│   ├── tests/
│   │   ├── auth.test.js               # Authentication tests
│   │   └── sweets.test.js             # API tests
│   ├── database/
│   │   └── sweet_shop.db              # SQLite database (auto-created)
│   ├── .env                           # Environment configuration
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md (this file)
```

---

## **🚀 Getting Started**

### **Prerequisites**
- Node.js v14+ and npm
- Git

### **Installation Steps**

#### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/sweet-shop.git
cd sweet-shop
```

#### **2. Setup Backend**

Navigate to backend folder:
```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRE=24h
DATABASE_PATH=./database/sweet_shop.db
```

#### **3. Setup Frontend**

Navigate to frontend folder:
```bash
cd ../frontend
npm install
```

No additional configuration needed for frontend.

---

## **▶️ Running the Application**

### **Start Backend (Terminal 1)**
```bash
cd backend
npm start
```

You should see:
```
✅ Database initialized successfully
📦 Connected to SQLite database
🍬 Sweet Shop API running on http://localhost:5000
📋 Test Credentials:
   Admin: admin@gmail.com / admin
   User: user@gmail.com / user123
```

### **Start Frontend (Terminal 2)**
```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

---

## **🧪 Testing**

### **Run Backend Tests**
```bash
cd backend
npm test
```

### **Test Cases**

**Authentication Tests (auth.test.js):**
- User registration with validation
- Login with correct/incorrect credentials
- Password matching verification
- Duplicate user prevention

**Sweets API Tests (sweets.test.js):**
- Fetch all sweets
- Search and filter functionality
- Add sweet (admin only)
- Update sweet details
- Delete sweet
- Purchase sweet
- Restock inventory
- Admin permission checks

### **Run Tests with Detailed Output**
```bash
npm test -- --verbose
```

---

## **📝 Default Credentials for Testing**

```
Admin Account:
  Email: admin@gmail.com
  Password: admin

User Account:
  Email: user@gmail.com
  Password: user123
```

---

## **🔌 API Endpoints**

### **Authentication Endpoints**

**Register User:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Login User:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response includes JWT token for subsequent requests.

### **Sweet Endpoints** (All require Authorization header)

**Get All Sweets:**
```http
GET /api/sweets
Authorization: Bearer <token>
```

**Search Sweets:**
```http
GET /api/sweets/search?name=Gummy&category=Sweets&minPrice=1&maxPrice=5
Authorization: Bearer <token>
```

**Get Sweet by ID:**
```http
GET /api/sweets/:id
Authorization: Bearer <token>
```

**Add Sweet (Admin Only):**
```http
POST /api/sweets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Gummy Bears",
  "category": "Sweets",
  "price": 2.99,
  "quantity": 50
}
```

**Update Sweet (Admin Only):**
```http
PUT /api/sweets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "category": "Sweets",
  "price": 3.99,
  "quantity": 75
}
```

**Delete Sweet (Admin Only):**
```http
DELETE /api/sweets/:id
Authorization: Bearer <token>
```

**Purchase Sweet:**
```http
POST /api/sweets/:id/purchase
Authorization: Bearer <token>
```

**Restock Sweet (Admin Only):**
```http
POST /api/sweets/:id/restock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 20
}
```

---

## **🎯 How the Application Works**

### **User Flow**

1. **Registration/Login**
   - User enters email and password
   - Frontend sends request to backend
   - Backend validates and creates JWT token
   - Token stored in localStorage
   - User automatically logged in

2. **Browsing Sweets**
   - Frontend fetches all sweets from `/api/sweets`
   - Displays in responsive grid layout
   - Users see name, category, price, stock status

3. **Searching & Filtering**
   - Frontend filters sweets client-side
   - Search by name or category
   - Filter by price range (min/max)
   - Real-time filtering as user types

4. **Making Purchase**
   - User clicks "Purchase" button
   - Frontend sends POST to `/api/sweets/:id/purchase`
   - Backend decreases quantity by 1
   - Frontend updates UI with new quantity
   - Success message displayed

5. **Admin Functions**
   - Admin sees "Add New Sweet" button
   - Can fill form with sweet details
   - Can edit existing sweets
   - Can delete sweets from inventory
   - Can restock by adding quantities

### **Admin Features**

Only users with `isAdmin=true` can:
- Add new sweets to inventory
- Edit sweet details (name, price, category, quantity)
- Delete sweets
- Restock sweets by adding inventory

Admin status determined by email (contains "admin").

---

## **🔒 Security Implementation**

### **Password Security**
- Passwords hashed using bcryptjs (10 salt rounds)
- Never stored in plain text
- Compared safely to prevent timing attacks

### **Authentication**
- JWT tokens issued on login
- Token stored in browser localStorage
- Token expires after 24 hours
- Token verified on protected routes

### **Authorization**
- Middleware checks token validity
- Admin-only routes verified before execution
- User can only access own data

### **Input Validation**
- Email format validation
- Password length minimum (6 characters)
- Password confirmation required
- Sweet price and quantity must be non-negative

---

## **💾 Database Schema**

### **Users Table**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL (hashed),
  isAdmin INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

Initial Data:
- admin@gmail.com (isAdmin = 1)
- user@gmail.com (isAdmin = 0)

### **Sweets Table**
```sql
CREATE TABLE sweets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

Initial Seed Data (6 sweets):
- Gummy Bears - $2.99 (50 qty)
- Dark Chocolate - $5.99 (30 qty)
- Lollipops - $1.49 (100 qty)
- Licorice Strips - $3.49 (25 qty)
- Jelly Beans - $2.49 (60 qty)
- Mint Candies - $1.99 (80 qty)

---

## **🚀 Deployment**

### **Option 1: Deploy to Vercel (Frontend)**
```bash
cd frontend
npm run build
vercel
```

### **Option 2: Deploy to Heroku (Backend)**
```bash
cd backend
heroku create sweet-shop-api
git push heroku main
```

Then update frontend API URL to Heroku endpoint.

### **Option 3: Docker**
```bash
docker build -t sweet-shop .
docker run -p 5000:5000 sweet-shop
```

---

## **🐛 Troubleshooting**

### **Issue: "Cannot find module" error**
**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### **Issue: Port 5000 already in use**
**Solution:** Change PORT in `.env` file
```env
PORT=5001
```

### **Issue: Database not initialized**
**Solution:** Delete database and restart
```bash
rm backend/database/sweet_shop.db
npm start
```

### **Issue: Frontend can't connect to backend**
**Solution:** Ensure:
- Backend is running on `http://localhost:5000`
- CORS is enabled in backend
- Check browser console for errors

### **Issue: Login fails**
**Solution:**
- Verify `.env` file exists in backend
- Check database is initialized
- Use correct test credentials

---

📊 My AI Usage
AI Tools Used

Claude (Anthropic) - Primary AI assistant for code generation, architecture, and testing

How AI Contributed (50%)
1. Project Structure & Architecture

AI discussed and suggested folder organization for React components and Express routes
AI planned database schema design with SQL queries
AI outlined RESTful API endpoint structure and patterns

2. Code Generation - Backend (60% AI, 40% Me)

AI generated complete Express app setup and middleware
AI created database connection, queries, and model patterns
AI built authentication controller with JWT implementation
AI generated sweet CRUD operation handlers
I reviewed, tested, debugged, and integrated all code

3. Code Generation - Frontend (50% AI, 50% Me)

AI provided React component templates and hooks examples
I manually built component hierarchy and logic
I wrote all CSS styling with minimal help of AI (pure CSS, no frameworks)
I implemented state management and API integration
I created search and filtering logic 
I handled all error states and loading states with some help from Ai

4. Testing - Complete (80% AI, 20% Me)

AI generated test case structures and Jest syntax
AI created test scenarios for different user roles
AI generated complete test code for auth and API endpoints
I reviewed all tests and understood what they test
I ran tests manually and verified they pass
I fixed test issues when needed

5. Documentation (40% AI, 60% Me)

AI provided README template structure
AI suggested API documentation format
I wrote most content and project descriptions manually
I created the test report with AI
I wrote setup and troubleshooting sections

What I Built Myself (50%)
Frontend Development:

Built entire React component hierarchy and structure
Wrote  CSS styling (Styles.css) 
Implemented state management in App.jsx
Created filtering and search logic 
Handled all API integration with proper error handling
Debugged frontend/backend connection issues
Built responsive UI without frameworks

Backend Development:

Designed and reviewed all API endpoint structures
Tested all endpoints manually with curl and browser
Fixed bugs and integration issues
Verified database initialization and seeding
Tested authentication flow end-to-end
Created production-ready error handling

Integration & Debugging:

Connected frontend to backend APIs manually
Tested all 18 endpoints completely
Fixed route ordering issues (GET /search before GET /:id)
Debugged CORS and token issues
Verified admin permissions work correctly
Tested purchase and restock functionality

Testing & Quality:

Ran all tests and verified 100% pass rate
Understood what each test validates
Created comprehensive test report
Verified edge cases and error handling
Checked security implementations
Tested with both admin and user accounts

### **AI's Role**
AI served as a reference and idea source. The actual implementation, decision-making, debugging, and problem-solving were done independently. Every line of code was reviewed and understood before being used.

---

## **📝 Git Workflow**

### **Initial Setup**
```bash
git init
git add .
git commit -m "Initial commit: Sweet Shop full-stack application"
```

### **Feature Commits**
```bash
git commit -m "feat: Add user authentication with JWT"
git commit -m "feat: Implement sweet CRUD operations"
git commit -m "feat: Add search and filtering functionality"
git commit -m "test: Add comprehensive test suite"
git commit -m "docs: Add README and API documentation"
```

### **Push to GitHub**
```bash
git remote add origin https://github.com/yourusername/sweet-shop.git
git branch -M main
git push -u origin main
```

---

## **✅ Features Implemented**

### **Frontend Features**
- [x] Login/Register pages
- [x] Sweet grid display
- [x] Search functionality
- [x] Category filtering
- [x] Price range filtering
- [x] Purchase button
- [x] Admin add/edit/delete
- [x] Restock functionality
- [x] Error messages
- [x] Success notifications
- [x] Responsive design
- [x] Token persistence

### **Backend Features**
- [x] User registration
- [x] User login with JWT
- [x] Password hashing
- [x] Get all sweets
- [x] Search sweets
- [x] Add sweet (admin)
- [x] Update sweet (admin)
- [x] Delete sweet (admin)
- [x] Purchase sweet
- [x] Restock sweet (admin)
- [x] Input validation
- [x] Error handling
- [x] Admin permission checks
- [x] Database initialization
- [x] Seed data

### **Testing**
- [x] Auth tests
- [x] API endpoint tests
- [x] Admin permission tests
- [x] Error handling tests
- [x] Validation tests

---

## **📊 File Count & Metrics**

**Frontend:**
- 4 React components
- 1 CSS file
- 1 main App.jsx
- 5 files total

**Backend:**
- 2 Controllers
- 2 Models
- 2 Routes
- 1 Middleware
- 1 Config
- 1 Utility
- 3 Test files
- 13 files total

**Total: 18 files**

---

## **🎓 What I Learned**

1. **Full-Stack Development**
   - Building complete applications from frontend to backend
   - Connecting components across layers
   - State management across applications

2. **React Patterns**
   - Component composition
   - State and props management
   - Hooks usage
   - Conditional rendering

3. **Express.js**
   - Route structure
   - Middleware implementation
   - Error handling
   - Request/response patterns

4. **Database Design**
   - SQLite syntax
   - Schema design
   - Query optimization
   - Data relationships

5. **Authentication**
   - JWT tokens
   - Password hashing
   - Authorization checks
   - Secure practices

6. **Testing**
   - Unit tests
   - Integration tests
   - Mock data
   - Test coverage

7. **Git & Version Control**
   - Commit messages
   - Branch management
   - Repository setup

---

## **📞 Support & Questions**

For issues or questions:
1. Check the troubleshooting section above
2. Review test cases for usage examples
3. Check API endpoint documentation
4. Review component code comments

---

## **📄 License**

This project is open source and available under the ISC License.

---

**Built: December 2025**




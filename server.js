const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 1. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 2. CORS CONFIGURATION (MUST be before routes)
const corsOptions = {
  origin: "https:gravityhostel.vercel.app",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Explicit OPTIONS handler for all routes
// app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// 4. ROUTES (Updated to match your frontend /api prefix)
const studentRoutes = require('./routes/studentRoutes');
const visitorRoutes = require('./routes/visitorRoutes');

// Mount with /api prefix to match your frontend calls
app.use('/api/student', studentRoutes);
app.use('/visitor', visitorRoutes);

// Health Check
app.get('/', (req, res) => res.send('AI Service is Live'));

// 5. START SERVER
app.listen(PORT, () => {
  console.log(`🚀 AI Server listening on http:localhost:${PORT}`);
});
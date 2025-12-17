const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 1. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 2. CORS CONFIGURATION (MUST be before routes)
app.use(cors({
  origin: "https://gravityhostel.vercel.app", // Ensure no trailing slash
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// 4. ROUTES (Updated to match your frontend /api prefix)
const studentRoutes = require('./routes/studentRoutes');
const visitorRoutes = require('./routes/visitorRoutes');

// Mount with /api prefix to match your frontend calls
app.use('/api/student', studentRoutes);
app.use('/api/visitor', visitorRoutes);

// Health Check
app.get('/', (req, res) => res.send('AI Service is Live'));

// 5. START SERVER
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AI Server listening on 0.0.0.0:${PORT}`);
});
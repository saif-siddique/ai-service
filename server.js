const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const visitorRoutes = require('./routes/visitorRoutes');

// Mount Routes
// app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);
app.use('/visitor', visitorRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 AI Microservice running on http://localhost:${PORT}`);
});

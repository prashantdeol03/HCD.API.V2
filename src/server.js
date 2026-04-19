const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const leadRoutes = require("./routes/lead.routes");
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(express.json());

app.use("/api/leads", cors(), leadRoutes);

app.use(cors({
  origin: [
    'http://localhost:5000',
    'https://demo-blogs-1.onrender.com',
    'https://main-website-xsr0.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/upload', uploadRoutes);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

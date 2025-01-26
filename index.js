const express = require('express');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const petugasRoutes = require('./routes/petugasRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Mengizinkan permintaan dari frontend
  credentials: true, // Mengizinkan cookies (jika ada)
}));

app.use(express.json());
app.use(
  session({
    secret: '290607sfrlhd', // Kunci rahasia
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 1 bulan dalam milidetik
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
    },
  })
);

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/petugas', petugasRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

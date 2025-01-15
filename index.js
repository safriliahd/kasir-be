const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const petugasRoutes = require('./routes/petugasRoutes');

const app = express();

app.use(express.json());
app.use(
  session({
    secret: '290607sfrlhd',
    resave: false,
    saveUninitialized: true,
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

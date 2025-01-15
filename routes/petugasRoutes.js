const express = require('express');
const { isLoggedIn ,isAdminOrPetugas } = require('../middlewares/authMiddleware');
const pelangganController = require('../controllers/pelangganController');
const router = express.Router();

router.get('/', isAdminOrPetugas, (req, res) => {
  res.json({ message: 'Welcome to the Petugas page!' });
});

// Routes for Pelanggan
router.post('/createPelanggan', isLoggedIn, isAdminOrPetugas, pelangganController.createPelanggan); // Admin & Petugas
router.get('/allPelanggan', isLoggedIn, isAdminOrPetugas, pelangganController.getAllPelanggan); // Admin & Petugas

module.exports = router;

const express = require('express');
const router = express.Router();

const pelangganController = require('../controllers/pelangganController');
const { isLoggedIn, isAdmin, isAdminOrPetugas } = require('../middlewares/authMiddleware');

// Routes for Pelanggan
router.post('/create', isLoggedIn, isAdmin, pelangganController.createPelanggan); // Admin only
router.get('/', isLoggedIn, isAdminOrPetugas, pelangganController.getAllPelanggan); // Admin & Petugas
router.put('/update/:id', isLoggedIn, isAdmin, pelangganController.updatePelanggan); // Admin only
router.delete('/delete/:id', isLoggedIn, isAdmin, pelangganController.deletePelanggan); // Admin only

module.exports = router;

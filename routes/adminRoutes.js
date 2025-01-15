const express = require('express');
const authController = require('../controllers/authController');
const pelangganController = require('../controllers/pelangganController');
const { isAdmin, isLoggedIn, isAdminOrPetugas } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', isAdmin, (req, res) => {
  res.json({ message: 'Welcome to the Admin page!' });
});

//get all user
router.get('/users', isLoggedIn, isAdmin, authController.getAllUsers);


// Routes for Pelanggan
router.post('/createPelanggan', isLoggedIn, isAdminOrPetugas, pelangganController.createPelanggan); // Admin & Petugas
router.get('/allPelanggan', isLoggedIn, isAdminOrPetugas, pelangganController.getAllPelanggan); // Admin & Petugas
router.put('/updatePelanggan/:id', isLoggedIn, isAdmin, pelangganController.updatePelanggan); // Admin only
router.delete('/deletePelanggan/:id', isLoggedIn, isAdmin, pelangganController.deletePelanggan); // Admin only

module.exports = router;

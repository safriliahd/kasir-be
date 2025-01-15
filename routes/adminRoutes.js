const express = require('express');
const authController = require('../controllers/authController');
const pelangganController = require('../controllers/pelangganController');
const produkController = require('../controllers/produkController');
const orderController = require('../controllers/orderController');
const upload = require('../middlewares/uploadMiddleware');
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

// Routes for Produk
router.post('/createProduk', isLoggedIn, isAdminOrPetugas, upload.single('FotoProduk'), produkController.createProduk);
router.get('/allProduk', isLoggedIn, isAdminOrPetugas, produkController.getAllProduk);
router.put('/updateProduk/:id', isLoggedIn, isAdmin, upload.single('FotoProduk'), produkController.updateProduk);
router.delete('/deleteProduk/:id', isLoggedIn, isAdmin, produkController.deleteProduk);



// Order Routes
router.post('/createOrder', isLoggedIn, isAdminOrPetugas, orderController.createOrderWithPenjualan); // Create orders
// router.post('/finalizePenjualan', isLoggedIn, isAdminOrPetugas, orderController.finalizePenjualan); // Finalize penjualan
router.get('/allOrders', isLoggedIn, isAdminOrPetugas, orderController.getAllOrders); // Get all orders


module.exports = router;

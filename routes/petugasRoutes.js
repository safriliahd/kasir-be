const express = require('express');
const { isLoggedIn ,isAdminOrPetugas } = require('../middlewares/authMiddleware');
const pelangganController = require('../controllers/pelangganController');
const produkController = require('../controllers/produkController');
const orderController = require('../controllers/orderController');
const detailPenjualanController = require('../controllers/detailPenjualanController');
const penjualanController = require('../controllers/penjualanController');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.get('/', isAdminOrPetugas, (req, res) => {
  res.json({ message: 'Welcome to the Petugas page!' });
});

// Routes for Pelanggan
router.post('/createPelanggan', isLoggedIn, isAdminOrPetugas, pelangganController.createPelanggan); 
router.get('/allPelanggan', isLoggedIn, isAdminOrPetugas, pelangganController.getAllPelanggan); 
router.put('/updatePelanggan/:id', isLoggedIn, isAdminOrPetugas, pelangganController.updatePelanggan); 
router.delete('/deletePelanggan/:id', isLoggedIn, isAdminOrPetugas, pelangganController.deletePelanggan); 

// Routes for Produk
router.post('/createProduk', isLoggedIn, isAdminOrPetugas, upload.single('FotoProduk'), produkController.createProduk);
router.get('/allProduk', isLoggedIn, isAdminOrPetugas, produkController.getAllProduk);


// Order Routes
router.post('/createOrder', isLoggedIn, isAdminOrPetugas, orderController.createOrderWithPenjualan); 
router.get('/allOrders', isLoggedIn, isAdminOrPetugas, orderController.getAllOrders);

// Route to delete orders based on PenjualanID
router.delete('/deleteOrder/:penjualanID', isLoggedIn, isAdminOrPetugas, orderController.deleteOrderByPenjualanID); 

// Routes for Penjualan
router.get('/penjualan/:PenjualanID', isLoggedIn, isAdminOrPetugas, penjualanController.getPenjualanByPenjualanID);

//Get detail penjualan by penjualanID
router.get('/detailPenjualan/:PenjualanID', isLoggedIn, isAdminOrPetugas, detailPenjualanController.getDetailPenjualanByPenjualanID);


module.exports = router;

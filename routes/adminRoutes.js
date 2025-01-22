const express = require('express');
const authController = require('../controllers/authController');
const pelangganController = require('../controllers/pelangganController');
const produkController = require('../controllers/produkController');
const orderController = require('../controllers/orderController');
const  detailPenjualanController = require('../controllers/detailPenjualanController');
const upload = require('../middlewares/uploadMiddleware');
const { isAdmin, isLoggedIn, isAdminOrPetugas } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', isAdmin, (req, res) => {
  res.json({ message: 'Welcome to the Admin page!' });
});

//get all user
router.get('/users', isLoggedIn, isAdmin, authController.getAllUsers);


// Routes for Pelanggan
router.post('/createPelanggan', isLoggedIn, isAdminOrPetugas, pelangganController.createPelanggan);
router.get('/allPelanggan', isLoggedIn, isAdminOrPetugas, pelangganController.getAllPelanggan); 
router.put('/updatePelanggan/:id', isLoggedIn, isAdmin, pelangganController.updatePelanggan); 
router.delete('/deletePelanggan/:id', isLoggedIn, isAdmin, pelangganController.deletePelanggan); 

// Routes for Produk
router.post('/createProduk', isLoggedIn, isAdminOrPetugas, upload.single('FotoProduk'), produkController.createProduk);
router.get('/allProduk', isLoggedIn, isAdminOrPetugas, produkController.getAllProduk);
router.put('/updateProduk/:id', isLoggedIn, isAdmin, upload.single('FotoProduk'), produkController.updateProduk);
router.delete('/deleteProduk/:id', isLoggedIn, isAdmin, produkController.deleteProduk);



// Order Routes
router.post('/createOrder', isLoggedIn, isAdminOrPetugas, orderController.createOrderWithPenjualan); 
router.get('/allOrders', isLoggedIn, isAdminOrPetugas, orderController.getAllOrders);

// Route to delete orders based on PenjualanID
router.delete('/deleteOrder/:penjualanID', isLoggedIn, isAdminOrPetugas, orderController.deleteOrderByPenjualanID); 

//Get detail penjualan by penjualanID
router.get('/detailPenjualan/:PenjualanID', isLoggedIn, isAdminOrPetugas, detailPenjualanController.getDetailPenjualanByPenjualanID);



module.exports = router;

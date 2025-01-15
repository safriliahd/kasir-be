const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { isLoggedIn, isAdmin } = require('../middlewares/authMiddleware');

// Register route (for both admin and petugas)
router.post('/register', authController.register);

router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Dummy authentication for example purposes
    if (username === 'admin' && password === 'admin123') {
      req.session.userId = 1;
      req.session.role = 'ADMIN';
      return res.json({ message: 'Logged in as ADMIN', redirect: '/admin' });
    } else if (username === 'petugas' && password === 'petugas123') {
      req.session.userId = 2;
      req.session.role = 'PETUGAS';
      return res.json({ message: 'Logged in as PETUGAS', redirect: '/petugas' });
    }
  
    res.status(401).json({ error: 'Invalid credentials' });
  }); 


router.post('/logout', isLoggedIn, authController.logout); 
router.get('/users', isLoggedIn, isAdmin, authController.getAllUsers);


module.exports = router;

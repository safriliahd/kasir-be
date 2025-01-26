const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

module.exports = {
  // Register
  register: async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!['ADMIN', 'PETUGAS'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
      });
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Login
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Set session data
      req.session.userId = user.id;
      req.session.role = user.role;

      // Redirect based on role
      if (user.role === 'ADMIN') {
        return res.json({ message: 'Logged in as ADMIN', redirect: '/admin', role: user.role });
      } else if (user.role === 'PETUGAS') {
        return res.json({ message: 'Logged in as PETUGAS', redirect: '/petugas', role: user.role });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Logout
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Failed to log out' });
      res.json({ message: 'Logged out successfully' });
    });
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

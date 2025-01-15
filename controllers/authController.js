const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

module.exports = {
  register: async (req, res) => {
    const { name, email, password, role } = req.body;

    // Validate that role is either 'ADMIN' or 'PETUGAS'
    if (!role || (role !== 'ADMIN' && role !== 'PETUGAS')) {
      return res.status(400).json({ error: 'Invalid role. Only "ADMIN" or "PETUGAS" are allowed.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          role, // Use the role from the request body
          password: hashedPassword,
        },
      });
      res.status(201).json({ message: `${role} registered successfully`, user });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed', details: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      req.session.userId = user.id;
      req.session.role = user.role;
      res.json({ message: `${user.role} logged in successfully`, user });
    } catch (error) {
      res.status(500).json({ error: 'Login failed', details: error.message });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed', details: err.message });
      }
      res.json({ message: 'Logged out successfully' });
    });
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
  },
  
};


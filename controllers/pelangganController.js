const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  createPelanggan: async (req, res) => {
    const { NamaPelanggan, Alamat, NomorTelepon } = req.body;
    try {
      const pelanggan = await prisma.pelanggan.create({
        data: {
          NamaPelanggan,
          Alamat,
          NomorTelepon,
        },
      });
      res.status(201).json({ message: 'Pelanggan created successfully', pelanggan });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create pelanggan', details: error.message });
    }
  },

  getAllPelanggan: async (req, res) => {
    try {
      const pelanggan = await prisma.pelanggan.findMany();
      res.json({ pelanggan });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pelanggan', details: error.message });
    }
  },

  updatePelanggan: async (req, res) => {
    const { id } = req.params;
    const { NamaPelanggan, Alamat, NomorTelepon } = req.body;
    try {
      const pelanggan = await prisma.pelanggan.update({
        where: { PelangganID: parseInt(id) },
        data: {
          NamaPelanggan,
          Alamat,
          NomorTelepon,
        },
      });
      res.json({ message: 'Pelanggan updated successfully', pelanggan });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update pelanggan', details: error.message });
    }
  },

  deletePelanggan: async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.pelanggan.delete({
        where: { PelangganID: parseInt(id) },
      });
      res.json({ message: 'Pelanggan deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete pelanggan', details: error.message });
    }
  },
};

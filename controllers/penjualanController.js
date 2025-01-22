const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get Penjualan by PenjualanID
const getPenjualanByPenjualanID = async (req, res) => {
  try {
    const { PenjualanID } = req.params;

    const penjualan = await prisma.penjualan.findUnique({
      where: { PenjualanID: parseInt(PenjualanID) },
      include: {
        Pelanggan: true,
        detailPenjualan: {
          include: {
            produk: true,
          },
        },
        orders: {
          include: {
            produk: true,
            pelanggan: true,
          },
        },
      },
    });

    if (!penjualan) {
      return res.status(404).json({ message: 'Penjualan not found' });
    }

    res.status(200).json(penjualan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch Penjualan', error: error.message });
  }
};

// Get All Penjualan
const getAllPenjualan = async (req, res) => {
  try {
    const penjualanList = await prisma.penjualan.findMany({
      include: {
        Pelanggan: true,
        detailPenjualan: {
          include: {
            produk: true,
          },
        },
        orders: {
          include: {
            produk: true,
            pelanggan: true,
          },
        },
      },
    });

    res.status(200).json(penjualanList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch all Penjualan', error: error.message });
  }
};

module.exports = {
  getPenjualanByPenjualanID,
  getAllPenjualan,
};

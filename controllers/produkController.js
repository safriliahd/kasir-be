const { PrismaClient } = require('@prisma/client');
const cloudinary = require('../utils/cloudinary');

const prisma = new PrismaClient();

// Create Produk
exports.createProduk = async (req, res) => {
  try {
    const { NamaProduk, Harga, Stok } = req.body;

    // Upload foto ke Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    const newProduk = await prisma.produk.create({
      data: {
        NamaProduk,
        Harga: parseFloat(Harga),
        Stok: parseInt(Stok),
        FotoProduk: result.secure_url,
      },
    });

    res.status(201).json(newProduk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Produk
exports.getAllProduk = async (req, res) => {
  try {
    const produk = await prisma.produk.findMany();
    res.status(200).json(produk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Produk
exports.updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const { NamaProduk, Harga, Stok } = req.body;

    // Upload foto baru ke Cloudinary jika ada
    let updatedData = { NamaProduk, Harga: parseFloat(Harga), Stok: parseInt(Stok) };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedData.FotoProduk = result.secure_url;
    }

    const updatedProduk = await prisma.produk.update({
      where: { ProdukID: parseInt(id) },
      data: updatedData,
    });

    res.status(200).json(updatedProduk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Produk
exports.deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.produk.delete({ where: { ProdukID: parseInt(id) } });
    res.status(200).json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

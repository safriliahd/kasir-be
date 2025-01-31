const { PrismaClient } = require('@prisma/client');
const cloudinary = require('../utils/cloudinary');

const prisma = new PrismaClient();


exports.createProduk = async (req, res) => {
  try {
    // Log request untuk debugging
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { NamaProduk, Harga, Stok } = req.body;

    // Validasi keberadaan file
    if (!req.file) {
      return res.status(400).json({ error: 'FotoProduk is required' });
    }

    // Upload ke Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'produk', // Folder dalam akun Cloudinary Anda
    });

    // Simpan data ke database menggunakan Prisma
    const newProduk = await prisma.produk.create({
      data: {
        NamaProduk,
        Harga: parseFloat(Harga),
        Stok: parseInt(Stok),
        FotoProduk: result.secure_url, // URL gambar dari Cloudinary
      },
    });

    res.status(201).json(newProduk); // Respon sukses
  } catch (error) {
    console.error('Error creating produk:', error);
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

// Get Produk by ID
exports.getProdukById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find produk by ID
    const produk = await prisma.produk.findUnique({
      where: { ProdukID: parseInt(id) },
    });

    if (!produk) {
      return res.status(404).json({ error: 'Produk not found' });
    }

    res.status(200).json(produk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


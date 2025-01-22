const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create order & create a Penjualan with DetailPenjualan
const createOrderWithPenjualan = async (req, res) => {
  try {
    const { PelangganID, TanggalPenjualan, products } = req.body;

    if (!PelangganID || !TanggalPenjualan || !products || products.length === 0) {
      return res.status(400).json({ message: 'PelangganID, TanggalPenjualan, dan products wajib diisi!' });
    }

    // Create a new Penjualan
    const penjualan = await prisma.penjualan.create({
      data: {
        PelangganID,
        TanggalPenjualan: new Date(TanggalPenjualan),
        TotalHarga: 0, 
      },
    });

    // Create order and DetailPenjualan records
    const createdOrders = await prisma.order.createMany({
      data: products.map(product => ({
        PenjualanID: penjualan.PenjualanID,
        ProdukID: product.ProdukID,
        PelangganID, 
        JumlahProduk: product.JumlahProduk,
        Subtotal: product.JumlahProduk * product.Harga, 
      })),
    });

    const createdDetailPenjualan = await prisma.detailPenjualan.createMany({
      data: products.map(product => ({
        PenjualanID: penjualan.PenjualanID,
        ProdukID: product.ProdukID,
        JumlahProduk: product.JumlahProduk,
        Subtotal: product.JumlahProduk * product.Harga, 
      })),
    });

    // Calculate total price
    const totalHarga = products.reduce((total, product) => total + product.JumlahProduk * product.Harga, 0);

    await prisma.penjualan.update({
      where: { PenjualanID: penjualan.PenjualanID },
      data: { TotalHarga: totalHarga },
    });

    // Update the stock for each product
    for (const product of products) {
      const existingProduct = await prisma.produk.findUnique({
        where: { ProdukID: product.ProdukID },
      });

      if (existingProduct && existingProduct.Stok >= product.JumlahProduk) {
        // Update product stock
        await prisma.produk.update({
          where: { ProdukID: product.ProdukID },
          data: { Stok: existingProduct.Stok - product.JumlahProduk },
        });
      } else {
        return res.status(400).json({ message: `Stok produk ${product.ProdukID} tidak mencukupi.` });
      }
    }

    res.status(201).json({
      message: 'Order and Penjualan created successfully',
      penjualan,
      createdOrdersCount: createdOrders.count,
      createdDetailPenjualanCount: createdDetailPenjualan.count, 
      totalHarga,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order and penjualan', error: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        produk: true, 
        penjualan: true,
        pelanggan: true, 
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};


// Delete Order PenjualanI 
const deleteOrderByPenjualanID = async (req, res) => {
  try {
    const { penjualanID } = req.params;

    // Fetch all orders related to the PenjualanID, this will give the related products
    const orders = await prisma.order.findMany({
      where: {
        PenjualanID: parseInt(penjualanID),
      },
      include: {
        produk: true, // Get product data
      },
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this PenjualanID' });
    }

    // Fetch related DetailPenjualan records, using PenjualanID
    const detailPenjualan = await prisma.detailPenjualan.findMany({
      where: {
        PenjualanID: parseInt(penjualanID),
      },
    });

    // Restore stock for each product in the order
    for (const order of orders) {
      for (const orderDetail of detailPenjualan) {
        const product = await prisma.produk.findUnique({
          where: { ProdukID: orderDetail.ProdukID },
        });

        if (product) {
          // Increase the stock back by the ordered quantity
          await prisma.produk.update({
            where: { ProdukID: orderDetail.ProdukID },
            data: { Stok: product.Stok + orderDetail.JumlahProduk },
          });
        }
      }
    }

    // Delete related DetailPenjualan records
    await prisma.detailPenjualan.deleteMany({
      where: { PenjualanID: parseInt(penjualanID) },
    });

    // Delete all orders for the given PenjualanID
    await prisma.order.deleteMany({
      where: { PenjualanID: parseInt(penjualanID) },
    });

    // If the Penjualan has no other orders, delete the Penjualan as well
    const remainingOrders = await prisma.order.findMany({
      where: { PenjualanID: parseInt(penjualanID) },
    });

    if (remainingOrders.length === 0) {
      await prisma.penjualan.delete({
        where: { PenjualanID: parseInt(penjualanID) },
      });
    }

    res.status(200).json({ message: 'All orders and related data for PenjualanID deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete orders for PenjualanID', error: error.message });
  }
};


module.exports = {
  createOrderWithPenjualan,
  getAllOrders,
  deleteOrderByPenjualanID,
};

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create an order and automatically create a Penjualan
const createOrderWithPenjualan = async (req, res) => {
  try {
    const { PelangganID, TanggalPenjualan, products } = req.body; 
    // `products` is an array of objects { ProdukID, JumlahProduk, Harga }

    // Step 1: Create a new Penjualan
    const penjualan = await prisma.penjualan.create({
      data: {
        PelangganID,
        TanggalPenjualan: new Date(TanggalPenjualan),
        TotalHarga: 0, // Will be updated later
      },
    });

    // Step 2: Create orders linked to the PenjualanID
    const createdOrders = await prisma.order.createMany({
      data: products.map(product => ({
        PenjualanID: penjualan.PenjualanID, // Link to the newly created Penjualan
        ProdukID: product.ProdukID,
        JumlahProduk: product.JumlahProduk,
        Subtotal: product.JumlahProduk * product.Harga, // Calculate Subtotal
      })),
    });

    // Step 3: Calculate the total price for the Penjualan
    const totalHarga = products.reduce((total, product) => total + product.JumlahProduk * product.Harga, 0);

    // Step 4: Update the TotalHarga in Penjualan
    await prisma.penjualan.update({
      where: { PenjualanID: penjualan.PenjualanID },
      data: { TotalHarga: totalHarga },
    });

    res.status(201).json({
      message: 'Order and Penjualan created successfully',
      penjualan,
      createdOrdersCount: createdOrders.count, // Number of orders created
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
        produk: true, // Include related Produk data
        penjualan: true, // Include related Penjualan data
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

module.exports = {
  createOrderWithPenjualan,
  getAllOrders,
};

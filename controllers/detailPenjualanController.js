const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDetailPenjualanByPenjualanID = async (req, res) => {
  try {
    const { PenjualanID } = req.params;

    if (!PenjualanID) {
      return res.status(400).json({ message: 'PenjualanID wajib diisi!' });
    }

    const parsedPenjualanID = parseInt(PenjualanID, 10);

    if (isNaN(parsedPenjualanID)) {
      return res.status(400).json({ message: 'PenjualanID harus berupa angka yang valid!' });
    }

    // Check if the Penjualan exists
    const penjualan = await prisma.penjualan.findUnique({
      where: { PenjualanID: parsedPenjualanID },
      include: { Pelanggan: true }, // Ganti 'pelanggan' menjadi 'Pelanggan'
    });

    if (!penjualan) {
      return res.status(404).json({ message: 'Penjualan tidak ditemukan!' });
    }

    // Retrieve details from Order table related to the PenjualanID
    const orders = await prisma.order.findMany({
      where: { PenjualanID: parsedPenjualanID },
      include: { produk: true }, // Include product details
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Tidak ada detail penjualan untuk PenjualanID ini!' });
    }

    const detailPenjualan = orders.map(order => ({
      DetailID: order.OrderID,
      PenjualanID: order.PenjualanID,
      ProdukID: order.ProdukID,
      JumlahProduk: order.JumlahProduk,
      Subtotal: order.Subtotal,
      produk: {
        ProdukID: order.produk.ProdukID,
        NamaProduk: order.produk.NamaProduk,
        Harga: order.produk.Harga,
        FotoProduk: order.produk.FotoProduk,
      },
    }));

    res.status(200).json({
      PenjualanID: penjualan.PenjualanID,
      TanggalPenjualan: penjualan.TanggalPenjualan,
      Pelanggan: penjualan.Pelanggan,
      TotalHarga: penjualan.TotalHarga,
      detailPenjualan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mendapatkan detail penjualan', error: error.message });
  }
};



module.exports = {
  getDetailPenjualanByPenjualanID,
};

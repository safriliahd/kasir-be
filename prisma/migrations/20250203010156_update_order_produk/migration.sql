/*
  Warnings:

  - Made the column `PelangganID` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `PenjualanID` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "OrderID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "PenjualanID" INTEGER NOT NULL,
    "ProdukID" INTEGER NOT NULL,
    "PelangganID" INTEGER NOT NULL,
    "JumlahProduk" INTEGER NOT NULL,
    "Subtotal" DECIMAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_PenjualanID_fkey" FOREIGN KEY ("PenjualanID") REFERENCES "Penjualan" ("PenjualanID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_ProdukID_fkey" FOREIGN KEY ("ProdukID") REFERENCES "Produk" ("ProdukID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_PelangganID_fkey" FOREIGN KEY ("PelangganID") REFERENCES "Pelanggan" ("PelangganID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("JumlahProduk", "OrderID", "PelangganID", "PenjualanID", "ProdukID", "Subtotal", "createdAt") SELECT "JumlahProduk", "OrderID", "PelangganID", "PenjualanID", "ProdukID", "Subtotal", "createdAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

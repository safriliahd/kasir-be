/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Pelanggan" (
    "PelangganID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "NamaPelanggan" TEXT NOT NULL,
    "Alamat" TEXT,
    "NomorTelepon" TEXT
);

-- CreateTable
CREATE TABLE "Penjualan" (
    "PenjualanID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "TanggalPenjualan" DATETIME NOT NULL,
    "TotalHarga" DECIMAL NOT NULL DEFAULT 0.0,
    "PelangganID" INTEGER NOT NULL,
    CONSTRAINT "Penjualan_PelangganID_fkey" FOREIGN KEY ("PelangganID") REFERENCES "Pelanggan" ("PelangganID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DetailPenjualan" (
    "DetailID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "PenjualanID" INTEGER NOT NULL,
    "ProdukID" INTEGER NOT NULL,
    "JumlahProduk" INTEGER NOT NULL,
    "Subtotal" DECIMAL NOT NULL DEFAULT 0.0,
    CONSTRAINT "DetailPenjualan_PenjualanID_fkey" FOREIGN KEY ("PenjualanID") REFERENCES "Penjualan" ("PenjualanID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetailPenjualan_ProdukID_fkey" FOREIGN KEY ("ProdukID") REFERENCES "Produk" ("ProdukID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Produk" (
    "ProdukID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "NamaProduk" TEXT NOT NULL,
    "Harga" DECIMAL NOT NULL DEFAULT 0.0,
    "Stok" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name") SELECT "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

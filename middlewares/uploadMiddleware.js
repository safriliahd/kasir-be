const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Pastikan direktori 'uploads' ada, jika tidak buat direktori tersebut
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('Direktori uploads telah dibuat:', uploadPath);
}

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Direktori untuk menyimpan file
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Penamaan file
  },
});

const upload = multer({ storage });

module.exports = upload;

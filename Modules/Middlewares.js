const multer = require('multer')

// Configure Multer for Image/file uploads
// enctype="multipart/form-data"
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'ProductsFiles'); // Directory where uploaded files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    },
});

// const PDFStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'ProductCatalogue'); // Directory where uploaded files will be stored
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Unique file name
//     },
// });

exports.Upload = multer({
    storage: Storage
});

// exports.UploadPDF = multer({
//     storage: PDFStorage,
//     limits: { files: 1 }, 
// });
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images'); // Destination dossier images
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // Créé un nouveau nom
        const extension = MIME_TYPES[file.mimetype]; // Ajoute une extension
        callback(null, name + Date.now() + '.' + extension); // renvoi le nom avec la date et l'extension
    }
});

module.exports = multer({storage: storage}).single('image'); //export fichier unique
const multer = require('multer');
const path = require('path');



let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});


let upload = multer({
    storage: storage
});


module.exports = upload;

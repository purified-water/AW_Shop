const express = require('express');
const router = express.Router();
const cateController = require('../controllers/cate.c.js');
const multer = require('multer')
const path = require('path')
const {isAuthenticated} = require('../middlewares/auth.middleware.js')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log(req);
        cb(null,'./mainSystem/public/images2')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null,  file.originalname)
    }
})
const upload = multer({storage: storage})
router.use(isAuthenticated);

// router.get('/',cateController.getAllCates);
router.get('/',cateController.loadCates);
router.post('/add', upload.single('image'), cateController.addCate);
router.post('/edit', upload.single('image'), cateController.editCate);
router.get('/delete/:product_type',cateController.deleteCate);

module.exports = router;
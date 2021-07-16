const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/', auth, sauceController.findSauce);

router.get('/:id', auth, sauceController.findOneSauce);

router.post('/', auth, multer, sauceController.createSauce);

router.put('/:id', auth, multer, sauceController.updateSauce);

router.delete('/:id', auth, sauceController.deleteSauce);

router.post('/:id/like', auth, sauceController.likeSauce);

module.exports = router;
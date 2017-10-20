const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/books.controllers');

router.get('/', ctrl.getAllBooks);
router.get('/:bookId', ctrl.getOneBook);
router.post('/', ctrl.createBook);
router.put('/:bookId', ctrl.replaceOneBook);
router.patch('/:bookId', ctrl.updateOneBook);
router.patch('/', ctrl.updateAllBooks);
router.delete('/:bookId', ctrl.deleteOneBook);
router.delete('/', ctrl.burnLibraryToTheGround);

module.exports = router;
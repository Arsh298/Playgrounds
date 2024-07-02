const express = require('express');
const router = express.Router({mergeParams:true});
const multer  = require('multer');

const catchAsync = require('../utils/CatchAsync');
const {isLogged, isAuthor, validateGround} = require('../middleware');
const playground = require('../controllers/playground');

const {storage} = require('../cloudinary');
const upload = multer({storage});

router.use((req,res,next) => {
    const {sport} = req.params;
    res.locals.sport = sport;
    next();
})

router.route('/')
    .get(catchAsync(playground.index))
    .post(isLogged, upload.array('images'), validateGround, catchAsync(playground.createGround))

router.get('/new', isLogged, playground.newForm);

router.route('/:id')
    .get(catchAsync(playground.viewGround))
    .delete(isLogged, isAuthor, catchAsync(playground.deleteGround))
    .put(isLogged, isAuthor, upload.array('images'), validateGround, catchAsync(playground.updateGround));

router.get('/:id/edit', isLogged, isAuthor, catchAsync(playground.editForm));

module.exports = router;
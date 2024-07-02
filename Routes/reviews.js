const express = require('express');
const router = express.Router({mergeParams:true});
const reviews = require('../controllers/reviews')

const catchAsync = require('../utils/CatchAsync');
const {isLogged, validateReview, isreviewAuthor} = require('../middleware');

router.get('/', (req,res) => {
    console.log(req.params);
    res.send("OK");
});

router.post('/', isLogged, validateReview, catchAsync(reviews.createReview));

router.route('/:r_id')
    .delete(isLogged, isreviewAuthor, catchAsync(reviews.deleteReview))
    .put(isLogged, isreviewAuthor, catchAsync(reviews.editReview))

module.exports = router;
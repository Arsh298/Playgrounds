const {Football, Basketball, Tennis} = require('../models/playground');
const Review = require('../models/review');

module.exports.createReview = async (req,res) => {
    const {id, sport} = req.params;
    let ground;
    if(sport == "football") {
        ground = await Football.findById(id);
    } else if(sport === "basketball") {
        ground = await Basketball.findById(id);
    }
    const review = new Review(req.body.review);
    review.author = req.user._id;
    ground.reviews.push(review);
    await review.save();
    await ground.save();
    req.flash('success', "Successfully added new review")
    res.redirect(`/${sport}/${id}`);
};

module.exports.deleteReview = async (req,res) => {
    const {id, r_id, sport} = req.params;
    if(sport == "football") {
        await Football.findByIdAndUpdate(id, { $pull : {reviews:r_id}});
    } else if(sport === "basketball") {
        await Basketball.findByIdAndUpdate(id, { $pull : {reviews:r_id}});
    }
    await Review.findByIdAndDelete(r_id);
    req.flash('success', "Successfully deleted a review")
    res.redirect(`/${sport}/${id}`);
};

module.exports.editReview = async (req,res) => {
    const {id, r_id, sport} = req.params;
    await Review.findByIdAndUpdate(r_id, req.body.review);
    req.flash('success', "Successfully edited review")
    res.redirect(`/${sport}/${id}`);
};
const {Football, Basketball} = require('./models/playground');
const Review = require('./models/review');

const ExpressError = require('./utils/ExpressError');
const {validationSchema, reviewSchema} = require('./schema');
const catchAsync = require('./utils/CatchAsync');

module.exports.isLogged = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.return = req.originalUrl;
        req.flash('error', 'You need to login');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturn = (req,res,next) => {
    res.locals.return = req.session.return;
    next();
}

module.exports.isAuthor = catchAsync(async(req,res,next) => {
    const {id, sport} = req.params;
    let ground;
    if(sport === "football") {
        ground  = await Football.findById(id);
    } else if(sport === "basketball") {
        ground = await Basketball.findById(id)
    }
    if(!ground) {
        req.flash('error', "Cannon find that playground");
        return res.redirect(`/${sport}`);
    }
    if(!ground.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to make changes to this playground");
        return res.redirect(`/${sport}/${id}`);
    }
    next();
})

module.exports.validateGround = (req,res,next) => {
    const {error} = validationSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}

module.exports.isreviewAuthor = catchAsync(async(req,res,next) => {
    const {sport,id,r_id} = req.params;
    const rev = await Review.findById(r_id);
    if(!rev) {
        req.flash('error', "Cannon find that review");
        return res.redirect(`/${sport}`);
    }
    if(!rev.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to delete this campground");
        return res.redirect(`/${sport}/${id}`);
    }
    next();
})

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}

const {Football, Basketball} = require('../models/playground');
const {cloudinary} = require('../cloudinary');

module.exports.index = async(req,res,next) => {
    const {sport} = req.params;
    let allGrounds
    if(sport == "football") {
        allGrounds = await Football.find({}).populate('author');
    } else if(sport === "basketball") {
        allGrounds = await Basketball.find({}).populate('author');
    } else {
        req.flash('error', 'cannot find that sport');
        return res.redirect('/');
    }
    res.render('playground/Index', {allGrounds});
};

module.exports.newForm = (req,res) => {
    res.render('playground/New');
};

module.exports.createGround = async (req,res,next) => {
    const {sport} = req.params;
    let newGround;
    if(sport === "football") {
        newGround = new Football(req.body.data);
    } else if(sport === "basketball") {
        newGround = new Basketball(req.body.data);
    } else {
        req.flash('error', "Cannon edit that playground");
        return res.redirect(`/${sport}`);
    }
    newGround.author = req.user._id;
    newGround.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    await newGround.save();
    req.flash('success', "Successfully added new playground")
    res.redirect(`/${sport}/${newGround._id}`);
};

module.exports.viewGround = async (req,res) => {
    const {id, sport} = req.params;
    const {edit} = req.query;
    let ground;
    if(sport === "football") {
        ground = await Football.findById(id).populate({
            path : 'reviews',
            populate : {
                path : 'author'
            }
        }).populate('author');
    } else if(sport === "basketball") {
        ground = await Basketball.findById(id).populate({
            path : 'reviews',
            populate : {
                path : 'author'
            }
        }).populate('author');
    }
    if(!ground) {
        req.flash('error', "Can not find that playground");
        return res.redirect(`/${sport}`);
    }
    res.render('playground/Show', {ground, edit});
};

module.exports.editForm = async (req,res)=>{
    const {id, sport} = req.params;
    let ground;
    if(sport === "football") {
        ground = await Football.findById(id)
    } else if(sport === "basketball") {
        ground = await Basketball.findById(id)
    } else {
        req.flash('error', "Cannon edit that playground");
        return res.redirect(`/${sport}`);
    }
    res.render('playground/Edit', {ground});
};

module.exports.deleteGround = async (req,res)=>{
    const {id, sport} = req.params;
    let ground;
    if(sport === "football") {
        ground = await Football.findByIdAndDelete(id);
    } else if(sport === "basketball") {
        ground = await Basketball.findByIdAndDelete(id);
    } else {
        req.flash('error', "Can not delete that playground");
        return res.redirect(`/${sport}`);
    }
    for(let image of ground.images) {
        if(image.filename !== "SeedImage") {
            await cloudinary.uploader.destroy(image.filename);
        }
    }
    req.flash('success', "Successfully deleted playground");
    res.redirect(`/${sport}`);
};

module.exports.updateGround = async (req,res)=>{
    const {id, sport} = req.params;
    let ground;
    if(sport === "football") {
        ground = await Football.findByIdAndUpdate(id, {...req.body.data});
    } else if(sport === "basketball") {
        ground = await Basketball.findByIdAndUpdate(id, {...req.body.data});
    } else {
        req.flash('error', "Couldn't find that playground");
        return res.redirect(`/${sport}`);
    }
    const newImgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    ground.images.push(...newImgs);
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            if(filename !== "SeedImage") {
                await cloudinary.uploader.destroy(filename);
            }
        }
        await ground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    await ground.save();
    req.flash('success', "Successfully edited playground");
    res.redirect(`/${sport}/${id}`);
};
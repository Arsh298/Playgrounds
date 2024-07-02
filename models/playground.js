const mongoose = require("mongoose");
const Review = require("./review")
const Schema = mongoose.Schema;

const mySchema = new Schema({
    title : String,
    images : [
        {
            url: String,
            filename: String
        }
    ],
    price : Number,
    description : String,
    location : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    contact : Number,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
});

mySchema.post('findOneAndDelete', async function(camp) {
    if(camp) {
        await Review.deleteMany({
            _id : { $in : camp.reviews }
        })
    }
});

const Football =  mongoose.model('Football', mySchema);
const Basketball =  mongoose.model('Basketball', mySchema);

module.exports = {Football,Basketball};
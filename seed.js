if(process.env.NODE_env !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const {Football, Basketball} = require('./models/playground');
const axios = require('axios');

const DBurl = process.env.URL || 'mongodb://localhost:27017/Project';
mongoose.connect(DBurl)
    .then(() => {
        console.log("Connection Open!!");
    })
    .catch((err) => {
        console.log(err);
    })

const rand = (array) => array[Math.floor(Math.random() * array.length)];

async function seedImg(collectionID) {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'IYURpm91-URIZYA581j6OrgETke-Bl9RGxy79c1MRsI',
                collections: collectionID,
            },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}

const users = ['668474f85f322bf4fe7875c3' ,'668475095f322bf4fe7875c6', '668475235f322bf4fe7875c9' ];
const contacts = [987456301, 8452136874, 9407842651, 7548750149,845962314, 7541256328, 8461543249, 7412653894, 8846315981];
const places = ["Mandi, Himachal Pradesh", "Kurukshetra, Haryana", "Lucknow, Uttar Pradesh", "Mumbai, Maharashtra", "Delhi, India", "Mirzapur, Uttar Pradesh", "Chandigarh, India", "Shimla, Himachal Pradesh",];
const titles = ["Wembley Stadium", "Old Trafford", "Anfield", "Villa Park", "Pride Park", "Falmer Stadium", "Ball Arena", "Chase Center", "Spectrum Center"];

const seedGround = async function(Sport, collectionID) {
    for (let i = 0; i < 15; i++) {
        const price = Math.floor(Math.random() * 100) + 300;
        const url = await seedImg(collectionID);
        img = [{url, filename:"SeedImage"}];
        const f = new Sport({
            title: `${rand(titles)}`,
            location: `${rand(places)}`,
            price: price,
            description : "Gibberish refers to speech or writing that is nonsensical, incoherent, or devoid of any recognizable meaning. It often consists of random syllables, words, or sounds strung together in a way that does not form logical or understandable sentences. Gibberish can be intentionally produced for humorous effect, as a form of playful communication, or as a method of avoiding detection or understanding by others.",
            author : rand(users),
            images : img,
            contact : rand(contacts)
        })
        await f.save();
    }
}

const seedDB = async function() {
    await Football.deleteMany({});
    await Basketball.deleteMany({});

    await seedGround(Football, 9920102);
    await seedGround(Basketball, 6861443);
}

seedDB()
    .then(() => {
        mongoose.connection.close();
        console.log("Connection Closed!!");
    })

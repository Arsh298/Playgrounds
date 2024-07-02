const mongoose = require('mongoose');
const {Football, Basketball} = require('../models/playground');
const axios = require('axios');

mongoose.connect('mongodb://127.0.0.1:27017/Project')
    .then(() => {
        console.log("Connection Opened!!");
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

const users = ['667712339e5c1381b6b9e050' ,'6677123d9e5c1381b6b9e058', '667712479e5c1381b6b9e060' ];
const contacts = [987456321, 8452136874, 9457842651, 7548752149,845962314, 7541256328];
const places = ["Mandi, HP", "Kurukshetra, Haryana", "Lucknow, UP", "Mumbai, Maharashtra", "Delhi, India", "Mirzapur, UP"];
const titles = ["Wembley Stadium", "Old Trafford", "Anfield", "Villa Park", "Pride Park", "Falmer Stadium"]

const seedGround = async function(Sport, collectionID) {
    for (let i = 0; i < 15; i++) {
        const price = Math.floor(Math.random() * 100) + 300;
        const url = await seedImg(collectionID);
        img = [{url, filename:"SeedImage"}];
        const f = new Sport({
            title: `${rand(titles)}`,
            location: `${rand(places)}`,
            price: price,
            description : "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos voluptas, veritatis tenetur libero nesciunt suscipit placeat odio numquam harum blanditiis repellendus. Molestias molestiae rem, debitis ratione nesciunt suscipit vel. Omnis.",
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

const mongoose = require('mongoose'); 
const cities = require('./cities'); 
const { places, descriptors } = require('./seedHelpers') 
const Campground = require('../models/campground'); 

//Connect Mongoose
mongoose.connect('mongodb://localhost:27017/yelpcampDemo', {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
});

//logic to see if the db is connected
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected!");
}); 

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({}); // removing data from db
  // await c.save(); checking if the db is working
  for (let i = 0; i < 30; i++){ //300
    const random1000 = Math.floor(Math.random() * 1000); // random 1000 cities
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "617fe473913c11ecc5c9ef5f",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)}, ${sample(places)}`,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A commodi maiores, earum nulla fuga tempora voluptatum, molestias quidem delectus voluptate temporibus nemo, quis officia ipsum. Dolorem ipsa cum corporis pariatur!',
      price,
      geometry: {
        type: 'Point',
        coordinates:[
          cities[random1000].longitude,
          cities[random1000].latitude,
        ]
      },
      images:[
        {
          url: 'https://res.cloudinary.com/arianemoki/image/upload/v1636037426/YelpCamp/noxa762mgyv2ixtg1vh2.jpg',
          filename: 'YelpCamp/noxa762mgyv2ixtg1vh2'
        }
      ]
    })
    await camp.save();
  } 
}; 

//closing the db
seedDB().then(() => {
  mongoose.connection.close()
});
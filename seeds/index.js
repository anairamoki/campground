const mongoose = require('mongoose'); 
const cities = require('./cities'); 
const { places, descriptors } = require('./seedHelpers') 
const Campground = require('../models/campground'); 

//Connect Mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
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
  for (let i = 0; i < 50; i++){
    const random1000 = Math.floor(Math.random() * 1000); // random 1000 cities
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "617ade0fd4c36e5164f0c952",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)}, ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251', //63rd
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A commodi maiores, earum nulla fuga tempora voluptatum, molestias quidem delectus voluptate temporibus nemo, quis officia ipsum. Dolorem ipsa cum corporis pariatur!',
      price
    })
    await camp.save();
  }
    
}; 
//closing the db
seedDB().then(() => {
  mongoose.connection.close()
});

const mongoose = require('mongoose');// 16th step
const Review = require('./reviews')// 17th step is a shortcut for referencing Schema
const Schema = mongoose.Schema;

//Creating Schema 18th step.
const CampgroundSchema = new Schema({
  title: String,
  image: String, //62nd
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'

    }
  ]
}); 

// to delete all the review in the DB when the specific campground is deleted by the client
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
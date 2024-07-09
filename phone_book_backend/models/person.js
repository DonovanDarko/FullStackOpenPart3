const mongoose = require('mongoose')
require('dotenv').config()

const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const url = process.env.MONGODB_URL_part1 + password + process.env.MONGODB_URL_part2

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
  
personSchema.set('toJSON', {
transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
}
})
  
module.exports = mongoose.model('Person', personSchema)
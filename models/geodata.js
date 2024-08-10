import mongoose from 'mongoose';

const geodataSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  averageRating: Number,
  noOfRatings: Number
});

// Create a 2dsphere index on the location field (make sure this index exists in your collection)
geodataSchema.index({ location: '2dsphere' });

// Specify the name of your existing collection here
const GeoData = mongoose.model('GeoData', geodataSchema, 'mongogeodata');
export default GeoData;

import GeoData from '../models/geodata.js';

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export const radiusrange = async (req, res) => {
  const { latitude, longitude, minimumDistance, maximumDistance } = req.query;

  // Parse the query parameters as floating-point numbers
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const minDistance = parseFloat(minimumDistance);
  const maxDistance = parseFloat(maximumDistance);

  // Validate inputs
  if (isNaN(lat) || isNaN(lon) || isNaN(minDistance) || isNaN(maxDistance)) {
    return res.status(400).json({ error: "Invalid input. Latitude, longitude, minDistance, and maxDistance must be numbers." });
  }

  console.log(`Range : Latitude: ${lat}, Longitude: ${lon}, MinDistance: ${minDistance}, MaxDistance: ${maxDistance}`);

  try {
    // Using MongoDB's $geoNear 
    const restaurants = await GeoData.find(
{
    location:{
        $near: {
         $geometry: {
            type: "Point",
            coordinates: [lon, lat] // Use [longitude, latitude]
          },
          $maxDistance:maxDistance,
          $minDistance: minDistance // Minimum distance in meters
         
        }
      }
}
    );



    // Prepare the response
    const response = restaurants.map(restaurant => ({
      "Name of restaurant": restaurant.name,
      "Description of restaurant": restaurant.description || "No description available",
      "Location": {
        "Restaurant": {
          latitude: restaurant.location.coordinates[1],
          longitude: restaurant.location.coordinates[0]
        }
      },
      "Average Rating of the restaurant": getRandomNumber(1,5),
      "No. of Ratings": getRandomNumber(1,10000),
      "Distance (in meters)": restaurant.distance
    }));

    // Send the array to the frontend
    res.json(response);
  
    console.log(`Query Results Lenght: ${response.length}`);
  } catch (err) {
    res.status(500).json({ error: err.message + " This is range type error" });
  }
};



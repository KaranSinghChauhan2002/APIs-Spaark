import GeoData from '../models/geodata.js';


function getRandomNumber(min, max) {
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



export const specificPointController = async (req, res) => {
  const { latitude, longitude, radius } = req.query;

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const rad = parseFloat(radius);

  if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
    return res.status(400).json({ error: "Invalid input. Latitude, longitude, and radius must be numbers." });
  }

  try {
    const restaurants = await GeoData.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [lon, lat], // Correct order: [longitude, latitude]
            rad / 6378100 // Convert radius to radians
          ]
        }
      }
    });

    const response = restaurants.map(restaurant => ({
      "Name of restaurant": restaurant.name,
      "Description of restaurant": restaurant.description || "No description available",
      "Location": {
        "Restaurant": {
          latitude: restaurant.location.coordinates[1],
          longitude: restaurant.location.coordinates[0]
        }
      },
      "Average Rating of the restaurant": getRandomNumber(1,5) ,
      "No. of Ratings": getRandomNumber(1,10000) 
    }));

    res.json(response);
    console.log(`Lenghth : ${response.length} ` );
    console.log(lat,lon,rad)
  } catch (err) {
    res.status(500).json({ error: err.message + " This is specific point error" });
  }
};

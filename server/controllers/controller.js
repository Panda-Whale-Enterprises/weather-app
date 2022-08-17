const axios = require('axios');
const { Location } = require('../model.js')
require('dotenv').config();

const controller = {};

controller.getData = (req, res, next) => {
  if (!req.body.city) {
    return next({
      log: 'Error in controller.getData - no city name.',
      message: 'Query for location unsuccessful, check server log for details.'
    })
  }
  const cityName = req.body.city;
  Location.findOne({ cityName })
    .then(response => {
      if (!response) {
        res.locals.cityName = cityName;
        return next();
      }
      return res.status(200).send(response);
    })
    .catch(err => 
      next({
        log: `Error in controller.getData: ${err}`,
        message: 'Query for location unsuccessful, check server log for details.'
      })
    );
}

controller.getCoordinates = (req, res, next) => {
  const cityName = req.body.city;
  res.locals.cityName = cityName;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cityName}&key=${process.env.GOOGLEAPIKEY}`;
    // Get coordinates from city name
  axios.get(url)
    .then(response => {
      const coordinates = { lat: response.data.results[0].geometry.location.lat, lon: response.data.results[0].geometry.location.lng } // returns { lat: 51.5, lon: -0.127 }
      res.locals.coordinates = coordinates;
      return next();
    })
    .catch(err => 
      next({
        log: `Error in controller.getCoordinates: ${err}`,
        message: 'Query for coordinates unsuccessful, check server log for details.'
      })
    );
};

controller.getStations = (req, res, next) => {
  if(!res.locals.coordinates){
    return next({
      log: 'Error in controller.getStations - no coordinates.',
      message: 'Query for stations unsuccessful, check server log for details.'
    })
  }
  const options = {
    method: 'GET',
    url: 'https://meteostat.p.rapidapi.com/stations/nearby',
    params: res.locals.coordinates, 
    headers: {
      'X-RapidAPI-Key': `${process.env.METEOSTATKEY}`,
      'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
    }
  };

  axios.request(options)
  .then(response => {
    res.locals.stationID = response.data.data[0].id; 
    return next();
  })
  .catch(err => {
    next({
      log: `Error in controller.getStations: ${err}`,
      message: 'Query for stations unsuccessful, check server log for details.'
    })
  })
}

controller.getMonthlyData = (req, res, next) => {
  if (!res.locals.stationID){
    return next({
      log: 'Error in controller.getMonthlyData - no stationID.',
      message: 'Query for monthly weather data unsuccessful, check server log for details.'
    });
  }
  const options = {
    method: 'GET',
    url: 'https://meteostat.p.rapidapi.com/stations/monthly',
    params: { 
      station: res.locals.stationID, 
      start: '2020-01-01', 
      end: '2020-12-31', 
      units: 'imperial' 
    },
    headers: {
      'X-RapidAPI-Key': '486cee67b7msh6fe5f060a910d1ap176ef4jsncf8e8f8d110e',
      'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
    }
  }
  axios.request(options)
    .then(response => {
      res.locals.cityData = response.data.data;
      return next();
    })
    .catch(err => 
      next({
        log: `Error in controller.getMonthlyData: ${err}`,
        message: 'Query for monthly weather data unsuccessful, check server log for details.'
      })  
    );
  };

controller.saveData = (req, res, next) => {
  if (!res.locals.cityData){
    return next({
      log: 'Error in controller.saveData - no city data to save.',
      message: 'Saving city data to database failed, check server log for details.'
    });
  }
  const newLocation = new Location({
    cityName: res.locals.cityName,
    cityData: res.locals.cityData
  });

  newLocation.save()
  .then(response => {
    return next()
  })
  .catch(err => 
    next({
      log: `Error in controller.saveData: ${err}`,
      message: 'Saving city data to database failed, check server log for details.'
    })
  )
}

module.exports = controller;

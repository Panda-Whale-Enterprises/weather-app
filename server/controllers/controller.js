const axios = require('axios');
const { Location } = require('../model.js')

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
  if (!res.locals.cityName) {
    return next({
      log: 'Error in controller.getCoordinates - no city name.',
      message: 'Query for coordinates unsuccessful, check server log for details.'
    });
  }
  const cityName = res.locals.cityName;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cityName}&key=AIzaSyAehZ2pCL7V8b3cAfN3iBwZWEgfWWFIlJI`;
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
      'X-RapidAPI-Key': 'ca2594298amsh94fb12fd4497783p1553c7jsn3ff6ba05d679',
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
      'X-RapidAPI-Key': 'aae7167eabmsha14de507765a006p19b50bjsn4c06e379b10e',
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

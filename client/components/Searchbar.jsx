//client/components/Searchbar.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardContainer from './CardContainer.jsx';
import { LineChart } from 'recharts';

const Searchbar = props => {
  
  const [cityData, setCityData] = useState([]);
  const [cityName, setCityName] = useState('');
  const [locationIsLoading, setLocationIsLoading] = useState(true);
  const [error, setError] = useState('');

  // function to handle async GET requests to DB
  const useAsyncData = (city) => {
    axios({
      method: 'POST',
      url: 'http://localhost:3000/search',
      data: { city }
    })
      .then(data => {
        if (data.data.cityData.length === 0) {
          setError(`Weather data not found for ${data.data.cityName}, please enter a different location.`);
          setLocationIsLoading(false);
          props.setLocationToLoad(false);
          return;
        }
        setCityData(data.data.cityData);
        setCityName(data.data.cityName);
        setLocationIsLoading(false);
      })
      .catch(err => {
        console.log('Error in post request for location data:', err);
        setError('City not found, please enter a different location.');
        setLocationIsLoading(false);
        props.setLocationToLoad(false);
      })
  }


  //like componentDidMount triggers on change
  useEffect(() => {
    if (props.locationToLoad) {
      const loadData = async () => {
        await useAsyncData(props.localInfo.currentLocation);
      }
      loadData();
    } else {
      setLocationIsLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    //prevents the page from refreshing on submit
    e.preventDefault();
    if (!locationIsLoading) {
      setError('');
      setLocationIsLoading(true);
      props.setLocationToLoad(true);
      const inputCity = e.target.firstChild.value;
      const loadData = async () => {
        await useAsyncData(inputCity);
      }
      loadData();
    }
  }

  return (
    <div className="searchbar-div">
      <form className="searchbar" onSubmit={handleSubmit}>
        <input className="search-input" name="search-input" id="search-input" type="text" placeholder="London" required></input>
        <input className="search-btn" type="submit" value="Search"></input>
      </form>
      {
        !locationIsLoading && props.locationToLoad ? 
        <CardContainer city={cityName} data={cityData} /> : 
        <div><h3>Enter city name above...</h3></div>
      }
      {
        error ?
        <div><h3>{error}</h3></div> :
        null
      }
    </div>
  )
}


export default Searchbar;
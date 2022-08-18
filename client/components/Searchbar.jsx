//client/components/Searchbar.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardContainer from './CardContainer.jsx';
import { LineChart } from 'recharts';


const Searchbar = props => {

  //[current, updateMethod] = usesState('default') 
  
  const [cityData, setCityData] = useState([]) // cityData = []
 
  const [cityName, setCityName] = useState('') // cityName = 'Portland'
  const [locationIsLoading, setLocationIsLoading] = useState(true)

  //like componentDidMount triggers on change
  useEffect(() => {

    const getCurrentLocation = () =>{
      
      
      navigator.geolocation.getCurrentPosition(success, error)
      

    }

  

    axios({
      method: 'POST',
      url: 'http://localhost:3000/search',
      data: { city: 'Denver' }
    })
      .then(data => {
        setCityData(data.data.cityData);
        setCityName(data.data.cityName);
        setLocationIsLoading(false)
      })
  }, []);

  const handleSubmit = (e) => {
    //prevents the page from refreshing on submit
    e.preventDefault();
    if (!locationIsLoading) {
      setLocationIsLoading(true);
      const inputCity = e.target.firstChild.value;
      console.log('input city', inputCity);
      axios({
        method: 'POST',
        url: 'http://localhost:3000/search',
        data: { city: inputCity }
      })
        .then(data => {
          // console.log('front end!!', data.data);
          setCityData(data.data.cityData);
          setCityName(data.data.cityName);
          setLocationIsLoading(false);
        })
    }
  }

  return (
    <div className="searchbar-div">
      <form className="searchbar" onSubmit={handleSubmit}>
        <input className="search-input" name="search-input" id="search-input" type="text" placeholder="London" required></input>
        <input className="search-btn" type="submit" value="Search"></input>
      </form>
      {!locationIsLoading ? <CardContainer city={cityName} data={cityData} /> : <div><h3>Enter city name above...</h3></div>}
    </div>
  )
}


export default Searchbar;
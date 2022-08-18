//client/components/App.jsx

import React , {useState, useEffect} from 'react';
import '../styles/styles.scss';
import Navbar from './Navbar.jsx';
import Searchbar from './Searchbar.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import LocalWeather from './LocalWeather.jsx';
import { Routes, Route } from "react-router-dom";


const App = props => {

  const [user, setUser] = useState(null);
  const [localInfo, setLocalInfo] = useState({});
  const [currInfoLoading, setCurrInfoLoading] = useState(true);


  useEffect(()=>{


    const currentLocationInfo = (() => {
     
  
       let api = "https://api.openweathermap.org/data/2.5/weather";
       let apiKey = "3865d44fbc4bfd45572787afb8fa06b2"; 
     
      navigator.geolocation.getCurrentPosition(success, error); 
      
      function success(position){
          let latitude = position.coords.latitude; 
          let longitude = position.coords.longitude; 
          let url =  `${api}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`; 
          
          let localInfo = {}
  
          fetch(url)
          .then(res => res.json())
          .then(data => {           
             localInfo.temp = data.main.temp;
             localInfo.currentLocation = data.name
             localInfo.weatherDescription = data.weather[0].main;
             localInfo.latitude = latitude
             localInfo.longitude = longitude

             setLocalInfo(localInfo)
             setCurrInfoLoading(false);
          })
      }; 
  
      function error() {
        console.log('error finding location');
      }
    })();  


  }, [])

  

  
    return (
      <Routes>
        <Route path="/" element={
          <main>
            <Navbar user={user} setUser={setUser} />
            <LocalWeather localInfo = {localInfo}/>
            {!currInfoLoading ?
              <Searchbar localInfo = {localInfo} user={user} setUser={setUser} /> :
              <div><h3>Loading Location Info</h3></div>
            }
          </main>
        } />
        <Route path="/signup" element={<Signup user={user} setUser={setUser} />} />
        <Route path="/login" element={<Login user={user} setUser={setUser} />} />
        {/* <Route path="/favorites" element={}/> */}
      </Routes>
    );
}

export default App; 



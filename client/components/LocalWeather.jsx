import React from "react";
import { FunnelChart } from "recharts";



const LocalWeather = props => {

const getWeather = () => {

    let api = "https://api.openweathermap.org/data/2.5/weather";
    let apiKey = "3865d44fbc4bfd45572787afb8fa06b2"; 
   
    
    navigator.geolocation.getCurrentPosition(success, error); 
    
    function success(position){
        let latitude = position.coords.latitude; 
        let longitude = position.coords.longitude; 
        let url =  `${api}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`; 
        
        console.log('position ', position);
        console.log('latitude: ', latitude);
        console.log('longitude: ', longitude); 
        console.log('url: ', url)
    }; 

    function error(){console.log('error finding location')}



}

getWeather()

    return(
    <div className="localWeather">
        <h3>CurrentLocation</h3>
        <h4>Location</h4>
        <h4>Temp</h4>

    </div>
    )
}


export default LocalWeather
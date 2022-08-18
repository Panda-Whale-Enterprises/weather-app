import axios from "axios";
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
        
        fetch(url)
        .then(res => res.json())
        .then(data => {


            let location = document.getElementById("location") 
            let temperature = document.querySelector('#temperature'); 
            let description = document.querySelector('#description')
            
            let temp = data.main.temp;
            temperature.innerHTML = temp + "° F";
            location.innerHTML = data.name; 
            description.innerHTML = data.weather[0].main;

        })
        console.log('position ', position);
        console.log('latitude: ', latitude);
        console.log('longitude: ', longitude); 
       
    }; 

    function error(){console.log('error finding location')}



}

getWeather()

    return(
    <div className="localWeather">
        <h3 id="location">Location</h3>
        <h4 id='temperature'>Temp</h4>
        <h4 id='description'>Description</h4>

    </div>
    )
}


export default LocalWeather
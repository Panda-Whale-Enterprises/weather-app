
import React from "react";
import { FunnelChart } from "recharts";




const LocalWeather = props => {

    return(
    <div className="localWeather">
        <h3 id="location">{
          props.localInfo.currentLocation ? 
          props.localInfo.currentLocation : 
          'No Local Data Available'
          }</h3>
        <h4 id='temperature'>{
          props.localInfo.temp ?
          props.localInfo.temp + ' °F' :
          'Current Temperature Unavailable'
          }</h4>
        <h4 id='description'>{props.localInfo.weatherDescription}</h4>

    </div>
    )
}


export default LocalWeather
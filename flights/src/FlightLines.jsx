import {Polyline} from "react-leaflet";

export default function FlightLines({mainAirport, otherAirports}){

    return(
        <>
            {otherAirports.map((airport) => {
                return(
                    <Polyline positions={[[mainAirport.lat, mainAirport.lon], [airport.lat, airport.lon]]} />
                )
            })}
        </>
    )
}
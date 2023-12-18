import {Polyline} from "react-leaflet";

export default function FlightLines({currentCityPairs, pastCityPairs}){
    return(
        <>
            {currentCityPairs.map((flight) => {
                if(flight.departure!=null && flight.arrival!=null) {
                    return (
                        <Polyline
                            positions={[[flight.departure.lat, flight.departure.lon], [flight.arrival.lat, flight.arrival.lon]]}
                        />
                    )
                }
            })}
            {pastCityPairs.map((flight) => {
                if(flight.departure!=null && flight.arrival!=null) {
                    return (
                        <Polyline
                            pathOptions={{opacity: '0.3'}}
                            positions={[[flight.departure.lat, flight.departure.lon], [flight.arrival.lat, flight.arrival.lon]]}
                            />
                    )
                }
            })}
        </>
    )
}
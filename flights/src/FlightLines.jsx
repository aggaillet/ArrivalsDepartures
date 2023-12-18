import {Polyline} from "react-leaflet";

export default function FlightLines({currentCityPairs, pastCityPairs}){
    return(
        <>
            {currentCityPairs.map((flight, index) => {
                if(flight.departure!=null && flight.arrival!=null) {
                    return (
                        <Polyline
                            key={index}
                            positions={[[flight.departure.lat, flight.departure.lon], [flight.arrival.lat, flight.arrival.lon]]}
                        />
                    )
                }
            })}
            {pastCityPairs.map((flight, index) => {
                if(flight.departure!=null && flight.arrival!=null) {
                    return (
                        <Polyline
                            key={-index}
                            pathOptions={{opacity: '0.3'}}
                            positions={[[flight.departure.lat, flight.departure.lon], [flight.arrival.lat, flight.arrival.lon]]}
                            />
                    )
                }
            })}
        </>
    )
}
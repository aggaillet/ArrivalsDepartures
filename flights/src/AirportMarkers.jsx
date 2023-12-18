import L from "leaflet";
import iconOther from "./assets/airportIconOth.png";
import iconMain from "./assets/airportIcon.png";
import {Marker, Popup} from "react-leaflet";

export default function AirportMarkers({onMarkerClick, items, mainAirport}) {

    const airportIconMain = L.icon({
        iconUrl: iconMain,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
    });

    const airportIconOther = L.icon({
        iconUrl: iconOther,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
    });

    return (
        <>
            {items.map((item, index) => {
                const icon = mainAirport && item.name === mainAirport.name ? airportIconOther : airportIconMain;
                return (
                    <Marker key={index}
                            position={[item.lat, item.lon]}
                            icon={icon}>
                        <Popup>
                            <div>
                                <h2>{item.name}</h2>
                                <p>IATA Code: {item.iata}</p>
                                <p>Continent: {item.continent}</p>
                                <ButtonAirportSelect item={item}/>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    )

    function ButtonAirportSelect({item}){
        if (onMarkerClick != null) {
            return (
                <p>
                    <button onClick={() => onMarkerClick(item)}>Select</button>
                </p>
            )
        } else {
            return <></>
        }
    }

}
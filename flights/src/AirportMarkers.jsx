import L from "leaflet";
import icon from "./assets/airportIcon.png";
import {Marker, Popup} from "react-leaflet";
export default function AirportMarkers({onMarkerClick, items}) {

    const airportIcon = L.icon({
        iconUrl: icon,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
    });

    return (
        <>
            {items.map((item, index) => {
                return (
                    <Marker key={index}
                            position={[item.lat, item.lon]}
                            icon={airportIcon}>
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
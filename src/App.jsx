import './App.css'
import FlightsList from "./FlightsList.jsx";
import {useEffect, useState} from "react";
import MenuAirports from "./Menu.jsx";
import {AirportView} from "./AirportView.jsx";

function App() {
    const [activeMenu, setActiveMenu] = useState('airports')
    const [currentAirport, setCurrentAirport] = useState({
        "iata": "TLS",
        "lon": "1.374321",
        "iso": "FR",
        "status": 1,
        "name": "Toulouse-Blagnac Airport",
        "continent": "EU",
        "type": "airport",
        "lat": "43.63007",
        "size": "large"
    })
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(true);
    const BASE_API_URL = "https://raw.githubusercontent.com/jbrooksuk/JSON-Airports/master/airports.json";

    useEffect(() => {
        api_retriever_ap();
    }, []);

    const handleAirportSelection = (airport) => {
        setCurrentAirport(airport)
    }

    const onClickMenuItem = (name) => {
        setActiveMenu(name)
    }

    return (
        <>
            <div style={{width: "90vw", padding: 0, margin: 0, border: "white solid 5px", position: "absolute", top: "5vh", left: "5vw"}}>
                <MenuAirports onClickItem={onClickMenuItem}></MenuAirports>
                {activeMenu === 'airports' && <AirportView loading={loading} items={airports} currentAirport={currentAirport} onAirportSelectFunc={handleAirportSelection}/>}
                {activeMenu === 'departures' && <FlightsList airport={currentAirport} departure={true} allAirports={airports}/>}
                {activeMenu === 'arrivals' && <FlightsList airport={currentAirport} departure={false} allAirports={airports}/>}
            </div>
        </>
    )

    async function api_retriever_ap() {
        try {
            let res = await fetch(BASE_API_URL)
            let data = await res.json();

            let filteredItems = data.filter(
                (item) =>
                    item.lat !== undefined &&
                    item.lon !== undefined &&
                    item.name !== null &&
                    !isNaN(item.lat) &&
                    !isNaN(item.lon) &&
                    item.type === 'airport' &&
                    item.iata !== 'TJP'  // Bug in airport API creates this non-existing airport
            );

            setAirports(filteredItems);
            setLoading(false);
        } catch (error) {
            console.error("API ERROR", error);
            setLoading(false);
        }
    }
}

export default App
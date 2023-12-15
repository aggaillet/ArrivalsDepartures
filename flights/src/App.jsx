import './App.css'
import FlightsList from "./FlightsList.jsx";
import {useState} from "react";
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
                {activeMenu === 'airports' && <AirportView onAirportSelectFunc={handleAirportSelection}/>}
                {activeMenu === 'departures' && <FlightsList airport={currentAirport} departure={true} allAirports={airports}/>}
                {activeMenu === 'arrivals' && <FlightsList airport={currentAirport} departure={false} allAirports={airports}/>}
            </div>
        </>
    )

}

export default App


function getAllAirports(){

}

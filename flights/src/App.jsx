import './App.css'
import FlightsList from "./FlightsList.jsx";
import {useState} from "react";
import MenuAirports from "./Menu.jsx";
import {AirportView} from "./AirportView.jsx";

function App() {
    const [activeMenu, setActiveMenu] = useState('airports')
    const [currentAirport, setCurrentAirport] = useState('mxp')

    const handleAirportSelection = (iataCode) => {
        setCurrentAirport(iataCode.toLowerCase())
    }

    const onClickMenuItem = (name) => {
        setActiveMenu(name)
    }

    return (
        <>
            <div style={{width: "90vw", padding: 0, margin: 0, border: "white solid 5px", position: "absolute", top: "5vh", left: "5vw"}}>
                <MenuAirports onClickItem={onClickMenuItem}></MenuAirports>
                {activeMenu === 'airports' && <AirportView/>}
                {activeMenu === 'departures' && <FlightsList airportCode={currentAirport.toLowerCase()} departure={true}/>}
                {activeMenu === 'arrivals' && <FlightsList airportCode={currentAirport.toLowerCase()} departure={false}/>}
            </div>
        </>
    )

}

export default App

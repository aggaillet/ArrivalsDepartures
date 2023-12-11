import './App.css'
import FlightsList from "./FlightsList.jsx";
import {useState} from "react";
import MenuAirports from "./Menu.jsx";

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
            <MenuAirports onClickItem={onClickMenuItem}></MenuAirports>
            {activeMenu === 'departures' && <FlightsList airportCode={currentAirport.toLowerCase()} departure={true}/>}
            {activeMenu === 'arrivals' && <FlightsList airportCode={currentAirport.toLowerCase()} departure={false}/>}
        </>
    )

}

export default App

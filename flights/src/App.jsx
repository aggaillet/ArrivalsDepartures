import './App.css'
import DeparturesList from "./DeparturesList.jsx";
import ShowButton from "./ShowButton.jsx";
import {useState} from "react";

function App() {
    const [hasBeenClicked, setHasBeenClicked] = useState(false);

    const handleButtonClick = () => {
        setHasBeenClicked(true)
    };

    return (
        <>
            <h1>Destinations from TOULOUSE :</h1>
            {!hasBeenClicked && <ShowButton onBtnPress={handleButtonClick}/>}
            {hasBeenClicked && <DeparturesList/>}
        </>
    )

}

export default App

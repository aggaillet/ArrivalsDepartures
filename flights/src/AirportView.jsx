import 'leaflet/dist/leaflet.css';
import './index.css'
import {Map} from './Map.jsx'
import {Marker, Popup} from 'react-leaflet'
import { useEffect, useState } from "react";
import L from 'leaflet'
import icon from './assets/airportIcon.png'
import {Container, Input, Segment, Table} from "semantic-ui-react";
import AirportMarkers from "./AirportMarkers.jsx";


export function AirportView({onAirportSelectFunc}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
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
    });

    const BASE_API_URL = "https://raw.githubusercontent.com/jbrooksuk/JSON-Airports/master/airports.json";

    useEffect(() => {
        api_retriever_ap();
    }, []);

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
                    item.size === 'large'&&
                    item.iata !== 'TJP'  // Bug in aiport API creates this non-existing airport
            );

            setItems(filteredItems);
            setLoading(false);
        } catch (error) {
            console.error("API ERROR", error);
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <div className="listContainer">
                <AirportList />
            </div>
            <div className="mapContainer">
                <Map>
                    <AirportMarkers items={items} onMarkerClick={handleAirportSelection}/>
                </Map>
            </div>
        </div>
    )

    function AirportList() {
        const [searchTerm, setSearchTerm] = useState('');

        function handleSearch(e) {
            setSearchTerm(e.target.value);
        }

        const filteredItems = items.filter((item) => {
            const name = item.name ? item.name.toLowerCase() : '';
            const iata = item.iata ? item.iata.toLowerCase() : '';
            const continent = item.continent ? item.continent.toLowerCase() : '';

            return (
                name.includes(searchTerm.toLowerCase()) ||
                iata.includes(searchTerm.toLowerCase()) ||
                continent.includes(searchTerm.toLowerCase())
            );
        });

        return (
            <>
                <div style={{display: "inline-block"}}>
                <h3 style={{marginBottom: 0}}>Current selection: {currentAirport.iata}</h3>
                    <Input
                           icon="search"
                           placeholder="Airport Research by name..."
                           onChange={handleSearch}
                           value={searchTerm}
                    />
                </div>
                <Segment style={{overflow: 'auto', maxHeight: "87%" }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Airport Name</Table.HeaderCell>
                                    <Table.HeaderCell>IATA Code</Table.HeaderCell>
                                    <Table.HeaderCell>Continent</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {filteredItems.map((item, index) => (
                                    <Table.Row key={index} onClick={() => handleAirportSelection(item)}>
                                        <Table.Cell>{item.name}</Table.Cell>
                                        <Table.Cell>{item.iata}</Table.Cell>
                                        <Table.Cell>{item.continent}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    )}
                </Segment>
            </>
        )
    }

    function handleAirportSelection(airport) {
        setCurrentAirport(airport)
        onAirportSelectFunc(airport)
    }
}
import 'leaflet/dist/leaflet.css';
import './index.css'
import {Map} from './Map.jsx'
import {useState} from "react";
import {Input, Segment, Table} from "semantic-ui-react";
import AirportMarkers from "./AirportMarkers.jsx";


export function AirportView({loading, items, currentAirport, onAirportSelectFunc}) {

    return (
        <div className="container">
            <div className="listContainer">
                <AirportList />
            </div>
            <div className="mapContainer">
                <Map>
                    <AirportMarkers items={items.filter(x => x.size === 'large')} onMarkerClick={handleAirportSelection}/>
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

            return (
                name.includes(searchTerm.toLowerCase()) ||
                iata.includes(searchTerm.toLowerCase())
            );
        });

        return (
            <>
                <div style={{display: "inline-block"}}>
                <h3 style={{marginBottom: 0}}>Current selection: {currentAirport.iata}</h3>
                    <Input
                        name="searchBar"
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
        onAirportSelectFunc(airport)
    }
}
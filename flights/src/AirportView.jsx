import React, { useEffect, useState } from "react";
import {Input, Segment, Table} from "semantic-ui-react";
import 'leaflet/dist/leaflet.css';
import './index.css'
import {Map} from './Map.jsx'
import {Marker, Popup} from 'react-leaflet'
import L from 'leaflet'
import icon from './assets/airportIcon.png'
import {create as searchTerm} from "eslint-plugin-react/lib/rules/sort-prop-types.js";


export function AirportView(func) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    !isNaN(item.lat) &&
                    !isNaN(item.lon) &&
                    item.type === 'airport' &&
                    item.size === 'large'
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
                    <AirportMap />
                </Map>
            </div>
        </div>
    )

    function AirportMap() {

        const airportIcon = L.icon({
            iconUrl: icon,
            iconSize: [50, 50],
            iconAnchor: [25, 50],
        });

        return (
            <>
                {items.map((item, index) => {
                    return (
                        <Marker key={index} position={[item.lat, item.lon]} icon={airportIcon}>
                            <Popup>
                                <div>
                                    <p>Airport Name: {item.name}</p>
                                    <p>IATA Code: {item.iata}</p>
                                    <p>Continent: {item.continent}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </>
        )
    }

    function AirportList() {
        const [searchTerm, setSearchTerm] = useState('');

        function pain(iata) {
            console.log("AP clicked : ",  iata);
            //TODO This method is just for standalone, needs to be deleted after modifying the logic of "func"
        }

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
                <Segment style={{height: "8%"}}>
                    <Input
                           icon="search"
                           placeholder="Airport Research by name..."
                           onChange={handleSearch}
                           value={searchTerm}
                    />
                </Segment>
                <Segment style={{overflow: 'auto', maxHeight: "92%" }}>
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
                                    <Table.Row key={index} onClick={() => pain(item.iata)}>
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
}
import React, { useEffect, useState } from "react";
import {Segment, Table} from "semantic-ui-react";
import {MapContainer, TileLayer} from "react-leaflet"

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
            setItems(data);
            setLoading(false);
        } catch (error) {
            console.error("API ERROR", error);
            setLoading(false);
        }
    }

    return (
        <AirportList />
    )

    function AirportMap() {

        const position = [51.505, -0.09]

        return (
            <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        )
    }

    function AirportList() {
        function pain(iata) {
            console.log("AP clicked : ",  iata);
        }

        return (
            <>
                <Segment style={{overflow: 'auto', maxHeight: screen.height }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <Table celled>
                            <Table.Header>
                                <Table.Row on>
                                    <Table.HeaderCell>Airport Name</Table.HeaderCell>
                                    <Table.HeaderCell>IATA Code</Table.HeaderCell>
                                    <Table.HeaderCell>Continent</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {items.map(item =>
                                    <Table.Row key={item} onClick={pain(item.iata)}>
                                        <Table.Cell>{item.name}</Table.Cell>
                                        <Table.Cell>{item.iata}</Table.Cell>
                                        <Table.Cell>{item.continent}</Table.Cell>
                                    </Table.Row>)}
                            </Table.Body>
                        </Table>
                    )}
                </Segment>
            </>
        )
    }
}
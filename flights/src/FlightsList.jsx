import {useEffect, useState} from 'react'
import {Segment, Table} from 'semantic-ui-react'
import {Map} from "./Map.jsx";
import AirportMarkers from "./AirportMarkers.jsx";
import FlightLines from "./FlightLines.jsx";

export default function FlightsList({airport, departure, allAirports}) {
    let airportCode = airport.iata
    let requestString = ""
    let titleString
    if (departure) {
        requestString = "https://www.skyscanner.com/g/arrival-departure-svc/api/airports/" + airportCode + "/departures?locale=en-GB"
        titleString = "DEPARTURES FROM"
    } else {
        requestString = "https://www.skyscanner.com/g/arrival-departure-svc/api/airports/" + airportCode + "/arrivals?locale=en-GB"
        titleString = "ARRIVALS TO"
    }

    const [departures, setDepartures] = useState([])
    const [hasLoaded, setHasLoded] = useState(false)
    let flightsTable = departures.map(x =>
        <Table.Row><Table.Cell>{x.airlineName}</Table.Cell>
            <Table.Cell>{x.flightNumber}</Table.Cell>
            <Table.Cell> {departure ? x.arrivalAirportName : x.departureAirportName} </Table.Cell>
            <Table.Cell>{x.localisedScheduledDepartureTime.slice(-5)}</Table.Cell>
            <Table.Cell>{x.localisedScheduledArrivalTime.slice(-5)}</Table.Cell>
        </Table.Row>);
    let selectedAirportCodes = departures.map(x => departure ? x.arrivalAirportCode : x.departureAirportCode)
    let selectedAirports = allAirports.filter(x => selectedAirportCodes.includes(x.iata))

    useEffect(() => {
        // Execute only at first render
        Promise.resolve(fetchDepartures()).then((d) => {
            setDepartures(d)
            setHasLoded(true)
        })
    }, [])

    return(
        <>
            {!hasLoaded &&
                <>
                    <div className="container">
                        <img src="/src/assets/loading.gif" className="center" height="100px" width="100px"></img>
                    </div>
                </>
            }
            {hasLoaded &&
                <>
                    <div className="container">
                        <div className="listContainer">
                            <h3 style={{height: "3%", marginBottom: 0, fontSize: 20}}>{titleString}</h3>
                            <h3 style={{height: "3%", marginTop: 0, fontSize: 18}}>{airport.name}</h3>
                            <Segment style={{overflow: 'auto', maxHeight: "89%" }}>
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Airline</Table.HeaderCell>
                                        <Table.HeaderCell>Flight number</Table.HeaderCell>
                                        <Table.HeaderCell>{departure ? "Destination" : "Origin"}</Table.HeaderCell>
                                        <Table.HeaderCell>Departure time</Table.HeaderCell>
                                        <Table.HeaderCell>Arrival time</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {flightsTable}
                                </Table.Body>
                            </Table>
                            </Segment>
                        </div>
                        <div className="mapContainer">
                            <Map>
                                <FlightLines mainAirport={airport} otherAirports={selectedAirports} />
                                <AirportMarkers items={selectedAirports.concat(airport)} onMarkerClick={null}/>
                            </Map>
                        </div>
                    </div>
                </>
            }
        </>
    )

    // Returns array of departures
    async function fetchDepartures(){
        const result = await fetch(requestString, {mode: 'cors'})
        const data = await result.json()
        if(departure){
            return data.departures
        } else {
            return data.arrivals
        }
    }

}

import {useEffect, useState} from 'react'
import {Segment, Table} from 'semantic-ui-react'
import {Map} from "./Map.jsx";
import AirportMarkers from "./AirportMarkers.jsx";
import FlightLines from "./FlightLines.jsx";

var previousSearchFlights = []
var prevMainAirports = []

export default function FlightsList({airport, departure, allAirports}) {
    let airportCode = airport.iata
    const [flights, setFlights] = useState([])
    const [hasLoaded, setHasLoded] = useState(false)

    let requestString = ""
    let titleString

    useEffect(() => {
        if (prevMainAirports.includes(airportCode.toUpperCase())){
            if (departure){
                setFlights(previousSearchFlights.filter(x => x.departureAirportCode.toUpperCase() === airportCode.toUpperCase()))
            }else if(!departure && prevMainAirports.includes(airportCode.toUpperCase())) {
                setFlights(previousSearchFlights.filter(x => x.arrivalAirportCode.toUpperCase() === airportCode.toUpperCase()))
            }
            setHasLoded(true)
        }else{
            if (departure) {
                requestString = "https://www.skyscanner.com/g/arrival-departure-svc/api/airports/" + airportCode + "/departures?locale=en-GB"
                titleString = "DEPARTURES FROM"
            } else {
                requestString = "https://www.skyscanner.com/g/arrival-departure-svc/api/airports/" + airportCode + "/arrivals?locale=en-GB"
                titleString = "ARRIVALS TO"
            }
            Promise.resolve(fetchFlights()).then((d) => {
                setFlights(d)
                if (! prevMainAirports.filter(x => x.departureBoolean === departure).map(x => x.iata.toUpperCase()).includes(airportCode.toUpperCase())){
                    previousSearchFlights = previousSearchFlights.concat(d)
                    prevMainAirports.push({
                        "departureBoolean": departure,
                        "iata": airportCode.toUpperCase()
                    })
                }
                setHasLoded(true)
            })
        }
    }, []);


    let flightsTable = flights.map((x, index) =>
        <Table.Row key={index}><Table.Cell>{x.airlineName}</Table.Cell>
            <Table.Cell>{x.flightNumber}</Table.Cell>
            <Table.Cell> {departure ? x.arrivalAirportName : x.departureAirportName} </Table.Cell>
            <Table.Cell>{x.localisedScheduledDepartureTime.slice(-5)}</Table.Cell>
            <Table.Cell>{x.localisedScheduledArrivalTime.slice(-5)}</Table.Cell>
        </Table.Row>);

    let currentCityPairs = []
    let airportsList = []
    for (const flight of flights){
        let depAirport = allAirports.findLast(x => x.iata === flight.departureAirportCode.toUpperCase());
        let arrAirport = allAirports.findLast(x => x.iata === flight.arrivalAirportCode.toUpperCase());
        if(!currentCityPairs.filter(x => x.departure === depAirport).map(x => x.arrival).includes(arrAirport)){
            currentCityPairs.push({
                "departure": depAirport,
                "arrival": arrAirport
            })
            if(depAirport !== undefined && arrAirport !== undefined && depAirport.iata === airport.iata){
                airportsList.push(arrAirport)
            } else {
                airportsList.push(depAirport)
            }
        }
    }

    let pastCityPairs = []
    let type = departure ? 'departure' : 'arrival';
    for (const pastFlight of previousSearchFlights) {
        let depAirport = allAirports.findLast(x => x.iata === pastFlight.departureAirportCode.toUpperCase());
        let arrAirport = allAirports.findLast(x => x.iata === pastFlight.arrivalAirportCode.toUpperCase());
        if(!pastCityPairs.filter(x => x.departure === depAirport).map(x => x.arrival).includes(arrAirport) // Make sure combinations are unique
            && currentCityPairs.filter(x => x.departure === depAirport).filter(x => x.arrival === arrAirport).length === 0 // Avoid duplicates with current flights
        ){
            pastCityPairs.push({
                "departure": depAirport,
                "arrival": arrAirport,
                "type": type
            })
        }
    }

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
                                <FlightLines currentCityPairs={currentCityPairs} pastCityPairs={pastCityPairs}/>
                                <AirportMarkers items={airportsList.concat(airport)} onMarkerClick={null} mainAirport={airport}/>
                            </Map>
                        </div>
                    </div>
                </>
            }
        </>
    )

    // Returns array of departures
    async function fetchFlights(){
        const result = await fetch(requestString, {mode: 'cors'})
        const data = await result.json()
        if(departure){
            return data.departures
        } else {
            return data.arrivals
        }
    }

}

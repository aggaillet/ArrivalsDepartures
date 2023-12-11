import {useEffect, useState} from 'react'
import {Table} from 'semantic-ui-react'

export default function FlightsList(props) {
    let {airportCode, departure} = props
    airportCode = airportCode.toLowerCase()
    let requestString = ""
    let titleString = ""
    if (departure) {
        requestString = "https://www.skyscanner.com/g/arrival-departure-svc/api/airports/" + airportCode + "/departures?locale=en-GB"
        titleString = "Departures from " + airportCode
    } else {
        requestString = "https://www.skyscanner.com/g/arrival-departure-svc/api/airports/" + airportCode + "/arrivals?locale=en-GB"
        titleString = "Arrivals to " + airportCode
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

    useEffect(() => {
        // Execute only at first render
        Promise.resolve(fetchDepartures()).then((d) => {
            setDepartures(d)
            setHasLoded(true)
        })
    }, [])

    return(
        <>
            {!hasLoaded && <img src="/src/assets/loading.gif" height="100px" width="100px"></img>}
            {hasLoaded &&
                <>
                    <h2>{titleString}</h2>
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

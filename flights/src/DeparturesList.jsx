import {useEffect, useState} from 'react'
import {Table} from 'semantic-ui-react'

let airportCode = "tls"
let departuresRequestString = "https://www.skyscanner.com/g/arrival-departure-svc/api/airports/" + airportCode + "/departures?locale=en-GB"

export default function DeparturesList() {
    const [departures, setDepartures] = useState([])
    const [hasLoaded, setHasLoded] = useState(false)
    let destinationTable = departures.map(x => <Table.Row><Table.Cell>{x.airlineName}</Table.Cell><Table.Cell>{x.flightNumber}</Table.Cell><Table.Cell>{x.localisedScheduledDepartureTime}</Table.Cell><Table.Cell>{x.localisedScheduledArrivalTime}</Table.Cell></Table.Row>);

    useEffect(() => {
        // Execute only at first render
        Promise.resolve(fetchDepartures()).then((d) => {
            setDepartures(d)
            console.log(d)
            setHasLoded(true)
        })
    }, [])

    return(
        <>
            {!hasLoaded && <img src="/src/assets/loading.gif" height="100px" width="100px"></img>}
            {hasLoaded &&
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Airline</Table.HeaderCell>
                            <Table.HeaderCell>Flight number</Table.HeaderCell>
                            <Table.HeaderCell>Departure time</Table.HeaderCell>
                            <Table.HeaderCell>Arrival time</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {destinationTable}
                    </Table.Body>
                </Table>
            }
        </>
    )

}

// Returns array of departures
async function fetchDepartures(){
    const result = await fetch(departuresRequestString, {mode: 'cors'})
    const data = await result.json()
    return data.departures
}

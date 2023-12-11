import { Menu } from 'semantic-ui-react'

export default function MenuAirports({onClickItem}) {

    return (
            <div>
                <Menu fluid widths={3}>
                    <Menu.Item
                        name='airports'
                        onClick={() => onClickItem('airports')}
                    />
                    <Menu.Item
                        name='departures'
                        onClick={() => onClickItem('departures')}
                    />
                    <Menu.Item
                        name='arrivals'
                        onClick={() => onClickItem('arrivals')}
                    />
                </Menu>
            </div>
    )
}

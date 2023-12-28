import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

export function Map({ children }) {
    return (
        <MapContainer center={[51.505, -0.09]} zoom={3}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {children}
        </MapContainer>
    );
}
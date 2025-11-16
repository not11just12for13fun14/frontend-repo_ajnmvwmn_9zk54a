import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Workaround default marker icons in Leaflet + Vite
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

function ClickHandler({ onSelect }){
  useMapEvents({
    click(e){
      const { lat, lng } = e.latlng
      onSelect(lat, lng)
    }
  })
  return null
}

export default function MapSelector({ center=[45.4642, 9.19], marker, onSelect }){
  return (
    <div className="w-full h-64 rounded overflow-hidden border">
      <MapContainer center={marker || center} zoom={12} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {marker && <Marker position={marker}><Popup>Selezione club</Popup></Marker>}
        <ClickHandler onSelect={(lat, lon)=>onSelect && onSelect(lat, lon)} />
      </MapContainer>
    </div>
  )
}

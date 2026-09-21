import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../Hooks/UseGeoLocation";
import Button from "./Button";
import { UseUrlPosition } from "../Hooks/UseUrlPosition";

function getCountryFlag(countryCode) {
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt()))
    .join("");
}

function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPos,
    position: geoLocationPos,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = UseUrlPosition();

  const { cities } = useCities();

  const [isLocationActive, setIsLocationActive] = useState(false);
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng],
  );
  useEffect(
    function () {
      if (geoLocationPos)
        setMapPosition([geoLocationPos.lat, geoLocationPos.lng]);
    },
    [geoLocationPos],
  );
  return (
    <div className={styles.mapContainer}>
      {!geoLocationPos && (
        <Button
          type="position"
          onClick={() => {
            getPosition();
            setIsLocationActive(true);
          }}
        >
          {isLoadingPos ? "Loading..." : "use Your Position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <img
                src={`https://flagcdn.com/24x18/${city.countryCode.toLowerCase()}.png`}
                alt={`${city.countryCode} flag`}
              />
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        {mapLat != null && mapLng != null && (
          <Marker position={[mapLat, mapLng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {geoLocationPos && isLocationActive && (
          <Marker position={[geoLocationPos.lat, geoLocationPos.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        <ChangeCenter position={mapPosition} />
        <DetectClick onClick={() => setIsLocationActive(false)} />
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick({ onClick }) {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      onClick();
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });

  return null;
}
export default Map;

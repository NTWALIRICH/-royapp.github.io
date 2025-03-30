import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const API_KEY = "AIzaSyArbAGk55XvTti-Nn1UsUJQMknS0iS-OAU"; // Replace with your Google Maps API key

const PhoneTrackerWithPoliceStations = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [policeStations, setPoliceStations] = useState([]);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
          fetchNearbyPoliceStations(latitude, longitude);

          const now = new Date();
          setCurrentTime(now.toLocaleString()); // Format current time
        },
        (err) => {
          setError("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }

    // Update time every second
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchNearbyPoliceStations = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: 5000, // Search within a 5 km radius
            type: "police",
            key: API_KEY,
          },
        }
      );
      setPoliceStations(response.data.results);
    } catch (err) {
      console.error("Error fetching nearby police stations:", err);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h1>Phone Tracker with Police Stations</h1>
      {error && <p>{error}</p>}
      <div>
        <p>Current Time: {currentTime}</p>
      </div>
      <MapContainer
        center={location || [0, 0]} // Default center
        zoom={location ? 15 : 2}    // Zoom based on location availability
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* User's location marker */}
        {location && (
          <Marker position={location}>
            <Popup>Your Location: {location[0]}, {location[1]} <br /> Current Time: {currentTime}</Popup>
          </Marker>
        )}
        {/* Markers for nearby police stations */}
        {policeStations.map((station, index) => (
          <Marker
            key={index}
            position={{
              lat: station.geometry.location.lat,
              lng: station.geometry.location.lng,
            }}
          >
            <Popup>
              <strong>{station.name}</strong>
              <br />
              {station.vicinity}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PhoneTrackerWithPoliceStations;

import React, { useState, useEffect, useRef } from 'react';
import VehicleOverlayMarker from './VehicleOverlayMarker';
import './Navigation.css';

const parseCoordinates = (coordString) => {
  if (!coordString || typeof coordString !== 'string') return null;
  const parts = coordString.split(',');
  if (parts.length !== 2) return null;
  const parsePart = (partStr) => {
    const regex = /(\d+(?:\.\d+)?)[°\s]*\s*(\d+(?:\.\d+)?)*[\'′\s]*\s*(\d+(?:\.\d+)?)*[\"\″\s]*\s*([NSEW])/i;
    const match = partStr.trim().match(regex);
    if (!match) return NaN;
    const degrees = parseFloat(match[1]);
    const minutes = match[2] ? parseFloat(match[2]) : 0;
    const seconds = match[3] ? parseFloat(match[3]) : 0;
    const direction = match[4].toUpperCase();
    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') decimal = -decimal;
    return decimal;
  };
  const lat = parsePart(parts[0]);
  const lng = parsePart(parts[1]);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
};

const SingleMonasteryNavigation = ({ monasteries }) => {
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [selectedMonastery, setSelectedMonastery] = useState(null);
  const [hoveredMonastery, setHoveredMonastery] = useState(null);
  const [origin, setOrigin] = useState('');
  const [route, setRoute] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ distance: '', duration: '' });
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [locationError, setLocationError] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [search, setSearch] = useState('');
  const mapRef = useRef(null);
  const originInputRef = useRef(null);

  // Real-time tracking
  const [tracking, setTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const watchIdRef = useRef(null);
  const [vehicleMarker, setVehicleMarker] = useState(null);

  useEffect(() => {
    if (window.google && mapRef.current) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 27.5, lng: 88.5 },
        zoom: 9,
      });
      setMap(googleMap);
      setDirectionsService(new window.google.maps.DirectionsService());
      const renderer = new window.google.maps.DirectionsRenderer();
      renderer.setMap(googleMap);
      setDirectionsRenderer(renderer);

      const autocomplete = new window.google.maps.places.Autocomplete(originInputRef.current);
      autocomplete.bindTo('bounds', googleMap);
    }
  }, []);

  // REAL-TIME TRACKING EFFECT
  useEffect(() => {
    if (!tracking) {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (vehicleMarker) vehicleMarker.setMap(null);
      setVehicleMarker(null);
      return;
    }
    if (navigator.geolocation && map) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const pos = { lat: latitude, lng: longitude };
          setCurrentPosition(pos);
          setOrigin(pos);
          if (!vehicleMarker) {
            const marker = new window.google.maps.Marker({
              position: pos,
              map: map,
              title: "Your Vehicle",
              icon: {
                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: "#2196f3",
                fillOpacity: 1,
                strokeWeight: 2,
              }
            });
            setVehicleMarker(marker);
          } else {
            vehicleMarker.setPosition(pos);
          }
          if (selectedMonastery) {
            const destination = parseCoordinates(selectedMonastery['GPS Coordinates']);
            if (destination) {
              calculateRoute(destination, pos);
            }
          }
        },
        (err) => {
          setLocationError("Could not track your location in real-time.");
          setTracking(false);
        },
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
      );
    }
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (vehicleMarker) vehicleMarker.setMap(null);
      setVehicleMarker(null);
    };
    // eslint-disable-next-line
  }, [tracking, map, selectedMonastery]);

  const handleLocationError = (error) => {
    let message = "An unknown error occurred.";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Geolocation request denied. Please allow location access in your browser settings."; break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information is currently unavailable. Please check your connection or try again later."; break;
      case error.TIMEOUT:
        message = "The request to get user location timed out."; break;
      default:
        message = "An unknown error occurred."; break;
    }
    setLocationError(message);
  };

  const handleUseMyLocation = () => {
    setLocationError('');
    if (navigator.geolocation) {
      if (!window.isSecureContext && window.location.hostname !== 'localhost') {
        setLocationError('Geolocation is only available on secure (HTTPS) connections or localhost.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setOrigin(pos);
          originInputRef.current.value = 'My Current Location';
          if (selectedMonastery) {
            const destination = parseCoordinates(selectedMonastery['GPS Coordinates']);
            if (destination) {
              calculateRoute(destination, pos);
            }
          }
        },
        handleLocationError
      );
    } else {
      setLocationError("Error: Your browser doesn't support geolocation.");
    }
  };

  const calculateRoute = (destination, startPoint = origin) => {
    if (!directionsService || !directionsRenderer || !startPoint) {
      alert('Please enter a starting location.');
      return;
    }
    directionsRenderer.setDirections({ routes: [] });
    setRoute(null);
    setRouteInfo({ distance: '', duration: '' });
    setGoogleMapsUrl('');

    const mode = travelMode === 'TRANSIT' ? 'TRANSIT' : travelMode;
    directionsService.route(
      {
        origin: startPoint,
        destination: destination,
        travelMode: window.google.maps.TravelMode[mode],
      },
      (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
          const currentRoute = response.routes[0].legs[0];
          setRouteInfo({
            distance: currentRoute.distance.text,
            duration: currentRoute.duration.text,
          });
          setRoute(response.routes[0]);
        } else {
          const originQuery = typeof startPoint === 'string' ? startPoint : `${startPoint.lat},${startPoint.lng}`;
          const destQuery = `${destination.lat},${destination.lng}`;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originQuery)}&destination=${encodeURIComponent(destQuery)}&travelmode=${mode.toLowerCase()}`;
          setGoogleMapsUrl(url);

          if (status === 'ZERO_RESULTS') {
            alert(`A route could not be found within the app. Click the link provided to view the route on Google Maps.`);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        }
      }
    );
  };

  const handleMonasterySelect = (monastery) => {
    setSelectedMonastery(monastery);
    if (origin) {
      const destination = parseCoordinates(monastery['GPS Coordinates']);
      if (destination) {
        calculateRoute(destination);
      } else {
        alert('Could not parse the GPS coordinates for this monastery.');
      }
    }
  };

  useEffect(() => {
    if (selectedMonastery && origin) {
      const destination = parseCoordinates(selectedMonastery['GPS Coordinates']);
      if (destination) {
        calculateRoute(destination);
      }
    }
    // eslint-disable-next-line
  }, [travelMode]);

  function getRailSteps(steps) {
    const rails = steps.filter(
      step =>
        step.travel_mode === 'TRANSIT' &&
        step.transit && step.transit.line &&
        step.transit.line.vehicle && step.transit.line.vehicle.type &&
        step.transit.line.vehicle.type.toUpperCase() === 'RAIL'
    );
    return rails.length > 0 ? rails : steps;
  }

  // Search and alpha sort monasteries
  const filteredSortedMonasteries = monasteries
    .filter(monastery =>
      monastery['Monastery Name']
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) =>
      a['Monastery Name'].localeCompare(b['Monastery Name'])
    );

  return (
    <div className="navigation-container">
      <div className="sidebar">
        <h2>Monastery Navigation</h2>
        <div className="live-tracking-toggle">
          <label>
            <input
              type="checkbox"
              checked={tracking}
              onChange={() => setTracking((t) => !t)}
            />{" "}
            Enable Real-Time Tracking
          </label>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a monastery…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="monastery-search"
          />
        </div>
        <div className="origin-input">
          <label htmlFor="origin">Your Location:</label>
          <input
            id="origin"
            type="text"
            ref={originInputRef}
            onChange={(e) => {
                setOrigin(e.target.value);
                setLocationError('');
            }}
            placeholder="Enter your starting point"
          />
          <button onClick={handleUseMyLocation}>Use My Location</button>
          {locationError && <p className="location-error">{locationError}</p>}
        </div>
        <div className="travel-mode-selector">
          <label htmlFor="travel-mode">Travel Mode:</label>
          <select id="travel-mode" value={travelMode} onChange={(e) => setTravelMode(e.target.value)}>
            <option value="DRIVING">Driving</option>
            <option value="WALKING">Walking</option>
            <option value="TRANSIT">Train / Transit</option>
          </select>
        </div>
        <div className="monastery-list scrollable-list">
          {filteredSortedMonasteries.map((monastery, index) => (
            <div
              key={index}
              className={`monastery-item ${selectedMonastery === monastery ? 'selected' : ''}`}
              onClick={() => handleMonasterySelect(monastery)}
              onMouseEnter={() => setHoveredMonastery(monastery)}
              onMouseLeave={() => setHoveredMonastery(null)}
            >
              <strong>{monastery['Monastery Name']}</strong>
              <p>{monastery.Location}</p>
            </div>
          ))}
        </div>
        {googleMapsUrl && (
          <div className="fallback-link">
            <p>Could not find a route in the app.</p>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              View Route on Google Maps
            </a>
          </div>
        )}
        {selectedMonastery && !googleMapsUrl && (
          <div className="monastery-details">
            <h3>Details for {selectedMonastery['Monastery Name']}</h3>
            {routeInfo.distance && <p><strong>Distance:</strong> {routeInfo.distance}</p>}
            {routeInfo.duration && <p><strong>Duration:</strong> {routeInfo.duration}</p>}
            <p><strong>Founder:</strong> {selectedMonastery['Founder/Lineage']}</p>
            <p><strong>Established:</strong> {selectedMonastery['Year Established']}</p>
            <p><strong>History:</strong> {selectedMonastery['Historical Background']}</p>
          </div>
        )}
        {route && (
          <div className="top-right-panel">
            <div className="directions">
              <h3>Directions</h3>
              {route.legs.map((leg, legIndex) => (
                <div key={legIndex}>
                  <ol>
                    {(travelMode === 'TRANSIT'
                      ? getRailSteps(leg.steps)
                      : leg.steps
                    ).map((step, stepIndex) => (
                      <li
                        key={stepIndex}
                        dangerouslySetInnerHTML={{ __html: step.instructions }}
                        style={{
                          background: (step.travel_mode === 'TRANSIT' &&
                            step.transit && step.transit.line.vehicle &&
                            step.transit.line.vehicle.type.toUpperCase() === 'RAIL')
                            ? '#f0f8ff' : undefined,
                          fontWeight: (step.travel_mode === 'TRANSIT' &&
                            step.transit && step.transit.line.vehicle &&
                            step.transit.line.vehicle.type.toUpperCase() === 'RAIL')
                            ? 600 : 400
                        }}
                      />
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div ref={mapRef} className="map-container" style={{ height: "100vh", width: "100%" }} />
      {tracking && currentPosition && map && (
  <VehicleOverlayMarker map={map} position={currentPosition} />
)}
      {hoveredMonastery && (
        <div className="location-snackbar">
          {routeInfo.distance && <p><strong>Distance:</strong> {routeInfo.distance}</p>}
          {routeInfo.duration && <p><strong>Duration:</strong> {routeInfo.duration}</p>}
          <strong>{hoveredMonastery['Monastery Name']}</strong>
          <br />
          {hoveredMonastery['GPS Coordinates'] && (
            <span>GPS: {hoveredMonastery['GPS Coordinates']}</span>
          )}
          <br />
          {hoveredMonastery.Location}
        </div>
      )}
    </div>
  );
};

export default SingleMonasteryNavigation;

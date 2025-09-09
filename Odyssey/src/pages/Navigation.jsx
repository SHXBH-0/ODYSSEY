import React, { useState, useEffect, useRef } from 'react';
import './Navigation.css';

const parseCoordinates = (coordString) => {
    if (!coordString || typeof coordString !== 'string') return null;
    const parts = coordString.split(',');
    if (parts.length !== 2) return null;
    const latStr = parts[0];
    const lngStr = parts[1];
    const parsePart = (partStr) => {
        const cleaned = partStr.replace(/[^0-9.NSEWnsew]/g, '');
        const directionMatch = cleaned.match(/[NSEWnsew]/);
        if (!directionMatch) return NaN;
        const direction = directionMatch[0].toUpperCase();
        const numbers = cleaned.replace(/[NSEWnsew]/, '').split(/[^0-9.]+/).filter(Boolean).map(Number);
        let decimal = 0;
        if (numbers.length > 0) decimal += numbers[0];
        if (numbers.length > 1) decimal += numbers[1] / 60;
        if (numbers.length > 2) decimal += numbers[2] / 3600;
        if (direction === 'S' || direction === 'W') {
            decimal = -decimal;
        }
        return decimal;
    };
    const lat = parsePart(latStr);
    const lng = parsePart(lngStr);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
};

const SingleMonasteryNavigation = ({ monasteries }) => {
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [selectedMonastery, setSelectedMonastery] = useState(null);
  const [origin, setOrigin] = useState('');
  const [route, setRoute] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ distance: '', duration: '' });
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [locationError, setLocationError] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(''); // State for the fallback URL
  const mapRef = useRef(null);
  const originInputRef = useRef(null);

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

  const handleLocationError = (error) => {
    let message = "An unknown error occurred.";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Geolocation request denied. Please allow location access in your browser settings.";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information is currently unavailable. Please check your connection or try again later.";
        break;
      case error.TIMEOUT:
        message = "The request to get user location timed out.";
        break;
      default:
        message = "An unknown error occurred.";
        break;
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
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
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
    
    // Clear previous results
    directionsRenderer.setDirections({ routes: [] });
    setRoute(null);
    setRouteInfo({ distance: '', duration: '' });
    setGoogleMapsUrl('');


    directionsService.route(
      {
        origin: startPoint,
        destination: destination,
        travelMode: window.google.maps.TravelMode[travelMode],
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
          // ** NEW: Generate Google Maps URL as a fallback **
          const originQuery = typeof startPoint === 'string' ? startPoint : `${startPoint.lat},${startPoint.lng}`;
          const destQuery = `${destination.lat},${destination.lng}`;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originQuery)}&destination=${encodeURIComponent(destQuery)}&travelmode=${travelMode.toLowerCase()}`;
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
    }, [travelMode]);


  return (
    <div className="navigation-container">
      <div className="sidebar">
        <h2>Monastery Navigation</h2>
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
                <option value="TRANSIT">Transit</option>
                <option value="WALKING">Walking</option>
                <option value="BICYCLING">Bicycling</option>
            </select>
        </div>

        <div className="monastery-list">
          {monasteries.map((monastery, index) => (
            <div
              key={index}
              className={`monastery-item ${selectedMonastery === monastery ? 'selected' : ''}`}
              onClick={() => handleMonasterySelect(monastery)}
            >
              <strong>{monastery['Monastery Name']}</strong>
              <p>{monastery.Location}</p>
            </div>
          ))}
        </div>
        
        {/* ** NEW: Display the Google Maps link if it exists ** */}
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
          <div className="directions">
            <h3>Directions</h3>
            {route.legs.map((leg, legIndex) => (
              <div key={legIndex}>
                <ol>
                  {leg.steps.map((step, stepIndex) => (
                    <li key={stepIndex} dangerouslySetInnerHTML={{ __html: step.instructions }} />
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>
      <div ref={mapRef} className="map-container" />
    </div>
  );
};

export default SingleMonasteryNavigation;
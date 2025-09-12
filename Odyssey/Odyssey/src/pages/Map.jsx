import React, { useEffect, useRef } from 'react';

const Map = ({ monasteries }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 27.5, lng: 88.5 },
        zoom: 9,
      });

      monasteries.forEach((monastery) => {
        const [lat, lng] = monastery['GPS Coordinates']
          .split(',')
          .map(coord => parseFloat(coord.replace(/[^0-9.-]/g, '')));
          
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map,
            title: monastery['Monastery Name'],
          });

          const infowindow = new window.google.maps.InfoWindow({
            content: `<h3>${monastery['Monastery Name']}</h3><p>${monastery.Location}</p>`,
          });

          marker.addListener('click', () => {
            infowindow.open(map, marker);
          });
        }
      });
    }
  }, [monasteries]);

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default Map;
import React, { useEffect, useRef } from 'react';

function VehicleOverlayMarker({ map, position }) {
  const overlayRef = useRef();

  useEffect(() => {
    if (!map || !window.google || !position) return;
    const Overlay = function() {};
    Overlay.prototype = new window.google.maps.OverlayView();
    Overlay.prototype.onAdd = function() {
      const div = document.createElement("div");
      div.className = "vehicle-marker-animated";
      div.innerHTML = `
        <div class="glow"></div>
        <svg class="car" viewBox="0 0 30 30">
          <rect x="8" y="13" width="14" height="7" rx="2.5" fill="#2196f3" />
          <circle cx="10" cy="23" r="2.5" fill="#37474f" />
          <circle cx="20" cy="23" r="2.5" fill="#37474f" />
          <rect x="11.5" y="15" width="7" height="4" rx="2" fill="white"/>
        </svg>
      `;
      this.div = div;
      const panes = this.getPanes();
      panes && panes.overlayMouseTarget.appendChild(div);
    };
    Overlay.prototype.draw = function() {
      const projection = this.getProjection();
      const point = projection.fromLatLngToDivPixel(
        new window.google.maps.LatLng(position.lat, position.lng)
      );
      if (this.div && point) {
        this.div.style.left = point.x + 'px';
        this.div.style.top = point.y + 'px';
        this.div.style.position = 'absolute';
      }
    };
    Overlay.prototype.onRemove = function() {
      this.div && this.div.parentNode.removeChild(this.div);
      this.div = null;
    };
    const overlay = new Overlay();
    overlay.setMap(map);
    overlayRef.current = overlay;
    return () => overlay.setMap(null);
  }, [map, position]);
  
  return null;
}

export default VehicleOverlayMarker;

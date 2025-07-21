import { useEffect, useState } from "react";
import { FiMapPin, FiAlertCircle } from "react-icons/fi";

const MapComponent = ({ location, onLocationChange }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if Google Maps is available
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
    } else {
      console.warn("Google Maps API not loaded");
      setError("Google Maps not available");
      return;
    }

    if (!location || !location.lat || !location.lng) {
      console.log("Invalid location:", location);
      return;
    }

    // Use a timeout to ensure DOM element is available
    const timeoutId = setTimeout(() => {
      const mapElement = document.getElementById("map");
      if (!mapElement) {
        console.warn("Map element not found");
        setError("Map container not available");
        return;
      }

    try {
      const google = window.google;
      const mapInstance = new google.maps.Map(mapElement, {
        zoom: 15,
        center: location,
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }],
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#f2f2f2" }],
          },
        ],
      });

      const markerInstance = new google.maps.Marker({
        position: location,
        map: mapInstance,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });

      // Create search box
      const input = document.createElement("input");
      input.className = "map-search-box";
      input.placeholder = "Search for a location...";
      input.style.cssText = `
        box-sizing: border-box;
        border: 1px solid transparent;
        width: 240px;
        height: 40px;
        padding: 0 12px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        font-size: 14px;
        outline: none;
        text-overflow: ellipses;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 10px;
        background-color: white;
      `;

      mapInstance.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
      const searchBoxInstance = new google.maps.places.SearchBox(input);

      // Listen for search box events
      searchBoxInstance.addListener("places_changed", () => {
        const places = searchBoxInstance.getPlaces();

        if (places.length === 0) return;

        const place = places[0];
        if (!place.geometry || !place.geometry.location) return;

        // Update map and marker
        mapInstance.setCenter(place.geometry.location);
        markerInstance.setPosition(place.geometry.location);

        // Notify parent component
        onLocationChange({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setSearchBox(searchBoxInstance);

      // Listen for marker drag events
      google.maps.event.addListener(markerInstance, "dragend", () => {
        const position = markerInstance.getPosition();
        onLocationChange({ lat: position.lat(), lng: position.lng() });
      });

      // Listen for map click events
      mapInstance.addListener("click", (e) => {
        markerInstance.setPosition(e.latLng);
        onLocationChange({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
      });

      // Bias the SearchBox results towards current map's viewport
      mapInstance.addListener("bounds_changed", () => {
        searchBoxInstance.setBounds(mapInstance.getBounds());
      });

    } catch (mapError) {
      console.error("Failed to initialize Google Maps:", mapError);
      setError("Failed to load map. Please refresh the page.");
      return;
    }
    }, 100); // Wait 100ms for DOM to render

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location, onLocationChange]);

  // Fallback UI when Google Maps is not available
  if (error || !isGoogleMapsLoaded) {
    return (
      <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Map Preview Unavailable</h3>
          <p className="text-gray-500 mb-4">
            {error || "Google Maps is not available at the moment"}
          </p>
          {location && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <FiMapPin className="w-4 h-4" />
              <span>Location: {location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      id="map"
      className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
    ></div>
  );
};

export default MapComponent;

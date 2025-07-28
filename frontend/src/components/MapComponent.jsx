import { useEffect, useState } from "react";
import { FiMapPin, FiAlertCircle, FiStar, FiClock } from "react-icons/fi";

const MapComponent = ({ location, onLocationChange, gyms = [] }) => {
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [gymMarkers, setGymMarkers] = useState([]);
  const [searchBox, setSearchBox] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

  // Update map center and user marker when location changes
  useEffect(() => {
    if (map && userMarker && location && location.lat && location.lng) {
      const newPosition = { lat: location.lat, lng: location.lng };
      map.setCenter(newPosition);
      userMarker.setPosition(newPosition);
      console.log('Map updated to new location:', newPosition);
    }
  }, [location, map, userMarker]);

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
          zoom: 12,
          center: location,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ color: "#1a1a1a" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#000000" }, { lightness: 13 }]
            },
            {
              featureType: "administrative",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }]
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }]
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#08304b" }]
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#0c4152" }, { lightness: 5 }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#0b434f" }, { lightness: 25 }]
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }]
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.stroke",
              stylers: [{ color: "#0b3d51" }, { lightness: 16 }]
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#000000" }]
            },
            {
              featureType: "transit",
              elementType: "all",
              stylers: [{ color: "#146474" }]
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#021019" }]
            }
          ],
        });

        // Create user location marker (draggable)
        const userMarkerInstance = new google.maps.Marker({
          position: location,
          map: mapInstance,
          draggable: true,
          animation: google.maps.Animation.DROP,
          title: "Your Location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#8b5cf6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 8
          }
        });

        // Create info window
        const infoWindowInstance = new google.maps.InfoWindow();

        // Create search box
        const input = document.createElement("input");
        input.className = "map-search-box";
        input.placeholder = "Search for a location...";
        input.style.cssText = `
          box-sizing: border-box;
          border: 1px solid #374151;
          width: 280px;
          height: 40px;
          padding: 0 12px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          font-size: 14px;
          outline: none;
          text-overflow: ellipses;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 10px;
          background-color: #1f2937;
          color: white;
        `;

        mapInstance.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
        const searchBoxInstance = new google.maps.places.SearchBox(input);

        // Listen for search box events
        searchBoxInstance.addListener("places_changed", () => {
          const places = searchBoxInstance.getPlaces();

          if (places.length === 0) return;

          const place = places[0];
          if (!place.geometry || !place.geometry.location) return;

          // Update map and user marker
          mapInstance.setCenter(place.geometry.location);
          userMarkerInstance.setPosition(place.geometry.location);

          // Notify parent component
          onLocationChange({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        });

        setMap(mapInstance);
        setUserMarker(userMarkerInstance);
        setSearchBox(searchBoxInstance);
        setInfoWindow(infoWindowInstance);

        // Listen for user marker drag events
        google.maps.event.addListener(userMarkerInstance, "dragend", () => {
          const position = userMarkerInstance.getPosition();
          onLocationChange({ lat: position.lat(), lng: position.lng() });
        });

        // Listen for map click events
        mapInstance.addListener("click", (e) => {
          userMarkerInstance.setPosition(e.latLng);
          onLocationChange({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
          infoWindowInstance.close();
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

  // Update gym markers when gyms prop changes
  useEffect(() => {
    if (!map || !window.google || !gyms.length) return;

    // Clear existing gym markers
    gymMarkers.forEach(marker => marker.setMap(null));

    // Create new gym markers
    const newGymMarkers = gyms.map(gym => {
      if (!gym.location?.coordinates || gym.location.coordinates.length !== 2) {
        return null;
      }

      const [lng, lat] = gym.location.coordinates;
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: gym.gymName,
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          fillColor: gym.status === 'approved' ? '#10b981' : gym.status === 'pending' ? '#f59e0b' : '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 6,
          rotation: 180
        }
      });

      // Create info window content
      const formatOperatingHours = (operatingHours) => {
        if (!operatingHours) return "Hours not specified";
        
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const todayHours = operatingHours[today];
        
        if (todayHours?.closed) return "Closed today";
        if (todayHours?.open && todayHours?.close) {
          return `${todayHours.open} - ${todayHours.close}`;
        }
        return "Hours not specified";
      };

      const infoContent = `
        <div style="padding: 12px; max-width: 300px; font-family: system-ui;">
          <div style="margin-bottom: 8px;">
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              ${gym.gymName}
            </h3>
            <div style="display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 12px; margin-bottom: 4px;">
              <span>📍</span>
              <span>${gym.address?.city || 'Location'}, ${gym.address?.state || ''}</span>
            </div>
            ${gym.rating?.average ? `
              <div style="display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 12px;">
                <span>⭐</span>
                <span>${gym.rating.average.toFixed(1)} (${gym.rating.totalReviews || 0} reviews)</span>
              </div>
            ` : ''}
          </div>
          
          <div style="margin-bottom: 8px;">
            <div style="color: #374151; font-size: 13px; margin-bottom: 4px;">
              <span style="color: #6b7280;">🕒</span> ${formatOperatingHours(gym.operatingHours)}
            </div>
            <div style="color: #374151; font-size: 13px;">
              <span style="color: #6b7280;">👥</span> Capacity: ${gym.capacity} members
            </div>
          </div>

          ${gym.facilities && gym.facilities.length > 0 ? `
            <div style="margin-bottom: 8px;">
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Facilities:</div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${gym.facilities.slice(0, 3).map(facility => 
                  `<span style="background: #ddd6fe; color: #5b21b6; padding: 2px 6px; border-radius: 12px; font-size: 10px;">${facility}</span>`
                ).join('')}
                ${gym.facilities.length > 3 ? `<span style="color: #6b7280; font-size: 10px;">+${gym.facilities.length - 3} more</span>` : ''}
              </div>
            </div>
          ` : ''}

          <div style="margin-top: 8px;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; 
              ${gym.status === 'approved' ? 'background: #dcfce7; color: #166534;' : 
                gym.status === 'pending' ? 'background: #fef3c7; color: #92400e;' : 
                'background: #fee2e2; color: #991b1b;'}">
              ${gym.status.charAt(0).toUpperCase() + gym.status.slice(1)}
            </span>
          </div>
        </div>
      `;

      // Add click listener to marker
      marker.addListener('click', () => {
        infoWindow.setContent(infoContent);
        infoWindow.open(map, marker);
      });

      return marker;
    }).filter(Boolean);

    setGymMarkers(newGymMarkers);

    // Auto-fit bounds to show all gyms if there are any
    if (newGymMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      
      // Add user location to bounds
      bounds.extend(location);
      
      // Add all gym locations to bounds
      newGymMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      
      map.fitBounds(bounds);
      
      // Set a maximum zoom level
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 15) map.setZoom(15);
        window.google.maps.event.removeListener(listener);
      });
    }

  }, [map, gyms, infoWindow, location]);

  // Fallback UI when Google Maps is not available
  if (error || !isGoogleMapsLoaded) {
    return (
      <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
        <div className="text-center p-8">
          <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Map Preview Unavailable</h3>
          <p className="text-gray-400 mb-4">
            {error || "Google Maps is not available at the moment"}
          </p>
          {location && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <FiMapPin className="w-4 h-4" />
              <span>Location: {location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}</span>
            </div>
          )}
          {gyms.length > 0 && (
            <div className="mt-4 text-sm text-gray-400">
              <span>{gyms.length} gyms available to view</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        id="map"
        className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
      ></div>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
        <div className="font-medium mb-2">Map Legend</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-violet-500 border border-white"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 border border-white" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
            <span>Approved Gyms</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 border border-white" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
            <span>Pending Gyms</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 border border-white" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
            <span>Rejected Gyms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
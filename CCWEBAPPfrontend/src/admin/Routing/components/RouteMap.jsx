import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

// Map styling
const mapContainerStyle = {
  width: '49%',
  height: '600px',
};

// Container for both maps
const dualMapContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  height: '600px',
};

// Default center (Delhi coordinates)
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
};

// Fallback coordinates for failed geocoding
const fallbackCoords = {
  lat: 28.6139,
  lng: 77.2090,
};

// Map Legend Component
const MapLegend = ({ selectedRoutePacket }) => (
  <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md z-10">
    <h3 className="text-sm font-semibold mb-2">Map Legend</h3>
    <div className="space-y-2">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
        <span className="text-xs">Pickup Location</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
        <span className="text-xs">Drop Location</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-purple-600 rounded-full mr-2"></div>
        <span className="text-xs">In Saved Route</span>
      </div>
      {selectedRoutePacket && (
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: selectedRoutePacket.color }}></div>
          <span className="text-xs">Selected Route</span>
        </div>
      )}
    </div>
  </div>
);

// Route Packet Modal (for viewing saved route packets)
const RoutePacketModal = ({ routePacket, onClose }) => {
  if (!routePacket) return null;

  // Function to shorten addresses
  const shortenAddress = (address) => {
    if (!address) return 'N/A';
    const parts = address.split(', ');
    if (parts.length > 2) {
      return `${parts[0]}, ${parts[parts.length - 3]}`; // e.g., "Swarn Nagari, Greater Noida"
    }
    return address;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50 border border-gray-200">
      <h2 className="text-xl font-bold text-blue-600 mb-4">{routePacket.name}</h2>
      <p><strong>Total Distance:</strong> {routePacket.routeDetails.totalDistance}</p>
      <p><strong>Total Time:</strong> {routePacket.routeDetails.totalTime}</p>
      <h3 className="text-lg font-semibold mt-4">Passengers:</h3>
      {routePacket.passengers && routePacket.passengers.length > 0 ? (
        <ul className="list-disc pl-5 mt-2">
          {routePacket.passengers.map((p) => (
            <li key={p._id}>
              {p.name || 'Unknown'} (Pickup: {shortenAddress(p.pickupLocation)}, Drop: {shortenAddress(p.dropLocation)})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No passengers found.</p>
      )}
      <button
        onClick={onClose}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Close
      </button>
    </div>
  );
};

// Passenger Selection Modal
const PassengerModal = ({ user, routeData, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-600">{user.name}'s Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Pickup:</strong> {user.pickupLocation}</p>
        <p><strong>Drop:</strong> {user.dropLocation}</p>
        {routeData && (
          <>
            <p><strong>Distance:</strong> {routeData.routes[0].legs[0].distance.text}</p>
            <p><strong>Estimated Time:</strong> {routeData.routes[0].legs[0].duration.text}</p>
          </>
        )}
      </div>
    </div>
  );
};

// Add new PassengerConfirmModal component after PassengerModal
const PassengerConfirmModal = ({ user, routeData, onClose, onConfirm }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-600">Add {user.name} to Route?</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Pickup:</strong> {user.pickupLocation}</p>
        <p><strong>Drop:</strong> {user.dropLocation}</p>
        {routeData && (
          <>
            <p><strong>Distance:</strong> {routeData.routes[0].legs[0].distance.text}</p>
            <p><strong>Estimated Time:</strong> {routeData.routes[0].legs[0].duration.text}</p>
          </>
        )}
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add to Route
        </button>
      </div>
    </div>
  );
};

const RouteMap = ({
  users,
  routePackets,
  selectedRoutePacket,
  isCreatingRoutePacket,
  routePacketPassengers,
  setRoutePacketPassengers,
  passengersInRoutes,
  onCreateRoutePacket,
  setIsCreatingRoutePacket,
  directions,
  setDirections
}) => {
  const [locationCoords, setLocationCoords] = useState({});
  const [, setMapLoaded] = useState(false);
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [loadingGeocode, setLoadingGeocode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [hoveredMarkerKey, setHoveredMarkerKey] = useState(null);
  const [showRoutePacketModal, setShowRoutePacketModal] = useState(false);
  const [vehicleType, setVehicleType] = useState(null);
  const [routePacketName, setRoutePacketName] = useState('');
  const [leftMapDirections, setLeftMapDirections] = useState(null);
  const [rightMapDirections, setRightMapDirections] = useState(null);
  const [showHidePassengers, setShowHidePassengers] = useState(true);
  const [pendingUser, setPendingUser] = useState(null);
  const [routeDetails, setRouteDetails] = useState({
    totalDistance: 0,
    totalTime: 0,
    passengerDetails: []
  });

  // Effect for geocoding locations
  useEffect(() => {
    if (googleApiLoaded && users.length > 0) {
      setLoadingGeocode(true);
      const geocoder = new window.google.maps.Geocoder();
      const uniqueLocations = new Set(
        users.map((user) => user.pickupLocation).concat(users.map((user) => user.dropLocation))
      );

      const geocodePromises = Array.from(uniqueLocations).map(
        (location) =>
          new Promise((resolve) => {
            geocoder.geocode({ address: location }, (results, status) => {
              if (status === 'OK') {
                resolve({
                  location,
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng(),
                });
              } else {
                console.warn(`Geocoding failed for ${location}: ${status}`);
                resolve({
                  location,
                  lat: fallbackCoords.lat,
                  lng: fallbackCoords.lng,
                });
              }
            });
          })
      );

      Promise.all(geocodePromises).then((results) => {
        const coordsMap = {};
        results.forEach((result) => {
          if (result) {
            coordsMap[result.location] = { lat: result.lat, lng: result.lng };
          }
        });
        setLocationCoords(coordsMap);
        setLoadingGeocode(false);
      });
    }
  }, [googleApiLoaded, users]);

  // Effect for calculating route details
  useEffect(() => {
    if (routePacketPassengers.length > 0 && googleApiLoaded && isCreatingRoutePacket) {
      const directionsService = new window.google.maps.DirectionsService();
      
      // Create sequential waypoints
      const waypointsData = [];
      
      // Add pickup points first
      routePacketPassengers.forEach(p => {
        waypointsData.push({ 
          location: locationCoords[p.pickupLocation], 
          type: 'pickup', 
          userId: p._id,
          name: p.name
        });
      });
      
      // Then add drop points
      routePacketPassengers.forEach(p => {
        waypointsData.push({ 
          location: locationCoords[p.dropLocation], 
          type: 'drop', 
          userId: p._id,
          name: p.name
        });
      });

      if (waypointsData.length < 2) return;

      const origin = waypointsData[0].location;
      const destination = waypointsData[waypointsData.length - 1].location;
      const intermediateWaypoints = waypointsData.slice(1, -1).map((wp) => ({
        location: wp.location,
        stopover: true,
      }));

      directionsService.route(
        {
          origin,
          destination,
          waypoints: intermediateWaypoints,
          optimizeWaypoints: false,
          travelMode: 'DRIVING',
        },
        (result, status) => {
          if (status === 'OK') {
            setRightMapDirections(result);
            
            // Calculate detailed route information
            const legs = result.routes[0].legs;
            const passengerDetails = routePacketPassengers.map((passenger, index) => {
              const pickupLeg = legs[index * 2];
              const dropLeg = legs[index * 2 + 1];
              
              return {
                passengerId: passenger._id,
                name: passenger.name,
                pickupDistance: pickupLeg.distance.value,
                dropDistance: dropLeg.distance.value,
                pickupTime: pickupLeg.duration.value,
                dropTime: dropLeg.duration.value,
                totalDistance: pickupLeg.distance.value + dropLeg.distance.value,
                totalTime: pickupLeg.duration.value + dropLeg.duration.value
              };
            });

            const totalDistance = legs.reduce((sum, leg) => sum + leg.distance.value, 0);
            const totalTime = legs.reduce((sum, leg) => sum + leg.duration.value, 0);

            setRouteDetails({
              totalDistance,
              totalTime,
              passengerDetails
            });
          } else {
            console.error('Route calculation failed:', status);
          }
        }
      );
    }
  }, [routePacketPassengers, googleApiLoaded, isCreatingRoutePacket, locationCoords]);

  // Effect for handling selected route packet
  useEffect(() => {
    if (selectedRoutePacket && googleApiLoaded && !isCreatingRoutePacket) {
      const directionsService = new window.google.maps.DirectionsService();
      
      const waypointsData = [];
      
      selectedRoutePacket.passengers.forEach((p) => {
        const pickupCoord = locationCoords[p.pickupLocation];
        if (pickupCoord) {
          waypointsData.push({
            location: pickupCoord,
            stopover: true
          });
        }
      });
      
      selectedRoutePacket.passengers.forEach((p) => {
        const dropCoord = locationCoords[p.dropLocation];
        if (dropCoord) {
          waypointsData.push({
            location: dropCoord,
            stopover: true
          });
        }
      });

      if (waypointsData.length >= 2) {
        directionsService.route(
          {
            origin: waypointsData[0].location,
            destination: waypointsData[waypointsData.length - 1].location,
            waypoints: waypointsData.slice(1, -1),
            optimizeWaypoints: false,
            travelMode: 'DRIVING',
          },
          (result, status) => {
            if (status === 'OK') {
              setRightMapDirections(result);
            } else {
              console.error('Failed to calculate route for selected packet:', status);
              setRightMapDirections(null);
            }
          }
        );
      }
    } else if (!selectedRoutePacket) {
      setRightMapDirections(null);
    }
  }, [selectedRoutePacket, googleApiLoaded, isCreatingRoutePacket, locationCoords]);

  // Update the table to use routeDetails
  const renderPassengerDetails = (passenger, index) => {
    const passengerDetail = routeDetails.passengerDetails[index];
    
    return (
      <tr key={passenger._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
              {String.fromCharCode(65 + index)}
            </span>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{passenger.name}</div>
              <div className="text-sm text-gray-500">{passenger.phone}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{passenger.pickupLocation.split(',')[0]}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{passenger.dropLocation.split(',')[0]}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {passengerDetail ? `${(passengerDetail.totalDistance / 1000).toFixed(1)} km` : 'Calculating...'}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {passengerDetail ? `${Math.round(passengerDetail.totalTime / 60)} mins` : 'Calculating...'}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex space-x-2">
            {index > 0 && (
              <button 
                onClick={() => movePassenger(index, 'up')}
                className="text-blue-600 hover:text-blue-900"
                title="Move Up"
              >
                ↑
              </button>
            )}
            {index < routePacketPassengers.length - 1 && (
              <button 
                onClick={() => movePassenger(index, 'down')}
                className="text-blue-600 hover:text-blue-900"
                title="Move Down"
              >
                ↓
              </button>
            )}
            <button 
              onClick={() => {
                const newPassengers = [...routePacketPassengers];
                newPassengers.splice(index, 1);
                setRoutePacketPassengers(newPassengers);
              }}
              className="text-red-600 hover:text-red-900"
              title="Remove"
            >
              ×
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // Update the route on the right map
  const updateRightMapRoute = () => {
    if (routePacketPassengers.length < 1 || !googleApiLoaded) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    // Create a sequential route that goes from first pickup to first drop, then second pickup to second drop, etc.
    const waypointsData = [];
    
    // Add pickup points first, then drop points to create a sequential route
    routePacketPassengers.forEach(p => {
      waypointsData.push({ 
        location: locationCoords[p.pickupLocation], 
        type: 'pickup', 
        userId: p._id,
        name: p.name
      });
    });
    
    routePacketPassengers.forEach(p => {
      waypointsData.push({ 
        location: locationCoords[p.dropLocation], 
        type: 'drop', 
        userId: p._id,
        name: p.name
      });
    });

    if (waypointsData.length < 2) return;

    const origin = waypointsData[0].location;
    const destination = waypointsData[waypointsData.length - 1].location;
    const intermediateWaypoints = waypointsData.slice(1, -1).map((wp) => ({
      location: wp.location,
      stopover: true,
    }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints: intermediateWaypoints,
        optimizeWaypoints: false, // Don't optimize to keep the sequence
        travelMode: 'DRIVING',
      },
      (result, status) => {
        if (status === 'OK') {
          setRightMapDirections(result);
          
          // Calculate total distance and time
          const totalDistance = result.routes[0].legs.reduce(
            (sum, leg) => sum + leg.distance.value, 0
          );
          const totalTime = result.routes[0].legs.reduce(
            (sum, leg) => sum + leg.duration.value, 0
          );
          
          console.log(`Route: ${(totalDistance / 1000).toFixed(1)} km, ${Math.round(totalTime / 60)} mins`);
        } else {
          console.error('Route calculation failed:', status);
        }
      }
    );
  };

  // Handle vehicle type selection
  const handleVehicleSelect = (type) => {
    setVehicleType(type);
    setRoutePacketPassengers([]);
    setRightMapDirections(null);
  };

  // Update the left map click handler to show individual routes
  const handleLeftMapMarkerClick = (user, type) => {
    if (!googleApiLoaded) {
      console.error('Google Maps API not loaded yet.');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    // Calculate and show the individual route
    directionsService.route(
      {
        origin: locationCoords[user.pickupLocation],
        destination: locationCoords[user.dropLocation],
        travelMode: 'DRIVING',
      },
      (result, status) => {
        if (status === 'OK') {
          setRouteData(result);
          setLeftMapDirections(result);
          
          // If we're in route creation mode, show confirmation modal
          if (isCreatingRoutePacket && vehicleType) {
            const maxPassengers = vehicleType === '5-seater' ? 4 : 6;
            
            if (routePacketPassengers.length >= maxPassengers) {
              alert(`Maximum of ${maxPassengers} passengers allowed in a ${vehicleType}.`);
              return;
            }
            
            if (routePacketPassengers.some((p) => p._id === user._id)) {
              alert('This passenger is already in the route packet.');
              return;
            }

            setPendingUser({ ...user, markerType: type });
          } else {
            // Just show passenger details
            setSelectedUser({ ...user, markerType: type });
          }
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  // Add confirmation handler
  const handleConfirmPassenger = () => {
    if (!pendingUser) return;

    // Add the passenger to the route
    setRoutePacketPassengers(prev => [...prev, pendingUser]);

    // Clear pending user
    setPendingUser(null);

    // Update right map route after a short delay
    setTimeout(updateRightMapRoute, 100);
  };

  // Update the marker icon logic
  const getMarkerIcon = (userId, type) => {
    const isHovered = hoveredMarkerKey === `${userId}-${type}`;
    const scale = isHovered ? 10 : 8;

    // Check if the user is in the current route being created
    if (isCreatingRoutePacket && routePacketPassengers.some(p => p._id === userId)) {
      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#4285F4', // Blue for current route
        fillOpacity: type === 'pickup' ? 1 : 0.7,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
        scale: scale,
      };
    }

    // Check if the user is in any saved route packet
    if (passengersInRoutes.has(userId)) {
      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#9333EA', // Purple color for passengers in routes
        fillOpacity: type === 'pickup' ? 1 : 0.7,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
        scale: scale,
      };
    }

    // Default colors for unrouted passengers
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: type === 'pickup' ? '#22C55E' : '#EF4444', // Green for pickup, Red for drop
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#FFFFFF',
      scale: scale,
    };
  };

  // First pickup location for map center
  const firstPickupCoord = users[0] && locationCoords[users[0].pickupLocation];
  const center = firstPickupCoord || defaultCenter;

  // Update the pickup markers logic
  const pickupMarkers = users.map((user) => {
    const coord = locationCoords[user.pickupLocation];
    if (!coord) return null;

    // Show marker if:
    // 1. User is in the current route being created OR
    // 2. showHidePassengers is true OR
    // 3. User is not in any route
    const isInCurrentRoute = isCreatingRoutePacket && routePacketPassengers.some(p => p._id === user._id);
    const isInSavedRoute = passengersInRoutes.has(user._id);

    if (isInCurrentRoute || showHidePassengers || !isInSavedRoute) {
      return (
        <Marker
          key={`pickup-${user._id}`}
          position={coord}
          icon={getMarkerIcon(user._id, 'pickup')}
          onClick={() => handleLeftMapMarkerClick(user, 'pickup')}
          onMouseOver={() => setHoveredMarkerKey(`${user._id}-pickup`)}
          onMouseOut={() => setHoveredMarkerKey(null)}
          title={`${user.name} (Pickup)`}
        />
      );
    }
    return null;
  }).filter(Boolean);

  // Update the drop markers logic
  const dropMarkers = users.map((user) => {
    const coord = locationCoords[user.dropLocation];
    if (!coord) return null;

    // Show marker if:
    // 1. User is in the current route being created OR
    // 2. showHidePassengers is true OR
    // 3. User is not in any route
    const isInCurrentRoute = isCreatingRoutePacket && routePacketPassengers.some(p => p._id === user._id);
    const isInSavedRoute = passengersInRoutes.has(user._id);

    if (isInCurrentRoute || showHidePassengers || !isInSavedRoute) {
      return (
        <Marker
          key={`drop-${user._id}`}
          position={coord}
          icon={getMarkerIcon(user._id, 'drop')}
          onClick={() => handleLeftMapMarkerClick(user, 'drop')}
          onMouseOver={() => setHoveredMarkerKey(`${user._id}-drop`)}
          onMouseOut={() => setHoveredMarkerKey(null)}
          title={`${user.name} (Drop)`}
        />
      );
    }
    return null;
  }).filter(Boolean);
  
  // Right map markers (only for selected passengers in route creation)
  const rightMapMarkers = routePacketPassengers.flatMap((passenger, index) => {
    const pickupCoord = locationCoords[passenger.pickupLocation];
    const dropCoord = locationCoords[passenger.dropLocation];
    const markers = [];
    
    // Use letters to identify sequence of passengers
    const passengerLetter = String.fromCharCode(65 + index); // A, B, C, D...
    
    if (pickupCoord) {
      markers.push(
        <Marker
          key={`right-pickup-${passenger._id}`}
          position={pickupCoord}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 8,
          }}
          label={{
            text: passengerLetter,
            color: '#FFFFFF',
            fontWeight: 'bold'
          }}
          title={`${passenger.name} (Pickup ${passengerLetter})`}
        />
      );
    }
    
    if (dropCoord) {
      markers.push(
        <Marker
          key={`right-drop-${passenger._id}`}
          position={dropCoord}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#EA4335',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 8,
          }}
          label={{
            text: passengerLetter,
            color: '#FFFFFF',
            fontWeight: 'bold'
          }}
          title={`${passenger.name} (Drop ${passengerLetter})`}
        />
      );
    }
    
    return markers;
  });

  // Handle route creation cancellation
  const handleCancelRouteCreation = () => {
    setVehicleType(null);
    setRoutePacketPassengers([]);
    setRightMapDirections(null);
    setRoutePacketName('');
    setIsCreatingRoutePacket(false);
  };

  // Update route on right map when passengers change
  useEffect(() => {
    if (isCreatingRoutePacket && routePacketPassengers.length > 0 && googleApiLoaded) {
      updateRightMapRoute();
    }
  }, [routePacketPassengers, isCreatingRoutePacket, googleApiLoaded]);

  // Toggle showing/hiding passengers in routes
  const togglePassengersVisibility = () => {
    setShowHidePassengers(!showHidePassengers);
  };

  // Save route with name
  const handleSaveRoute = () => {
    if (routePacketPassengers.length < 1) {
      alert('Please add at least one passenger to create a route packet.');
      return;
    }

    if (!routePacketName.trim()) {
      alert('Please enter a name for the route packet.');
      return;
    }

    if (!vehicleType) {
      alert('Please select a vehicle type.');
      return;
    }

    if (!googleApiLoaded) {
      console.error('Google Maps API not loaded yet.');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    
    // Create sequential waypoints - first all pickups in order, then all drops in order
    const waypointsData = [];
    
    // Add pickup points first
    routePacketPassengers.forEach((p, index) => {
      const pickupCoord = locationCoords[p.pickupLocation];
      waypointsData.push({ 
        lat: pickupCoord.lat,
        lng: pickupCoord.lng,
        type: 'pickup',
        userId: p._id,
        order: index
      });
    });
    
    // Then add drop points
    routePacketPassengers.forEach((p, index) => {
      const dropCoord = locationCoords[p.dropLocation];
      waypointsData.push({ 
        lat: dropCoord.lat,
        lng: dropCoord.lng,
        type: 'drop',
        userId: p._id,
        order: index
      });
    });

    const intermediateWaypoints = waypointsData.slice(1, -1).map((wp) => ({
      location: { lat: wp.lat, lng: wp.lng },
      stopover: true,
    }));

    directionsService.route(
      {
        origin: { lat: waypointsData[0].lat, lng: waypointsData[0].lng },
        destination: { lat: waypointsData[waypointsData.length - 1].lat, lng: waypointsData[waypointsData.length - 1].lng },
        waypoints: intermediateWaypoints,
        optimizeWaypoints: false,
        travelMode: 'DRIVING',
      },
      async (result, status) => {
        if (status === 'OK') {
          const route = result.routes[0];
          const totalDistance = route.legs.reduce((sum, leg) => sum + leg.distance.value, 0);
          const totalTime = route.legs.reduce((sum, leg) => sum + leg.duration.value, 0);

          // Create route packet data structure
          const routePacketData = {
            name: routePacketName,
            vehicleType: vehicleType,
            passengers: routePacketPassengers.map((p, idx) => ({
              userId: p._id,
              name: p.name,
              email: p.email,
              phone: p.phone,
              pickupLocation: p.pickupLocation,
              dropLocation: p.dropLocation,
              order: idx
            })),
            routeDetails: {
              totalDistance: `${(totalDistance / 1000).toFixed(1)} km`,
              totalTime: `${Math.round(totalTime / 60)} mins`,
              waypoints: waypointsData
            }
          };

          try {
            const response = await onCreateRoutePacket(routePacketData);
            if (response && response.data) {
              handleCancelRouteCreation();
              // Show success message
              const successMessage = document.createElement('div');
              successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
              successMessage.textContent = 'Route packet created successfully!';
              document.body.appendChild(successMessage);
              setTimeout(() => {
                document.body.removeChild(successMessage);
              }, 3000);
            } else {
              throw new Error('Failed to create route packet');
            }
          } catch (error) {
            console.error('Error creating route packet:', error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
            errorMessage.textContent = 'Failed to create route packet. Please try again.';
            document.body.appendChild(errorMessage);
            setTimeout(() => {
              document.body.removeChild(errorMessage);
            }, 3000);
          }
        } else {
          console.error('Route calculation failed:', status);
          const errorMessage = document.createElement('div');
          errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
          errorMessage.textContent = 'Failed to calculate route. Please try again.';
          document.body.appendChild(errorMessage);
          setTimeout(() => {
            document.body.removeChild(errorMessage);
          }, 3000);
        }
      }
    );
  };

  // Reorder passengers in the route
  const movePassenger = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === routePacketPassengers.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newPassengers = [...routePacketPassengers];
    [newPassengers[index], newPassengers[newIndex]] = [newPassengers[newIndex], newPassengers[index]];
    setRoutePacketPassengers(newPassengers);
    
    // Update the route after reordering
    setTimeout(updateRightMapRoute, 50);
  };

  return (
    <div className="mb-8 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">Route Planning Interface</h2>
        {!isCreatingRoutePacket && (
          <button
            onClick={() => {
              console.log('Create Route Packet button clicked');
              console.log('setIsCreatingRoutePacket type:', typeof setIsCreatingRoutePacket);
              if (typeof setIsCreatingRoutePacket === 'function') {
                setIsCreatingRoutePacket(true);
              } else {
                console.error('setIsCreatingRoutePacket is not a function:', setIsCreatingRoutePacket);
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Create Route Packet</span>
          </button>
        )}
      </div>
      
      {/* Route Creation Controls */}
      {isCreatingRoutePacket && (
        <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          {vehicleType === null ? (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Vehicle Type</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleVehicleSelect('5-seater')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>5-Seater (4 Passengers)</span>
                </button>
                <button
                  onClick={() => handleVehicleSelect('7-seater')}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>7-Seater (6 Passengers)</span>
                </button>
                <button
                  onClick={handleCancelRouteCreation}
                  className="sm:w-auto w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Creating {vehicleType} Route
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {routePacketPassengers.length} of {vehicleType === '5-seater' ? 4 : 6} Passengers
                  </span>
                  <button
                    onClick={handleCancelRouteCreation}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all duration-200 flex items-center space-x-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Cancel</span>
                  </button>
                </div>
              </div>

              {/* Instructions Card */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-blue-800 font-medium">Instructions:</p>
                    <p className="text-blue-600 text-sm mt-1">
                      {routePacketPassengers.length < (vehicleType === '5-seater' ? 4 : 6) ? 
                        `Click on passenger markers to add them to the route (${routePacketPassengers.length + 1}/${vehicleType === '5-seater' ? 4 : 6} passengers)` : 
                        'Route is complete! Enter a name and save it'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected Passengers List */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-3">Selected Passengers:</h4>
                {routePacketPassengers.length > 0 ? (
                  <div className="space-y-4">
                    {/* Detailed Route Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden bg-white">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {routePacketPassengers.map((p, index) => renderPassengerDetails(p, index))}
                        </tbody>
                        {rightMapDirections && (
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                Total:
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {(rightMapDirections.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1000).toFixed(1)} km
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {Math.round(rightMapDirections.routes[0].legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 60)} mins
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                    
                    {/* Total Route Summary */}
                    {rightMapDirections && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-800 mb-3">Route Summary</h5>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {(rightMapDirections.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1000).toFixed(1)}
                            </div>
                            <div className="text-sm text-blue-500">Total Distance (km)</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {Math.round(rightMapDirections.routes[0].legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 60)}
                            </div>
                            <div className="text-sm text-blue-500">Total Time (mins)</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {routePacketPassengers.length * 2}
                            </div>
                            <div className="text-sm text-blue-500">Number of Stops</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <p className="text-gray-500">Click on passenger markers to start creating the route</p>
                  </div>
                )}
              </div>

              {/* Route Saving Controls */}
              {routePacketPassengers.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={routePacketName}
                        onChange={(e) => setRoutePacketName(e.target.value)}
                        placeholder="Enter route name"
                        className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleSaveRoute}
                      disabled={!routePacketName.trim()}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-200 ${
                        routePacketName.trim()
                          ? 'bg-green-500 hover:bg-green-600 text-white transform hover:scale-105'
                          : 'bg-gray-300 cursor-not-allowed text-gray-500'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8.586 10l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Save Route</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Toggle for hiding/showing passengers in routes */}
      {routePackets.length > 0 && (
        <div className="mb-4">
          <button
            onClick={togglePassengersVisibility}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md ${
              showHidePassengers 
                ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-300'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${showHidePassengers ? 'text-purple-600' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
              {showHidePassengers ? (
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              ) : (
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              )}
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">
              {showHidePassengers ? 'Show All Passengers' : 'Hide Routed Passengers'}
            </span>
          </button>
        </div>
      )}
      
      <LoadScript
        googleMapsApiKey="AIzaSyCSRyWqB2x4mZvU6uOo96th1qQYBplCPVo" // Replace with your actual API key
        onLoad={() => {
          setMapLoaded(true);
          setGoogleApiLoaded(true);
        }}
        onError={(err) => {
          console.error('Failed to load Google Maps API:', err);
        }}
      >
        {loadingGeocode ? (
          <div className="text-center text-gray-500">Loading map...</div>
        ) : (
          <div style={dualMapContainerStyle}>
            {/* Left Map - All Passengers */}
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
              {leftMapDirections && !selectedRoutePacket && (
                <DirectionsRenderer
                  directions={leftMapDirections}
                  options={{
                    polylineOptions: {
                      strokeColor: '#0000FF',
                      strokeWeight: 5,
                    },
                  }}
                />
              )}
              {pickupMarkers}
              {dropMarkers}
              <MapLegend selectedRoutePacket={selectedRoutePacket} />
            </GoogleMap>
            
            {/* Right Map - Route Creation or Selected Route */}
            <div style={mapContainerStyle}>
              {isCreatingRoutePacket ? (
                <GoogleMap mapContainerStyle={{width: '100%', height: '100%'}} center={center} zoom={10}>
                  {rightMapDirections && (
                    <DirectionsRenderer
                      directions={rightMapDirections}
                      options={{
                        polylineOptions: {
                          strokeColor: '#4285F4',
                          strokeWeight: 5,
                        },
                      }}
                    />
                  )}
                  {rightMapMarkers}
                </GoogleMap>
              ) : selectedRoutePacket ? (
                <div className="relative w-full h-full">
                  <GoogleMap mapContainerStyle={{width: '100%', height: '100%'}} center={center} zoom={10}>
                    {rightMapDirections && (
                      <DirectionsRenderer
                        directions={rightMapDirections}
                        options={{
                          polylineOptions: {
                            strokeColor: selectedRoutePacket.color || '#4285F4',
                            strokeWeight: 5,
                          },
                        }}
                      />
                    )}
                    {selectedRoutePacket.passengers.map((passenger, index) => {
                      const pickupCoord = locationCoords[passenger.pickupLocation];
                      const dropCoord = locationCoords[passenger.dropLocation];
                      const markers = [];
                      const passengerLetter = String.fromCharCode(65 + index);

                      if (pickupCoord) {
                        markers.push(
                          <Marker
                            key={`selected-pickup-${passenger.userId}`}
                            position={pickupCoord}
                            icon={{
                              path: window.google.maps.SymbolPath.CIRCLE,
                              fillColor: selectedRoutePacket.color || '#4285F4',
                              fillOpacity: 1,
                              strokeWeight: 2,
                              strokeColor: '#FFFFFF',
                              scale: 8,
                            }}
                            label={{
                              text: passengerLetter,
                              color: '#FFFFFF',
                              fontWeight: 'bold'
                            }}
                          />
                        );
                      }

                      if (dropCoord) {
                        markers.push(
                          <Marker
                            key={`selected-drop-${passenger.userId}`}
                            position={dropCoord}
                            icon={{
                              path: window.google.maps.SymbolPath.CIRCLE,
                              fillColor: selectedRoutePacket.color || '#4285F4',
                              fillOpacity: 0.7,
                              strokeWeight: 2,
                              strokeColor: '#FFFFFF',
                              scale: 8,
                            }}
                            label={{
                              text: passengerLetter,
                              color: '#FFFFFF',
                              fontWeight: 'bold'
                            }}
                          />
                        );
                      }

                      return markers;
                    })}
                  </GoogleMap>
                  {/* Route details overlay */}
                  <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md max-w-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{selectedRoutePacket.name}</h3>
                      <span className="text-sm font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {selectedRoutePacket.vehicleType}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        {selectedRoutePacket.passengers.length} Passengers
                      </p>
                      <p className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {selectedRoutePacket.routeDetails.totalDistance}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {selectedRoutePacket.routeDetails.totalTime}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500 text-center">Select a route packet or create a new route to see it here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </LoadScript>
      
      {/* Modals */}
      {selectedUser && !isCreatingRoutePacket && (
        <PassengerModal
          user={selectedUser}
          routeData={routeData}
          onClose={() => {
            setSelectedUser(null);
            setRouteData(null);
          }}
        />
      )}

      {pendingUser && isCreatingRoutePacket && (
        <PassengerConfirmModal
          user={pendingUser}
          routeData={routeData}
          onClose={() => {
            setPendingUser(null);
          }}
          onConfirm={() => {
            handleConfirmPassenger();
          }}
        />
      )}
      
      {selectedRoutePacket && showRoutePacketModal && (
        <RoutePacketModal
          routePacket={selectedRoutePacket}
          onClose={() => {
            setShowRoutePacketModal(false);
          }}
        />
      )}
    </div>
  );
};

export default RouteMap;
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import UserStatusService from '../../../services/operations/userStatusService';
import { useSelector } from 'react-redux';

const mapContainerStyle = {
  width: '49%',
  height: '600px',
  minHeight: '400px',
};

const dualMapContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: '1rem',
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
}; 

const mapStyle = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
  { featureType: "landscape", elementType: "all", stylers: [{ visibility: "simplified" }] },
  { featureType: "road", elementType: "all", stylers: [{ visibility: "simplified" }] },
  { featureType: "administrative", elementType: "all", stylers: [{ visibility: "off" }] },
];

// Memoized MapLegend component
const MapLegend = memo(() => (
  <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md z-10">
    <h3 className="text-sm font-semibold mb-2">Map Legend</h3>
    <div className="space-y-2">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-500 rounded-full mr-2" />
        <span className="text-xs">Home Location</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-red-500 rounded-full mr-2" />
        <span className="text-xs">Work Location</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
        <span className="text-xs">Selected Route</span>
      </div>
    </div>
  </div>
));

// Memoized Marker component
const UserMarker = memo(({ position, icon, onClick, onMouseOver, onMouseOut, title }) => (
  <Marker
    position={position}
    icon={icon}
    onClick={onClick}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    title={title}
  />
));

// Selected Users Panel Component
const SelectedUsersPanel = memo(({ selectedUsers, routeDetails, onRemoveUser, locationCoords }) => {
  const calculateUserDistance = (user, legs) => {
    if (!legs || legs.length === 0 || !routeDetails?.orderedLocations || !locationCoords) return 'Calculating...';
    
    // Find the index of this user's home location in the ordered locations
    const userHomeLocation = locationCoords[`home-${user.id}`];
    if (!userHomeLocation) return 'Calculating...';

    const userIndex = routeDetails.orderedLocations.findIndex(loc => {
      const latDiff = Math.abs(loc.lat - userHomeLocation.lat);
      const lngDiff = Math.abs(loc.lng - userHomeLocation.lng);
      return latDiff < 0.001 && lngDiff < 0.001;
    });

    if (userIndex === -1) return 'Calculating...';

    // Get the leg that starts at this user's location
    const userLeg = legs[userIndex];
    return userLeg ? userLeg.distance.text : 'Calculating...';
  };

  const calculateUserTime = (user, legs) => {
    if (!legs || legs.length === 0 || !routeDetails?.orderedLocations || !locationCoords) return 'Calculating...';
    
    // Find the index of this user's home location in the ordered locations
    const userHomeLocation = locationCoords[`home-${user.id}`];
    if (!userHomeLocation) return 'Calculating...';

    const userIndex = routeDetails.orderedLocations.findIndex(loc => {
      const latDiff = Math.abs(loc.lat - userHomeLocation.lat);
      const lngDiff = Math.abs(loc.lng - userHomeLocation.lng);
      return latDiff < 0.001 && lngDiff < 0.001;
    });

    if (userIndex === -1) return 'Calculating...';

    // Get the leg that starts at this user's location
    const userLeg = legs[userIndex];
    return userLeg ? userLeg.duration.text : 'Calculating...';
  };

  const calculateTotalDistance = (legs) => {
    if (!legs || legs.length === 0) return '0 km';
    const totalMeters = legs.reduce((acc, leg) => acc + leg.distance.value, 0);
    return `${(totalMeters / 1000).toFixed(1)} km`;
  };

  const calculateTotalTime = (legs) => {
    if (!legs || legs.length === 0) return '0 mins';
    const totalSeconds = legs.reduce((acc, leg) => acc + leg.duration.value, 0);
    const minutes = Math.round(totalSeconds / 60);
    return `${minutes} mins`;
  };

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md z-10 w-80">
      <h3 className="text-lg font-semibold mb-4">Selected Passengers</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {selectedUsers.map(user => (
          <div key={user.id} className="border rounded-lg p-3 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{user.name}</h4>
                <p className="text-sm text-gray-600">ID: {user.id}</p>
              </div>
              <button
                onClick={() => onRemoveUser(user)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
            <div className="mt-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-medium">
                  {calculateUserDistance(user, routeDetails?.routes[0]?.legs)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {calculateUserTime(user, routeDetails?.routes[0]?.legs)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {selectedUsers.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No passengers selected
          </div>
        )}
      </div>
      {routeDetails?.routes[0]?.legs && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Distance:</span>
            <span className="font-medium">
              {calculateTotalDistance(routeDetails.routes[0].legs)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Time:</span>
            <span className="font-medium">
              {calculateTotalTime(routeDetails.routes[0].legs)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

const PassengerMap = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [directions, setDirections] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [locationCoords, setLocationCoords] = useState({});
  const [hoveredMarkerKey, setHoveredMarkerKey] = useState(null);
  const [rightMapDirections, setRightMapDirections] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validUsers, setValidUsers] = useState([]);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { token } = useSelector((state) => state.auth);

  // Fetch users with routing status
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await UserStatusService.getUsersByStatus('routing', token);
        const users = response.users; // Updated to match the response format
        
        // Filter valid users with proper coordinates
        const validUsers = users.filter(user => {
          const isValid = user.homeAddress && user.workAddress &&
            user.homeAddress.latitude && user.homeAddress.longitude &&
            user.workAddress.latitude && user.workAddress.longitude;
          if (!isValid) {
            console.warn('Invalid user data:', user);
          }
          return isValid;
        });
        
        setValidUsers(validUsers);
        setError(null);
      } catch (err) {
        setError(`Error fetching users: ${err.message}`);
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Debug effect to check valid users
  useEffect(() => {
    console.log('Valid users:', validUsers);
    console.log('Location coords:', locationCoords);
  }, [validUsers, locationCoords]);

  // Memoize center calculation
  const center = useMemo(() => {
    const firstHomeCoord = validUsers[0] && locationCoords[`home-${validUsers[0].id}`];
    return firstHomeCoord || defaultCenter;
  }, [validUsers, locationCoords]);

  // Memoize location coordinates update
  useEffect(() => {
    if (googleApiLoaded && validUsers.length > 0) {
      const coordsMap = {};
      validUsers.forEach(user => {
        coordsMap[`home-${user.id}`] = {
          lat: user.homeAddress.latitude,
          lng: user.homeAddress.longitude
        };
        coordsMap[`work-${user.id}`] = {
          lat: user.workAddress.latitude,
          lng: user.workAddress.longitude
        };
      });
      setLocationCoords(coordsMap);
    }
  }, [googleApiLoaded, validUsers]);

  // Memoize marker icon creation with proper checks
  const getMarkerIcon = useCallback((userId, type) => {
    if (!window.google || !window.google.maps) {
      return null;
    }

    const isHovered = hoveredMarkerKey === `${userId}-${type}`;
    const scale = isHovered ? 10 : 8;
    const isSelected = selectedUsers.some(user => user.id === userId);
    const color = isSelected ? '#3B82F6' : (type === 'home' ? '#22C55E' : '#EF4444');

    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#FFFFFF',
      scale,
    };
  }, [hoveredMarkerKey, selectedUsers]);

  // Optimize marker click handler
  const handleMarkerClick = useCallback((user) => {
    setSelectedUsers(prev => {
      const exists = prev.find(u => u.id === user.id);
      return exists ? prev.filter(u => u.id !== user.id) : [...prev, user];
    });
  }, []);

  // Memoize route update function with proper checks
  const updateRightMapRoute = useCallback(async () => {
    if (selectedUsers.length < 1 || !googleApiLoaded || !window.google || !window.google.maps) return;
    
    setIsLoading(true);
    try {
      const directionsService = new window.google.maps.DirectionsService();
      const allLocations = [];

      // Sort users by their home location to ensure consistent route order
      const sortedUsers = [...selectedUsers].sort((a, b) => {
        return a.homeAddress.latitude - b.homeAddress.latitude;
      });

      sortedUsers.forEach(user => {
        allLocations.push({ location: locationCoords[`home-${user.id}`], type: 'home', userId: user.id });
        allLocations.push({ location: locationCoords[`work-${user.id}`], type: 'work', userId: user.id });
      });

      if (allLocations.length < 2) return;

      const origin = allLocations[0].location;
      const destination = allLocations[allLocations.length - 1].location;
      const waypoints = allLocations.slice(1, -1).map(loc => ({ location: loc.location, stopover: true }));

      const result = await new Promise((resolve, reject) => {
        directionsService.route({
          origin,
          destination,
          waypoints,
          optimizeWaypoints: true,
          travelMode: 'DRIVING',
        }, (result, status) => {
          if (status === 'OK') {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });

      // Store the order of locations for later reference
      const routeOrder = result.routes[0].waypoint_order || [];
      const orderedLocations = [origin, ...routeOrder.map(i => waypoints[i].location), destination];
      
      setRightMapDirections(result);
      setRouteDetails({
        ...result,
        orderedLocations,
        userLocations: allLocations
      });
      setError(null);
    } catch (err) {
      setError(`Error calculating route: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUsers, googleApiLoaded, locationCoords]);

  // Update route when selected users change
  useEffect(() => {
    const timer = setTimeout(updateRightMapRoute, 100);
    return () => clearTimeout(timer);
  }, [updateRightMapRoute]);

  // Update route details when directions change
  useEffect(() => {
    if (rightMapDirections) {
      setRouteDetails(rightMapDirections);
    }
  }, [rightMapDirections]);

  // Handle removing a user
  const handleRemoveUser = useCallback((user) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
  }, []);

  // Memoize map options
  const mapOptions = useMemo(() => ({
    styles: mapStyle,
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  }), []);

  return (
    <div className="relative">
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="absolute top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Calculating route...
        </div>
      )}
      {!googleApiLoaded && (
        <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Loading Google Maps...
        </div>
      )}
      <LoadScript 
        googleMapsApiKey={apiKey} 
        onLoad={() => setGoogleApiLoaded(true)}
        onError={(err) => setError(`Failed to load Google Maps: ${err.message}`)}
      >
        {googleApiLoaded && (
          <div style={dualMapContainerStyle}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
              options={mapOptions}
            >
              {validUsers.length > 0 ? (
                validUsers.map(user => (
                  <React.Fragment key={user.id}>
                    <UserMarker
                      position={{
                        lat: user.homeAddress.latitude,
                        lng: user.homeAddress.longitude
                      }}
                      icon={getMarkerIcon(user.id, 'home')}
                      onClick={() => handleMarkerClick(user)}
                      onMouseOver={() => setHoveredMarkerKey(`${user.id}-home`)}
                      onMouseOut={() => setHoveredMarkerKey(null)}
                      title={`${user.name} (Home)`}
                    />
                    <UserMarker
                      position={{
                        lat: user.workAddress.latitude,
                        lng: user.workAddress.longitude
                      }}
                      icon={getMarkerIcon(user.id, 'work')}
                      onClick={() => handleMarkerClick(user)}
                      onMouseOver={() => setHoveredMarkerKey(`${user.id}-work`)}
                      onMouseOut={() => setHoveredMarkerKey(null)}
                      title={`${user.name} (Work)`}
                    />
                  </React.Fragment>
                ))
              ) : (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-md">
                  No valid users found. Please check the data format.
                </div>
              )}
              <MapLegend />
              <SelectedUsersPanel 
                selectedUsers={selectedUsers}
                routeDetails={routeDetails}
                onRemoveUser={handleRemoveUser}
                locationCoords={locationCoords}
              />
            </GoogleMap>

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
              options={mapOptions}
            >
              {rightMapDirections && <DirectionsRenderer directions={rightMapDirections} />}
            </GoogleMap>
          </div>
        )}
      </LoadScript>
    </div>
  );
};

export default memo(PassengerMap);

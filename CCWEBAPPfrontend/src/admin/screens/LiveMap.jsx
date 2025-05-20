import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { Car, MapPin, Clock, User } from 'lucide-react';

// Sample data - replace with actual API data
const rides = [
  {
    id: 'R001',
    driver: 'John Doe',
    carNumber: 'DL01AB1234',
    passengers: 3,
    pickup: { lat: 28.6139, lng: 77.2090 },
    dropoff: { lat: 28.5355, lng: 77.3910 },
    status: 'in_progress',
    currentLocation: { lat: 28.5745, lng: 77.3000 }
  },
  {
    id: 'R002',
    driver: 'Jane Smith',
    carNumber: 'DL02CD5678',
    passengers: 2,
    pickup: { lat: 28.4595, lng: 77.0266 },
    dropoff: { lat: 28.7041, lng: 77.1025 },
    status: 'waiting',
    currentLocation: { lat: 28.4595, lng: 77.0266 }
  }
];

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)'
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};

// Car SVG path
const carSVG = {
  path: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z',
  fillColor: '#4CAF50',
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: '#000',
  scale: 1.5,
  rotation: 0
};

function LiveMap() {
  const [selectedRide, setSelectedRide] = useState(null);
  const [ridesData, setRidesData] = useState(rides);
  const [directions, setDirections] = useState({});
  const [directionsService, setDirectionsService] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'directions']
  });

  useEffect(() => {
    if (isLoaded) {
      setDirectionsService(new window.google.maps.DirectionsService());
    }
  }, [isLoaded]);

  const getCarIcon = (status, driverName) => {
    if (!isLoaded) return null;

    const color = status === 'in_progress' ? '#4CAF50' : '#FFC107';
    const anchorPoint = new window.google.maps.Point(12, 12);
    const labelOriginPoint = new window.google.maps.Point(12, 12);

    return {
      ...carSVG,
      fillColor: color,
      anchor: anchorPoint,
      labelOrigin: labelOriginPoint,
      label: {
        text: driverName,
        color: '#000',
        fontSize: '12px',
        fontWeight: 'bold',
        className: 'map-label'
      }
    };
  };

  const calculateRoute = useCallback((ride) => {
    if (!directionsService) return;

    directionsService.route(
      {
        origin: ride.pickup,
        destination: ride.dropoff,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(prev => ({
            ...prev,
            [ride.id]: result
          }));
        }
      }
    );
  }, [directionsService]);

  useEffect(() => {
    if (directionsService) {
      ridesData.forEach(ride => {
        calculateRoute(ride);
      });
    }
  }, [directionsService, ridesData, calculateRoute]);

  const handleRideSelect = (ride) => {
    setSelectedRide(ride);
    if (!directions[ride.id]) {
      calculateRoute(ride);
    }
  };

  return (
    <div className="relative">
      {!isLoaded ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          options={{
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'road',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          }}
        >
          {ridesData.map((ride) => (
            <React.Fragment key={ride.id}>
              {/* Car Marker with Driver Label */}
              <Marker
                position={ride.currentLocation}
                icon={getCarIcon(ride.status, ride.driver)}
                onClick={() => handleRideSelect(ride)}
              />

              {/* Route */}
              {directions[ride.id] && (
                <DirectionsRenderer
                  directions={directions[ride.id]}
                  options={{
                    suppressMarkers: true,
                    polylineOptions: {
                      strokeColor: ride.status === 'in_progress' ? '#4CAF50' : '#FFC107',
                      strokeWeight: 4,
                      strokeOpacity: 0.8
                    }
                  }}
                />
              )}
            </React.Fragment>
          ))}

          {selectedRide && (
            <InfoWindow
              position={selectedRide.currentLocation}
              onCloseClick={() => setSelectedRide(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold text-lg mb-2">Ride #{selectedRide.id}</h3>
                <div className="space-y-1">
                  <p className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Driver: {selectedRide.driver}
                  </p>
                  <p className="flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Car: {selectedRide.carNumber}
                  </p>
                  <p className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Passengers: {selectedRide.passengers}
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Status: {selectedRide.status === 'in_progress' ? 'In Progress' : 'Waiting'}
                  </p>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
}

export default LiveMap;
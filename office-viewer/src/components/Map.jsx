import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

export default function Map({ offices, showOfficeCode }) {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.416775, lng: -3.703790 }); // Estado para el centro del mapa

  useEffect(() => {
    const fetchCoordinates = () => {
      const newMarkers = offices.map((office) => {
        const { "google_maps_address": direccion, lat, lng, "cod. oficina": officeCode, is_done } = office;
        return { direccion, lat, lng, officeCode, is_done: is_done || false };
      });
      setMarkers(newMarkers);
    };
    fetchCoordinates();
  }, [offices]);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error(error);
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation not supported"));
      }
    });
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setMapCenter({ lat: marker.lat, lng: marker.lng }); // Actualizar el centro del mapa al seleccionar un marcador
  };

  const openGoogleMaps = async () => {
    if (selectedMarker) {
      try {
        const userLocation = await getUserLocation();
        const origin = `${userLocation.lat},${userLocation.lng}`;
        const destination = `${selectedMarker.lat},${selectedMarker.lng}`;
        const travelMode = "driving";
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelMode}`;
        window.open(googleMapsUrl, '_blank');
      } catch (error) {
        console.error("Error getting user location or opening Google Maps", error);
      }
    }
  };

  const openWaze = async () => {
    if (selectedMarker) {
      try {
        const wazeUrl = `https://waze.com/ul?ll=${selectedMarker.lat},${selectedMarker.lng}&navigate=yes`;
        window.open(wazeUrl, '_blank');
      } catch (error) {
        console.error("Error opening Waze", error);
      }
    }
  };

//   const handleToggleInstalled = async (marker) => {
//     const newStatus = !marker.is_done;
  
//     try {
//       const response = await fetch('/api/update-office', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ officeCode: marker.officeCode, isDone: newStatus }),
//       });
  
//       if (!response.ok) {
//         throw new Error('Error actualizando el archivo en el backend');
//       }
  
//       const data = await response.json();
//       console.log('Archivo actualizado correctamente:', data);
  
//       setMarkers((prevMarkers) =>
//         prevMarkers.map((m) =>
//           m.officeCode === marker.officeCode ? { ...m, is_done: newStatus } : m
//         )
//       );
  
//       setSelectedMarker({ ...marker, is_done: newStatus });
//     } catch (error) {
//       console.error('Error al actualizar el archivo:', error);
//     }
//   };

  const mapContainerStyle = {
    width: '100%',
    height: '78vh',
  };

  return (
    <LoadScript googleMapsApiKey={"AIzaSyDNQJWqh2YJd64CrKPQLCT733Zhu-YITRA"}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={6}
        center={mapCenter} // Usar el estado `mapCenter` como centro
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={`Dirección: ${marker.direccion}\nCoordenadas: ${marker.lat} ${marker.lng}`}
            label={showOfficeCode ? marker.officeCode.toString() : undefined}
            icon={{
              url: marker.is_done ? "greenMarker.png" : "redMarker.png",
              scaledSize: new window.google.maps.Size(32, 32),
            }}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
            options={{ disableAutoPan: true }}
          >
            <div style={{ maxWidth: '200px', color: 'black' }}>
              <h3 style={{ marginBottom: '8px' }}>Oficina: {selectedMarker.officeCode}</h3>
              <p style={{ marginBottom: '8px' }}><strong>Dirección:</strong> {selectedMarker.direccion}</p>
              <button
                onClick={openGoogleMaps}
                style={{
                  padding: '8px',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                }}
              >
                Iniciar Ruta con Google Maps
              </button>
              <button
                onClick={openWaze}
                style={{
                  padding: '8px',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                }}
              >
                Iniciar Ruta con Waze
              </button>
              {/* <button
                onClick={() => handleToggleInstalled(selectedMarker)}
                style={{
                  padding: '8px',
                  backgroundColor: selectedMarker.is_done ? '#FF0000' : '#3aea35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                }}
              >
                {selectedMarker.is_done ? 'Desmarcar como instalada' : 'Marcar como instalada'}
              </button> */}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

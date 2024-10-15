import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

export default function MapComponent({ offices, territorial }) {
  const [markers, setMarkers] = useState([]);
  const [showOfficeCode, setShowOfficeCode] = useState(false); // Estado para controlar qué tipo de marcador mostrar

  const mapContainerStyle = {
    width: '100%',
    height: '80vh',
  };

  const defaultCenter = {
    lat: 40.416775, // Coordenadas de ejemplo (Madrid)
    lng: -3.703790,
  };

  const getCoordinates = async (address) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('API Key no encontrada. Asegúrate de haberla definido correctamente.');
      return null;
    }

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: apiKey,
        },
      });

      const { data } = response;

      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng }; // Devuelve las coordenadas
      } else {
        console.error(`Error en Geocoding API: ${data.status}`);
        return null;
      }
    } catch (error) {
      console.error('Error al hacer la solicitud a Geocoding API:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      const newMarkers = [];

      // Filtra las oficinas según el territorial seleccionado
      const filteredOffices = territorial === 'all'
        ? offices // Si se selecciona 'all', usa todas las oficinas
        : offices.filter(office => office.territorial === territorial); // Filtrar por territorial

      // Iterar sobre las oficinas filtradas y obtener sus coordenadas
      for (const office of filteredOffices) {
        try {
          const coords = await getCoordinates(office.google_maps_address); // Asegúrate de que este campo exista en tu JSON
          if (coords) {
            newMarkers.push({
              lat: coords.lat,
              lng: coords.lng,
              name: office.direccion,
              officeCode: office['cod. oficina'], // Cambiar acceso a 'cod. oficina'
            });
          }
        } catch (error) {
          console.error('Error al obtener coordenadas:', error);
        }
      }

      setMarkers(newMarkers); // Actualiza el estado de los marcadores
    };

    if (territorial) {
      fetchCoordinates(); // Solo llama si hay un territorial seleccionado
    } else {
      setMarkers([]); // Si no hay un territorial seleccionado, limpia los marcadores
    }
  }, [offices, territorial]); // Vuelve a ejecutar cuando las oficinas o el territorial cambian

  // Cambia entre mostrar el marcador por defecto o mostrar el código de la oficina
  const handleMarkerTypeChange = (event) => {
    setShowOfficeCode(event.target.value === 'officeCode');
  };

  return (
    <div>
      <div>
        <select id="marker-select" onChange={handleMarkerTypeChange}>
          <option value="default">Marcador por defecto</option>
          <option value="officeCode">Mostrar código de oficina</option>
        </select>
      </div>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={6}
          center={markers.length > 0 ? markers[0] : defaultCenter} // Centra el mapa en el primer marcador si existe
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.name}
              label={showOfficeCode ? marker.officeCode.toString() : undefined} // Muestra el código de oficina si está seleccionado
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

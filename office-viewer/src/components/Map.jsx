import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export default function Map({offices, showOfficeCode}) {
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const fetchCoordinates = async () => {
            const newMarkers = offices.map((office) => {
                const {direccion, lat, lng, "cod. oficina": officeCode} = office; 
                return {direccion, lat, lng, officeCode}
            })
            setMarkers(newMarkers);
            console.log(newMarkers)
        }
        fetchCoordinates();
    }, [offices]);

    const getUserLocation = () => {
        return new Promise((resolve, reject) => {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const {latitude, longitude} = position.coords;
                        resolve({lat: latitude, lng: longitude});
                    },
                    (error) => {
                        console.error(error);
                        reject(error);
                    }
                )
            } else {
                reject(new Error("Geolocation not supported"));
            }
        });
    }

    const handleMarkerOnclick = async (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        try {
            const userLocation = await getUserLocation();

            const origin = `${userLocation.lat},${userLocation.lng}`;
            const destination = `${lat},${lng}`;
            const travelMode = "driving";  

            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelMode}`;
            
            window.open(googleMapsUrl, '_blank');
        } catch (error) {
            console.error("Error getting user location or calculating route", error)
        }
    }

    const mapContainerStyle = {
        width: '100%',
        height: '78vh',
      };
    
    const defaultCenter = {
      lat: 40.416775, 
      lng: -3.703790,
    };

    return (
        <LoadScript googleMapsApiKey={"AIzaSyDNQJWqh2YJd64CrKPQLCT733Zhu-YITRA"}>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={6} center={markers.length > 0 ? markers[0] : defaultCenter}>
                {markers.map((marker, index) => {
                    return (
                        <Marker
                            key={index}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            title={`Dirección: ${marker.direccion}\nCoordenadas: ${marker.lat} ${marker.lng}`}
                            label={showOfficeCode ? marker.officeCode.toString() : undefined}
                            onClick={handleMarkerOnclick}
                        />
                    )
                })}
            </GoogleMap>
        </LoadScript>
    );
}
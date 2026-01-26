import { useMemo, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  category?: string;
  imageUrl?: string;
  type?: 'place' | 'event';
}

interface InteractiveMapProps {
  locations: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (location: Location) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: -23.5505, // São Paulo
  lng: -46.6333,
};

const defaultZoom = 12;

export function InteractiveMap({
  locations,
  center,
  zoom = defaultZoom,
  height = '400px',
  onMarkerClick,
}: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Calcular centro do mapa baseado nos locais (fallback se fitBounds não funcionar)
  const mapCenter = useMemo(() => {
    if (center) return center;
    
    if (locations.length === 0) return defaultCenter;
    
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [locations, center]);

  // Ajustar zoom para mostrar todos os pins quando o mapa ou locais mudarem
  useEffect(() => {
    if (map && locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      
      // Adicionar todos os locais aos bounds
      locations.forEach((location) => {
        bounds.extend(new google.maps.LatLng(location.lat, location.lng));
      });

      // Ajustar o mapa para mostrar todos os pins com padding
      map.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    }
  }, [map, locations]);

  if (!apiKey) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Chave da API do Google Maps não configurada</p>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Nenhum local encontrado</p>
        </div>
      </div>
    );
  }

  const onMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ ...mapContainerStyle, height }}
        center={mapCenter}
        zoom={zoom}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => {
              setSelectedLocation(location);
              onMarkerClick?.(location);
            }}
            title={location.name}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-1">{selectedLocation.name}</h3>
              {selectedLocation.address && (
                <p className="text-xs text-gray-600">{selectedLocation.address}</p>
              )}
              {selectedLocation.category && (
                <p className="text-xs text-primary mt-1">{selectedLocation.category}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

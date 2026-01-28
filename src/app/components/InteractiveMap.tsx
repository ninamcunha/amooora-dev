import { useMemo, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import customPinIcon from '../../assets/map-pin.PNG';

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
  lat: -23.5259152,
  lng: -46.6709052,
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
  const [mapError, setMapError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_K;
  
  // Log para debug (sempre, para ajudar no troubleshooting)
  console.log('🗺️ Google Maps API Key Check:', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyPreview: apiKey ? `${apiKey.substring(0, 10)}...` : 'não configurada',
    envVar: 'VITE_GOOGLE_MAPS_API_K',
    allEnvVars: Object.keys(import.meta.env).filter(k => k.includes('GOOGLE') || k.includes('MAPS'))
  });
  
  // Calcular centro do mapa baseado nos locais
  const mapCenter = useMemo(() => {
    if (center) return center;
    
    if (locations.length === 0) return defaultCenter;
    
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [center, locations.length]);

  // Calcular zoom inicial baseado na distribuição dos pins
  // Zoom mais amplo para mostrar área maior (similar à imagem)
  const calculatedZoom = useMemo(() => {
    if (locations.length === 0) return 11; // Zoom amplo padrão
    if (locations.length === 1) return 13; // Zoom médio para um único local
    
    // Calcular a extensão geográfica dos pins
    const lats = locations.map(loc => loc.lat);
    const lngs = locations.map(loc => loc.lng);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Calcular a diferença (span) em graus
    const latSpan = maxLat - minLat;
    const lngSpan = maxLng - minLng;
    const maxSpan = Math.max(latSpan, lngSpan);
    
    // Ajustar zoom baseado no span - valores mais baixos = zoom mais amplo
    // A imagem mostra uma visão bem ampla da cidade, então vamos usar zooms menores
    if (maxSpan < 0.01) return 12; // Muito próximos (menos de ~1km)
    if (maxSpan < 0.05) return 11; // Próximos (menos de ~5km)
    if (maxSpan < 0.1) return 10;  // Médio (menos de ~10km)
    if (maxSpan < 0.2) return 9;   // Amplo (menos de ~20km)
    return 8; // Muito amplo (mais de ~20km) - visão da cidade inteira
  }, [locations.length]);

  // Removido fitBounds automático para evitar loops
  // O mapa usa o centro calculado automaticamente via mapCenter

  if (!apiKey) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Mapa não disponível</p>
          <p className="text-xs text-gray-500">Toque para ver o mapa completo</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Erro ao carregar mapa</p>
          <p className="text-xs text-gray-500">{mapError}</p>
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

  // Configurar ícone customizado do pin
  // Criar o ícone apenas quando o Google Maps estiver disponível
  const getCustomIcon = () => {
    if (typeof google === 'undefined' || !google.maps) {
      return undefined;
    }
    
    return {
      url: customPinIcon,
      scaledSize: new google.maps.Size(32, 32), // Tamanho similar ao pin padrão (32x32px)
      anchor: new google.maps.Point(16, 32), // Ponto de ancoragem na base do pin (centro horizontal, base vertical)
    };
  };

  const onMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    // Ajustar o mapa para mostrar todos os pins quando houver múltiplos locais
    // Usar fitBounds para mostrar área ampla similar à imagem
    if (locations.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend(new google.maps.LatLng(location.lat, location.lng));
      });
      
      // Aplicar padding maior para mostrar área mais ampla (similar à imagem)
      // E definir zoom máximo para não ficar muito próximo
      mapInstance.fitBounds(bounds, {
        padding: { top: 100, right: 100, bottom: 100, left: 100 }
      });
      
      // Garantir que o zoom não fique muito próximo (máximo zoom 13)
      // Isso mantém a visão ampla mostrada na imagem
      const currentZoom = mapInstance.getZoom();
      if (currentZoom && currentZoom > 13) {
        mapInstance.setZoom(13);
      }
    }
  };

  return (
    <LoadScript 
      googleMapsApiKey={apiKey}
      loadingElement={
        <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center" style={{ height }}>
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      }
      onError={(error) => {
        console.error('❌ Erro ao carregar Google Maps:', error);
        setMapError('Não foi possível carregar o mapa. Verifique sua conexão.');
      }}
    >
      <GoogleMap
        mapContainerStyle={{ ...mapContainerStyle, height }}
        center={mapCenter}
        zoom={calculatedZoom}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: false,
          zoomControl: false,
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
            icon={getCustomIcon()}
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

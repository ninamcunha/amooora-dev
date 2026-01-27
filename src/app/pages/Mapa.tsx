import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Calendar, Filter } from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap';
import { usePlaces } from '../hooks/usePlaces';
import { useEvents } from '../hooks/useEvents';
import { geocodeAddress } from '../services/geocoding';
import { Place, Event } from '../types';

interface MapaProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

type MapFilter = 'all' | 'places' | 'events';

export function Mapa({ onNavigate, onBack }: MapaProps) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/36ab800b-6558-4486-879e-0991defbb1a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Mapa.tsx:component-entry',message:'Componente Mapa iniciado',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  const [activeFilter, setActiveFilter] = useState<MapFilter>('all');
  const [geocodingCache, setGeocodingCache] = useState<Record<string, { lat: number; lng: number }>>({});
  const [geocodingInProgress, setGeocodingInProgress] = useState(false);
  const geocodingProcessedRef = useRef<Set<string>>(new Set());

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/36ab800b-6558-4486-879e-0991defbb1a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Mapa.tsx:before-hooks',message:'Antes de chamar hooks usePlaces e useEvents',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  const { places, loading: loadingPlaces, error: errorPlaces } = usePlaces();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/36ab800b-6558-4486-879e-0991defbb1a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Mapa.tsx:after-usePlaces',message:'usePlaces executado',data:{placesCount:places?.length||0,loading:loadingPlaces,hasError:!!errorPlaces,errorMsg:errorPlaces?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  const { events, loading: loadingEvents, error: errorEvents } = useEvents();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/36ab800b-6558-4486-879e-0991defbb1a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Mapa.tsx:after-useEvents',message:'useEvents executado',data:{eventsCount:events?.length||0,loading:loadingEvents,hasError:!!errorEvents,errorMsg:errorEvents?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  // Carregar coordenadas para eventos que não têm latitude/longitude
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/36ab800b-6558-4486-879e-0991defbb1a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Mapa.tsx:geocoding-effect-entry',message:'useEffect geocoding iniciado',data:{loadingEvents,eventsCount:events?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    if (loadingEvents || !events || events.length === 0) return;

    const loadEventCoordinates = async () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/36ab800b-6558-4486-879e-0991defbb1a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Mapa.tsx:geocoding-function-entry',message:'loadEventCoordinates iniciado',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      // Criar lista de eventos que precisam de geocoding
      const eventsNeedingGeocoding = events.filter(
        (event) => event.location && 
                   !geocodingProcessedRef.current.has(event.location)
      );

      if (eventsNeedingGeocoding.length === 0) return;

      setGeocodingInProgress(true);

      try {
        // Marcar todos como processados ANTES de fazer as requisições
        eventsNeedingGeocoding.forEach((event) => {
          if (event.location) {
            geocodingProcessedRef.current.add(event.location);
          }
        });

        const newCache: Record<string, { lat: number; lng: number }> = { ...geocodingCache };

        // Geocodificar eventos que precisam (com delay para evitar rate limiting)
        for (const event of eventsNeedingGeocoding) {
          if (event.location) {
            const result = await geocodeAddress(event.location);
            if (result) {
              newCache[event.location] = { lat: result.lat, lng: result.lng };
            }
            // Delay de 200ms entre requisições
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        }

        // Atualizar cache apenas uma vez no final
        setGeocodingCache(newCache);
      } catch (error) {
        console.error('❌ Erro ao fazer geocoding de eventos:', error);
      } finally {
        setGeocodingInProgress(false);
      }
    };

    loadEventCoordinates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.length, loadingEvents]); // Usar apenas events.length para evitar loop

  // Preparar locais para o mapa
  const mapPlaces = useMemo(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/36ab800b-6558-4486-879e-0991defbb1a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Mapa.tsx:mapPlaces-useMemo',message:'mapPlaces useMemo executado',data:{placesLength:places.length,activeFilter,cacheSize:Object.keys(geocodingCache).length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return places
      .filter((place) => {
        // Filtrar por tipo se necessário
        if (activeFilter === 'events') return false;
        if (activeFilter === 'places') return true;
        return true; // 'all'
      })
      .filter((place) => {
        // Apenas locais com coordenadas ou endereço
        return (place.latitude && place.longitude) || place.address;
      })
      .map((place) => {
        // Se não tiver coordenadas, tentar usar do cache de geocoding
        let lat = place.latitude;
        let lng = place.longitude;

        if (!lat || !lng) {
          const cached = place.address ? geocodingCache[place.address] : undefined;
          if (cached) {
            lat = cached.lat;
            lng = cached.lng;
          }
        }

        // Se ainda não tiver coordenadas, pular este local
        if (!lat || !lng) return null;

        return {
          id: place.id,
          name: place.name,
          address: place.address,
          lat: Number(lat),
          lng: Number(lng),
          category: place.category,
          imageUrl: place.imageUrl,
          type: 'place' as const,
        };
      })
      .filter((place): place is NonNullable<typeof place> => place !== null);
  }, [places.length, activeFilter, Object.keys(geocodingCache).length]); // Usar apenas tamanhos

  // Preparar eventos para o mapa
  const mapEvents = useMemo(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/36ab800b-6558-4486-879e-0991defbb1a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Mapa.tsx:mapEvents-useMemo',message:'mapEvents useMemo executado',data:{eventsLength:events.length,activeFilter,cacheSize:Object.keys(geocodingCache).length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return events
      .filter((event) => {
        // Filtrar por tipo se necessário
        if (activeFilter === 'places') return false;
        if (activeFilter === 'events') return true;
        return true; // 'all'
      })
      .filter((event) => {
        // Apenas eventos com localização
        return event.location && event.location.trim().length > 0;
      })
      .map((event) => {
        // Tentar obter coordenadas do cache de geocoding
        const cached = geocodingCache[event.location];
        if (!cached) return null; // Ainda não foi geocodificado

        return {
          id: event.id,
          name: event.name,
          address: event.location,
          lat: cached.lat,
          lng: cached.lng,
          category: event.category,
          imageUrl: event.imageUrl,
          type: 'event' as const,
        };
      })
      .filter((event): event is NonNullable<typeof event> => event !== null);
  }, [events.length, activeFilter, Object.keys(geocodingCache).length]); // Usar apenas tamanhos

  // Combinar locais e eventos
  const allLocations = useMemo(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/36ab800b-6558-4486-879e-0991defbb1a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Mapa.tsx:allLocations-useMemo',message:'allLocations useMemo executado',data:{mapPlacesLength:mapPlaces.length,mapEventsLength:mapEvents.length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const combined = [...mapPlaces, ...mapEvents];
    return combined;
  }, [mapPlaces.length, mapEvents.length]);

  const loading = loadingPlaces || loadingEvents || geocodingInProgress;

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/36ab800b-6558-4486-879e-0991defbb1a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Mapa.tsx:before-render',message:'Antes de renderizar JSX',data:{loading,allLocationsCount:allLocations?.length||0,hasErrorPlaces:!!errorPlaces,hasErrorEvents:!!errorEvents},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-5 py-4 flex items-center gap-4">
          <button
            onClick={onBack || (() => onNavigate('home'))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Mapa</h1>
            <p className="text-xs text-gray-500">
              {allLocations.length} {allLocations.length === 1 ? 'local encontrado' : 'locais encontrados'}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex gap-2 flex-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveFilter('places')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'places'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-4 h-4 inline mr-1" />
                Locais
              </button>
              <button
                onClick={() => setActiveFilter('events')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'events'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-1" />
                Eventos
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">
                  {geocodingInProgress ? 'Carregando coordenadas...' : 'Carregando mapa...'}
                </p>
              </div>
            </div>
          ) : errorPlaces || errorEvents ? (
            <div className="p-5">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium">Erro ao carregar dados</p>
                <p className="text-red-500 text-xs mt-1">
                  {errorPlaces?.message || errorEvents?.message}
                </p>
              </div>
            </div>
          ) : allLocations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 p-5 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium mb-2">Nenhum local encontrado</p>
              <p className="text-sm text-gray-500">
                {activeFilter === 'all'
                  ? 'Não há locais ou eventos com localização disponível.'
                  : activeFilter === 'places'
                  ? 'Não há locais com localização disponível.'
                  : 'Não há eventos com localização disponível.'}
              </p>
            </div>
          ) : (
            <div className="p-5">
              {/* #region agent log */}
              {(() => {
                fetch('http://127.0.0.1:7242/ingest/36ab800b-6558-4486-879e-0991defbb1a3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Mapa.tsx:before-InteractiveMap',message:'Antes de renderizar InteractiveMap',data:{allLocationsCount:allLocations?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
                return null;
              })()}
              {/* #endregion */}
              <InteractiveMap
                locations={allLocations}
                height="500px"
                onMarkerClick={(location) => {
                  if (location.type === 'place') {
                    onNavigate(`place-details:${location.id}`);
                  } else if (location.type === 'event') {
                    onNavigate(`event-details:${location.id}`);
                  }
                }}
              />

              {/* Lista de locais abaixo do mapa */}
              <div className="mt-6 space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Locais no mapa ({allLocations.length})
                </h2>
                {allLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      if (location.type === 'place') {
                        onNavigate(`place-details:${location.id}`);
                      } else {
                        onNavigate(`event-details:${location.id}`);
                      }
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {location.type === 'place' ? (
                          <MapPin className="w-5 h-5 text-primary" />
                        ) : (
                          <Calendar className="w-5 h-5 text-accent" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{location.name}</h3>
                        {location.address && (
                          <p className="text-xs text-gray-600 truncate">{location.address}</p>
                        )}
                        {location.category && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                            {location.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

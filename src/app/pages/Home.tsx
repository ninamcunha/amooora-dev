import { Link } from 'react-router-dom';
import { usePlaces } from '../hooks/usePlaces';
import { useEvents } from '../hooks/useEvents';

export const Home = () => {
  const { places, loading: placesLoading } = usePlaces();
  const { events, loading: eventsLoading } = useEvents();

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#1f2937' }}>
        Bem-vindo ao Amooora
      </h1>

      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', color: '#1f2937' }}>Locais em Destaque</h2>
          <Link
            to="/locais"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Ver todos →
          </Link>
        </div>
        {placesLoading ? (
          <p>Carregando...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {places.slice(0, 4).map((place) => (
              <Link
                key={place.id}
                to={`/locais/${place.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '12px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '4px', color: '#1f2937' }}>
                      {place.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      {place.category}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#f59e0b' }}>⭐</span>
                      <span style={{ fontSize: '14px', color: '#1f2937' }}>{place.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', color: '#1f2937' }}>Próximos Eventos</h2>
          <Link
            to="/eventos"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Ver todos →
          </Link>
        </div>
        {eventsLoading ? (
          <p>Carregando...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {events.slice(0, 4).map((event) => (
              <Link
                key={event.id}
                to={`/eventos/${event.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={event.image}
                    alt={event.name}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '12px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '4px', color: '#1f2937' }}>
                      {event.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>{event.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
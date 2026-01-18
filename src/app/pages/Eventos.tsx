import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';

export const Eventos = () => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Carregando eventos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>Erro ao carregar eventos: {error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#1f2937' }}>
        Eventos
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {events.map((event) => (
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
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <img
                src={event.image}
                alt={event.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#1f2937' }}>
                  {event.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  {event.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      📅 {new Date(event.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      📍 {event.location}
                    </span>
                  </div>
                  {event.price !== undefined && (
                    <span style={{ fontSize: '18px', color: '#3b82f6', fontWeight: '600' }}>
                      {event.price === 0 ? 'Gratuito' : `R$ ${event.price}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
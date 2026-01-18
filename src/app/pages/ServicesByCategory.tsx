import { useParams, Link } from 'react-router-dom';
import { useServicesByCategory } from '../hooks/useServices';

export const ServicesByCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const { services, loading, error } = useServicesByCategory(slug);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Carregando serviços...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>Erro ao carregar serviços: {error.message}</p>
      </div>
    );
  }

  const categoryName = services.length > 0 ? services[0].category : slug;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#1f2937' }}>
        Serviços - {categoryName}
      </h1>

      {services.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Nenhum serviço encontrado nesta categoria.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {services.map((service) => (
            <Link
              key={service.id}
              to={`/servicos/${service.id}`}
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
                  src={service.image}
                  alt={service.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#1f2937' }}>
                    {service.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                    {service.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#f59e0b' }}>⭐</span>
                      <span style={{ fontSize: '14px', color: '#1f2937' }}>{service.rating}</span>
                    </div>
                    {service.price && (
                      <span style={{ fontSize: '18px', color: '#3b82f6', fontWeight: '600' }}>
                        R$ {service.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
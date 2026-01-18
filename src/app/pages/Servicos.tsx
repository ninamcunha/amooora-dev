import { Link } from 'react-router-dom';
import { useServices } from '../hooks/useServices';

export const Servicos = () => {
  const { services, loading, error } = useServices();

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

  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#1f2937' }}>
        Serviços
      </h1>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {categories.map((category) => {
          const service = services.find((s) => s.category === category);
          return (
            <Link
              key={category}
              to={`/servicos/categoria/${service?.categorySlug || ''}`}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                color: '#1f2937',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              {category}
            </Link>
          );
        })}
      </div>

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
                  <span style={{ fontSize: '14px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                    {service.category}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    {service.price && (
                      <span style={{ fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>
                        R$ {service.price}
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#f59e0b' }}>⭐</span>
                      <span style={{ fontSize: '14px', color: '#1f2937' }}>{service.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
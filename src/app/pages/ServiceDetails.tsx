import { useParams, useNavigate, Link } from 'react-router-dom';
import { useService } from '../hooks/useServices';
import { useReviewsByServiceId } from '../hooks/useReviews';

export const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { service, loading, error } = useService(id);
  const { reviews, loading: reviewsLoading } = useReviewsByServiceId(id || '');

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', marginBottom: '16px' }}>
          {error?.message || 'Serviço não encontrado'}
        </p>
        <button
          onClick={() => navigate('/servicos')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Voltar para Serviços
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <button
        onClick={() => navigate('/servicos')}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          marginBottom: '16px',
          color: '#3b82f6',
        }}
      >
        ← Voltar
      </button>

      <img
        src={service.image}
        alt={service.name}
        style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '24px' }}
      />

      <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#1f2937' }}>
        {service.name}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
          {service.category}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#f59e0b' }}>⭐</span>
          <span style={{ fontSize: '18px', color: '#1f2937', fontWeight: '600' }}>
            {service.rating}
          </span>
        </div>
        {service.price && (
          <span style={{ fontSize: '24px', color: '#3b82f6', fontWeight: '600', marginLeft: 'auto' }}>
            R$ {service.price}
          </span>
        )}
      </div>

      <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
        {service.description}
      </p>

      {service.provider && (
        <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Fornecedor</p>
          <p style={{ fontSize: '16px', color: '#1f2937' }}>{service.provider}</p>
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', color: '#1f2937' }}>Avaliações</h2>
          <Link
            to={`/avaliacao/criar?serviceId=${service.id}`}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            Escrever Avaliação
          </Link>
        </div>

        {reviewsLoading ? (
          <p>Carregando avaliações...</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Ainda não há avaliações para este serviço.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  backgroundColor: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  {review.userAvatar && (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  )}
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {review.userName}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#f59e0b' }}>⭐</span>
                      <span style={{ fontSize: '14px', color: '#1f2937' }}>{review.rating}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                  {review.comment}
                </p>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                  {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const CreateReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const placeId = searchParams.get('placeId');
  const serviceId = searchParams.get('serviceId');
  const eventId = searchParams.get('eventId');

  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Por enquanto, apenas navega de volta
    if (placeId) {
      navigate(`/locais/${placeId}`);
    } else if (serviceId) {
      navigate(`/servicos/${serviceId}`);
    } else if (eventId) {
      navigate(`/eventos/${eventId}`);
    } else {
      navigate(-1);
    }
  };

  const getBackPath = () => {
    if (placeId) return `/locais/${placeId}`;
    if (serviceId) return `/servicos/${serviceId}`;
    if (eventId) return `/eventos/${eventId}`;
    return -1;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(getBackPath() as any)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          marginBottom: '24px',
          color: '#3b82f6',
        }}
      >
        ← Voltar
      </button>

      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#1f2937' }}>
        Criar Avaliação
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Avaliação
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData({ ...formData, rating })}
                style={{
                  fontSize: '32px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: rating <= formData.rating ? '#f59e0b' : '#d1d5db',
                }}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Comentário
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={6}
            required
            placeholder="Compartilhe sua experiência..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '600',
            marginTop: '8px',
          }}
        >
          Publicar Avaliação
        </button>
      </form>
    </div>
  );
};
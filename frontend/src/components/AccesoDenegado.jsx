import { useNavigate } from 'react-router-dom'

export default function AccesoDenegado() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'sans-serif' }}>
      <h1>Acceso denegado</h1>
      <p>No tienes permiso para ver esta página.</p>
      <button onClick={() => navigate('/dashboard')}>
        Volver al panel
      </button>
    </div>
  )
}
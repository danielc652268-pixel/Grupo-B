import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RutaProtegida({ rolesPermitidos, children }) {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return <p>Cargando...</p>
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.role)) {
    return <Navigate to="/acceso-denegado" replace />
  }

  return children
}
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

const NOMBRES_ROL = {
  1: 'Administrador',
  2: 'Técnico',
  3: 'Residente',
}

export default function Dashboard() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await cerrarSesion()
    navigate('/login')
  }

  const rol = usuario?.role

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Panel {NOMBRES_ROL[rol] || ''}</h1>

        <nav className="dashboard-nav">
          {rol === 1 && (
            <button onClick={() => navigate('/crear-usuario')}>
              Crear usuario
            </button>
          )}

          <button onClick={handleLogout} className="logout-btn">
            Cerrar sesión
          </button>
        </nav>
      </header>

      <main className="dashboard-content">
        <p>Bienvenido, {usuario?.username}</p>
      </main>
    </div>
  )
}
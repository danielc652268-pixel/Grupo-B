import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import PanelUsuarios from './PanelUsuarios'
import PanelResidenciales from './PanelResidenciales'
import PanelApartamentoCasa from './PanelApartamentoCasa'
import PanelAsignarReporte from './PanelAsignarReporte'
import ReportarAveria from './ReportarAveria'
import './Dashboard.css'

const NOMBRES_ROL = {
  1: 'ADMIN',
  2: 'Técnico',
  3: 'Residente',
}

const TITULOS_VISTA = {
  inicio: 'Inicio',
  'crear-usuario': 'Crear usuario',
  residencial: 'Residencial / Edificios',
  'apartamento-casa': 'Apartamento / Casa',
  'asignar-reporte': 'Asignar reportes',
  'reportar-averia': 'Reportar un problema',
}

export default function Dashboard() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()
  const [vistaActiva, setVistaActiva] = useState('inicio')

  const handleLogout = async () => {
    await cerrarSesion()
    navigate('/login')
  }

  const rol = usuario?.role

  return (
    <div className="layout">
      <Sidebar
        rol={rol}
        vistaActiva={vistaActiva}
        onSeleccionar={setVistaActiva}
        onCerrarSesion={handleLogout}
      />

      <div className="layout-main">
        <header className="layout-header">
          <h1>{TITULOS_VISTA[vistaActiva]}</h1>
          <span className="layout-header-rol">{NOMBRES_ROL[rol] || ''}</span>
          
        </header>

        <main className="layout-content">
          {vistaActiva === 'inicio' && <p>Bienvenido, {usuario?.username}</p>}
          {vistaActiva === 'crear-usuario' && rol === 1 && <PanelUsuarios />}
          {vistaActiva === 'residencial' && rol === 1 && <PanelResidenciales />}
          {vistaActiva === 'apartamento-casa' && rol === 1 && <PanelApartamentoCasa />}
          {vistaActiva === 'asignar-reporte' && rol === 1 && <PanelAsignarReporte />}
          {vistaActiva === 'reportar-averia' && rol === 3 && <ReportarAveria />}
        </main>
      </div>
    </div>
  )
}
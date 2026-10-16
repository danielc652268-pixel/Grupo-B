import './Sidebar.css'
import logo from '../assets/components/images/JDM Repair - logo.png'

const SECCIONES = [
  {
    titulo: 'General',
    items: [{ id: 'inicio', etiqueta: 'Inicio' }],
  },
  {
    titulo: 'Administración',
    soloRol: 1,
    items: [
      { id: 'crear-usuario', etiqueta: 'Crear usuario' },
      { id: 'residencial', etiqueta: 'Registrar Residencial o Edificios' },
      { id: 'apartamento-casa', etiqueta: 'Registrar Apartamentos o Casas' },
      { id: 'asignar-reporte', etiqueta: 'Reportes' },
      { id: 'todos-reportes', etiqueta: 'Todos los reportes' },
    ],
  },
  {
    titulo: 'Residente',
    soloRol: 3,
    items: [{ id: 'reportar-averia', etiqueta: 'Reportar un problema' }],
  },
  {
    titulo: 'Técnico',
    soloRol: 2,
    items: [{ id: 'mantenimiento-tecnico', etiqueta: 'Mantenimiento' }],
  },
]

export default function Sidebar({ rol, vistaActiva, onSeleccionar, onCerrarSesion }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img className="sidebar-logo" src={logo} alt="" />
        <span>JDM Repair</span>
      </div>

      <nav className="sidebar-nav">
        {SECCIONES.filter((seccion) => !seccion.soloRol || seccion.soloRol === rol).map(
          (seccion) => (
            <div className="sidebar-section" key={seccion.titulo}>
              <span className="sidebar-section-title">{seccion.titulo}</span>

              {seccion.items.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-item ${vistaActiva === item.id ? 'activo' : ''}`}
                  onClick={() => onSeleccionar(item.id)}
                >
                  {item.etiqueta}
                </button>
              ))}
            </div>
          )
        )}
      </nav>

      <button className="sidebar-logout" onClick={onCerrarSesion}>
        Cerrar sesión
      </button>
    </aside>
  )
}
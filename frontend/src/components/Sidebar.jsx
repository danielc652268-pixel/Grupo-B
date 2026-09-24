import './Sidebar.css'

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
      { id: 'residencial', etiqueta: 'Residencial / Edificios' },
    ],
  },
]

export default function Sidebar({ rol, vistaActiva, onSeleccionar, onCerrarSesion }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">JDM Repair</div>

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

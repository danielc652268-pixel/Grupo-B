import { useEffect, useState } from 'react'
import axios from 'axios'
import './AsignarReporte.css'
import './TablaReportesAsignados.css'
import './TablaTodosReportes.css'
import DetalleReporte from './DetalleReporte'

const ESTADOS = [
  { valor: 'PENDIENTE', etiqueta: 'Pendiente' },
  { valor: 'ASIGNADO', etiqueta: 'Asignado' },
  { valor: 'PROGRAMADO', etiqueta: 'Programado' },
  { valor: 'EN_PROCESO', etiqueta: 'En proceso' },
  { valor: 'COMPLETADO', etiqueta: 'Completado' },
  { valor: 'CANCELADO', etiqueta: 'Cancelado' },
]

const ETIQUETAS_ESTADO = Object.fromEntries(ESTADOS.map((e) => [e.valor, e.etiqueta]))

export default function TablaTodosReportes() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null)
  const [reportes, setReportes] = useState([])
  const [residenciales, setResidenciales] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [filtroResidencial, setFiltroResidencial] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroTecnico, setFiltroTecnico] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarFiltros = async () => {
      try {
        const [resResidenciales, resTecnicos] = await Promise.all([
          axios.get('http://localhost:3000/residenciales', { withCredentials: true }),
          axios.get('http://localhost:3000/tecnicos', { withCredentials: true }),
        ])
        setResidenciales(resResidenciales.data)
        setTecnicos(resTecnicos.data)
      } catch (err) {
        console.log('No se pudieron cargar los filtros', err)
      }
    }

    cargarFiltros()
  }, [])

  useEffect(() => {
    const cargarReportes = async () => {
      setCargando(true)
      setError('')

      try {
        const respuesta = await axios.get('http://localhost:3000/reportes', {
          withCredentials: true,
          params: {
            residencial_id: filtroResidencial || undefined,
            estado: filtroEstado || undefined,
            tecnico_id: filtroTecnico || undefined,
          },
        })
        setReportes(respuesta.data)
      } catch (err) {
        setError('No se pudieron cargar los reportes.')
      } finally {
        setCargando(false)
      }
    }

    cargarReportes()
  }, [filtroResidencial, filtroEstado, filtroTecnico])

  if (reporteSeleccionado) {
    return (
      <DetalleReporte
        id={reporteSeleccionado}
        onVolver={() => setReporteSeleccionado(null)}
      />
    )
  }

  return (
    <div className="asignar-reporte-container">
      <h2>Todos los reportes</h2>

      <div className="filtros-reportes">
        <select
          className="asignar-reporte-select"
          value={filtroResidencial}
          onChange={(e) => setFiltroResidencial(e.target.value)}
        >
          <option value="">Todos los condominios</option>
          {residenciales.map((r) => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>

        <select
          className="asignar-reporte-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((estado) => (
            <option key={estado.valor} value={estado.valor}>{estado.etiqueta}</option>
          ))}
        </select>

        <select
          className="asignar-reporte-select"
          value={filtroTecnico}
          onChange={(e) => setFiltroTecnico(e.target.value)}
        >
          <option value="">Todos los técnicos</option>
          {tecnicos.map((t) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>
      </div>

      {error && <p className="asignar-reporte-mensaje asignar-reporte-error">{error}</p>}

      {cargando ? (
        <p>Cargando reportes...</p>
      ) : (
        <table className="asignar-reporte-tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Fecha</th>
              <th>Condominio</th>
              <th>Ubicación</th>
              <th>Técnico</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((reporte) => (
              <tr key={reporte.id}>
                <td>#{reporte.id}</td>
                <td>{new Date(reporte.fecha_reporte).toLocaleDateString()}</td>
                <td>{reporte.residencial || '-'}</td>
                <td>{reporte.ubicacion || '-'}</td>
                <td>{reporte.tecnico || 'Sin asignar'}</td>
                <td>
                  <span className={`estado-etiqueta estado-${reporte.estado}`}>
                    {ETIQUETAS_ESTADO[reporte.estado] || reporte.estado}
                  </span>
                </td>
                <td>
                  <button
                    className="boton-verReporte"
                    onClick={() => setReporteSeleccionado(reporte.id)}
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}

            {reportes.length === 0 && (
              <tr>
                <td colSpan="7" className="asignar-reporte-vacio">
                  No hay reportes con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
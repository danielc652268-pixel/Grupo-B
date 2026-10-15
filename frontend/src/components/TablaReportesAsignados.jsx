import { useEffect, useState } from 'react'
import axios from 'axios'
import './AsignarReporte.css'
import './TablaReportesAsignados.css'
import { avisarExito, avisarError, confirmarAccion } from '../utils/notificaciones'

const CATEGORIAS = {
  PLOMERIA: 'Plomería',
  ELECTRICIDAD: 'Electricidad',
  ELEVADOR: 'Elevador',
  ESTRUCTURAL: 'Estructural',
  OTRO: 'Otro',
}

export default function TablaReportesAsignados({ recargar }) {
  const [reportes, setReportes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [reporteViendo, setReporteViendo] = useState(null)
  const [edicionId, setEdicionId] = useState(null)
  const [edicionTecnico, setEdicionTecnico] = useState('')
  const [edicionFecha, setEdicionFecha] = useState('')
  const [guardando, setGuardando] = useState(false)

  const cargarReportes = async () => {
    setCargando(true)

    try {
      const [respuestaReportes, respuestaTecnicos] = await Promise.all([
        axios.get('http://localhost:3000/reportes/asignados', { withCredentials: true }),
        axios.get('http://localhost:3000/tecnicos', { withCredentials: true }),
      ])
      setReportes(respuestaReportes.data)
      setTecnicos(respuestaTecnicos.data)
    } catch (err) {
      avisarError('No se pudieron cargar los reportes asignados.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarReportes()
  }, [recargar])

  const verReporte = (reporte) => {
    setReporteViendo(reporte)
  }

  const editarReporte = (reporte) => {
    setEdicionId(reporte.id)
    setEdicionTecnico(reporte.tecnico_id || '')
    setEdicionFecha(reporte.fecha_programada || '')
  }

  const cancelarEdicion = () => {
    setEdicionId(null)
    setEdicionTecnico('')
    setEdicionFecha('')
  }

  const guardarEdicion = async (reporteId) => {
    if (!edicionTecnico) {
      avisarError('Selecciona un técnico.')
      return
    }

    setGuardando(true)

    try {
      await axios.patch(
        `http://localhost:3000/reportes/${reporteId}/reasignar`,
        { tecnico_id: Number(edicionTecnico), fecha_programada: edicionFecha || null },
        { withCredentials: true }
      )
      avisarExito('Reporte actualizado correctamente.')
      cancelarEdicion()
      cargarReportes()
    } catch (err) {
      avisarError(err.response?.data?.error || 'No se pudo actualizar el reporte.')
    } finally {
      setGuardando(false)
    }
  }

  const eliminarReporte = (reporte) => {
    confirmarAccion({
      titulo: `¿Eliminar el reporte de "${reporte.residente}"?`,
      descripcion: 'Esta acción no se puede deshacer.',
      textoBoton: 'Eliminar',
      onConfirmar: async () => {
        try {
          await axios.delete(`http://localhost:3000/reportes/${reporte.id}`, {
            withCredentials: true,
          })
          avisarExito('Reporte eliminado correctamente.')
          setReportes((actuales) => actuales.filter((r) => r.id !== reporte.id))
        } catch (err) {
          avisarError(err.response?.data?.error || 'No se pudo eliminar el reporte.')
        }
      },
    })
  }

  if (cargando) {
    return <p>Cargando reportes asignados...</p>
  }

  return (
    <div className="asignar-reporte-container">
      <h2>Reportes asignados</h2>

      <table className="asignar-reporte-tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Residente</th>
            <th>Ubicación</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Técnico asignado</th>
            <th>Fecha programada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((reporte) => (
            <tr key={reporte.id}>
              <td>{new Date(reporte.fecha_reporte).toLocaleDateString()}</td>
              <td>{reporte.residente}</td>
              <td>{reporte.apartamento || reporte.area_comun || '-'}</td>
              <td>{CATEGORIAS[reporte.categoria] || reporte.categoria}</td>
              <td>{reporte.descripcion}</td>

              {edicionId === reporte.id ? (
                <>
                  <td>
                    <select
                      className="asignar-reporte-select"
                      value={edicionTecnico}
                      onChange={(e) => setEdicionTecnico(e.target.value)}
                    >
                      <option value="">Selecciona un técnico</option>
                      {tecnicos.map((t) => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="date"
                      className="asignar-reporte-fecha"
                      value={edicionFecha}
                      onChange={(e) => setEdicionFecha(e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="boton-verReporte"
                      disabled={guardando}
                      onClick={() => guardarEdicion(reporte.id)}
                    >
                      {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button className="boton-eliminar" onClick={cancelarEdicion}>
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{reporte.tecnico}</td>
                  <td>
                    {reporte.fecha_programada
                      ? new Date(`${reporte.fecha_programada}T00:00:00`).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    <button className="boton-verReporte" onClick={() => verReporte(reporte)}>
                      Ver
                    </button>
                    <button className="boton-editar" onClick={() => editarReporte(reporte)}>
                      Editar
                    </button>
                    <button className="boton-eliminar" onClick={() => eliminarReporte(reporte)}>
                      Eliminar
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}

          {reportes.length === 0 && (
            <tr>
              <td colSpan="8" className="asignar-reporte-vacio">
                Aún no hay reportes asignados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {reporteViendo && (
        <div className="modal-overlay-reporte" onClick={() => setReporteViendo(null)}>
          <div className="modal-contenido-reporte" onClick={(e) => e.stopPropagation()}>
            <h3>Detalle del reporte</h3>
            <p><strong>Fecha:</strong> {new Date(reporteViendo.fecha_reporte).toLocaleDateString()}</p>
            <p><strong>Residente:</strong> {reporteViendo.residente}</p>
            <p><strong>Ubicación:</strong> {reporteViendo.apartamento || reporteViendo.area_comun || '-'}</p>
            <p><strong>Categoría:</strong> {CATEGORIAS[reporteViendo.categoria] || reporteViendo.categoria}</p>
            <p><strong>Descripción:</strong> {reporteViendo.descripcion}</p>
            <p><strong>Técnico asignado:</strong> {reporteViendo.tecnico}</p>
            <p>
              <strong>Fecha programada:</strong>{' '}
              {reporteViendo.fecha_programada
                ? new Date(`${reporteViendo.fecha_programada}T00:00:00`).toLocaleDateString()
                : '-'}
            </p>
            <div className="no-imprimir modal-botones-reporte">
              <button className="boton-verReporte" onClick={() => window.print()}>
                Imprimir / Guardar PDF
              </button>
              <button className="boton-eliminar" onClick={() => setReporteViendo(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
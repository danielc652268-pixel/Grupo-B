import { useState, useEffect } from 'react'
import axios from 'axios'
import './AsignarReporte.css'

const CATEGORIAS = {
  PLOMERIA: 'Plomería',
  ELECTRICIDAD: 'Electricidad',
  ELEVADOR: 'Elevador',
  ESTRUCTURAL: 'Estructural',
  OTRO: 'Otro',
}

export default function AsignarReporte({ onGuardado }) {
  const [reportes, setReportes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [seleccion, setSeleccion] = useState({})
  const [fechas, setFechas] = useState({})
  const [asignandoId, setAsignandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  const cargarDatos = async () => {
    setCargando(true)
    setError('')

    try {
      const [respuestaReportes, respuestaTecnicos] = await Promise.all([
        axios.get('http://localhost:3000/reportes/pendientes', { withCredentials: true }),
        axios.get('http://localhost:3000/tecnicos', { withCredentials: true }),
      ])
      setReportes(respuestaReportes.data)
      setTecnicos(respuestaTecnicos.data)
    } catch (err) {
      setError('No se pudieron cargar los reportes pendientes.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const manejarSeleccion = (reporteId, tecnicoId) => {
    setSeleccion((valores) => ({ ...valores, [reporteId]: tecnicoId }))
  }

  const manejarFecha = (reporteId, fecha) => {
    setFechas((valores) => ({ ...valores, [reporteId]: fecha }))
  }

  const manejarAsignacion = async (reporteId) => {
    const tecnicoId = seleccion[reporteId]
    if (!tecnicoId) {
      setError('Selecciona un técnico antes de asignar.')
      return
    }

    setError('')
    setMensaje('')
    setAsignandoId(reporteId)

    try {
      await axios.patch(
        `http://localhost:3000/reportes/${reporteId}/asignar`,
        { tecnico_id: Number(tecnicoId), fecha_programada: fechas[reporteId] || null },
        { withCredentials: true }
      )

      setReportes((actuales) => actuales.filter((reporte) => reporte.id !== reporteId))
      setMensaje('Técnico asignado correctamente. El reporte pasó a Asignado.')
      onGuardado?.()
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo asignar el técnico.')
    } finally {
      setAsignandoId(null)
    }
  }

  if (cargando) {
    return <p>Cargando reportes pendientes...</p>
  }

  return (
    <div className="asignar-reporte-container">
      <h2>Asignar técnico</h2>

      {mensaje && <p className="asignar-reporte-mensaje asignar-reporte-exito">{mensaje}</p>}
      {error && <p className="asignar-reporte-mensaje asignar-reporte-error">{error}</p>}

      <table className="asignar-reporte-tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Residente</th>
            <th>Ubicación</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Técnico</th>
            <th>Fecha programada</th>
            <th></th>
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
              <td>
                <select
                  className="asignar-reporte-select"
                  value={seleccion[reporte.id] || ''}
                  onChange={(e) => manejarSeleccion(reporte.id, e.target.value)}
                >
                  <option value="">Selecciona un técnico</option>
                  {tecnicos.map((tecnico) => (
                    <option key={tecnico.id} value={tecnico.id}>{tecnico.nombre}</option>
                  ))}
                </select>
              </td>

              <td>
                <input
                  type="date"
                  className="asignar-reporte-fecha"
                  value={fechas[reporte.id] || ''}
                  onChange={(e) => manejarFecha(reporte.id, e.target.value)}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="asignar-reporte-boton"
                  disabled={asignandoId === reporte.id}
                  onClick={() => manejarAsignacion(reporte.id)}
                >
                  {asignandoId === reporte.id ? 'Asignando...' : 'Asignar'}
                </button>
              </td>
            </tr>
          ))}

          {reportes.length === 0 && (
            <tr>
              <td colSpan="8" className="asignar-reporte-vacio">
                No hay reportes pendientes por asignar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

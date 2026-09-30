import { useEffect, useState } from 'react'
import axios from 'axios'
import './AsignarReporte.css'
import './TablaReportesAsignados.css'

const CATEGORIAS = {
  PLOMERIA: 'Plomería',
  ELECTRICIDAD: 'Electricidad',
  ELEVADOR: 'Elevador',
  ESTRUCTURAL: 'Estructural',
  OTRO: 'Otro',
}

export default function TablaReportesAsignados({ recargar }) {
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarReportes = async () => {
      setCargando(true)
      setError('')

      try {
        const respuesta = await axios.get('http://localhost:3000/reportes/asignados', {
          withCredentials: true,
        })
        setReportes(respuesta.data)
      } catch (err) {
        setError('No se pudieron cargar los reportes asignados.')
      } finally {
        setCargando(false)
      }
    }

    cargarReportes()
  }, [recargar])

  if (cargando) {
    return <p>Cargando reportes asignados...</p>
  }

  if (error) {
    return <p className="asignar-reporte-mensaje asignar-reporte-error">{error}</p>
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
              <td>{reporte.tecnico}</td>
              <td>
                {reporte.fecha_programada
                  ? new Date(`${reporte.fecha_programada}T00:00:00`).toLocaleDateString()
                  : '-'}
              </td>
              <td>
                <button className="boton-verReporte" onClick={() => verReporte(reporte.id)}>
                  Ver
                </button>
                <button className="boton-editar" onClick={() => editarReporte(reporte.id)}>
                  Editar
                </button>
                <button className="boton-eliminar" onClick={() => eliminarReporte(reporte.id)}>
                  Eliminar
                </button>
              </td>
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
    </div>
  )
}

import { useEffect, useState } from 'react'
import axios from 'axios'
import './AsignarReporte.css'
import './TablaReportesAsignados.css'
import './DetalleReporte.css'

const CATEGORIAS = {
  PLOMERIA: 'Plomería',
  ELECTRICIDAD: 'Electricidad',
  ELEVADOR: 'Elevador',
  ESTRUCTURAL: 'Estructural',
  OTRO: 'Otro',
}

const ETIQUETAS_ESTADO = {
  PENDIENTE: 'Pendiente',
  ASIGNADO: 'Asignado',
  PROGRAMADO: 'Programado',
  EN_PROCESO: 'En proceso',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
}

export default function DetalleReporte({ id, onVolver }) {
  const [reporte, setReporte] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarReporte = async () => {
      try {
        const respuesta = await axios.get(`http://localhost:3000/reportes/${id}`, {
          withCredentials: true,
        })
        setReporte(respuesta.data)
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar el reporte.')
      } finally {
        setCargando(false)
      }
    }

    cargarReporte()
  }, [id])

  return (
    <div className="asignar-reporte-container detalle-reporte">
      <button className="boton-verReporte detalle-reporte-volver" onClick={onVolver}>
        ← Todos los reportes
      </button>

      {cargando && <p>Cargando reporte...</p>}
      {error && <p className="asignar-reporte-mensaje asignar-reporte-error">{error}</p>}

      {reporte && (
        <>
          <h2>
            Reporte #{reporte.id}{' '}
            <span className={`estado-etiqueta estado-${reporte.estado}`}>
              {ETIQUETAS_ESTADO[reporte.estado] || reporte.estado}
            </span>
          </h2>

          <div className="detalle-reporte-datos">
            <p><strong>Fecha:</strong> {new Date(reporte.fecha_reporte).toLocaleString()}</p>
            <p><strong>Residente:</strong> {reporte.residente}</p>
            <p><strong>Condominio:</strong> {reporte.residencial || '-'}</p>
            <p><strong>Ubicación:</strong> {reporte.ubicacion || '-'}</p>
            <p><strong>Categoría:</strong> {CATEGORIAS[reporte.categoria] || reporte.categoria}</p>
            <p><strong>Técnico:</strong> {reporte.tecnico || 'Sin asignar'}</p>
            <p>
              <strong>Fecha programada:</strong>{' '}
              {reporte.fecha_programada
                ? new Date(`${reporte.fecha_programada}T00:00:00`).toLocaleDateString()
                : '-'}
            </p>
            <p className="detalle-reporte-descripcion">
              <strong>Descripción:</strong> {reporte.descripcion}
            </p>
          </div>

          <h3>Estados y comentarios del técnico</h3>

          {reporte.comentarios.length === 0 ? (
            <p className="asignar-reporte-vacio">El técnico aún no ha registrado avances.</p>
          ) : (
            <ul className="detalle-historial">
              {reporte.comentarios.map((c) => (
                <li key={c.id} className="detalle-historial-item">
                  <div className="detalle-historial-cabecera">
                    <span className={`estado-etiqueta estado-${c.estado}`}>
                      {ETIQUETAS_ESTADO[c.estado] || c.estado}
                    </span>
                    <span className="detalle-historial-meta">
                      {c.autor} · {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p>{c.comentario || 'Sin comentario.'}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

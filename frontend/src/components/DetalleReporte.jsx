import { useEffect, useState } from 'react'
import axios from 'axios'
import { avisarExito, avisarError, confirmarAccion } from '../utils/notificaciones'
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
  const [tecnicos, setTecnicos] = useState([])
  const [editando, setEditando] = useState(false)
  const [edicionTecnico, setEdicionTecnico] = useState('')
  const [edicionFecha, setEdicionFecha] = useState('')
  const [guardando, setGuardando] = useState(false)

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

  useEffect(() => {
    cargarReporte()
  }, [id])

  const iniciarEdicion = async () => {
    let listaTecnicos = []

    try {
      const respuesta = await axios.get('http://localhost:3000/tecnicos', {
        withCredentials: true,
      })
      listaTecnicos = respuesta.data
      setTecnicos(listaTecnicos)
    } catch (err) {
      avisarError('No se pudo cargar la lista de técnicos.')
      return
    }

    const tecnicoActual = listaTecnicos.find((t) => t.nombre === reporte.tecnico)
    setEdicionTecnico(tecnicoActual ? String(tecnicoActual.id) : '')
    setEdicionFecha(reporte.fecha_programada || '')
    setEditando(true)
  }

  const cancelarEdicion = () => {
    setEditando(false)
    setEdicionTecnico('')
    setEdicionFecha('')
  }

  const guardarEdicion = async () => {
    if (!edicionTecnico) {
      avisarError('Selecciona un técnico.')
      return
    }

    setGuardando(true)

    try {
      await axios.patch(
        `http://localhost:3000/reportes/${id}/${reporte.estado === 'PENDIENTE' ? 'asignar' : 'reasignar'}`,
        { tecnico_id: Number(edicionTecnico), fecha_programada: edicionFecha || null },
        { withCredentials: true }
      )
      avisarExito('Reporte actualizado correctamente.')
      cancelarEdicion()
      await cargarReporte()
    } catch (err) {
      avisarError(err.response?.data?.error || 'No se pudo actualizar el reporte.')
    } finally {
      setGuardando(false)
    }
  }

  const eliminarReporte = () => {
    confirmarAccion({
      titulo: `¿Eliminar el reporte #${reporte.id} de "${reporte.residente}"?`,
      descripcion: 'Esta acción no se puede deshacer.',
      textoBoton: 'Eliminar',
      onConfirmar: async () => {
        try {
          await axios.delete(`http://localhost:3000/reportes/${id}`, {
            withCredentials: true,
          })
          avisarExito('Reporte eliminado correctamente.')
          onVolver()
        } catch (err) {
          avisarError(err.response?.data?.error || 'No se pudo eliminar el reporte.')
        }
      },
    })
  }

  // El backend solo deja asignar reportes PENDIENTE y reasignar los ASIGNADO
  const puedeEditar = ['PENDIENTE', 'ASIGNADO'].includes(reporte?.estado)

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
            {editando ? (
              <>
                <p>
                  <strong>Técnico:</strong>{' '}
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
                </p>
                <p>
                  <strong>Fecha programada:</strong>{' '}
                  <input
                    type="date"
                    className="asignar-reporte-fecha"
                    value={edicionFecha}
                    onChange={(e) => setEdicionFecha(e.target.value)}
                  />
                </p>
              </>
            ) : (
              <>
                <p><strong>Técnico:</strong> {reporte.tecnico || 'Sin asignar'}</p>
                <p>
                  <strong>Fecha programada:</strong>{' '}
                  {reporte.fecha_programada
                    ? new Date(`${reporte.fecha_programada}T00:00:00`).toLocaleDateString()
                    : '-'}
                </p>
              </>
            )}
            <p className="detalle-reporte-descripcion">
              <strong>Descripción:</strong> {reporte.descripcion}
            </p>
          </div>

          {(
            <div className="detalle-reporte-acciones">
              {editando ? (
                <>
                  <button
                    className="boton-verReporte"
                    disabled={guardando}
                    onClick={guardarEdicion}
                  >
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button className="boton-eliminar" onClick={cancelarEdicion}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="boton-editar"
                    disabled={!puedeEditar}
                    title={puedeEditar ? '' : 'Solo se pueden editar reportes Pendientes o Asignados'}
                    onClick={iniciarEdicion}
                  >
                    Editar reporte
                  </button>
                  <button className="boton-eliminar" onClick={eliminarReporte}>
                    Eliminar reporte
                  </button>
                </>
              )}
            </div>
          )}

          {!puedeEditar && !editando && (
            <p className="detalle-reporte-nota">
              Solo se pueden editar reportes Pendientes o Asignados.
            </p>
          )}

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

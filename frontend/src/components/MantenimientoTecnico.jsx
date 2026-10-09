import { useEffect, useState } from "react";
import "./MantenimientoTecnico.css";

const URL_MANTENIMIENTOS = "http://localhost:3000/maintenance";

const ETIQUETAS_ESTADO = {
  PENDIENTE: "Pendiente",
  ASIGNADO: "Asignado",
  PROGRAMADO: "Programado",
  EN_PROCESO: "En proceso",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

const ESTADOS_CERRADOS = ["COMPLETADO", "CANCELADO"];

const formatearFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleDateString("es-CO") : "—";

const formatearFechaHora = (fecha) =>
  new Date(fecha).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });

export default function MantenimientoTecnico() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [seleccionado, setSeleccionado] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState("");

  async function cargarMantenimientos() {
    try {
      const respuesta = await fetch(URL_MANTENIMIENTOS, { credentials: "include" });

      if (!respuesta.ok) {
        throw new Error("Error al cargar los mantenimientos");
      }

      const datos = await respuesta.json();
      setMantenimientos(datos);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarMantenimientos();
  }, []);

  async function cargarComentarios(id) {
    try {
      const respuesta = await fetch(`${URL_MANTENIMIENTOS}/${id}/comentarios`, {
        credentials: "include",
      });

      if (!respuesta.ok) {
        throw new Error("Error al cargar los comentarios");
      }

      setComentarios(await respuesta.json());
    } catch (error) {
      console.error(error);
      setComentarios([]);
    }
  }

  function abrirModal(mantenimiento) {
    setSeleccionado(mantenimiento);
    setNuevoEstado("");
    setNuevoComentario("");
    setErrorModal("");
    setComentarios([]);
    cargarComentarios(mantenimiento.id);
  }

  function cerrarModal() {
    if (guardando) return;
    setSeleccionado(null);
  }

  async function guardarActualizacion(evento) {
    evento.preventDefault();
    setErrorModal("");

    if (!nuevoEstado && !nuevoComentario.trim()) {
      setErrorModal("Agrega un comentario o cambia el estado.");
      return;
    }

    setGuardando(true);
    try {
      const respuesta = await fetch(`${URL_MANTENIMIENTOS}/${seleccionado.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: nuevoEstado || undefined,
          comentario: nuevoComentario,
        }),
      });

      if (!respuesta.ok) {
        const datos = await respuesta.json().catch(() => ({}));
        throw new Error(datos.error || "No se pudo actualizar el reporte");
      }

      await cargarMantenimientos();

      if (nuevoEstado && ESTADOS_CERRADOS.includes(nuevoEstado)) {
        setSeleccionado(null);
      } else {
        setNuevoEstado("");
        setNuevoComentario("");
        await cargarComentarios(seleccionado.id);
        setSeleccionado((actual) =>
          actual ? { ...actual, estado: nuevoEstado || actual.estado } : actual
        );
      }
    } catch (error) {
      setErrorModal(error.message);
    } finally {
      setGuardando(false);
    }
  }

  const reporteCerrado = seleccionado && ESTADOS_CERRADOS.includes(seleccionado.estado);

  return (
    <main className="mantenimiento-tecnico">

        <div className="mantenimiento-encabezado">
            <div>
                <h1>Mis mantenimientos</h1>
                <p>Consulta los mantenimientos asignados al técnico.</p>
            </div>

            <button className="boton-filtrar" disabled>
                Filtrar
            </button>
        </div>



      {cargando ? (
        <p>Cargando mantenimientos...</p>
      ) : (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Fecha de creación</th>
                <th>Tipo</th>
                <th>Técnico</th>
                <th>Descripción</th>
                <th>Fecha programada</th>
                <th>Estado</th>
                <th>Fecha de cierre</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {mantenimientos.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    No hay mantenimientos registrados.
                  </td>
                </tr>
              ) : (
                mantenimientos.map((m) => (
                  <tr key={m.id}>
                    <td>{formatearFecha(m.fecha_creacion)}</td>

                    <td>{m.tipo || "—"}</td>

                    <td>{m.tecnico || "—"}</td>

                    <td>{m.descripcion || "—"}</td>

                    <td>{formatearFecha(m.fecha_programada)}</td>

                    <td>
                      <span className={`estado-etiqueta estado-${m.estado}`}>
                        {ETIQUETAS_ESTADO[m.estado] || m.estado}
                      </span>
                    </td>

                    <td>
                      {m.fecha_cierre ? formatearFecha(m.fecha_cierre) : "Pendiente"}
                    </td>

                    <td>
                      <button
                        className="boton-actualizar"
                        onClick={() => abrirModal(m)}
                      >
                        {ESTADOS_CERRADOS.includes(m.estado) ? "Ver historial" : "Actualizar"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {seleccionado && (
        <div className="modal-fondo" onClick={cerrarModal}>
          <div
            className="modal-contenido"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Reporte #{seleccionado.id}</h2>
            <p className="modal-descripcion">{seleccionado.descripcion}</p>
            <p className="modal-estado-actual">
              Estado actual:{" "}
              <span className={`estado-etiqueta estado-${seleccionado.estado}`}>
                {ETIQUETAS_ESTADO[seleccionado.estado] || seleccionado.estado}
              </span>
            </p>

            {!reporteCerrado && (
              <form onSubmit={guardarActualizacion} className="modal-formulario">
                <label htmlFor="nuevo-estado">Cambiar estado</label>
                <select
                  id="nuevo-estado"
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                >
                  <option value="">Mantener estado actual</option>
                  {seleccionado.estado !== "EN_PROCESO" && (
                    <option value="EN_PROCESO">En proceso</option>
                  )}
                  <option value="COMPLETADO">Completado</option>
                </select>

                <label htmlFor="nuevo-comentario">Comentario de avance</label>
                <textarea
                  id="nuevo-comentario"
                  rows="4"
                  maxLength="1000"
                  placeholder="Describe el progreso del trabajo..."
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                />

                {errorModal && <p className="modal-error">{errorModal}</p>}

                <div className="modal-acciones">
                  <button type="button" className="boton-secundario" onClick={cerrarModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="boton-actualizar" disabled={guardando}>
                    {guardando ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            )}

            <h3>Historial de avances</h3>
            {comentarios.length === 0 ? (
              <p className="modal-vacio">Aún no hay comentarios.</p>
            ) : (
              <ul className="modal-historial">
                {comentarios.map((c) => (
                  <li key={c.id}>
                    <div className="historial-cabecera">
                      <span>{formatearFechaHora(c.created_at)}</span>
                      <span className={`estado-etiqueta estado-${c.estado}`}>
                        {ETIQUETAS_ESTADO[c.estado] || c.estado}
                      </span>
                    </div>
                    {c.comentario && <p>{c.comentario}</p>}
                  </li>
                ))}
              </ul>
            )}

            {reporteCerrado && (
              <div className="modal-acciones">
                <button type="button" className="boton-secundario" onClick={cerrarModal}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

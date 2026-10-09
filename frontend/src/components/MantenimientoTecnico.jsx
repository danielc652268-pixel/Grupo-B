import { useEffect, useState } from "react";
import "./MantenimientoTecnico.css";

const URL_MANTENIMIENTOS = "http://localhost:3000/maintenance";

export default function MantenimientoTecnico() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarMantenimientos() {
      try {
        const respuesta = await fetch(URL_MANTENIMIENTOS);

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

    cargarMantenimientos();
  }, []);

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
                <th>Fecha de cierre</th>
              </tr>
            </thead>

            <tbody>
              {mantenimientos.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    No hay mantenimientos registrados.
                  </td>
                </tr>
              ) : (
                mantenimientos.map((m) => (
                  <tr key={m.id}>
                    <td>
                      {m.fecha_creacion
                        ? new Date(m.fecha_creacion).toLocaleDateString("es-CO")
                        : "—"}
                    </td>

                    <td>{m.tipo || "—"}</td>

                    <td>{m.tecnico || "—"}</td>

                    <td>{m.descripcion || "—"}</td>

                    <td>
                      {m.fecha_programada
                        ? new Date(m.fecha_programada).toLocaleDateString("es-CO")
                        : "—"}
                    </td>

                    <td>
                      {m.fecha_cierre
                        ? new Date(m.fecha_cierre).toLocaleDateString("es-CO")
                        : "Pendiente"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

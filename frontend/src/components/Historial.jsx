
import { useEffect, useState } from "react";
import "./Historial.css";

const URL_PROPIETARIOS = "http://localhost:3000/propietarios";
const URL_MANTENIMIENTOS = "http://localhost:3000/mantenimiento";



const ESTADOS_MANTENIMIENTO = {
  1: { texto: "Programado", clase: "programado" },
  2: { texto: "En proceso", clase: "proceso" },
  3: { texto: "Completado", clase: "completado" },
  4: { texto: "Cancelado", clase: "cancelado" },
};

const ICONOS_TIPO = {
  Ascensor: "🛗",
  Piscina: "🏊",
  Eléctrico: "💡",
  Pintura: "🎨",
  Plomería: "🚰",
};

const COLORES_AVATAR = [
  "#e0e7ff",
  "#fce7f3",
  "#dcfce7",
  "#fef3c7",
  "#e0f2fe",
  "#f3e8ff",
];



function obtenerIniciales(nombre) {
  if (!nombre) return "—";

  return nombre
    .split(" ")
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join("")
    .toUpperCase();
}

function formatearFecha(fecha) {
  if (!fecha) 
    return "—";

  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function useDatos(url) {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        console.log("URL:", url);

        const respuesta = await fetch(url);

        console.log("STATUS:", respuesta.status);

        if (!respuesta.ok) {
          throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datosRecibidos = await respuesta.json();

        console.log("JSON RECIBIDO:", datosRecibidos);

        setDatos(datosRecibidos);
      } catch (e) {
        console.error("ERROR:", e);
        setError("No pudimos cargar la información.");
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [url]);

  return {
    datos,
    cargando,
    error,
  };
}



function TablaPropietarios() {
  const { datos, cargando, error } = useDatos(URL_PROPIETARIOS);

  const [filtro, setFiltro] = useState("todos");



  const opciones = [
    {
      valor: "todos",
      texto: "Todos",
      cantidad: datos.length,
    },

    {
      valor: "activos",
      texto: "Activos",
      cantidad: datos.filter((p) => p.estado === 1).length,
    },

    {
      valor: "inactivos",
      texto: "Inactivos",
      cantidad: datos.filter((p) => p.estado === 0).length,
    },
  ];

  const propietariosFiltrados = datos.filter((p) => {
    if (filtro === "activos") {
      return p.estado === 1;
    }

    if (filtro === "inactivos") {
      return p.estado === 0;
    }

    return true;
  });

  return (
    <section className="tarjeta">

      <div className="tarjeta-encabezado">

        <h2>Propietarios</h2>

        <div className="filtro">

          {opciones.map((opcion) => (
            <button
              key={opcion.valor}
              className={filtro === opcion.valor ? "activo" : ""}
              onClick={() => setFiltro(opcion.valor)}
            >
              {opcion.texto} <span>{opcion.cantidad}</span>
            </button>
          ))}

        </div>

      </div>

      {cargando && (
        <p className="mensaje">
          Cargando propietarios...
        </p>
      )}

      {error && (
        <p className="mensaje error">
          {error}
        </p>
      )}

      {!cargando && !error && (

        <div className="tabla-contenedor">

          <table>

            <thead>

              <tr>
                <th>Nombres</th>
                <th>Residencia</th>
                <th>Email</th>
                <th>Estado</th>
              </tr>

            </thead>

            <tbody>

              {propietariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="4" className="vacio">
                    No hay propietarios con este estado.
                  </td>
                </tr>
              )}

              {propietariosFiltrados.map((p, index) => (

                <tr key={`${p.email}-${index}`}>

                  <td>

                    <div className="persona">

                      <span
                        className="avatar"
                        style={{
                          background:
                            COLORES_AVATAR[
                              index % COLORES_AVATAR.length
                            ],
                        }}
                      >
                        {obtenerIniciales(p.nombre)}
                      </span>

                      {p.nombre}

                    </div>

                  </td>

                  <td>
                    {p.res_nombre}
                  </td>

                  <td>
                    {p.email}
                  </td>

                  <td>

                    <span
                      className={`etiqueta ${
                        p.estado === 1
                          ? "activo"
                          : "inactivo"
                      }`}
                    >
                      {p.estado === 1
                        ? "Activo"
                        : "Inactivo"}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}



function TablaMantenimiento() {
  const { datos, cargando, error } = useDatos(URL_MANTENIMIENTOS);

  return (
    <section className="tarjeta">

      <div className="tarjeta-encabezado">
        <h2>Mantenimiento</h2>
      </div>

      {cargando && (
        <p className="mensaje">
          Cargando mantenimientos...
        </p>
      )}

      {error && (
        <p className="mensaje error">
          {error}
        </p>
      )}

      {!cargando && !error && (

        <div className="tabla-contenedor">

          <table>

            <thead>

              <tr>
                <th>Tipo</th>
                <th>Fecha programada</th>
                <th>Descripción</th>
                <th>Estado</th>
              </tr>

            </thead>

            <tbody>

              {datos.length === 0 && (
                <tr>
                  <td colSpan="6" className="vacio">
                    Aún no hay mantenimientos registrados.
                  </td>
                </tr>
              )}

              {datos.map((m) => {

                const estado =
                  ESTADOS_MANTENIMIENTO[m.estado];

                return (

                  <tr key={m.id}>

                    <td>

                      <div className="persona">

                        <span className="icono">
                          {ICONOS_TIPO[m.tipo] || "🔧"}
                        </span>

                        {m.tipo}

                      </div>

                    </td>

                    <td>
                      {formatearFecha(m.fecha_programada)}
                    </td>

                    <td className="descripcion">
                      {m.descripcion}
                    </td>


                    <td>

                      <span
                        className={`etiqueta ${
                          estado ? estado.clase : ""
                        }`}
                      >
                        {m.estado == 3
                          ? programado
                          : "Desconocido"}
                      </span>

                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}



export default function Historial() {

  return (
    <main className="historial">

      <h1>Historial</h1>

      <TablaPropietarios />

      <TablaMantenimiento />

    </main>
  );
}


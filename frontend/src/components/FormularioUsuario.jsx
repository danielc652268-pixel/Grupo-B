import { useState, useEffect } from 'react'
import axios from 'axios'
import './FormularioUsuario.css'

const ROLES = [
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Técnico' },
  { id: 3, nombre: 'Residente' },
]

const DATOS_VACIOS = {
  nombre: '',
  correo: '',
  contrasena: '',
  rol: '',
  apartamento: '',
}

export default function FormularioUsuario({ onGuardado }) {
  const [isOpen, setIsOpen] = useState(false)
  const [datos, setDatos] = useState(DATOS_VACIOS)
  const [residenciales, setResidenciales] = useState([])
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const cargarResidenciales = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3000/residenciales', {
          withCredentials: true,
        })
        setResidenciales(respuesta.data)
      } catch (err) {
        console.log('No se pudo cargar la lista de residenciales', err)
      }
    }

    cargarResidenciales()
  }, [])

  const manejarCambio = (e) => {
    const { name, value } = e.target
    const nuevosDatos = { ...datos, [name]: value }

    if (name === 'rol' && value !== '3') {
      nuevosDatos.apartamento = ''
    }

    setDatos(nuevosDatos)
  }

  const cerrarModal = () => {
    setIsOpen(false)
    setDatos(DATOS_VACIOS)
    setError('')
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await axios.post(
        'http://localhost:3000/register',
        {
          nombre: datos.nombre,
          email: datos.correo,
          password: datos.contrasena,
          role_id: Number(datos.rol),
        },
        { withCredentials: true }
      )

      alert('¡Usuario creado exitosamente!')
      cerrarModal()
      onGuardado?.()
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Ese correo ya está registrado.')
      } else {
        setError('No se pudo crear el usuario. Revisa los datos.')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="form-usuario-container">

      <button
        onClick={() => setIsOpen(true)}
        className="btn-abrir-usuario"
      >
        + Crear Usuario
      </button>

      {isOpen && (
        <div className="modal-overlay-usuario">
          <div className="modal-contenido-usuario">
            <h2>Crear Usuario</h2>

            {error && <p style={{ color: '#d32f2f' }}>{error}</p>}

            <form onSubmit={manejarEnvio}>
              <div className="grupo-input-usuario">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Nombre completo"
                  value={datos.nombre}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="grupo-input-usuario">
                <label htmlFor="correo">Correo:</label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={datos.correo}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="grupo-input-usuario">
                <label htmlFor="contrasena">Contraseña inicial:</label>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  placeholder="Contraseña inicial"
                  value={datos.contrasena}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="grupo-input-usuario">
                <label htmlFor="rol">Rol:</label>
                <select
                  id="rol"
                  name="rol"
                  value={datos.rol}
                  onChange={manejarCambio}
                  required
                >
                  <option value="" disabled>Seleccione un rol...</option>
                  {ROLES.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {datos.rol === '3' && (
                <div className="grupo-input-usuario">
                  <label htmlFor="apartamento">Residencial / Edificio:</label>
                  <select
                    id="apartamento"
                    name="apartamento"
                    value={datos.apartamento}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="">Selecciona un residencial</option>
                    {residenciales.map((residencial) => (
                      <option key={residencial.id} value={residencial.id}>
                        {residencial.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="botones-accion-usuario">
                <button type="submit" className="btn-guardar-usuario" disabled={enviando}>
                  {enviando ? 'Guardando...' : 'Crear Usuario'}
                </button>
                <button type="button" onClick={cerrarModal} className="btn-cancelar-usuario">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

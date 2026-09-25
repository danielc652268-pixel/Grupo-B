import { useState, useEffect } from 'react'
import axios from 'axios'
import './FormularioUsuario.css'

const ROLES = [
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Técnico' },
  { id: 3, nombre: 'Residente' },
]

export default function FormularioUsuario() {
  const [datos, setDatos] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    rol: '',
    apartamento: '',
  })
  const [residenciales, setResidenciales] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

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

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    try {
      await axios.post('http://localhost:3000/register', {
        nombre: datos.nombre,
        email: datos.correo,
        password: datos.contrasena,
        role_id: Number(datos.rol),
      }, { withCredentials: true })
      setMensaje('Usuario creado correctamente')
      setDatos({ nombre: '', correo: '', contrasena: '', rol: '', apartamento: '' })
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Ese correo ya está registrado.')
      } else {
        setError('No se pudo crear el usuario. Revisa los datos.')
      }
    }
  }

  return (
    <form className="form-usuario" onSubmit={manejarEnvio}>
      <h2>Crear usuario</h2>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: '#d32f2f' }}>{error}</p>}

      <label htmlFor="nombre">Nombre</label>
      <input
        id="nombre"
        name="nombre"
        type="text"
        placeholder="Nombre completo"
        value={datos.nombre}
        onChange={manejarCambio}
        required
      />

      <label htmlFor="correo">Correo</label>
      <input
        id="correo"
        name="correo"
        type="email"
        placeholder="correo@ejemplo.com"
        value={datos.correo}
        onChange={manejarCambio}
        required
      />

      <label htmlFor="contrasena">Contraseña inicial</label>
      <input
        id="contrasena"
        name="contrasena"
        type="password"
        placeholder="Contraseña inicial"
        value={datos.contrasena}
        onChange={manejarCambio}
        required
      />

      <label htmlFor="rol">Rol</label>
      <select
        id="rol"
        name="rol"
        value={datos.rol}
        onChange={manejarCambio}
        required
      >
        <option value="">Selecciona un rol</option>
        {ROLES.map((rol) => (
          <option key={rol.id} value={rol.id}>
            {rol.nombre}
          </option>
        ))}
      </select>

      {datos.rol === '3' && (
        <>
          <label htmlFor="apartamento">Residencial / Edificio</label>
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
        </>
      )}

      <button type="submit">Crear usuario</button>
    </form>
  )
}
import { useState } from 'react'
import './FormularioUsuario.css'

const ROLES = ['Administrador', 'Técnico', 'Residente']

export default function FormularioUsuario() {
  const [datos, setDatos] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    rol: '',
  })

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const manejarEnvio = (e) => {
    e.preventDefault()
    // El guardado se implementa en #24
  }

  return (
    <form className="form-usuario" onSubmit={manejarEnvio}>
      <h2>Crear usuario</h2>

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
          <option key={rol} value={rol}>
            {rol}
          </option>
        ))}
      </select>

      <button type="submit">Crear usuario</button>
    </form>
  )
}
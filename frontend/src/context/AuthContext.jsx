import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  const cargarUsuario = async () => {
    try {
      const respuesta = await axios.get('http://localhost:3000/me', {
        withCredentials: true,
      })
      setUsuario(respuesta.data)
    } catch (err) {
      setUsuario(null)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarUsuario()
  }, [])

  const cerrarSesion = async () => {
    await axios.post('http://localhost:3000/logout', {}, { withCredentials: true })
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, cargarUsuario, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
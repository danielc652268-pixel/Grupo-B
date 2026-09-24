import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import FormularioUsuario from './components/FormularioUsuario'
import Login from './assets/components/Login'
import Dashboard from './components/Dashboard'
import RutaProtegida from './components/RutaProtegida'
import AccesoDenegado from './components/AccesoDenegado'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            }
          />

          <Route
            path="/crear-usuario"
            element={
              <RutaProtegida rolesPermitidos={[1]}>
                <FormularioUsuario />
              </RutaProtegida>
            }
          />

          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
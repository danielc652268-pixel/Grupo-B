import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import FormularioUsuario from './components/FormularioUsuario'
import Login from './assets/components/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/crear-usuario" element={<FormularioUsuario />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
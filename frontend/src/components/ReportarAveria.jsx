import { useState, useEffect } from 'react'
import axios from 'axios'
import './ReportarAveria.css'

const CATEGORIAS = [
  { valor: 'PLOMERIA', etiqueta: 'Plomería' },
  { valor: 'ELECTRICIDAD', etiqueta: 'Electricidad' },
  { valor: 'ELEVADOR', etiqueta: 'Elevador' },
  { valor: 'ESTRUCTURAL', etiqueta: 'Estructural' },
  { valor: 'OTRO', etiqueta: 'Otro' },
]

export default function ReportarAveria() {
  const [apartamento, setApartamento] = useState(null)
  const [areas, setAreas] = useState([])
  const [ubicacion, setUbicacion] = useState('apartamento')
  const [areaComunId, setAreaComunId] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3000/reportes/formulario', {
          withCredentials: true,
        })
        setApartamento(respuesta.data.apartamento)
        setAreas(respuesta.data.areas)
        if (!respuesta.data.apartamento) {
          setUbicacion('area_comun')
        }
      } catch (err) {
        setError('No se pudo cargar la información del formulario.')
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    try {
      await axios.post('http://localhost:3000/reportes', {
        ubicacion,
        apartamento_id: apartamento?.id,
        area_comun_id: areaComunId ? Number(areaComunId) : null,
        categoria,
        descripcion,
      }, { withCredentials: true })

      setMensaje('Tu reporte fue enviado. Le avisaremos al equipo de mantenimiento.')
      setCategoria('')
      setDescripcion('')
      setAreaComunId('')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo enviar el reporte.')
    }
  }

  if (cargando) {
    return <p>Cargando...</p>
  }

  return (
    <form className="form-reporte" onSubmit={manejarEnvio}>
      <h2>Reportar un problema</h2>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: '#d32f2f' }}>{error}</p>}

      <label>Ubicación del problema</label>
      <div className="opciones-ubicacion">
        <label>
          <input
            type="radio"
            name="ubicacion"
            value="apartamento"
            checked={ubicacion === 'apartamento'}
            onChange={() => setUbicacion('apartamento')}
            disabled={!apartamento}
          />
          Mi apartamento {apartamento ? `(${apartamento.nombre})` : '(no tienes uno asignado)'}
        </label>

        <label>
          <input
            type="radio"
            name="ubicacion"
            value="area_comun"
            checked={ubicacion === 'area_comun'}
            onChange={() => setUbicacion('area_comun')}
          />
          Área común del edificio
        </label>
      </div>

      {ubicacion === 'area_comun' && (
        <select value={areaComunId} onChange={(e) => setAreaComunId(e.target.value)} required>
          <option value="">Selecciona un área</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>{area.nombre}</option>
          ))}
        </select>
      )}

      <label htmlFor="categoria">Categoría</label>
      <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
        <option value="">Selecciona una categoría</option>
        {CATEGORIAS.map((cat) => (
          <option key={cat.valor} value={cat.valor}>{cat.etiqueta}</option>
        ))}
      </select>

      <label htmlFor="descripcion">Descripción del problema</label>
      <textarea
        id="descripcion"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Cuéntanos qué está pasando"
        rows={4}
        required
      />

      <button type="submit">Enviar reporte</button>
    </form>
  )
}
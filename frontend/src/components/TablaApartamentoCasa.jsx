import { useEffect, useState } from 'react';
import axios from 'axios';
import './TablaApartamentoCasa.css';

export default function TablaApartamentoCasa({ recargar }) {

    const [apartamentos, setApartamentos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    const cargarApartamentos = async () => {
        setCargando(true)
        setError('')

        try {
            const respuesta = await axios.get('http://localhost:3000/apartamento', {
                withCredentials: true
            })
            setApartamentos(respuesta.data)
        } catch (err) {
            setError('No se pudieron cargar los apartamentos.')
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        cargarApartamentos()
    }, [recargar])

    const eliminarApartamento = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/apartamento/${id}`, {
                withCredentials: true
            })
            alert("Apartamento/Casa eliminado exitosamente")
            cargarApartamentos()
        } catch (error) {
            alert("No se pudo eliminar el apartamento/Casa")
        }
    }

    return (
        <div className='tabla-apartamento-container'>
            <table className='tabla-apartamento'>
                <thead>
                    <tr>
                        <th>Nombre del Edificio</th>
                        <th>Número de Apartamento</th>
                        <th>Nivel / Piso</th>
                        <th>Residencial</th>
                        <th>Residente</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {apartamentos.map((apartamento) => (
                        <tr key={apartamento.id}>
                            <td>{apartamento.nombre}</td>
                            <td>{apartamento.numero_apartamento}</td>
                            <td>{apartamento.piso_apartamento}</td>
                            <td>{apartamento.residencial_nombre}</td>
                            <td>{apartamento.residente_nombre || 'Sin asignar'}</td>
                            <td>
                                <button
                                    onClick={() => eliminarApartamento(apartamento.id)}
                                    className="btn-eliminar-apartamento"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}

                    {apartamentos.length === 0 && (
                        <tr>
                            <td colSpan="6" className="tabla-apartamento-vacio">
                                No hay apartamentos/Casas registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
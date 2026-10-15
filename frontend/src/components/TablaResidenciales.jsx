import { useEffect, useState } from 'react';
import { avisarExito, avisarError, confirmarAccion } from '../utils/notificaciones';
import axios from 'axios';
import './TablaResidenciales.css';

export default function TablaResidenciales({ recargar, onEditar }) {
    const [residenciales, setResidenciales] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const cargarResidenciales = async () => {
        setCargando(true);
        setError('');

        try {
            const respuesta = await axios.get('http://localhost:3000/residenciales', {
                withCredentials: true
            });
            setResidenciales(respuesta.data);
        } catch (err) {
            setError('No se pudieron cargar los residenciales.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarResidenciales();
    }, [recargar]);

    const handleDesactivar = (residencial) => {
        confirmarAccion({
            titulo: `¿Desactivar "${residencial.nombre}"?`,
            descripcion: 'Podrás reactivarlo más adelante editándolo.',
            textoBoton: 'Desactivar',
            onConfirmar: async () => {
                try {
                    await axios.patch(
                        `http://localhost:3000/residenciales/${residencial.id}/desactivar`,
                        {},
                        { withCredentials: true }
                    );
                    avisarExito(`"${residencial.nombre}" fue desactivado`);
                    cargarResidenciales();
                } catch (err) {
                    avisarError(err.response?.data?.error || 'No se pudo desactivar el residencial.');
                }
            },
        });
    };

    if (cargando) {
        return <p className="tabla-residenciales-mensaje">Cargando residenciales...</p>;
    }

    if (error) {
        return <p className="tabla-residenciales-mensaje tabla-residenciales-error">{error}</p>;
    }

    return (
        <div className="tabla-residenciales-container">
            <table className="tabla-residenciales">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Ciudad</th>
                        <th>Teléfono</th>
                        <th>Cantidad de Edificios</th>
                        <th>Estado</th>
                        <th>Fecha de registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {residenciales.map((residencial) => (
                        <tr key={residencial.id}>
                            <td>{residencial.nombre}</td>
                            <td>{residencial.direccion}</td>
                            <td>{residencial.ciudad}</td>
                            <td>{residencial.telefono}</td>
                            <td>{residencial.cantidad_edificios}</td>
                            <td>
                                <span
                                    className={`estado-badge estado-${residencial.estado
                                        .toLowerCase()
                                        .replace(/\s+/g, '-')}`}
                                >
                                    {residencial.estado}
                                </span>
                            </td>
                            <td>
                                {residencial.fecha_registro
                                    ? new Date(residencial.fecha_registro).toLocaleDateString()
                                    : ''}
                            </td>
                            <td className="tabla-residenciales-acciones">
                                <button
                                    className="btn-editar-residencial"
                                    onClick={() => onEditar(residencial)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn-desactivar-residencial"
                                    onClick={() => handleDesactivar(residencial)}
                                    disabled={residencial.estado === 'Inactivo'}
                                >
                                    Desactivar
                                </button>
                            </td>
                        </tr>
                    ))}

                    {residenciales.length === 0 && (
                        <tr>
                            <td colSpan="8" className="tabla-residenciales-vacio">
                                No hay residenciales registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

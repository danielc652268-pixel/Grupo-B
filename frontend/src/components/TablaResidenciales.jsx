import { useEffect, useState } from 'react';
import { avisarExito, avisarError } from '../utils/notificaciones';
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

    const [confirmacion, setConfirmacion] = useState(null);
    const [procesando, setProcesando] = useState(false);

    const pedirConfirmacion = (residencial, accion) => {
        setConfirmacion({ residencial, accion });
    };

    const cancelarConfirmacion = () => {
        if (!procesando) setConfirmacion(null);
    };

    const confirmarCambioEstado = async () => {
        const { residencial, accion } = confirmacion;
        const activando = accion === 'activar';

        setProcesando(true);

        try {
            await axios.patch(
                `http://localhost:3000/residenciales/${residencial.id}/${accion}`,
                {},
                { withCredentials: true }
            );
            avisarExito(`"${residencial.nombre}" fue ${activando ? 'activado' : 'desactivado'} correctamente.`);
            setConfirmacion(null);
            cargarResidenciales();
        } catch (err) {
            avisarError(
                err.response?.data?.error ||
                    `No se pudo ${activando ? 'activar' : 'desactivar'} el residencial.`
            );
            setConfirmacion(null);
        } finally {
            setProcesando(false);
        }
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
                                {residencial.estado === 'Inactivo' ? (
                                    <button
                                        className="btn-activar-residencial"
                                        onClick={() => pedirConfirmacion(residencial, 'activar')}
                                    >
                                        Activar
                                    </button>
                                ) : (
                                    <button
                                        className="btn-desactivar-residencial"
                                        onClick={() => pedirConfirmacion(residencial, 'desactivar')}
                                    >
                                        Desactivar
                                    </button>
                                )}
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
            {confirmacion && (
                <div className="modal-confirmar-fondo" onClick={cancelarConfirmacion}>
                    <div
                        className="modal-confirmar"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>
                            {confirmacion.accion === 'activar'
                                ? 'Activar residencial'
                                : 'Desactivar residencial'}
                        </h3>
                        <p>
                            {confirmacion.accion === 'activar'
                                ? `Estás por activar "${confirmacion.residencial.nombre}". El residencial volverá a estar activo.`
                                : `Estás por desactivar "${confirmacion.residencial.nombre}". Podrás volver a activarlo más adelante.`}
                        </p>
                        <div className="modal-confirmar-acciones">
                            <button
                                className="btn-cancelar-residencial"
                                onClick={cancelarConfirmacion}
                                disabled={procesando}
                            >
                                Cancelar
                            </button>
                            <button
                                className={
                                    confirmacion.accion === 'activar'
                                        ? 'btn-activar-residencial'
                                        : 'btn-desactivar-residencial'
                                }
                                onClick={confirmarCambioEstado}
                                disabled={procesando}
                            >
                                {procesando
                                    ? 'Procesando...'
                                    : confirmacion.accion === 'activar'
                                      ? 'Sí, activar'
                                      : 'Sí, desactivar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

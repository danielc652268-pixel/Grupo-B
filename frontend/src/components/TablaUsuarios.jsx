import { useEffect, useState } from 'react';
import axios from 'axios';
import './TablaUsuarios.css';

export default function TablaUsuarios({ recargar }) {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const cargarUsuarios = async () => {
        setCargando(true);
        setError('');

        try {
            const respuesta = await axios.get('http://localhost:3000/usuarios', {
                withCredentials: true
            });
            setUsuarios(respuesta.data);
        } catch (err) {
            setError('No se pudieron cargar los usuarios.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, [recargar]);

    if (cargando) {
        return <p className="tabla-usuarios-mensaje">Cargando usuarios...</p>;
    }

    if (error) {
        return <p className="tabla-usuarios-mensaje tabla-usuarios-error">{error}</p>;
    }

    return (
        <div className="tabla-usuarios-container">
            <table className="tabla-usuarios">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Fecha de creación</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.rol}</td>
                            <td>
                                <span
                                    className={`estado-badge-usuario ${
                                        usuario.estado ? 'estado-activo-usuario' : 'estado-inactivo-usuario'
                                    }`}
                                >
                                    {usuario.estado ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td>{new Date(usuario.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}

                    {usuarios.length === 0 && (
                        <tr>
                            <td colSpan="5" className="tabla-usuarios-vacio">
                                No hay usuarios registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

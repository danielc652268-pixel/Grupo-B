import { useEffect, useState } from 'react';
import axios from 'axios';
import './FormularioResidencialyEdificios.css';

const DATOS_VACIOS = {
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    estado: '',
    fechaRegistro: ''
};

export default function FormularioResidencialyEdificios({ residencialEditar, onCerrarEdicion, onGuardado }) {
    const [isOpen, setIsOpen] = useState(false);
    const [infoResidencial, setInfoResidencial] = useState(DATOS_VACIOS);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const editando = Boolean(residencialEditar);
    const modalAbierto = editando || isOpen;

    useEffect(() => {
        if (residencialEditar) {
            setInfoResidencial({
                nombre: residencialEditar.nombre || '',
                direccion: residencialEditar.direccion || '',
                ciudad: residencialEditar.ciudad || '',
                telefono: residencialEditar.telefono || '',
                estado: residencialEditar.estado || '',
                fechaRegistro: residencialEditar.fecha_registro
                    ? String(residencialEditar.fecha_registro).slice(0, 10)
                    : ''
            });
            setError('');
        }
    }, [residencialEditar]);

    const manejoCambio = (e) => {
        const { name, value } = e.target;
        setInfoResidencial({ ...infoResidencial, [name]: value });
    };

    const cerrarModal = () => {
        setIsOpen(false);
        setInfoResidencial(DATOS_VACIOS);
        setError('');
        if (editando) {
            onCerrarEdicion?.();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEnviando(true);

        try {
            if (editando) {
                await axios.put(
                    `http://localhost:3000/residenciales/${residencialEditar.id}`,
                    infoResidencial,
                    { withCredentials: true }
                );
                alert("¡Residencial/Edificio actualizado exitosamente!");
            } else {
                await axios.post(
                    'http://localhost:3000/residenciales',
                    infoResidencial,
                    { withCredentials: true }
                );
                alert("¡Residencial/Edificio registrado exitosamente!");
            }

            setInfoResidencial(DATOS_VACIOS);
            setIsOpen(false);
            onGuardado?.();
            if (editando) {
                onCerrarEdicion?.();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'No se pudo guardar el residencial.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="form-residencial-container">

            <button
                onClick={() => setIsOpen(true)}
                className="btn-abrir-residencial"
            >
                + Registrar Residencial / Edificio
            </button>


            {modalAbierto && (
                <div className="modal-overlay-residencial">
                    <div className="modal-contenido-residencial">
                        <h2>{editando ? 'Editar Residencial' : 'Registro de Residencial'}</h2>

                        {error && <p style={{ color: '#d32f2f' }}>{error}</p>}

                        <form onSubmit={handleSubmit}>
                            <div className="grupo-input-residencial">
                                <label>Nombre del Residencial/Edificio:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={infoResidencial.nombre}
                                    onChange={manejoCambio}
                                    placeholder="Ej. Residencial Las Palmas"
                                    required
                                />
                            </div>

                            <div className="grupo-input-residencial">
                                <label>Dirección:</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={infoResidencial.direccion}
                                    onChange={manejoCambio}
                                    placeholder="Calle principal #123"
                                    required
                                />
                            </div>

                            <div className="grupo-input-residencial">
                                <label>Ciudad:</label>
                                <input
                                    type="text"
                                    name="ciudad"
                                    value={infoResidencial.ciudad}
                                    onChange={manejoCambio}
                                    placeholder="Ej. Santo Domingo"
                                    required
                                />
                            </div>

                            <div className="grupo-input-residencial">
                                <label>Teléfono:</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={infoResidencial.telefono}
                                    onChange={manejoCambio}
                                    placeholder="809-555-5555"
                                    required
                                />
                            </div>

                            <div className="grupo-input-residencial">
                                <label>Estado:</label>
                                <select
                                    name="estado"
                                    value={infoResidencial.estado}
                                    onChange={manejoCambio}
                                    required
                                >
                                    <option value="" disabled>Seleccione un estado...</option>
                                    <option value="Activo">Activo</option>
                                    <option value="En Construcción">En Construcción</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>

                            <div className="grupo-input-residencial">
                                <label>Fecha de Registro:</label>
                                <input
                                    type="date"
                                    name="fechaRegistro"
                                    value={infoResidencial.fechaRegistro}
                                    onChange={manejoCambio}
                                    required
                                />
                            </div>

                            <div className="botones-accion-residencial">
                                <button type="submit" className="btn-guardar-residencial" disabled={enviando}>
                                    {enviando ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Guardar Registro'}
                                </button>
                                <button type="button" onClick={cerrarModal} className="btn-cancelar-residencial">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

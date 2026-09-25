import { useEffect, useState } from 'react';
import axios from 'axios';
import './FormularioApartamentoCasa.css';

const DATOS_VACIOS = {
    nombre: '',
    numero_apartamento: '',
    piso_apartamento: '',
    residencial_id: '',
    usuario_id: ''
};

export default function FormularioApartamentoCasa({ apartamentoEditar, onCerrarEdicion, onGuardado }) {
    const [isOpen, setIsOpen] = useState(false);
    const [infoApartamento, setInfoApartamento] = useState(DATOS_VACIOS);
    const [residenciales, setResidenciales] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const editando = Boolean(apartamentoEditar);
    const modalAbierto = editando || isOpen;

    useEffect(() => {
        const cargarResidenciales = async () => {
            try {
                const respuesta = await axios.get('http://localhost:3000/residenciales', {
                    withCredentials: true,
                });
                setResidenciales(respuesta.data);
            } catch (err) {
                console.log('No se pudo cargar la lista de residenciales', err);
            }
        };

        cargarResidenciales();
    }, []);

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const respuesta = await axios.get('http://localhost:3000/usuarios', {
                    withCredentials: true,
                });
                setUsuarios(respuesta.data);
            } catch (err) {
                console.log('No se pudo cargar la lista de usuarios', err);
            }
        };

        cargarUsuarios();
    }, []);

    useEffect(() => {
        if (apartamentoEditar) {
            setInfoApartamento({
                nombre: apartamentoEditar.nombre || '',
                numero_apartamento: apartamentoEditar.numero_apartamento ?? '',
                piso_apartamento: apartamentoEditar.piso_apartamento ?? '',
                residencial_id: apartamentoEditar.residencial_id || '',
                usuario_id: apartamentoEditar.usuario_id || ''
            });
            setError('');
        }
    }, [apartamentoEditar]);

    const manejoCambio = (e) => {
        const { name, value } = e.target;
        setInfoApartamento({ ...infoApartamento, [name]: value });
    };

    const cerrarModal = () => {
        setIsOpen(false);
        setInfoApartamento(DATOS_VACIOS);
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
                    `http://localhost:3000/apartamento/${apartamentoEditar.id}`,
                    infoApartamento,
                    { withCredentials: true }
                );
                alert("¡Apartamento/Casa actualizado exitosamente!");
            } else {
                await axios.post(
                    'http://localhost:3000/apartamento',
                    infoApartamento,
                    { withCredentials: true }
                );
                alert("¡Apartamento/Casa registrado exitosamente!");
            }

            setInfoApartamento(DATOS_VACIOS);
            setIsOpen(false);
            onGuardado?.();
            if (editando) {
                onCerrarEdicion?.();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'No se pudo guardar el apartamento.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="form-apartamento-container">
            <button
                onClick={() => setIsOpen(true)}
                className="btn-abrir-apartamento"
            >
                + Registrar Apartamento / Casa
            </button>

            {modalAbierto && (
                <div className="modal-overlay-apartamento">
                    <div className="modal-contenido-apartamento">
                        <h2>{editando ? 'Editar Apartamento o Casa' : 'Registro de Apartamento o Casa'}</h2>

                        {error && <p style={{ color: '#d32f2f' }}>{error}</p>}

                        <form onSubmit={handleSubmit}>
                            <div className="grupo-input-apartamento">
                                <label>Nombre del Edificio:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={infoApartamento.nombre}
                                    onChange={manejoCambio}
                                    placeholder="Ej. Torre A - PH1"
                                    required
                                />
                            </div>

                            <div className="grupo-input-apartamento">
                                <label>Número de Apartamento:</label>
                                <input
                                    type="number"
                                    name="numero_apartamento"
                                    value={infoApartamento.numero_apartamento}
                                    onChange={manejoCambio}
                                    placeholder="Ej. 101"
                                    required
                                />
                            </div>

                            <div className="grupo-input-apartamento">
                                <label>Nivel / Piso:</label>
                                <input
                                    type="number"
                                    name="piso_apartamento"
                                    value={infoApartamento.piso_apartamento}
                                    onChange={manejoCambio}
                                    placeholder="Ej. 1"
                                    required
                                />
                            </div>

                            <div className="grupo-input-apartamento">
                                <label>Residencial:</label>
                                <select
                                    name="residencial_id"
                                    value={infoApartamento.residencial_id}
                                    onChange={manejoCambio}
                                    required
                                >
                                    <option value="" disabled>Seleccione un residencial...</option>
                                    {residenciales.map((residencial) => (
                                        <option key={residencial.id} value={residencial.id}>
                                            {residencial.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grupo-input-apartamento">
                                <label>Residente:</label>
                                <select
                                    name="usuario_id"
                                    value={infoApartamento.usuario_id}
                                    onChange={manejoCambio}
                                >
                                    <option value="">Sin residente asignado</option>
                                    {usuarios.map((usuario) => (
                                        <option key={usuario.id} value={usuario.id}>
                                            {usuario.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grupo-botones-apartamento">
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="btn-cancelar-apartamento"
                                    disabled={enviando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-guardar-apartamento"
                                    disabled={enviando}
                                >
                                    {enviando ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

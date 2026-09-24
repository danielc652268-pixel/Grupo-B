import { useState } from 'react';
import FormularioResidencialyEdificios from './FormularioResidencialyEdificios';
import TablaResidenciales from './TablaResidenciales';

export default function PanelResidenciales() {
    const [recargar, setRecargar] = useState(0);
    const [residencialEditar, setResidencialEditar] = useState(null);

    const handleGuardado = () => {
        setRecargar((valor) => valor + 1);
    };

    return (
        <div>
            <FormularioResidencialyEdificios
                residencialEditar={residencialEditar}
                onCerrarEdicion={() => setResidencialEditar(null)}
                onGuardado={handleGuardado}
            />

            <TablaResidenciales recargar={recargar} onEditar={setResidencialEditar} />
        </div>
    );
}

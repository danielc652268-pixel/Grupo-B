import { useState } from 'react';
import FormularioUsuario from './FormularioUsuario';
import TablaUsuarios from './TablaUsuarios';

export default function PanelUsuarios() {
    const [recargar, setRecargar] = useState(0);

    const handleGuardado = () => {
        setRecargar((valor) => valor + 1);
    };

    return (
        <div>
            <FormularioUsuario onGuardado={handleGuardado} />
            <TablaUsuarios recargar={recargar} />
        </div>
    );
}

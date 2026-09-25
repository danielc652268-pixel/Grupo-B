import { useState } from 'react';
import FormularioApartamentoCasa from './FormularioApartamentoCasa';
import TablaApartamentoCasa from './TablaApartamentoCasa';

export default function PanelApartamentoCasa() {
    const [recargar, setRecargar] = useState(0);

    const handleGuardado = () => {
        setRecargar((valor) => valor + 1);
    };

    return (
        <div>
            <FormularioApartamentoCasa onGuardado={handleGuardado} />
            <TablaApartamentoCasa recargar={recargar} />
        </div>
    );
}
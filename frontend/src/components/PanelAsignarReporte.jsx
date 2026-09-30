import { useState } from "react";
import AsignarReporte from "./AsignarReporte";
import TablaReportesAsignados from "./TablaReportesAsignados"

export default function PanelAsignarReporte() {
    const [recargar, setRecargar] = useState(0);

    const handleGuardado = () => {
        setRecargar((valor) => valor + 1);
    };
    return (
        <div>
            <AsignarReporte onGuardado={handleGuardado} />
            <TablaReportesAsignados recargar={recargar}/>
        </div>
    );
}
import { sileo } from 'sileo'

export const avisarExito = (mensaje) => {
  sileo.success({
    title: 'Listo',
    description: mensaje,
    fill: '#ecfdf5',
    roundness: 14,
    styles: {
      title: 'toast-titulo-exito',
      description: 'toast-texto-exito',
    },
  })
}

export const avisarError = (mensaje) => {
  sileo.error({
    title: 'Ups',
    description: mensaje,
    fill: '#fef2f2',
    roundness: 14,
    styles: {
      title: 'toast-titulo-error',
      description: 'toast-texto-error',
    },
  })
}

export const confirmarAccion = ({ titulo, descripcion, textoBoton, onConfirmar }) => {
  sileo.action({
    title: titulo,
    description: descripcion,
    duration: 8000,
    button: {
      title: textoBoton,
      onClick: onConfirmar,
    },
  })
}
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Alerta = withReactContent(Swal);

export const mostrarAlerta = (titulo, mensaje, tipo = 'success') => {
  Alerta.fire({
    title: <strong>{titulo}</strong>,
    html: <i>{mensaje}</i>,
    icon: tipo,
  });
};

export const mostrarErroresAPI = (errores) => {
  let mensaje = '';
  for (let campo in errores) {
    errores[campo].forEach((error) => {
      mensaje += `<b>${campo}</b>: ${error}<br/>`;
    });
  }

  Swal.fire({
    icon: 'error',
    title: 'Error al crear usuario',
    html: mensaje,
  });
};
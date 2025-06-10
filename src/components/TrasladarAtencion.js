import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import Swal from 'sweetalert2';
import API from '../api';

const TrasladarAtencion = ({ atencionId, onTrasladoExitoso }) => {
  const [usuarios, setUsuarios] = useState([]);

  const token = localStorage.getItem('access');

  useEffect(() => {
    API.get('usuarios/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsuarios(res.data))
      .catch(() => Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error'));
  }, []);

  const abrirModalTraslado = async () => {
    const opcionesHTML = usuarios
      .map(u => `<option value="${u.id}">${u.first_name} ${u.last_name}</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: 'Trasladar Atención',
      html: `
        <select id="nuevo_usuario" class="swal2-input">${opcionesHTML}</select>
        <input id="motivo" class="swal2-input" placeholder="Motivo del traslado" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          usuario: document.getElementById('nuevo_usuario').value,
          motivo: document.getElementById('motivo').value,
        };
      }
    });

    if (formValues) {
      try {
        await API.post(`atenciones/${atencionId}/trasladar/`, formValues, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Traslado exitoso', '', 'success');
        if (onTrasladoExitoso) onTrasladoExitoso(); // Callback opcional
      } catch (error) {
        Swal.fire('Error al trasladar atención', '', 'error');
      }
    }
  };

  return (
    <Button color="warning" onClick={abrirModalTraslado}>
      Trasladar atención
    </Button>
  );
};

export default TrasladarAtencion;

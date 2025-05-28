import React, { useEffect, useState } from 'react';
import { ListGroup, ListGroupItem, Spinner, Alert } from 'reactstrap';
import API from '../api';

const HistorialAtencion = ({ atencionId }) => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('access');

  useEffect(() => {
    API.get(`atenciones/${atencionId}/historial/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setHistorial(res.data))
      .catch(() => setError('No se pudo cargar el historial'))
      .finally(() => setCargando(false));
  }, [atencionId]);

  if (cargando) return <Spinner color="primary" />;
  if (error) return <Alert color="danger">{error}</Alert>;
  if (historial.length === 0) return <p>No hay registros de historial aún.</p>;

  return (
    <div className="mt-4">
      <h5>Historial de cambios</h5>
      <ListGroup>
        {historial.map((item) => (
          <ListGroupItem key={item.id}>
            <strong>{item.usuario_nombre || 'Usuario eliminado'}</strong><br />
            <small className="text-muted">{new Date(item.fecha).toLocaleString()}</small><br />
            {item.descripcion}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default HistorialAtencion;

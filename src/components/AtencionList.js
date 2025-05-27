import React, { useEffect, useState } from 'react';
import API from '../api';
import { Table } from 'reactstrap';

const AtencionList = () => {
  const [atenciones, setAtenciones] = useState([]);

  useEffect(() => {
    const fetchAtenciones = async () => {
      const token = localStorage.getItem('access');
      const res = await API.get('atenciones/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAtenciones(res.data);
    };
    fetchAtenciones();
  }, []);

  return (
    <div>
      <h3>Atenciones</h3>
      <Table striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Estudiante</th>
            <th>Motivo</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {atenciones.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.estudiante}</td>
              <td>{a.motivo}</td>
              <td>{a.fecha_creacion}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AtencionList;

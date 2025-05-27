import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import API from '../api';
import Swal from 'sweetalert2';

const PasoRegistroAtencion = ({ estudiante }) => {
  const [categorias, setCategorias] = useState([]);
  const [datos, setDatos] = useState({
    estudiante: estudiante.id,
    categoria: '',
    estado: '', // Se seteará como "Abierto" automáticamente
    motivo: '',
    observaciones: ''
  });

  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const [resCat, resEstad] = await Promise.all([
        API.get('categorias/', { headers }),
        API.get('estados/', { headers }),
      ]);

      setCategorias(resCat.data);

      const estadoAbierto = resEstad.data.find(e => e.nombre.toLowerCase() === 'abierto');
      if (estadoAbierto) {
        setDatos(prev => ({ ...prev, estado: estadoAbierto.id }));
      } else {
        Swal.fire('Advertencia', 'No se encontró el estado "Abierto".', 'warning');
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('atenciones/', datos, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('Atención registrada', 'La atención se guardó correctamente.', 'success');
      setDatos({ ...datos, categoria: '', motivo: '', observaciones: '' });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo registrar la atención.', 'error');
    }
  };

  return (
    <div>
      <h4>Paso 2: Registrar atención para {estudiante.nombre}</h4>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Categoría</Label>
          <Input
            type="select"
            name="categoria"
            onChange={handleChange}
            value={datos.categoria}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label>Motivo</Label>
          <Input
            type="textarea"
            name="motivo"
            onChange={handleChange}
            value={datos.motivo}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Observaciones (opcional)</Label>
          <Input
            type="textarea"
            name="observaciones"
            onChange={handleChange}
            value={datos.observaciones}
          />
        </FormGroup>

        <Button color="primary">Guardar Atención</Button>
      </Form>
    </div>
  );
};

export default PasoRegistroAtencion;
